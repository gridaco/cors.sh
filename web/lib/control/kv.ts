import type { KVNamespace } from "@cloudflare/workers-types";
import { QUOTAS, type Tier } from "./tiers";

export type KeyType = "live" | "test";

/**
 * The projection the proxy hot path reads from KV to authorize + meter a request (SPEC §3).
 * THE ONE PLACE this shape is built — project-CRUD and billing re-projection both call here,
 * so the proxy never sees a divergent record. Changing the shape means changing only this fn.
 */
export function kvRecord(opts: {
  account: string;
  tier: Tier;
  keyType: KeyType;
  origins: string[];
  targets: string[];
  active?: boolean;
}) {
  return {
    account: opts.account,
    tier: opts.tier,
    keyType: opts.keyType,
    allowedOrigins: opts.origins,
    allowedTargets: opts.targets,
    active: opts.active ?? true,
    quota: QUOTAS[opts.tier],
  };
}

/** Write/refresh a set of keys into KV with the same record shape. */
export async function projectKeysToKV(
  KEYS: KVNamespace,
  keys: { key: string; key_type: string }[],
  opts: { account: string; tier: Tier; origins: string[]; targets: string[] },
): Promise<void> {
  await Promise.all(
    keys.map((k) =>
      KEYS.put(
        k.key,
        JSON.stringify(
          kvRecord({
            account: opts.account,
            tier: opts.tier,
            keyType: k.key_type as KeyType,
            origins: opts.origins,
            targets: opts.targets,
          }),
        ),
      ),
    ),
  );
}
