import { bindings } from "@/lib/control/bindings";
import { resolveAccount } from "@/lib/control/account";
import { serializeProject, getUsage, type ProjectRow } from "@/lib/control/queries";
import { projectKeysToKV } from "@/lib/control/kv";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

async function loadProject(DB: CloudflareEnv["DB"], id: string, account: string) {
  return DB.prepare(
    "SELECT id,name,allowed_origins,allowed_targets,created_at FROM projects WHERE id=? AND account_id=?",
  )
    .bind(id, account)
    .first<ProjectRow>();
}

// GET /api/v1/projects/:id — project + keys + usage.
export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const acct = await resolveAccount();
  if (!acct) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { account } = acct;
  const { DB } = bindings();
  const proj = await loadProject(DB, id, account);
  if (!proj) return Response.json({ error: "not found" }, { status: 404 });
  const keys = await DB.prepare("SELECT key,key_type,active FROM keys WHERE project_id=?")
    .bind(id)
    .all<{ key: string; key_type: string; active: number }>();
  return Response.json({
    ...serializeProject(proj),
    keys: keys.results,
    usage: await getUsage(DB, account),
  });
}

// PATCH /api/v1/projects/:id — rename / change origins+targets, re-project keys to KV.
export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const acct = await resolveAccount();
  if (!acct) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { account, tier } = acct;
  const { DB, KEYS } = bindings();
  const proj = await loadProject(DB, id, account);
  if (!proj) return Response.json({ error: "not found" }, { status: 404 });

  const body = (await req.json().catch(() => ({}))) as {
    name?: string;
    allowedOrigins?: string[];
    allowedTargets?: string[];
  };
  const name = typeof body.name === "string" && body.name.trim() ? body.name.trim() : proj.name;
  const origins = body.allowedOrigins ?? (JSON.parse(proj.allowed_origins) as string[]);
  const targets = body.allowedTargets ?? (JSON.parse(proj.allowed_targets) as string[]);

  await DB.prepare("UPDATE projects SET name=?, allowed_origins=?, allowed_targets=? WHERE id=?")
    .bind(name, JSON.stringify(origins), JSON.stringify(targets), id)
    .run();

  const keys = await DB.prepare("SELECT key,key_type FROM keys WHERE project_id=?")
    .bind(id)
    .all<{ key: string; key_type: string }>();
  await projectKeysToKV(KEYS, keys.results, { account, tier, origins, targets });

  return Response.json({ id, name, allowedOrigins: origins, allowedTargets: targets });
}

// DELETE /api/v1/projects/:id — remove D1 rows + KV records (this is also key "rotation": SPEC §3).
export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const acct = await resolveAccount();
  if (!acct) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { account } = acct;
  const { DB, KEYS } = bindings();
  const proj = await loadProject(DB, id, account);
  if (!proj) return Response.json({ error: "not found" }, { status: 404 });

  const keys = await DB.prepare("SELECT key FROM keys WHERE project_id=?")
    .bind(id)
    .all<{ key: string }>();
  await Promise.all(keys.results.map((k) => KEYS.delete(k.key)));
  await DB.batch([
    DB.prepare("DELETE FROM keys WHERE project_id=?").bind(id),
    DB.prepare("DELETE FROM projects WHERE id=?").bind(id),
  ]);
  return Response.json({ deleted: id });
}
