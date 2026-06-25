# cors.sh — Service & Policy Spec

**The source of truth for how the service behaves.** Internal (not the public hosted docs), committed to git.
Grounded in the actual code; status flags say what is _live_ vs _planned_ while we rebuild.

> Background / rationale (local-only, not committed): `docs/cloudflare/prd-v1.md` (design), `legacy-recon.md`
> (legacy behavior), `plan.md`, `TODO.md`. **This file wins** if they ever disagree about current behavior.

**Status legend:** ✅ implemented · 🟡 partial / MVP-shortcut · ⛳ planned (not built yet)

## 0. Snapshot (2026-06-26)

**cors.sh is a standalone SaaS, LIVE in production.** Its own accounts, its own billing. Built + verified end-to-end:
the **proxy data plane** (origin-pinned auth, CORS rewrite, streaming + byte metering, monthly quota,
`test_` rate limiting via a Durable Object) and a **control plane folded into the Next app** on Cloudflare
(`@opennextjs/cloudflare`) with **real accounts** — **Auth.js (NextAuth v5) email magic-link via Resend**,
**account = user**, D1-backed. **Self-serve billing is live**: **standalone Stripe** (Checkout + Customer
Portal + webhooks) drives `users.tier`; tier changes re-project the user's KV keys so the proxy enforces
the new quota. A **transactional email subsystem** (react-email + Resend) covers sign-in, welcome,
subscription lifecycle, dunning, and quota warnings. 12/12 Playwright e2e green (CORS correctness, auth
gating + login, dashboard full-loop, billing webhook upgrade/downgrade). **Live on the edge:** `cors.sh`

- `www` → web, `proxy.cors.sh` → proxy (custom domains), plus a route `cors.sh/http*` → proxy so legacy
  keyless `cors.sh/<url>` callers keep working (anonymous tier, §4). Stripe (live key + $4/mo + $36/yr Pro +
  webhook) and Resend email are configured on the prod workers. **Remaining = hardening + trust, not features**
  (commit, AUP confirmation, a real test purchase, observability, async metering, ToS) — risk-ordered in §8.

## 1. Architecture & infrastructure

**Two planes, kept separate:** a thin **data plane** (the proxy — near-zero per-request DB work) and a **control plane** (owns state, projects it to the edge). The control plane is **folded into the Next app** (`web/`) as same-origin route handlers, hosted on Cloudflare via `@opennextjs/cloudflare` so handlers get the D1 + KV bindings. The proxy stays a separate worker and reads only the KV projection on the hot path.

| Component                        | What it is                              | Responsible for                                                                                          | Depends on                         | Status                             |
| -------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------- | ---------------------------------- |
| `workers/proxy`                  | **Data-plane** Worker (`proxy.cors.sh`) | per-request auth, origin pinning, CORS rewrite, streaming, byte metering, quota check, quota-notify ping | KV `KEYS`, D1 `DB`                 | ✅                                 |
| `web/` (Next 16 + OpenNext)      | **App + control plane**                 | marketing site, console dashboard, **`/api/v1/*` control API, Auth.js, Stripe billing, quota rollup**    | D1 `DB`, KV `KEYS`, Resend, Stripe | ✅ local · ⛳ deploy               |
| `workers/mock`                   | Test-fixture Worker                     | deliberately-no-CORS endpoints for the browser CORS tests                                                | —                                  | ✅ dev/CI only                     |
| **KV `cors-keys`**               | Edge cache                              | key → `{account,tier,origins,targets,quota,active}` projection — the hot-path read                       | —                                  | ✅                                 |
| **D1 `cors-control`**            | Control DB                              | Auth.js identity + projects/keys/usage + subscriptions — source of truth                                 | —                                  | ✅                                 |
| `@workspace/emails`              | Email package                           | react-email templates + Resend sender (dry-run aware)                                                    | Resend                             | ✅                                 |
| `playground/`                    | Hopscotch fork (separate repo)          | interactive "try a request" client                                                                       | external host                      | 🟡 external                        |
| `RateLimiterDO` (Durable Object) | Exact rate limiter                      | per-`test_`-key short-window cap (30/10s)                                                                | Workers Paid                       | ✅ enforcing (binding was a no-op) |
| **Stripe** (standalone)          | Payments                                | Checkout + Portal + webhooks → `users.tier`; **cors.sh owns its own Stripe**                             | Stripe                             | ✅ code · ⛳ live keys             |
| **Resend**                       | Email delivery                          | magic-link + transactional sends                                                                         | verified domain                    | ✅ code · ⛳ domain verify         |
| Analytics Engine / Queue         | Metering pipeline                       | batch usage off the hot path                                                                             | Workers                            | ⛳                                 |
| Domains / routes                 | Production routing                      | `proxy.cors.sh` → proxy, `cors.sh`/`www` → web                                                           | CF zone                            | ⛳ (workers.dev now)               |
| **Grida**                        | Future SSO provider                     | an _additional_ Auth.js provider later (additive)                                                        | —                                  | ⛳ future                          |

