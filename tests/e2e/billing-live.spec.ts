import { test, expect } from "@playwright/test";
import { WEB, signIn } from "./helpers";

// OPT-IN. Runs only with RUN_STRIPE_LIVE=1 and a REAL Stripe test key + test price ids injected into
// the stack (see scripts/stack.sh — the Stripe vars are env-overridable). Verifies that OUR billing
// endpoints make valid Stripe API calls, asserting only the returned redirect URL — we deliberately do
// NOT drive Stripe's hosted Checkout/Portal page (their UI, not our code; Stripe tests that). Webhook
// handling is fully covered hermetically by billing.spec.ts (signed events, no Stripe account needed).
//
//   stripe login                                          # refresh the CLI/test key if expired
//   # create test-mode Pro prices, then:
//   RUN_STRIPE_LIVE=1 STRIPE_SECRET_KEY=sk_test_… \
//     STRIPE_PRICE_PRO_MONTHLY=price_… STRIPE_PRICE_PRO_ANNUAL=price_… \
//     bash scripts/stack.sh up
//   ( cd tests/e2e && npx playwright test billing-live.spec.ts --project=billing-live )
const LIVE = !!process.env.RUN_STRIPE_LIVE;

test("checkout endpoint creates a real Stripe Checkout session (monthly + annual)", async ({
  page,
}) => {
  test.skip(!LIVE, "set RUN_STRIPE_LIVE + a real Stripe test key on the worker");
  await signIn(page, "billing-live@cors.sh");
  const ctx = page.context();
  await ctx.request.post(`${WEB}/api/v1/projects`, {
    data: { name: "Live checkout", allowedOrigins: [] },
  });

  for (const interval of ["monthly", "annual"]) {
    const res = await ctx.request.post(`${WEB}/api/billing/checkout`, { data: { interval } });
    expect(res.status(), `checkout(${interval}) status`).toBe(200);
    const { url } = (await res.json()) as { url: string };
    // A hosted Stripe Checkout URL — on stripe.com or the account's custom domain — carrying the session id.
    expect(url).toMatch(/^https:\/\/\S+/);
    expect(url).toContain("cs_");
  }
});
