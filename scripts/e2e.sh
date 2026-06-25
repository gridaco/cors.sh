#!/usr/bin/env bash
# Self-contained end-to-end run: bring the stack up, run the Playwright suite, tear down.
# Used by `pnpm test:e2e` and CI.
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# e2e deps (isolated; not a workspace member) + browser — idempotent.
( cd "$ROOT/tests/e2e" && { [ -d node_modules/@playwright/test ] || npm install --no-audit --no-fund; } )
( cd "$ROOT/tests/e2e" && npx playwright install chromium )

trap 'bash "$ROOT/scripts/stack.sh" down' EXIT
bash "$ROOT/scripts/stack.sh" up

# The authenticated setup reads the magic-link from the web worker's dry-run log.
export WEB_LOG="$ROOT/.dev-state/web.log"
( cd "$ROOT/tests/e2e" && npx playwright test )
exit $?
