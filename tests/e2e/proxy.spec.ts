import { test, expect } from "@playwright/test";

// Proxy enforcement at the API level (status codes the browser can't show, since rejections omit CORS
// headers). Uses the seeded keys: test_dev (not origin-enforced) + live_dev (pinned to :8090).
const PROXY = process.env.PROXY_URL || "http://localhost:8786";
const MOCK = process.env.MOCK_URL || "http://localhost:8788";
const target = `${PROXY}/${MOCK}/allow-all`;

test("invalid api key → 401", async ({ request }) => {
  const r = await request.get(target, { headers: { "x-cors-api-key": "live_bogus_nonexistent" } });
  expect(r.status()).toBe(401);
});

test("keyless (anonymous) → 200, CORS rewritten", async ({ request }) => {
  const r = await request.get(target);
  expect(r.status()).toBe(200);
  expect(r.headers()["access-control-allow-origin"]).toBe("*");
});

test("live key from an ALLOWED origin → 200", async ({ request }) => {
  const r = await request.get(target, {
    headers: { "x-cors-api-key": "live_dev", Origin: "http://localhost:8090" },
  });
  expect(r.status()).toBe(200);
});

test("live key from a WRONG origin → 403 (origin pinning)", async ({ request }) => {
  const r = await request.get(target, {
    headers: { "x-cors-api-key": "live_dev", Origin: "https://evil.example" },
  });
  expect(r.status()).toBe(403);
});

test("live key with NO origin → 403 (fail closed)", async ({ request }) => {
  const r = await request.get(target, { headers: { "x-cors-api-key": "live_dev" } });
  expect(r.status()).toBe(403);
});

test("test_ key short-window rate cap (30/10s) → bursts get 429", async ({ request }) => {
  // A burst beyond the cap must produce both allowed and rejected responses.
  const codes = await Promise.all(
    Array.from({ length: 45 }, () =>
      request.get(target, { headers: { "x-cors-api-key": "test_dev" } }).then((r) => r.status()),
    ),
  );
  expect(codes.filter((c) => c === 200).length).toBeGreaterThan(0);
  expect(codes.filter((c) => c === 429).length).toBeGreaterThan(0);
});
