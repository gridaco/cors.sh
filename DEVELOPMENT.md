# cors.sh — development

A CORS proxy rebuilt on Cloudflare Workers, as a **standalone SaaS** (own accounts + billing).
Monorepo (pnpm + turbo). **Requires Node ≥ 22** (`nvm use`).

## Layout

```
web/                  Next 16 app (OpenNext on Cloudflare): marketing + console + the control plane
  app/api/v1/*          control API (projects/keys/usage/account) — session-scoped
  app/api/auth/*        Auth.js (magic-link sign-in)
  app/api/billing/*     Stripe Checkout + Customer Portal
  app/api/webhooks/*    Stripe webhook
  app/api/internal/*    quota-notification rollup (proxy → here)
  lib/control/*         shared KV-record builder, tiers, account scoping
  lib/billing/*         Stripe client, plan map, entitlement, KV re-projection
  migrations/*.sql      D1 schema (Auth.js + domain + billing)
workers/
  proxy/              data plane — KV auth + origin pinning + CORS + streaming + metering + quota
  mock/               mock-reject API for the correctness tests
packages/
  ui|*-config           shared UI + tooling
  emails/               react-email templates + Resend sender (@workspace/emails)
tests/e2e/            Playwright: CORS correctness + auth gating + dashboard + billing webhook
docs/cloudflare/      PRD / recon / plan / infra (local-only; gitignored)
```

Data: **Workers KV** `cors-keys` (key → entitlement projection, the hot-path read) · **D1** `cors-control`
(Auth.js identity + projects/keys/usage + subscriptions). The control plane (in `web/`) projects key
records into KV; the proxy reads only KV on the hot path. `SPEC.md` is the source of truth for behavior.

## Run the whole stack locally

```bash
nvm use            # Node 22
pnpm install
pnpm stack:up      # build web (OpenNext), migrate D1, start web+proxy+mock+page (shared --persist-to .dev-state)
# → dashboard http://localhost:3000/console  (sign in at /login)
pnpm stack:down
```

`stack:up` writes local `.dev.vars` (gitignored): `EMAIL_DRY_RUN=1` (emails are logged, never sent),
`AUTH_SECRET`, and **dummy** Stripe test values (the webhook only verifies signatures, so signed test
events work with no real Stripe account). The proxy gets `WEB_INTERNAL_URL` + a shared `INTERNAL_SECRET`.

Sign-in is by **magic link**. In dev, the link is **logged** (dry-run) to `.dev-state/web.log` — grep
`email:dry-run … link=` and open it. (Auth.js hashes the token in D1, so the log is the usable link.)

## Test

```bash
pnpm test:e2e      # self-contained: stack up → Playwright (Chromium) → tear down
```

Covers (real browser + API): direct fetch BLOCKED vs via-proxy ALLOWED, wrong-origin, preflighted DELETE,
credentialed-vs-`*`; `/console` gated → `/login`, login sends a magic link; dashboard full loop
(create project → key works through the proxy); and the **billing webhook** (signed upgrade → quota
lifts to Pro → signed cancel → restores Free; bad signature → 400). CI runs the same via
`.github/workflows/ci.yml`. The e2e signs in by reading the dry-run link from `.dev-state/web.log` and
signs Stripe test events with `node:crypto` (see `tests/e2e/helpers.ts`).

## How proxy auth works (origin pinning)

The api key is **public** (it rides in browser requests). The real authenticator is the `Origin` header,
which browsers set and JS cannot forge cross-origin. So:

- **`live_` keys** are **origin-pinned** to a project's `allowedOrigins` (reject non-allowed and null/missing
  origins) — a stolen live key is useless from any other site.
- **`test_` keys** are not origin-enforced (work from localhost/curl) but rate-capped — "safe to leak" for dev.

See `SPEC.md` §3.

## Accounts, billing & email

- **Auth:** Auth.js (NextAuth v5) + `@auth/d1-adapter`, email magic-link via Resend, database sessions.
  **account = user.** `web/auth.ts` is a per-request config so the D1 binding is in scope (`getCloudflareContext`).
- **Billing:** standalone Stripe. Checkout/Portal/webhook in `web/app/api/billing|webhooks`. A subscription
  change flips `users.tier` and **re-projects the user's KV keys** so the proxy enforces the new quota.
- **Email:** `@workspace/emails` (react-email + Resend), rendered at send time on workerd. Templates:
  magic-link, welcome, subscription-confirmed/canceled, payment-failed, quota-warning/exceeded.

## CI / CD

- **CI** (`.github/workflows/ci.yml`): install → `pnpm build` → `pnpm test:e2e`. No Cloudflare creds needed.
- **CD** (`.github/workflows/deploy.yml`): manual `workflow_dispatch` (migrate D1 → deploy proxy → `cf:deploy`
  web). Needs repo secrets `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`. Flip the commented `push: main`
  to auto-deploy on merge. Both worker configs are `wrangler deploy --dry-run`-clean.

Manual equivalents: `web` → `pnpm --filter web cf:deploy` (OpenNext); proxy → `cd workers/proxy && wrangler deploy`.
Before go-live: real Stripe products + secrets, Resend domain verification, the shared `INTERNAL_SECRET` +
`WEB_INTERNAL_URL` on both workers, custom-domain routing (`proxy.cors.sh`/`cors.sh`), and the Cloudflare
AUP confirmation. Set all runtime secrets with `wrangler secret put` (after the worker first exists) — never commit them.
See `docs/cloudflare/infra-setup.md` for the full go-live runbook.
