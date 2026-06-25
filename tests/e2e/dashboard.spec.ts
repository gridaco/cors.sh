import { test, expect } from "@playwright/test";

const WEB = process.env.WEB_URL || "http://localhost:3000";
const PAGE = process.env.PAGE_URL || "http://localhost:8090";
const PROXY = process.env.PROXY_URL || "http://localhost:8786";
const MOCK = process.env.MOCK_URL || "http://localhost:8788";

test.describe.configure({ mode: "serial" });

test("dashboard lists real projects from the control API", async ({ page }) => {
  // domcontentloaded (NOT networkidle) — the marketing GA/gtag beacons never let the network idle.
  await page.goto(`${WEB}/console`, { waitUntil: "domcontentloaded" });
  // "My App" was created earlier via the control API; it must render from live data.
  await expect(page.getByText("My App", { exact: false }).first()).toBeVisible({ timeout: 30000 });
});

test("MVP full loop: dashboard creates a project, and its key works through the proxy", async ({ page }) => {
  // 1. Create a project in the dashboard UI, pinned to the test origin.
  await page.goto(`${WEB}/console/new`);
  await page.fill("#name", "E2E Project");
  await page.fill("#origins", PAGE);
  await page.getByRole("button", { name: "Create Project" }).click();

  // 2. Keys revealed once.
  await expect(page.getByText("Project created")).toBeVisible({ timeout: 30000 });
  const liveKey = await page.locator("input[readonly]").first().inputValue();
  expect(liveKey).toMatch(/^live_/);

  // 3. From the allowed origin, use that key through the proxy → browser accepts (CORS fixed).
  await page.goto(`${PAGE}/`);
  const res = await page.evaluate(
    async ({ proxy, mock, key }) => {
      try {
        const r = await fetch(`${proxy}/${mock}/no-cors`, { headers: { "x-cors-api-key": key } });
        return { ok: true as const, status: r.status, acao: r.headers.get("access-control-allow-origin") };
      } catch (e: any) {
        return { ok: false as const, name: e?.name };
      }
    },
    { proxy: PROXY, mock: MOCK, key: liveKey }
  );
  expect(res.ok).toBe(true);
  if (res.ok) {
    expect(res.status).toBe(200);
    expect(res.acao).toBe("*");
  }
});
