import { getCloudflareContext } from "@opennextjs/cloudflare";
import { resolveAccount } from "@/lib/control/account";
import { getStripe } from "@/lib/billing/stripe";
import { billingConfig, priceForInterval } from "@/lib/billing/plans";

export const dynamic = "force-dynamic";

// POST /api/billing/checkout — start a Stripe Checkout session for the signed-in user.
// Lazily creates the Stripe customer on first checkout (most free users never pay).
export async function POST(req: Request) {
  const acct = await resolveAccount();
  if (!acct) return Response.json({ error: "unauthorized" }, { status: 401 });

  const { env } = getCloudflareContext();
  const cfg = billingConfig(env);
  if (!cfg) return Response.json({ error: "billing not configured" }, { status: 503 });

  const body = (await req.json().catch(() => ({}))) as { interval?: string };
  const priceId = priceForInterval(body.interval, cfg);
  if (!priceId) return Response.json({ error: "price not configured" }, { status: 503 });

  const userId = acct.account;
  const stripe = getStripe(cfg.secretKey);
  const row = await env.DB.prepare("SELECT email, stripe_customer_id FROM users WHERE id = ?")
    .bind(userId)
    .first<{ email: string | null; stripe_customer_id: string | null }>();

  let customerId = row?.stripe_customer_id ?? null;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: row?.email ?? undefined,
      metadata: { userId },
    });
    customerId = customer.id;
    await env.DB.prepare("UPDATE users SET stripe_customer_id = ? WHERE id = ?")
      .bind(customerId, userId)
      .run();
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: userId,
    subscription_data: { metadata: { userId } },
    allow_promotion_codes: true,
    success_url: `${cfg.appUrl}/console/settings?upgraded=1`,
    cancel_url: `${cfg.appUrl}/console/settings`,
  });

  return Response.json({ url: checkout.url });
}
