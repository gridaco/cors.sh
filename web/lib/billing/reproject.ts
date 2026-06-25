import type { Tier } from "@/lib/control/tiers";
import { kvRecord } from "@/lib/control/kv";

/**
 * Re-project every key the user owns into KV with the new tier's quota — this is what makes the
 * proxy actually enforce a tier change. Reuses the SAME `kvRecord` builder as project CRUD so the
 * billing path and the CRUD path produce byte-identical records (no drift). MUST run before the
 * webhook returns 200. The proxy picks up the change within its ~60s in-isolate LRU TTL.
 */
export async function reprojectUserKeys(
  env: CloudflareEnv,
  userId: string,
  tier: Tier,
): Promise<void> {
  const rows = await env.DB.prepare(
    `SELECT k.key AS key, k.key_type AS key_type, p.allowed_origins AS origins, p.allowed_targets AS targets
     FROM keys k JOIN projects p ON k.project_id = p.id
     WHERE k.account_id = ?`,
  )
    .bind(userId)
    .all<{ key: string; key_type: string; origins: string; targets: string }>();

  await Promise.all(
    rows.results.map((r) =>
      env.KEYS.put(
        r.key,
        JSON.stringify(
          kvRecord({
            account: userId,
            tier,
            keyType: r.key_type as "live" | "test",
            origins: JSON.parse(r.origins) as string[],
            targets: JSON.parse(r.targets) as string[],
          }),
        ),
      ),
    ),
  );
}
