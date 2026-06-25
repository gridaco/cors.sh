import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { Page } from "@playwright/test";

export const WEB = process.env.WEB_URL || "http://localhost:3000";
const WEB_LOG = process.env.WEB_LOG || path.resolve(process.cwd(), "../../.dev-state/web.log");

/** Read the most recent magic-link (dry-run) for an email from the web worker log. */
export async function magicLinkFor(email: string): Promise<string> {
  for (let i = 0; i < 60; i++) {
    if (fs.existsSync(WEB_LOG)) {
      const log = fs.readFileSync(WEB_LOG, "utf8");
      const m = [...log.matchAll(/email:dry-run\] to=(\S+)[^\n]*link=(\S+)/g)]
        .filter((x) => x[1] === email && x[2].includes("token="))
        .pop();
      if (m) return m[2];
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`no magic link for ${email} in ${WEB_LOG}`);
}

/** Sign in a fresh user in the page's context via the magic-link flow. */
export async function signIn(page: Page, email: string): Promise<void> {
  const ctx = page.context();
  const csrf = await (await ctx.request.get(`${WEB}/api/auth/csrf`)).json();
  await ctx.request.post(`${WEB}/api/auth/signin/resend`, {
    form: { email, csrfToken: csrf.csrfToken, callbackUrl: `${WEB}/console` },
  });
  await page.goto(await magicLinkFor(email));
}

/** Build a Stripe webhook signature header the same way the SDK's test helper does. */
export function stripeSig(payload: string, secret: string): string {
  const t = Math.floor(Date.now() / 1000);
  const sig = crypto.createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex");
  return `t=${t},v1=${sig}`;
}

/** Current contents of the web worker's (dry-run) email log. */
export function webLog(): string {
  try {
    return fs.readFileSync(WEB_LOG, "utf8");
  } catch {
    return "";
  }
}

/** Poll the email log until `substring` appears (emails are written just before the request returns). */
export async function waitForLog(substring: string, timeoutMs = 5000): Promise<boolean> {
  const end = Date.now() + timeoutMs;
  while (Date.now() < end) {
    if (webLog().includes(substring)) return true;
    await new Promise((r) => setTimeout(r, 150));
  }
  return false;
}
