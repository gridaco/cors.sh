import { getCloudflareContext } from "@opennextjs/cloudflare";
import { resolveAccount } from "@/lib/control/account";
import { getStripe } from "@/lib/billing/stripe";
import { billingConfig } from "@/lib/billing/plans";

export const dynamic = "force-dynamic";

// POST /api/billing/portal — open the Stripe Billing Portal (plan change / cancel / payment method).
export async function POST() {
  const acct = await resolveAccount();
  if (!acct) return Response.json({ error: "unauthorized" }, { status: 401 });

  const { env } = getCloudflareContext();
  const cfg = billingConfig(env);
  if (!cfg) return Response.json({ error: "billing not configured" }, { status: 503 });

  const row = await env.DB.prepare("SELECT stripe_customer_id FROM users WHERE id = ?")
    .bind(acct.account)
    .first<{ stripe_customer_id: string | null }>();
  if (!row?.stripe_customer_id) {
    return Response.json({ error: "no billing account yet" }, { status: 400 });
  }

  const stripe = getStripe(cfg.secretKey);
  const portal = await stripe.billingPortal.sessions.create({
    customer: row.stripe_customer_id,
    return_url: `${cfg.appUrl}/console/settings`,
  });

  return Response.json({ url: portal.url });
}
