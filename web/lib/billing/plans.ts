import type { Tier } from "@/lib/control/tiers";

export interface BillingConfig {
  secretKey: string;
  webhookSecret: string;
  priceMonthly: string;
  priceAnnual: string;
  appUrl: string;
}

/** Returns null when Stripe isn't configured (local/dev without keys) — callers respond 503. */
export function billingConfig(env: CloudflareEnv): BillingConfig | null {
  if (!env.STRIPE_SECRET_KEY) return null;
  return {
    secretKey: env.STRIPE_SECRET_KEY,
    webhookSecret: env.STRIPE_WEBHOOK_SECRET ?? "",
    priceMonthly: env.STRIPE_PRICE_PRO_MONTHLY ?? "",
    priceAnnual: env.STRIPE_PRICE_PRO_ANNUAL ?? "",
    appUrl: env.NEXT_PUBLIC_APP_URL ?? "https://cors.sh",
  };
}

/** Map a Stripe price id to a tier. The single source of "which price means which plan". */
export function planTier(priceId: string, cfg: BillingConfig): Tier {
  if (priceId && (priceId === cfg.priceMonthly || priceId === cfg.priceAnnual)) return "pro";
  return "free";
}

/** Validate + resolve the requested checkout price id. Never trust a raw price id from the client. */
export function priceForInterval(interval: string | undefined, cfg: BillingConfig): string | null {
  if (interval === "annual") return cfg.priceAnnual || null;
  return cfg.priceMonthly || null;
}
