import type { Env } from "./types";

/**
 * Exact per-key rate limiter (fixed window) backed by a **Durable Object**.
 *
 * Why a DO and not the Workers Rate Limiting binding: the binding does NOT enforce on this account
 * (verified — `limit()` returns success always; SPEC §4). A DO is the CF-native primitive for an exact
 * counter: one instance per rate-limit key, single-threaded, so the synchronous check+increment is
 * atomic (spike 7.2 proved this). We deliberately do NOT use Redis/Upstash — an external per-request hop
 * from a global edge undercuts the latency/zero-egress thesis (SPEC §4 decision).
 *
 * Applied to `test_` keys only ("safe to leak"); `live_` keys skip it to keep the hot path fast — they're
 * already bounded by origin pinning + the monthly quota.
 */
interface DOState {
  storage: {
    get<T = unknown>(k: string): Promise<T | undefined>;
    put(k: string, v: unknown): Promise<void>;
  };
}

export class RateLimiterDO {
  private window?: { start: number; count: number };
  constructor(private state: DOState) {}

  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit") ?? 30);
    const periodMs = Number(url.searchParams.get("period") ?? 10) * 1000;
    const now = Date.now();

    if (!this.window)
      this.window = (await this.state.storage.get<{ start: number; count: number }>("w")) ?? {
        start: 0,
        count: 0,
      };
    if (now - this.window.start >= periodMs) this.window = { start: now, count: 0 };
    // synchronous check+increment — atomic within the single-threaded DO
    this.window.count++;
    const allowed = this.window.count <= limit;
    this.state.storage.put("w", this.window); // write-behind (input-gated)

    return new Response(JSON.stringify({ allowed, count: this.window.count, limit }), {
      headers: { "content-type": "application/json" },
    });
  }
}

/** True if this request is within `limit` per `periodSec` for `key`. */
export async function withinRateLimit(
  env: Env,
  key: string,
  limit: number,
  periodSec: number,
): Promise<boolean> {
  const id = env.RATE_LIMITER.idFromName(key);
  const res = await env.RATE_LIMITER.get(id).fetch(
    `https://rl/?limit=${limit}&period=${periodSec}`,
  );
  const { allowed } = (await res.json()) as { allowed: boolean };
  return allowed;
}
