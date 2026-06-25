import { bindings } from "@/lib/control/bindings";
import { resolveAccount } from "@/lib/control/account";
import { getUsage } from "@/lib/control/queries";
import { QUOTAS } from "@/lib/control/tiers";

export const dynamic = "force-dynamic";

// GET /api/v1/usage — current-period usage + the account's tier quota.
export async function GET() {
  const acct = await resolveAccount();
  if (!acct) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { account, tier } = acct;
  const { DB } = bindings();
  const usage = await getUsage(DB, account);
  return Response.json({ ...usage, quota: QUOTAS[tier] });
}
