# AGENTS.md

Guidance for AI coding agents (and humans) working in this repo. `CLAUDE.md` is a symlink to this file.

## What this is

**cors.sh** — a CORS proxy **SaaS**, rebuilt on **Cloudflare Workers** with its own accounts and billing. Two planes:

- **Data plane** — `workers/proxy`: the proxy itself. KV-only on the hot path (origin-pinned key auth, CORS rewrite, streaming + byte metering, monthly quota, `test_` rate cap, keyless anonymous tier).
- **Control plane** — `web/`: a Next 16 app on OpenNext/Cloudflare that owns state in **D1** and **projects key entitlements into KV** for the proxy to read. Also the marketing site, console (account = user), Auth.js sign-in, and Stripe billing.

The **KV `KeyRecord` is the contract** between the planes — one builder in `web/lib/control`, reused by project CRUD and billing re-projection. Change it in one place.

> **`SPEC.md` is the source of truth for behavior** — read it before touching proxy/auth/billing semantics. **`DEVELOPMENT.md`** is the setup/run/test guide. **`GRAVEYARD.md`** records what the rebuild removed (and why).

## Stack and invariants

- **Node ≥ 22** (`nvm use`), **pnpm 10.4.1**, turbo monorepo, TypeScript strict.
- Hosts on **Cloudflare only** — Workers + **D1** (`cors-control`) + **KV** (`cors-keys`). **Not Vercel** (legacy Vercel projects are disconnected).
- **Secrets are runtime-only** — Cloudflare secret bindings in prod, gitignored `.dev.vars` / `.env` locally. **Never commit a secret.**
- Formatter is **oxfmt** (not prettier) — config in `.oxfmtrc.json`.

## Commands

```bash
pnpm install
pnpm stack:up        # full local stack: web + proxy + mock + page on a shared D1/KV (see DEVELOPMENT.md)
pnpm stack:down
pnpm test:e2e        # self-contained Playwright suite (stack up -> test -> down)

pnpm format          # oxfmt (write)
pnpm format:check    # oxfmt --check   (CI)
pnpm lint            # eslint          (CI)
pnpm check-types     # tsc --noEmit    (CI)
pnpm build           # turbo build
```

## Before you commit

Run the same gates CI runs:

```bash
pnpm format && pnpm lint && pnpm check-types
```

For behavior changes (proxy / auth / billing), also run `pnpm test:e2e`. CI (`.github/workflows/ci.yml`) runs a fast `checks` job (fmt / lint / types) plus `build-and-e2e`. Deploy is **manual** — `workflow_dispatch` on `deploy.yml` (D1 migrate -> proxy -> web).

## Conventions and gotchas

- **Commit only when asked.** Don't push or open PRs unprompted.
- Keep the proxy hot path **KV-only** — no per-request D1 reads.
- Auth is **origin-pinning**: the API key is public; the unforgeable `Origin` header is the authenticator. Don't introduce key-secrecy assumptions.
- D1 schema changes go in `web/migrations/*.sql` (numbered); deploy migrates before shipping code.
- Email is `@workspace/emails` (react-email + Resend), rendered at send; `EMAIL_DRY_RUN=1` logs instead of sending (local + e2e).
- `docs/cloudflare/` and `spikes/` are **local-only** (gitignored) — planning notes, not shipped.
