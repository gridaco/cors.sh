import type { D1Database } from "@cloudflare/workers-types";

export interface ProjectRow {
  id: string;
  name: string;
  allowed_origins: string;
  allowed_targets: string;
  created_at: number;
}

export function serializeProject(r: ProjectRow) {
  return {
    id: r.id,
    name: r.name,
    allowedOrigins: JSON.parse(r.allowed_origins) as string[],
    allowedTargets: JSON.parse(r.allowed_targets) as string[],
    createdAt: r.created_at,
  };
}

/** Billing period (stub: UTC month). Real anchor = Stripe current_period_* (deferred, SPEC §8). */
export function currentPeriod(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export async function getUsage(
  DB: D1Database,
  account: string,
): Promise<{ period: string; requests: number; bytes: number }> {
  const period = currentPeriod();
  const row = await DB.prepare("SELECT requests, bytes FROM usage WHERE account_id=? AND period=?")
    .bind(account, period)
    .first<{ requests: number; bytes: number }>();
  return { period, requests: row?.requests ?? 0, bytes: row?.bytes ?? 0 };
}
