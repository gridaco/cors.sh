import { bindings } from "@/lib/control/bindings";
import { resolveAccount } from "@/lib/control/account";

export const dynamic = "force-dynamic";

// PATCH /api/v1/account — update account preferences (currently the quota-notification toggle).
export async function PATCH(req: Request) {
  const acct = await resolveAccount();
  if (!acct) return Response.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { notifyQuota?: boolean };
  if (typeof body.notifyQuota === "boolean") {
    const { DB } = bindings();
    await DB.prepare("UPDATE users SET notify_quota=? WHERE id=?")
      .bind(body.notifyQuota ? 1 : 0, acct.account)
      .run();
  }
  return Response.json({ ok: true });
}
