# Graveyard — removed in the Cloudflare rebuild (2026-06-24)

cors.sh was rebooted from AWS (Lambda + API Gateway) onto **Cloudflare Workers**.
The legacy code below was removed from the working tree. It is **not lost** — everything is preserved in:

- git tag **`legacy-aws-2026-06-24`** (the full prior state), and
- a sibling clone at **`../cors.sh-archive`**.

Behavior was extracted before removal and documented (local-only) in `docs/cloudflare/legacy-recon.md`.

## Removed

| Path                          | What it was                                                                                   | Replaced by                                         |
| ----------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `services/proxy.cors.sh`      | Deployed CORS proxy data plane (Lambda + serverless-express, `proxy.cors.sh`).                | `workers/proxy` (Cloudflare Worker).                |
| `services/lagacy`             | Older `cors.bridged.cc` proxy (frozen 2022).                                                  | —                                                   |
| `services/auth.proxy.cors.sh` | Unfinished + disabled API Gateway custom authorizer.                                          | Edge auth in `workers/proxy` (KV + origin pinning). |
| `services/services.cors.sh`   | Control plane: MongoDB/Prisma, Stripe, keygen, key→DynamoDB sync.                             | New control plane + Grida entitlement (TBD).        |
| `services/mail.cors.sh`       | MJML onboarding email templates.                                                              | Re-add later via Grida/Resend.                      |
| `.archives/console`           | Old Next.js dashboard.                                                                        | `web/` console.                                     |
| `.archives/homepage`          | Old marketing/pricing site.                                                                   | `web/` (home).                                      |
| `.archives/proxy`             | Stale proxy snapshot.                                                                         | —                                                   |
| `examples/`                   | One minimal demo.                                                                             | —                                                   |
| `docs/` (Docusaurus)          | Old docs site (mostly template). Real guides salvaged to `docs/cloudflare/_salvaged-guides/`. | New docs (TBD).                                     |

**Kept:** `web/`, `packages/*`, `workers/*`, `branding/`, `playground/` (stub → external Hopscotch fork), `docs/cloudflare/` (rebuild planning, local-only).
