import { test, expect } from "@playwright/test";

// The playground page is served by the web app (3000), not the page-origin baseURL (8090).
const WEB = process.env.WEB_URL || "http://localhost:3000";
const MOCK = process.env.MOCK_URL || "http://localhost:8788"; // mock-reject API (workers/mock)

test("playground: direct request is blocked, the same request via the proxy succeeds", async ({
  page,
}) => {
  await page.goto(`${WEB}/playground`);

  // Target a deliberately no-CORS endpoint that is cross-origin to the web app → the browser
  // blocks the direct fetch, and the proxy (PLAYGROUND_PROXY_URL → local proxy) rewrites it.
  await page.getByLabel("Target URL").fill(`${MOCK}/no-cors`);
  await page.getByRole("button", { name: "Run" }).click();

  // Direct panel: blocked by the browser.
  await expect(page.getByText("Blocked by the browser")).toBeVisible();

  // Proxy panel: a 200 means JS could read the response — impossible for a CORS-blocked request.
  await expect(page.getByText(/200 OK/)).toBeVisible();

  // The proxied response carries the cors.sh-injected header (only the proxy panel has tabs).
  await page.getByRole("tab", { name: /headers/i }).click();
  await expect(page.getByText("access-control-allow-origin").first()).toBeVisible();
});
