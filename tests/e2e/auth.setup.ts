import { test as setup, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

// Programmatic sign-in for e2e: trigger a magic link, read the (dry-run) link from the web
// worker log, follow it to establish a database session, then persist storageState. Also
// seeds a project so the "lists projects" test has data. Auth.js hashes the token in D1, so
// the log is the only place the usable raw link exists.
const WEB = process.env.WEB_URL || "http://localhost:3000";
const WEB_LOG = process.env.WEB_LOG || path.resolve(process.cwd(), "../../.dev-state/web.log");
const SEED_EMAIL = "e2e@cors.sh";
const authFile = path.join(process.cwd(), ".auth/state.json");

async function latestMagicLink(email: string): Promise<string> {
  for (let i = 0; i < 60; i++) {
    if (fs.existsSync(WEB_LOG)) {
      const log = fs.readFileSync(WEB_LOG, "utf8");
      const matches = [...log.matchAll(/email:dry-run\] to=(\S+)[^\n]*link=(\S+)/g)];
      const mine = matches.filter((m) => m[1] === email && m[2].includes("token=")).pop();
      if (mine) return mine[2];
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`magic link for ${email} not found in ${WEB_LOG}`);
}

setup("authenticate + seed", async ({ page }) => {
  const ctx = page.context();
  const csrf = await (await ctx.request.get(`${WEB}/api/auth/csrf`)).json();
  await ctx.request.post(`${WEB}/api/auth/signin/resend`, {
    form: { email: SEED_EMAIL, csrfToken: csrf.csrfToken, callbackUrl: `${WEB}/console` },
  });

  const link = await latestMagicLink(SEED_EMAIL);
  await page.goto(link); // follows the callback → sets the session cookie in this context

  // Authenticated now — seed a project for the "lists projects" test.
  const res = await ctx.request.post(`${WEB}/api/v1/projects`, {
    data: { name: "My App", allowedOrigins: ["http://localhost:8090"] },
  });
  expect(res.ok()).toBeTruthy();

  fs.mkdirSync(path.dirname(authFile), { recursive: true });
  await ctx.storageState({ path: authFile });
});