Today the proxy also reads/writes D1 for usage/quota (🟡 MVP shortcut; target = a KV usage snapshot so the hot path stays KV-only).

## 2. Proxy contract `https://proxy.cors.sh/<target-url>`

- **Methods:** any (no allow-list); HEAD/PATCH/etc. forwarded unchanged. ✅
- **Target:** the path after the first `/`, or the `x-strict-request-url` header (overrides path). ✅
- **Preflight:** `OPTIONS` short-circuits → **200, empty body**, never forwarded/authed/metered. ✅
- **CORS policy** (`workers/proxy/src/cors.ts`) ✅:
  - `Access-Control-Allow-Origin: *` (hard-coded; **no credentials** — `*`+credentials is illegal).
  - `Access-Control-Allow-Methods` / `-Headers`: **reflected** from the preflight request.
  - `Access-Control-Max-Age: 600` on preflight (legacy emitted none).
  - `Access-Control-Expose-Headers`: all response header names.
- **Request headers:** strip hop-by-hop + `cookie`/`cookie2` + **the api-key headers** (`x-cors-api-key`, `x-cors-grida-api-key`, `x-strict-request-url`) — keys never leak upstream. ✅
- **Response:** pass upstream status + headers through; **strip `set-cookie`/`set-cookie2`**; apply CORS on top. ✅
- **Body:** streamed (no buffering). **CF auto-decompresses gzip/br** → not byte-transparent; **metering counts decompressed (logical) bytes**. ✅
- **Size cap:** `6 MB` pre-checked on `Content-Length` → **413** (mid-stream cutoff when length absent ⛳).

## 3. Auth & keys (the key is public; the Origin is the authenticator)

- **Key parse:** `x-cors-api-key` header, legacy `x-cors-grida-api-key`, or `?cors_api_key=` query. ✅
- **Key format:** `live_<48hex>` / `test_<48hex>` (random). Stored in D1; projected into KV by the lookup key. ✅ (⛳ store by **hash**, not raw key.)
- **Two key types per project** (`live` + `test`):
  - **`live_`** — **origin-pinned**: the request `Origin` must be in the project's `allowedOrigins`; **null/missing Origin → 403** (fail closed). A browser can't forge `Origin`, so a leaked live key is useless from any other site. ✅
  - **`test_`** — **not** origin-enforced (works from localhost/curl/CI), meant to be rate-capped ("safe to leak"). ✅ origin-skip · ⛳ the rate cap + low quota that make it actually safe.
- **Target allowlist:** if a key sets `allowedTargets`, the upstream host must match → else 403. ✅
- **Revocation:** flip `active:false` (or delete) the KV record; takes effect within the in-isolate LRU TTL ≈ **60 s**. ✅
- **No key rotation (policy).** There is intentionally no "rotate key" feature. To recover a compromised key, **delete the project and create a new one** (fresh keys). **Projects are unlimited per account**, so this is the supported recovery path. Quota is per-account (shared across projects), so a new project grants no extra quota.
- **KV record shape:** `{ account, tier, keyType, allowedOrigins[], allowedTargets[], active, quota:{requests,bytes}, validUntil? }`.

