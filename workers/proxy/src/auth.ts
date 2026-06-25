import type { AuthError, Env, KeyRecord } from "./types";

/** Parse the API key from the request (header aliases + query, legacy parity). */
export function parseApiKey(request: Request): string | null {
  return (
    request.headers.get("x-cors-api-key") ||
    request.headers.get("x-cors-grida-api-key") ||
    new URL(request.url).searchParams.get("cors_api_key")
  );
}

/**
 * KV-backed key resolver with an in-isolate LRU (PRD §4.3). The LRU TTL bounds revocation
 * propagation (PRD §5.2: target ≤60s) — a flipped/deleted KV record takes effect within TTL.
 * (TODO prod: store by a hash of the key, not the raw key; add size-bounded LRU eviction.)
 */
const CACHE_TTL_MS = 60_000;
const cache = new Map<string, { record: KeyRecord | null; exp: number }>();

export async function resolveKey(key: string, env: Env): Promise<KeyRecord | null> {
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && hit.exp > now) return hit.record;

  const record = (await env.KEYS.get(key, { type: "json" })) as KeyRecord | null;
  // Positive-cache only: don't cache a miss (lets a newly-provisioned key activate as soon as
  // KV propagates). Revocation is a positive `active:false` record, so it's still cached/bounded.
  if (record) cache.set(key, { record, exp: now + CACHE_TTL_MS });
  return record;
}

/** A resolved record is usable only if not revoked and not expired. */
export function isActive(record: KeyRecord): boolean {
  if (record.active === false) return false;
  if (record.validUntil && record.validUntil < Math.floor(Date.now() / 1000)) return false;
  return true;
}

/**
 * Origin pinning (PRD §4.6). live keys: require a real, allowlisted Origin (fail closed on
 * null/missing). test keys: not origin-enforced (rate-capped elsewhere — "safe to leak").
 */
export function enforceOrigin(request: Request, record: KeyRecord): AuthError | null {
  if (record.keyType === "test") return null;

  const origin = request.headers.get("origin");
  if (!origin || origin === "null")
    return { status: 403, body: "Live key requires a browser Origin." };
  if (record.allowedOrigins.length > 0 && !record.allowedOrigins.includes(origin)) {
    return { status: 403, body: "Origin not allowed for this key." };
  }
  return null;
}

/** Target-host allowlist — caps even a forged-origin attacker to declared upstreams (PRD §4.6). */
export function enforceTarget(target: string, record: KeyRecord): AuthError | null {
  if (record.allowedTargets.length === 0) return null;
  let host: string;
  try {
    host = new URL(target).host;
  } catch {
    return { status: 400, body: "Invalid target URL." };
  }
  if (!record.allowedTargets.includes(host))
    return { status: 403, body: "Target not allowed for this key." };
  return null;
}
