export type Tier = "free" | "pro" | "team";

/** Quota per tier (request count + bandwidth bytes per period). */
export const QUOTAS: Record<Tier, { requests: number; bytes: number }> = {
  free: { requests: 10_000, bytes: 5 * 1024 ** 3 }, // 5 GB
  pro: { requests: 500_000, bytes: 500 * 1024 ** 3 }, // 500 GB
  team: { requests: 5_000_000, bytes: 1024 ** 4 }, // 1 TB
};
