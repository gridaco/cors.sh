import { getCloudflareContext } from "@opennextjs/cloudflare";
import { QUOTAS, type Tier } from "@/lib/control/tiers";
import { currentPeriod } from "@/lib/control/queries";
import { sendQuotaWarning, sendQuotaExceeded } from "@workspace/emails";

export const dynamic = "force-dynamic";

// Control-plane quota rollup. The proxy pings this (best-effort, off its hot path) when an account
// is near/over quota; here we own the fire-once-per-period dedup, the notify preference, and the
// actual send. Idempotent: the notified_80/100 flags guarantee one email per threshold per period.
export async function POST(req: Request) {
  const { env } = getCloudflareContext();
  if (env.INTERNAL_SECRET && req.headers.get("x-internal-secret") !== env.INTERNAL_SECRET) {
    return new Response("forbidden", { status: 403 });
  }

  const { account } = (await req.json().catch(() => ({}))) as { account?: string };
  if (!account) return Response.json({ sent: [] });

  const period = currentPeriod();
  const usage = await env.DB.prepare(
    "SELECT requests, bytes, notified_80, notified_100 FROM usage WHERE account_id=? AND period=?",
  )
    .bind(account, period)
    .first<{ requests: number; bytes: number; notified_80: number; notified_100: number }>();
  if (!usage) return Response.json({ sent: [] });

  const user = await env.DB.prepare("SELECT email, tier, notify_quota FROM users WHERE id=?")
    .bind(account)
    .first<{ email: string | null; tier: string; notify_quota: number }>();
  if (!user?.email) return Response.json({ sent: [] });

  const quota = QUOTAS[(user.tier as Tier) ?? "free"] ?? QUOTAS.free;
  const reqPct = usage.requests / quota.requests;
  const bytePct = usage.bytes / quota.bytes;
  // Report on whichever metric is closer to the limit.
  const metric = bytePct > reqPct ? "bandwidth" : "requests";
  const fmt = (n: number) => n.toLocaleString("en-US");
  const used = metric === "bandwidth" ? `${(usage.bytes / 1024 ** 3).toFixed(1)} GB` : fmt(usage.requests);
  const limit = metric === "bandwidth" ? `${(quota.bytes / 1024 ** 3).toFixed(0)} GB` : fmt(quota.requests);
  const upgradeUrl = `${env.NEXT_PUBLIC_APP_URL ?? "https://cors.sh"}/console/settings`;
  const sent: string[] = [];

  const over100 = usage.requests >= quota.requests || usage.bytes >= quota.bytes;
  const over80 = reqPct >= 0.8 || bytePct >= 0.8;

  if (over100) {
    if (!usage.notified_100) {
      await sendQuotaExceeded(env, user.email, { metric, used, limit, upgradeUrl });
      await env.DB.prepare("UPDATE usage SET notified_100=1 WHERE account_id=? AND period=?")
        .bind(account, period)
        .run();
      sent.push("exceeded");
    }
  } else if (over80) {
    if (!usage.notified_80 && user.notify_quota) {
      await sendQuotaWarning(env, user.email, {
        metric,
        used,
        limit,
        usedPct: Math.round(Math.max(reqPct, bytePct) * 100),
        upgradeUrl,
      });
      await env.DB.prepare("UPDATE usage SET notified_80=1 WHERE account_id=? AND period=?")
        .bind(account, period)
        .run();
      sent.push("warning");
    }
  }

  return Response.json({ sent });
}
