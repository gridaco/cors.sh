import type { Env } from "./types";

/**
 * Best-effort ping to the control plane that an account is near/over quota. The control plane
 * owns the once-per-period dedup, the notify preference, and the actual email send. Called only
 * from `ctx.waitUntil` (off the response path) and only when usage is already ≥ 80%, so it never
 * touches the hot path and never affects the response. Failures are swallowed by design.
 */
export async function notifyQuota(env: Env, account: string): Promise<void> {
  if (!env.WEB_INTERNAL_URL) return;
  try {
    await fetch(`${env.WEB_INTERNAL_URL}/api/internal/quota`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-internal-secret": env.INTERNAL_SECRET ?? "",
      },
      body: JSON.stringify({ account }),
    });
  } catch {
    // intentional: notification is non-critical
  }
}
