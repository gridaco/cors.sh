import { test, expect, type Page } from "@playwright/test";

// External servers (started by the runner):
const MOCK = process.env.MOCK_URL || "http://localhost:8788"; // mock-reject API (workers/mock)
const PROXY = process.env.PROXY_URL || "http://localhost:8786"; // cors.sh proxy (workers/proxy)
const KEY = process.env.CORS_KEY || "test_dev"; // test key: not origin-enforced

type FetchResult =
  | { ok: true; status: number; acao: string | null; body: string }
  | { ok: false; name: string; message: string };

/** Run fetch() inside the page (real browser → subject to SOP/CORS). */
function fetchInPage(page: Page, url: string, opts: RequestInit = {}): Promise<FetchResult> {
  return page.evaluate(
    async ({ url, opts }) => {
      try {
        const r = await fetch(url, opts as RequestInit);
        return { ok: true as const, status: r.status, acao: r.headers.get("access-control-allow-origin"), body: await r.text() };
      } catch (e: any) {
        return { ok: false as const, name: e?.name ?? "Error", message: String(e?.message ?? e) };
      }
    },
    { url, opts }
  );
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("A. direct fetch to a no-CORS endpoint is BLOCKED by the browser", async ({ page }) => {
  const r = await fetchInPage(page, `${MOCK}/no-cors`);
  expect(r.ok).toBe(false);
  if (!r.ok) expect(r.name).toBe("TypeError"); // "Failed to fetch"
});

test("B. the SAME request via cors.sh is ALLOWED (body readable, ACAO present)", async ({ page }) => {
  const r = await fetchInPage(page, `${PROXY}/${MOCK}/no-cors`, { headers: { "x-cors-api-key": KEY } });
  expect(r.ok).toBe(true);
  if (r.ok) {
    expect(r.status).toBe(200);
    expect(r.acao).toBe("*");
    expect(r.body).toContain("no-cors");
  }
});

test("C. direct fetch to an ACAO-pinned-elsewhere endpoint is BLOCKED", async ({ page }) => {
  const r = await fetchInPage(page, `${MOCK}/wrong-origin`);
  expect(r.ok).toBe(false);
});

test("D. control: an ACAO:* endpoint succeeds directly (harness self-check)", async ({ page }) => {
  const r = await fetchInPage(page, `${MOCK}/allow-all`);
  expect(r.ok).toBe(true);
  if (r.ok) expect(r.status).toBe(200);
});

test("E. a preflighted (non-simple DELETE) request succeeds via the proxy", async ({ page }) => {
  // DELETE is a non-simple method → the browser MUST preflight. Success proves the proxy
  // answered the OPTIONS (reflecting Allow-Methods) and forwarded the real DELETE.
  const r = await fetchInPage(page, `${PROXY}/${MOCK}/no-cors`, { method: "DELETE", headers: { "x-cors-api-key": KEY } });
  expect(r.ok).toBe(true);
  if (r.ok) expect(r.status).toBe(200);
});

test("F. a credentialed request against ACAO:* stays BLOCKED (documented limitation)", async ({ page }) => {
  const r = await fetchInPage(page, `${PROXY}/${MOCK}/allow-all`, {
    credentials: "include",
    headers: { "x-cors-api-key": KEY },
  });
  expect(r.ok).toBe(false);
});

test("G. a keyless (anonymous) request via the proxy is ALLOWED (legacy compat, IP-capped)", async ({ page }) => {
  // No x-cors-api-key → the anonymous tier serves it (rate-limited per IP), with CORS rewritten.
  const r = await fetchInPage(page, `${PROXY}/${MOCK}/no-cors`);
  expect(r.ok).toBe(true);
  if (r.ok) {
    expect(r.status).toBe(200);
    expect(r.acao).toBe("*");
  }
});
