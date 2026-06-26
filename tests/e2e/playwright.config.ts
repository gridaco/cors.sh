import { defineConfig } from "@playwright/test";

// Servers (web, page origin, mock, proxy) are started externally by scripts/stack.sh; URLs via env.
export default defineConfig({
  testDir: ".",
  reporter: "list",
  workers: 1,
  retries: 0,
  use: { baseURL: process.env.PAGE_URL || "http://localhost:8090" },
  projects: [
    // Signs in once and saves storageState for the authenticated suite.
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    // CORS correctness + auth gating + proxy enforcement run unauthenticated.
    { name: "anon", testMatch: /(cors|auth|proxy)\.spec\.ts/ },
    // Billing signs in its own user and drives signed webhook events.
    { name: "billing", testMatch: /billing\.spec\.ts/ },
    // Opt-in: real Stripe test-mode checkout (skips unless RUN_STRIPE_LIVE + a real key).
    { name: "billing-live", testMatch: /billing-live\.spec\.ts/ },
    // The /playground page drives the browser's own fetch() (navigates to the web app, not baseURL).
    { name: "playground", testMatch: /playground\.spec\.ts/ },
    // Dashboard suite runs with a real session.
    {
      name: "authed",
      testMatch: /dashboard\.spec\.ts/,
      dependencies: ["setup"],
      use: { storageState: ".auth/state.json" },
    },
  ],
});
