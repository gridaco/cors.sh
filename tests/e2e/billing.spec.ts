import { test, expect } from "@playwright/test";
import { WEB, signIn, stripeSig, waitForLog } from "./helpers";

// Exercises the full subscription lifecycle by POSTing locally-signed Stripe webhook events (test
// secret from stack.sh) and asserting the effects via the authenticated usage endpoint (tier→quota)
// and the dry-run email log. The webhook only VERIFIES signatures — it makes no Stripe API calls — so
// this needs no real Stripe account.
const SECRET = "whsec_test_local";
const PRICE_MONTHLY = "price_test_monthly";
const PRICE_ANNUAL = "price_test_annual";
const CUSTOMER = "cus_e2e_lifecycle";

function subEvent(
  id: string,
  type: string,
  userId: string,
  opts: { status?: string; price?: string; cancelAtPeriodEnd?: boolean } = {},
): string {
  return JSON.stringify({
    id,
    object: "event",
    type,
    data: {
      object: {
        id: "sub_e2e",
        object: "subscription",
        customer: CUSTOMER,
        status: opts.status ?? "active",
        cancel_at_period_end: !!opts.cancelAtPeriodEnd,
        metadata: { userId },
        items: {
          data: [
            {
              id: "si_e2e",
              price: { id: opts.price ?? PRICE_MONTHLY },
              current_period_start: 1700000000,
              current_period_end: 1702592000,
            },
          ],
        },
      },
    },
  });
}

function checkoutEvent(id: string, userId: string): string {
  return JSON.stringify({
    id,
    object: "event",
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_e2e",
        object: "checkout.session",
        client_reference_id: userId,
        customer: CUSTOMER,
        metadata: { userId },
      },
    },
  });
}

function invoiceEvent(id: string, type: string): string {
  return JSON.stringify({
    id,
    object: "event",
    type,
    data: {
      object: {
        id: "in_e2e",
        object: "invoice",
        customer: CUSTOMER,
        amount_due: 400,
        currency: "usd",
      },
    },
  });
}

test("subscription lifecycle: create → fail → cancel-at-end → delete, with quota + emails", async ({
  page,
}) => {
  const email = "billing-e2e@cors.sh";
  await signIn(page, email);
  const ctx = page.context();

  const session = await (await ctx.request.get(`${WEB}/api/auth/session`)).json();
  const userId = session.user.id as string;
  expect(userId).toBeTruthy();

  // Isolation: this fresh account sees none of another user's projects ("My App" belongs to setup).
  const before = await (await ctx.request.get(`${WEB}/api/v1/projects`)).json();
  expect(before.projects.some((p: { name: string }) => p.name === "My App")).toBe(false);

  // A project gives the user keys to re-project on tier change.
  await ctx.request.post(`${WEB}/api/v1/projects`, {
    data: { name: "Billing E2E", allowedOrigins: ["http://localhost:8090"] },
  });

  const post = (payload: string) =>
    ctx.request.post(`${WEB}/api/webhooks/stripe`, {
      headers: { "stripe-signature": stripeSig(payload, SECRET) },
      data: payload,
    });
  const quota = async () =>
    (await (await ctx.request.get(`${WEB}/api/v1/usage`)).json()).quota.requests;

  // 0. baseline: free
  expect(await quota()).toBe(10_000);

  // 1. checkout.session.completed → backfills the Stripe customer link (needed for invoice lookups)
  expect((await post(checkoutEvent("evt_checkout", userId))).status()).toBe(200);

  // 2. subscription.created (active, monthly) → Pro quota + confirmation email
  expect(
    (await post(subEvent("evt_created", "customer.subscription.created", userId))).status(),
  ).toBe(200);
  expect(await quota()).toBe(500_000);
  expect(await waitForLog(`to=${email} subject="You're on cors.sh Pro"`)).toBe(true);

  // 3. invoice.payment_failed → STAYS Pro (dunning grace) + dunning email
  expect((await post(invoiceEvent("evt_failed", "invoice.payment_failed"))).status()).toBe(200);
  expect(await quota()).toBe(500_000);
  expect(await waitForLog(`to=${email} subject="Payment failed`)).toBe(true);

  // 4. subscription.updated with cancel_at_period_end → STAYS Pro until period end
  expect(
    (
      await post(
        subEvent("evt_cancel_sched", "customer.subscription.updated", userId, {
          cancelAtPeriodEnd: true,
        }),
      )
    ).status(),
  ).toBe(200);
  expect(await quota()).toBe(500_000);

  // 5. subscription.deleted → back to Free + cancellation email
  expect(
    (
      await post(
        subEvent("evt_deleted", "customer.subscription.deleted", userId, { status: "canceled" }),
      )
    ).status(),
  ).toBe(200);
  expect(await quota()).toBe(10_000);
  expect(await waitForLog(`to=${email} subject="Your cors.sh subscription has ended"`)).toBe(true);

  // 6. idempotency: re-deliver the create event id → no-op, stays Free (not flipped back to Pro)
  expect(
    (await post(subEvent("evt_created", "customer.subscription.updated", userId))).status(),
  ).toBe(200);
  expect(await quota()).toBe(10_000);

  // 7. annual price also resolves to Pro
  expect(
    (
      await post(
        subEvent("evt_annual", "customer.subscription.updated", userId, { price: PRICE_ANNUAL }),
      )
    ).status(),
  ).toBe(200);
  expect(await quota()).toBe(500_000);

  // 8. bad signature → 400
  const bad = await ctx.request.post(`${WEB}/api/webhooks/stripe`, {
    headers: { "stripe-signature": "t=1,v1=deadbeef" },
    data: subEvent("evt_bad", "customer.subscription.updated", userId),
  });
  expect(bad.status()).toBe(400);
});

test("webhook for an unknown customer is a safe no-op (200, no crash)", async ({ page }) => {
  // No metadata.userId and a customer that matches no user → handler returns without effect.
  const payload = JSON.stringify({
    id: "evt_unknown",
    object: "event",
    type: "customer.subscription.updated",
    data: {
      object: {
        id: "sub_x",
        object: "subscription",
        customer: "cus_does_not_exist",
        status: "active",
        cancel_at_period_end: false,
        metadata: {},
        items: {
          data: [
            {
              id: "si",
              price: { id: PRICE_MONTHLY },
              current_period_start: 1,
              current_period_end: 2,
            },
          ],
        },
      },
    },
  });
  const r = await page.request.post(`${WEB}/api/webhooks/stripe`, {
    headers: { "stripe-signature": stripeSig(payload, SECRET) },
    data: payload,
  });
  expect(r.status()).toBe(200);
});
