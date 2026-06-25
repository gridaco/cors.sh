import { applyCors, handlePreflight } from "./cors";
import { buildForwardHeaders, sanitizeResponseHeaders } from "./headers";
import { meteredBody } from "./meter";
import { parseTarget } from "./target";
import { parseApiKey, resolveKey, isActive, enforceOrigin, enforceTarget } from "./auth";
import { getUsage, recordUsage } from "./usage";
import { withinRateLimit } from "./ratelimit";
import { notifyQuota } from "./notify";
import type { Ctx, Env } from "./types";

export { RateLimiterDO } from "./ratelimit";

/** Per-request body cap (tier-configurable later; PRD §4.5). */
const MAX_BODY_BYTES = 6 * 1024 * 1024;
/** Anonymous (keyless) tier — generous per-IP rate cap (legacy compatibility, SPEC §4). */
const ANON_RATE = 30;
const ANON_WINDOW_S = 10;

export default {
  async fetch(request: Request, env: Env, ctx: Ctx): Promise<Response> {
    // 1. Preflight short-circuits before auth — the key can't ride an OPTIONS preflight (PRD §4.6).
    const preflight = handlePreflight(request);
    if (preflight) return preflight;

    // 2. Resolve the upstream target.
    const target = parseTarget(request);
    if (!target) return new Response("Usage: https://proxy.cors.sh/<target-url>", { status: 400 });

    // 3. Auth. A valid key gets origin pinning + tier quota; a keyless request falls back to the
    //    anonymous tier (IP rate-limited) so legacy `cors.sh/<url>` callers keep working (SPEC §4).
    const key = parseApiKey(request);
    const record = key ? await resolveKey(key, env) : null;
    let account: string;

    if (record && isActive(record)) {
      const originErr = enforceOrigin(request, record);
      if (originErr) return new Response(originErr.body, { status: originErr.status });

      const targetErr = enforceTarget(target, record);
      if (targetErr) return new Response(targetErr.body, { status: targetErr.status });

      // test_ keys: short-window cap via a Durable Object ("safe to leak"); live_ skips it.
      if (record.keyType === "test" && !(await withinRateLimit(env, "test:" + key!, 30, 10))) {
        return new Response("Rate limit exceeded — slow down.", { status: 429 });
      }

      // Approximate monthly quota (+ threshold notify).
      if (record.quota) {
        const usage = await getUsage(env, record.account);
        const q = record.quota;
        if (usage.requests >= q.requests || usage.bytes >= q.bytes) {
          ctx.waitUntil(notifyQuota(env, record.account));
          return new Response("Monthly quota exceeded. Upgrade your plan to continue.", {
            status: 429,
          });
        }
        if (usage.requests >= q.requests * 0.8 || usage.bytes >= q.bytes * 0.8) {
          ctx.waitUntil(notifyQuota(env, record.account));
        }
      }
      account = record.account;
    } else if (key) {
      // A key was supplied but it's unknown or revoked.
      return new Response("Invalid or revoked API key.", { status: 401 });
    } else {
      // Anonymous: no key → allowed, rate-limited per IP. No origin pinning, no target allowlist.
      const ip = request.headers.get("cf-connecting-ip") ?? "0.0.0.0";
      if (!(await withinRateLimit(env, "anon:" + ip, ANON_RATE, ANON_WINDOW_S))) {
        return new Response(
          "Anonymous rate limit reached. Get a free API key at https://cors.sh for higher limits.",
          { status: 429 },
        );
      }
      account = "anonymous";
    }

    // 4. Per-request size pre-check on Content-Length (mid-stream cutoff is future work).
    if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
      return new Response("Request body exceeds the per-request size cap.", { status: 413 });
    }

    // 5. Forward to the upstream, rewrite CORS, stream through the byte meter, emit usage async.
    const hasBody = !["GET", "HEAD"].includes(request.method);
    const upstream = await fetch(target, {
      method: request.method,
      headers: buildForwardHeaders(request),
      body: hasBody ? request.body : undefined,
      redirect: "manual",
    });

    const headers = applyCors(request, sanitizeResponseHeaders(upstream));
    if (!upstream.body) return new Response(null, { status: upstream.status, headers });

    const body = meteredBody(upstream.body, (bytes) =>
      ctx.waitUntil(recordUsage(env, account, bytes)),
    );
    return new Response(body, { status: upstream.status, headers });
  },
};
