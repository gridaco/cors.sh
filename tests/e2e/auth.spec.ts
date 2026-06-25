import { test, expect } from "@playwright/test";

// Anonymous (no storageState): the console is gated, and the login UI sends a magic link.
const WEB = process.env.WEB_URL || "http://localhost:3000";

test("unauthenticated /console redirects to /login", async ({ page }) => {
  await page.goto(`${WEB}/console`, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByLabel("Email")).toBeVisible();
});

test("login form sends a magic link", async ({ page }) => {
  await page.goto(`${WEB}/login`, { waitUntil: "domcontentloaded" });
  await page.getByLabel("Email").fill("uitest@example.com");
  await page.getByRole("button", { name: /sign-in link/i }).click();
  await expect(page.getByTestId("login-sent")).toBeVisible({ timeout: 15000 });
});
