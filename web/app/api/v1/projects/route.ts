import { bindings } from "@/lib/control/bindings";
import { resolveAccount } from "@/lib/control/account";
import { serializeProject, type ProjectRow } from "@/lib/control/queries";
import { projectKeysToKV } from "@/lib/control/kv";
import { generateKey, newId } from "@/lib/control/keygen";

export const dynamic = "force-dynamic";

// GET /api/v1/projects — list the account's projects.
export async function GET() {
  const acct = await resolveAccount();
  if (!acct) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { account } = acct;
  const { DB } = bindings();
  const rows = await DB.prepare(
    "SELECT id,name,allowed_origins,allowed_targets,created_at FROM projects WHERE account_id=? ORDER BY created_at DESC",
  )
    .bind(account)
    .all<ProjectRow>();
  return Response.json({ projects: rows.results.map(serializeProject) });
}

// POST /api/v1/projects — create a project + its live/test keys (returned ONCE).
export async function POST(req: Request) {
  const acct = await resolveAccount();
  if (!acct) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { account, tier } = acct;
  const { DB, KEYS } = bindings();
  const body = (await req.json().catch(() => ({}))) as {
    name?: string;
    allowedOrigins?: string[];
    allowedTargets?: string[];
  };
  const id = newId();
  const liveKey = generateKey("live");
  const testKey = generateKey("test");
  const now = Date.now();
  const name = body.name?.trim() || "Untitled";
  const origins = body.allowedOrigins ?? [];
  const targets = body.allowedTargets ?? [];

  await DB.batch([
    DB.prepare(
      "INSERT INTO projects (id,account_id,name,allowed_origins,allowed_targets,created_at) VALUES (?,?,?,?,?,?)",
    ).bind(id, account, name, JSON.stringify(origins), JSON.stringify(targets), now),
    DB.prepare("INSERT INTO keys (key,project_id,account_id,key_type,active,created_at) VALUES (?,?,?,?,1,?)").bind(
      liveKey,
      id,
      account,
      "live",
      now,
    ),
    DB.prepare("INSERT INTO keys (key,project_id,account_id,key_type,active,created_at) VALUES (?,?,?,?,1,?)").bind(
      testKey,
      id,
      account,
      "test",
      now,
    ),
  ]);

  await projectKeysToKV(
    KEYS,
    [
      { key: liveKey, key_type: "live" },
      { key: testKey, key_type: "test" },
    ],
    { account, tier, origins, targets },
  );

  return Response.json(
    { id, name, allowedOrigins: origins, allowedTargets: targets, keys: { live: liveKey, test: testKey } },
    { status: 201 },
  );
}
