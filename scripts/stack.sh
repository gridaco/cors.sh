#!/usr/bin/env bash
# Launch / stop the full cors.sh local stack.
#
# The control plane is folded into the Next app (web), hosted on Cloudflare via OpenNext.
# All workers run against ONE shared local state dir (--persist-to .dev-state) so the web
# app's KV/D1 writes are visible to the proxy. Requires Node >= 22 (for wrangler/OpenNext).
#
#   bash scripts/stack.sh up     # build+migrate, start web+proxy+mock+page, seed fixtures
#   bash scripts/stack.sh down   # stop everything
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SHARED="$ROOT/.dev-state"
KV_ID="19bba81a98be4f908610db3b765d0abd"
PIDFILE="$SHARED/stack.pids"
WR="$ROOT/node_modules/.bin/wrangler"
export WRANGLER_SEND_METRICS=false

ensure_node22() {
  if ! node -v 2>/dev/null | grep -qE '^v(2[2-9]|[3-9][0-9])'; then
    export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
    # shellcheck disable=SC1091
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use 22 >/dev/null 2>&1 || true
  fi
  echo "node $(node -v)"
}

clear_ports() { for p in 3000 8090 8786 8788 9329 9330 9331; do lsof -ti tcp:$p 2>/dev/null | xargs kill 2>/dev/null || true; done; }
wait_url() { curl -s -o /dev/null --retry 90 --retry-delay 1 --retry-connrefused "$1" && echo "  up: $1"; }
worker() { # dir port name inspector-port
  ( cd "$ROOT/$1" && exec "$WR" dev --port "$2" --ip 127.0.0.1 --inspector-port "$4" --persist-to "$SHARED" ) >"$SHARED/$3.log" 2>&1 &
  echo $! >>"$PIDFILE"
}

up() {
  ensure_node22
  mkdir -p "$SHARED"; clear_ports; : >"$PIDFILE"

  echo "[1/5] build web (OpenNext -> .open-next/worker.js on workerd)"
  ( cd "$ROOT/web" && pnpm cf:build ) >"$SHARED/web-build.log" 2>&1 || { echo "web build failed:"; tail -30 "$SHARED/web-build.log"; exit 1; }

  echo "[2/5] migrate D1 (local, shared persist) + local web secrets"
  ( cd "$ROOT/web" && "$WR" d1 migrations apply DB --local --persist-to "$SHARED" ) >"$SHARED/migrate.log" 2>&1 \
    || { echo "migrate failed:"; cat "$SHARED/migrate.log"; exit 1; }
  # Local-only secrets for the web worker (gitignored; production uses `wrangler secret put`).
  # EMAIL_DRY_RUN=1 -> emails are logged, never sent, so e2e/CI needs no inbox or Resend key.
  # Stripe values are dummy test placeholders: the webhook path only VERIFIES signatures (no API
  # calls), so signed test events drive tier changes locally without a real Stripe account.
  cat >"$ROOT/web/.dev.vars" <<'VARS'
AUTH_SECRET=local_dev_only_secret_change_me
# The web wrangler.jsonc carries the cors.sh custom-domain routes (for prod/CD), which makes
# `wrangler dev` think the local host is cors.sh. Pin AUTH_URL so Auth.js builds localhost
# callback URLs locally. Prod leaves AUTH_URL unset → trustHost uses the real cors.sh host.
AUTH_URL=http://localhost:3000
EMAIL_DRY_RUN=1
NEXT_PUBLIC_APP_URL=http://localhost:3000
INTERNAL_SECRET=local_internal
# The /playground page points its requests at the local proxy (prod default: proxy.cors.sh).
PLAYGROUND_PROXY_URL=http://localhost:8786
VARS
  # Stripe: dummy by default (webhook-signature tests sign their own events). Override via env
  # with a real Stripe TEST key + test price ids to exercise the live checkout/portal calls
  # (RUN_STRIPE_LIVE billing-live.spec.ts). The expansion below is intentionally unquoted.
  cat >>"$ROOT/web/.dev.vars" <<VARS
STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY:-sk_test_local_dummy}
STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET:-whsec_test_local}
STRIPE_PRICE_PRO_MONTHLY=${STRIPE_PRICE_PRO_MONTHLY:-price_test_monthly}
STRIPE_PRICE_PRO_ANNUAL=${STRIPE_PRICE_PRO_ANNUAL:-price_test_annual}
VARS
  # The proxy pings the web control plane for quota notifications (must share INTERNAL_SECRET).
  cat >"$ROOT/workers/proxy/.dev.vars" <<'VARS'
WEB_INTERNAL_URL=http://127.0.0.1:3000
INTERNAL_SECRET=local_internal
VARS

  echo "[3/5] start web (control plane folded in) + proxy + mock + page origin"
  worker web           3000 web   9329
  worker workers/proxy 8786 proxy 9330
  worker workers/mock  8788 mock  9331
  ( cd "$ROOT/tests/e2e" && exec env PAGE_PORT=8090 node page-server.mjs ) >"$SHARED/page.log" 2>&1 & echo $! >>"$PIDFILE"

  echo "[4/5] wait for readiness"
  wait_url http://127.0.0.1:3000/api/v1/usage
  wait_url http://127.0.0.1:3000/playground
  wait_url http://127.0.0.1:8788/allow-all
  wait_url http://127.0.0.1:8090/
  curl -s -o /dev/null --retry 90 --retry-delay 1 --retry-connrefused http://127.0.0.1:8786/ && echo "  up: proxy 8786"

  echo "[5/5] seed fixtures (KV keys for the proxy CORS suite)"
  # Origin-pinned KV keys used directly by the CORS correctness suite (no account needed).
  "$WR" kv key put --namespace-id "$KV_ID" --local --persist-to "$SHARED" test_dev \
    '{"account":"dev","tier":"pro","keyType":"test","allowedOrigins":[],"allowedTargets":[],"active":true,"quota":{"requests":500000,"bytes":536870912000}}' >/dev/null 2>&1
  "$WR" kv key put --namespace-id "$KV_ID" --local --persist-to "$SHARED" live_dev \
    '{"account":"dev","tier":"pro","keyType":"live","allowedOrigins":["http://localhost:8090"],"allowedTargets":[],"active":true,"quota":{"requests":500000,"bytes":536870912000}}' >/dev/null 2>&1
  # The dashboard's own project ("My App") is now seeded by the authenticated Playwright setup.
  wait_url http://127.0.0.1:3000/console

  cat <<EOF

stack up:
  dashboard : http://localhost:3000/console
  control   : http://localhost:3000/api/v1/projects   (folded into web)
  proxy     : http://localhost:8786/<target-url>   (header x-cors-api-key: live_dev, Origin: http://localhost:8090)
  mock      : http://localhost:8788/{no-cors,wrong-origin,needs-preflight,allow-all}
  logs      : $SHARED/*.log
  stop      : pnpm stack:down
EOF
}

down() {
  if [ -f "$PIDFILE" ]; then while read -r pid; do kill "$pid" 2>/dev/null || true; done <"$PIDFILE"; rm -f "$PIDFILE"; fi
  clear_ports
  echo "stack down"
}

case "${1:-up}" in
  up) up ;;
  down) down ;;
  *) echo "usage: scripts/stack.sh up|down" >&2; exit 1 ;;
esac
