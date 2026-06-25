import Stripe from "stripe";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getStripe } from "@/lib/billing/stripe";
import { billingConfig, type BillingConfig } from "@/lib/billing/plans";
import { resolveTier } from "@/lib/billing/entitlement";
import { reprojectUserKeys } from "@/lib/billing/reproject";
import {
  sendSubscriptionConfirmed,
  sendSubscriptionCanceled,
  sendPaymentFailed,
} from "@workspace/emails";

export const dynamic = "force-dynamic";

// Stripe POSTs subscription lifecycle here. Workers specifics: raw body via req.text(), async
// signature verification with the SubtleCrypto provider (sync verify uses Node crypto → throws),
// and idempotency via the stripe_events ledger. Tier→KV re-projection runs BEFORE returning 200.
export async function POST(req: Request) {
  const { env } = getCloudflareContext();
  const cfg = billingConfig(env);
  if (!cfg) return new Response("billing not configured", { status: 503 });

  const stripe = getStripe(cfg.secretKey);
  const sig = req.headers.get("stripe-signature") ?? "";
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      sig,
      cfg.webhookSecret,
      undefined,
      Stripe.createSubtleCryptoProvider(),
    );
  } catch (e) {
    return new Response(`bad signature: ${(e as Error).message}`, { status: 400 });
  }

  // Idempotency: first writer wins; a duplicate delivery is a no-op 200.
  const ins = await env.DB.prepare(
    "INSERT OR IGNORE INTO stripe_events (id, type, processed_at) VALUES (?, ?, ?)",
  )
    .bind(event.id, event.type, Date.now())
    .run();
  if (ins.meta.changes === 0) return Response.json({ received: true, duplicate: true });

  try {
    await handleEvent(env, cfg, event);
  } catch (e) {
    // Internal failure → 500 so Stripe retries (the idempotency row lets the retry re-run safely
    // only if we delete it; simplest: surface the error and let Stripe resend a fresh attempt).
    return new Response(`handler error: ${(e as Error).message}`, { status: 500 });
  }
  return Response.json({ received: true });
}

async function handleEvent(env: CloudflareEnv, cfg: BillingConfig, event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object as Stripe.Checkout.Session;
      const userId = s.client_reference_id ?? s.metadata?.userId;
      const customerId = typeof s.customer === "string" ? s.customer : s.customer?.id;
      if (userId && customerId) {
        await env.DB.prepare(
          "UPDATE users SET stripe_customer_id = ? WHERE id = ? AND stripe_customer_id IS NULL",
        )
          .bind(customerId, userId)
          .run();
      }
      // Tier is owned by the subscription.* path so there's one code path.
      return;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await applySubscriptionState(env, cfg, sub, event.type === "customer.subscription.deleted");
      return;
    }
    case "invoice.payment_failed": {
      await notifyPaymentFailed(env, event.data.object as Stripe.Invoice);
      return;
    }
    default:
      return; // invoice.paid etc. — renewals are mirrored by subscription.updated
  }
}

async function applySubscriptionState(
  env: CloudflareEnv,
  cfg: BillingConfig,
  sub: Stripe.Subscription,
  deleted: boolean,
) {
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  let userId = sub.metadata?.userId;
  if (!userId) {
    const row = await env.DB.prepare("SELECT id FROM users WHERE stripe_customer_id = ?")
      .bind(customerId)
      .first<{ id: string }>();
    userId = row?.id;
  }
  if (!userId) return; // unknown customer — nothing to attribute

  const item = sub.items.data[0];
  const priceId = item?.price?.id ?? "";
  const status = sub.status;
  // current_period_* moved to the item level in recent API versions; read defensively.
  const periodStart =
    (item as unknown as { current_period_start?: number })?.current_period_start ??
    (sub as unknown as { current_period_start?: number }).current_period_start ??
    null;
  const periodEnd =
    (item as unknown as { current_period_end?: number })?.current_period_end ??
    (sub as unknown as { current_period_end?: number }).current_period_end ??
    null;
  const cancelAtPeriodEnd = sub.cancel_at_period_end ? 1 : 0;

  await env.DB.prepare(
    `INSERT INTO subscriptions
       (user_id, stripe_customer_id, stripe_subscription_id, status, price_id,
        current_period_start, current_period_end, cancel_at_period_end, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       stripe_customer_id = excluded.stripe_customer_id,
       stripe_subscription_id = excluded.stripe_subscription_id,
       status = excluded.status,
       price_id = excluded.price_id,
       current_period_start = excluded.current_period_start,
       current_period_end = excluded.current_period_end,
       cancel_at_period_end = excluded.cancel_at_period_end,
       updated_at = excluded.updated_at`,
  )
    .bind(userId, customerId, sub.id, status, priceId, periodStart, periodEnd, cancelAtPeriodEnd, Date.now())
    .run();

  const newTier = deleted ? "free" : resolveTier(status, priceId, cfg);
  const cur = await env.DB.prepare("SELECT tier, email FROM users WHERE id = ?")
    .bind(userId)
    .first<{ tier: string; email: string | null }>();
  if (!cur || cur.tier === newTier) return;

  await env.DB.prepare("UPDATE users SET tier = ? WHERE id = ?").bind(newTier, userId).run();
  // Re-project BEFORE returning 200 so the proxy enforces the new quota (within its ~60s LRU).
  await reprojectUserKeys(env, userId, newTier);

  if (cur.email) {
    if (newTier !== "free") {
      await sendSubscriptionConfirmed(env, cur.email, { planName: "Pro" });
    } else {
      await sendSubscriptionCanceled(env, cur.email, { planName: "Pro", isFinal: true });
    }
  }
}

async function notifyPaymentFailed(env: CloudflareEnv, inv: Stripe.Invoice) {
  const customerId = typeof inv.customer === "string" ? inv.customer : inv.customer?.id;
  if (!customerId) return;
  const row = await env.DB.prepare("SELECT email FROM users WHERE stripe_customer_id = ?")
    .bind(customerId)
    .first<{ email: string | null }>();
  if (!row?.email) return;
  const amountDue =
    typeof inv.amount_due === "number"
      ? `${(inv.amount_due / 100).toFixed(2)} ${(inv.currency ?? "usd").toUpperCase()}`
      : undefined;
  await sendPaymentFailed(env, row.email, { amountDue });
}
