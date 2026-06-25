import { auth } from "@/auth";
import type { Tier } from "./tiers";

/**
 * Resolve the acting account for a control-plane request — the signed-in user.
 * account = user (1:1). `tier` rides on the session (set from `users.tier` in the
 * session callback). Returns null when unauthenticated → callers respond 401.
 */
export async function resolveAccount(): Promise<{ account: string; tier: Tier } | null> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;
  const tier = (session.user.tier ?? "free") as Tier;
  return { account: userId, tier };
}
