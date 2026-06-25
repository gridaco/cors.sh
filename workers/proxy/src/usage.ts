import type { Env } from "./types";

/** Billing period (stub: UTC month). Real anchor comes from Grida current_period_* (PRD §5.4). */
export function currentPeriod(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

/**
 * MVP: read the account's current-period usage from D1 on the hot path for quota enforcement.
 * NOTE: production moves this to a KV usage snapshot carried in the key record (PRD §4.3,
 * already spiked) so the hot path stays KV-only — this D1 read is an MVP shortcut.
 */
export async function getUsage(env: Env, account: string): Promise<{ requests: number; bytes: number }> {
  const row = await env.DB.prepare("SELECT requests, bytes FROM usage WHERE account_id=? AND period=?")
    .bind(account, currentPeriod())
    .first<{ requests: number; bytes: number }>();
  return { requests: row?.requests ?? 0, bytes: row?.bytes ?? 0 };
}

/** Async usage write (off the response path via ctx.waitUntil). Upserts the period row. */
export async function recordUsage(env: Env, account: string, bytes: number): Promise<void> {
  await env.DB.prepare(
    "INSERT INTO usage (account_id, period, requests, bytes) VALUES (?, ?, 1, ?) " +
      "ON CONFLICT(account_id, period) DO UPDATE SET requests = requests + 1, bytes = bytes + ?"
  )
    .bind(account, currentPeriod(), bytes, bytes)
    .run();
}