## 4. Limits, tiers & quotas ← the policy table

**Per-caller policy** (target model; status = what's built now):

| Caller                                                  | Key  | Origin enforced               | Short-window cap (RPM/hr)                  | Monthly quota        | Status                                                                        |
| ------------------------------------------------------- | ---- | ----------------------------- | ------------------------------------------ | -------------------- | ----------------------------------------------------------------------------- |
| **Playground** (`Origin ∈ cors.sh, playground.cors.sh`) | none | bypass                        | none (unlimited)                           | none                 | ⛳                                                                            |
| **Anonymous** (no key, by IP)                           | none | n/a                           | **per-IP cap** (30 / 10 s, Durable Object) | none (rate-only)     | ✅ keyless allowed, IP-capped; account `anonymous`                            |
| **`test_` key**                                         | test | no                            | **tight** ("safe to leak")                 | small / dev-scale    | 🟡 (origin-skip ✅; cap+low-quota ⛳ — today it wrongly gets full tier quota) |
| **`live_` key**                                         | live | **yes** (403 off-origin/null) | per tier (paid uncapped/hr)                | **per tier** (below) | ✅ origin+quota · ⛳ hourly cap                                               |

**Tier quotas** (`web/lib/control/tiers.ts`) ✅. Tier is a field on the user (`users.tier`), driven by the
account's Stripe subscription (§5). Pricing: **Free $0**, **Pro $4/mo** (or annual), **Team = contact sales** (set manually):

| Tier | Requests / period | Bandwidth / period |
| ---- | ----------------- | ------------------ |
| free | 10,000            | 5 GB               |
| pro  | 500,000           | 500 GB             |
| team | 5,000,000         | 1 TB               |

**Enforcement semantics:**

- Over monthly **request or byte** quota → **429**. ✅ (🟡 read from D1 on the hot path; target = KV snapshot.)
- Invalid/missing/revoked key → **401**. ✅ · Origin/target denied → **403**. ✅ · Oversize → **413**. ✅
- Short-window **rate limiting** → ✅ **implemented + enforcing** via a **Durable Object** (`RateLimiterDO`, exact fixed-window). Applied to **`test_` keys** (default **30 / 10 s**, "safe to leak"); **`live_` skips it** to keep the hot path fast (already bounded by origin pinning + monthly quota). Verified on the edge: 60 concurrent on a test key → exactly **30 allowed / 30 → 429**.
- Boundary is **approximate** (soft) by design — brief over-admission near the limit is accepted.

**Rate-limiting design decision (why DO — not Redis, not the binding):**

- **CF-native only — no Redis/Upstash.** A per-request hop from the global edge (300+ POPs) to a Redis region undercuts the latency + zero-egress thesis. Redis (`@upstash/ratelimit`) is the right tool when compute is _regional/serverless_ (legacy used it on Lambda); on the global edge, native primitives win. Reserve Redis for cold-path/shared-store only.
- **CF-native options:** (1) **Workers Rate Limiting binding** — approximate per-colo, in-code; ideal but **does not enforce on this account** (verified — `limit()` returns success always). (2) **Durable Object** — exact counter → **chosen**. (3) **Zone WAF Rate Limiting Rules** — IP/path, pre-worker → future anonymous/IP abuse (§9).
- **Approximate is the right model; exactness is overkill.** Rate limiting is abuse control ("stop runaway"), not billing. Exactness only matters for the **monthly quota**, which is off the hot path (KV snapshot / D1) — not the per-second limiter.
- **Scope:** DO for `test_` (latency-tolerant dev keys); `live_` stays DO-free (fast).

**Legacy reference** (`legacy-recon.md §3`, for continuity — values to confirm as product policy): anon 100/hr · free-authorized 500/hr · paid t1 500k/28d · t2 2.5M/28d · playground origins unlimited. Legacy metered **request count only** (no bandwidth) and its limiter was documented-broken.

## 5. Accounts, entitlement & billing (standalone)

- **Identity:** **Auth.js (NextAuth v5)** with the **D1 adapter**; sign-in by **email magic-link via Resend**; **database sessions**. **account = user** (1:1 for v1; teams later). `web/auth.ts` is a per-request config so the D1 binding is in scope. Sessions surface `user.id` + `user.tier`. ✅
- **Entitlement:** `users.tier` (`free|pro|team`) is the denormalized fast-read the proxy + CRUD use. It is **derived from the Stripe subscription** and re-projected into every one of the user's KV records on change. `resolveTier(status, priceId)`: `active|trialing|past_due → pro` (past_due keeps pro during dunning), else `free`. ✅
- **Billing (standalone Stripe — cors.sh owns it):** ✅
  - **Checkout** (`POST /api/billing/checkout`) — lazily creates the Stripe customer, starts a subscription Checkout for Pro (monthly/annual).
  - **Customer Portal** (`POST /api/billing/portal`) — plan change / cancel / payment method (no custom UI).
  - **Webhook** (`POST /api/webhooks/stripe`) — raw body + `constructEventAsync` + SubtleCrypto on workerd; idempotent via the `stripe_events` ledger. Handles `checkout.session.completed` (link customer), `customer.subscription.created/updated/deleted` (→ tier + **KV re-projection before 200**), `invoice.payment_failed` (dunning email). Cancel respects `cancel_at_period_end` (stays Pro until period end, then Free).
  - **Team** is not self-serve (no Stripe price); an operator sets `users.tier='team'`.
- **Billing period (quota reset):** UTC calendar month (`YYYY-MM`) for v1. Anchoring quota to the Stripe billing cycle is a documented fast-follow (§9).
- **Grida** is a _future_ additive Auth.js provider — no Supabase/Grida billing dependency.

## 6. Data model

**D1 `cors-control`** (`web/migrations/*.sql`):

- **Auth.js (D1 adapter):** `users(id, name, email, emailVerified, image, tier, stripe_customer_id, notify_quota)` · `accounts` (OAuth provider links) · `sessions` · `verification_tokens`.
- **Domain:** `projects(id, account_id, name, allowed_origins, allowed_targets, created_at)` · `keys(key, project_id, account_id, key_type, active, created_at)` · `usage(account_id, period, requests, bytes, notified_80, notified_100)`. `account_id` references `users.id`.
- **Billing:** `subscriptions(user_id, stripe_customer_id, stripe_subscription_id, status, price_id, current_period_start, current_period_end, cancel_at_period_end, updated_at)` · `stripe_events(id, type, processed_at)` (webhook idempotency).
- Since **account = user**, `usage(account_id,…)` is per-user (the §8 per-account attribution gate is satisfied). Per-_project_ usage breakdown is still a future nicety.

## 7. API (same-origin under `web/`; **session-scoped** — every `/api/v1/*` call requires a signed-in user → else 401)

**Control** (`/api/v1/*`, scoped to `session.user.id`):

- `GET /api/v1/projects` → `{ projects: [{ id, name, allowedOrigins[], allowedTargets[], createdAt }] }`
- `POST /api/v1/projects` `{ name, allowedOrigins?, allowedTargets? }` → `{ id, name, …, keys: { live, test } }` (keys returned **once**)
- `GET /api/v1/projects/:id` → project + `keys[]` + `usage`
- `PATCH /api/v1/projects/:id` `{ name?, allowedOrigins?, allowedTargets? }` → re-projects keys to KV
- `DELETE /api/v1/projects/:id` → deletes D1 rows + KV records (also the key-"rotation" path, §3)
- `GET /api/v1/usage` → `{ period, requests, bytes, quota }`
- `PATCH /api/v1/account` `{ notifyQuota }` → quota-notification preference

**Auth** (`/api/auth/*`) — Auth.js (magic-link sign-in, callback, session, sign-out).
**Billing** (`/api/billing/{checkout,portal}` POST) — Stripe Checkout / Customer Portal (§5).
**Webhooks** (`/api/webhooks/stripe` POST) — Stripe events (§5).
**Internal** (`/api/internal/quota` POST, `x-internal-secret`) — the proxy pings this when an account is near/over quota; it dedups + sends the 80%/100% emails.

## 8. Launch state & hardening checklist

**LIVE on the real edge (2026-06-26).** `cors.sh` + `www` → app, `proxy.cors.sh` + `cors.sh/<url>` → proxy.
**Every original pre-launch gate is shipped:** accounts/auth (Auth.js magic-link + Resend, account=user),
standalone Stripe billing (Pro $4/mo + $36/yr, live webhook), edge cutover (custom domains), per-account
usage. The full **sign up → use → hit quota → pay → higher limit** loop works for a stranger today.

> **vs the original PRD (`prd-v1.md`):** all 7 in-scope items delivered. Two deliberate pivots from the PRD:
> **auth** went **standalone (Auth.js/D1)** instead of Grida-SSO-stub (§4.1), and **billing** went
> **standalone Stripe (cors.sh owns it)** instead of "consume Grida entitlement, never touch Stripe" (§4.2).
> The PRD's _deferred_ hardening (async metering §4.4, observability §6, AUP §7.8) is what's left below.

What separates _functional_ from _trustworthy at scale_, ordered by real risk:

**🔴 Before you market it (existential / money-correctness):**

1. **Commit everything.** Production currently runs uncommitted working-tree code.
2. **Cloudflare AUP confirmation** (PRD §7.8, open since v1). Written OK that a commercial CORS proxy is allowed on Workers — otherwise it can be shut down.
3. ✅ **One real test purchase** — done (2026-06-26): a real $4 charge → active subscription → `checkout.session.completed`+`subscription.created`+`invoice.paid` → `users.tier=pro` → KV re-projected (both keys quota 500k) → verified end-to-end in prod D1/KV/Stripe.

**🟠 Hardening before real volume:** 4. **Observability** (PRD §6) — error-rate/latency/quota metrics + an alert when the proxy 5xxs or webhook processing stalls. Today nothing pages you. 5. **Metering off the hot path** (PRD §4.3/§4.4) — async usage (Analytics Engine / Queue) + a KV usage snapshot, so the data plane stays KV-only under load. The current per-request D1 read is the known MVP shortcut and a scaling SPOF. 6. **Restricted Stripe key** — the worker holds a full `sk_live`; scope it to the calls we make. 7. **Billing edge-case soak** — dunning / proration / refund / dispute paths are coded but never run live.

**🟡 Trust & polish:** 8. **Legal/trust surface** — ToS, privacy, refund policy, support contact (required once taking money). 9. **Stripe Billing Portal config** (dashboard) so "Manage billing" works (plan change / cancel). 10. **Key hashing at rest** (TODO #18) — KV keys by the raw key; store by hash. _(Lower risk — keys are public identifiers by design, §3.)_ 11. **Per-project usage** (TODO #4) — usage is per-account (= per-user); relabel or break out per project. 12. **Cleanup** — rename workers `*-dev` → prod; wipe smoke-test rows; rotate legacy `web/.env`; replace the proxy's loose type shims with `@cloudflare/workers-types`.

_(Not a gate: **key rotation** — recovery = delete + recreate the project, §3.)_

## 9. Later / iterative (post-launch)

playground origin bypass · Durable-Object hard caps / exact-SLA tiers · mid-stream size cutoff ·
**Stripe-billing-cycle quota anchoring** (carry `periodStart/End` in the KV record, roll on `invoice.paid`) ·
trials, pricing-page CTA → checkout when signed in · **teams / multi-seat** · **Grida as an added Auth.js
provider** · edge response caching as a paid feature · richer dashboard. Full list in `docs/cloudflare/TODO.md`.
