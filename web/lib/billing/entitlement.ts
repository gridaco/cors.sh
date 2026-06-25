import type { Tier } from "@/lib/control/tiers";
import { planTier, type BillingConfig } from "./plans";

// `past_due` deliberately keeps the paid tier during Stripe's dunning grace — Stripe owns the
// retry schedule; when it gives up it sends subscription.updated/deleted which flips us to free.
const ENTITLED = new Set(["active", "trialing", "past_due"]);

export function resolveTier(status: string, priceId: string, cfg: BillingConfig): Tier {
  if (ENTITLED.has(status)) return planTier(priceId, cfg);
  return "free";
}
