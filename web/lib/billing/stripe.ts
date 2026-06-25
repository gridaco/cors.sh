import Stripe from "stripe";

/**
 * Workers-safe Stripe client. `createFetchHttpClient()` is REQUIRED — the SDK's default
 * Node http client does not exist on workerd. (Webhook verification additionally uses the
 * SubtleCrypto provider; see the webhook route.) apiVersion is left at the SDK default.
 */
export function getStripe(secretKey: string): Stripe {
  return new Stripe(secretKey, {
    httpClient: Stripe.createFetchHttpClient(),
  });
}
