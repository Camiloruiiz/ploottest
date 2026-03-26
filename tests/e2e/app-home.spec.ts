import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page, request }) => {
  await request.post("/api/v1/testing/reset");
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.goto("/");
});

test("catalog supports search, sort and visual snapshot", async ({ page }) => {
  await expect(page.getByRole("heading", { name: /Build the order flow/i })).toBeVisible();
  await page.getByLabel("Search products").fill("Pack");
  await expect(page.getByText("Mercury Field Pack")).toBeVisible();
  await page.locator("select").nth(1).selectOption("price_desc");
  await expect(page).toHaveScreenshot("catalog.png", { fullPage: true });
});

test("cart persists across reloads", async ({ page }) => {
  await page.getByRole("button", { name: "Add Atlas Trail Jacket to cart" }).click();
  await page.getByRole("link", { name: /Cart \(1\)/i }).click();
  await expect(page.getByRole("heading", { name: "Your purchase draft" })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Atlas Trail Jacket")).toBeVisible();
  await expect(page).toHaveScreenshot("cart.png", { fullPage: true });
});

test("user can sign in, checkout and review orders", async ({ page }) => {
  await page.getByRole("button", { name: "Add Atlas Trail Jacket to cart" }).click();
  await page.getByRole("link", { name: /Cart \(1\)/i }).click();
  await page.getByRole("link", { name: "Sign in to checkout" }).click();
  await page.getByLabel("Email").fill("shopper@example.com");
  await page.getByRole("button", { name: "Send magic link" }).click();
  await page.getByRole("link", { name: "Open demo magic link" }).click();
  await expect(page.getByRole("heading", { name: "Your purchase draft" })).toBeVisible();
  await expect(page.getByText("Atlas Trail Jacket")).toBeVisible();
  await expect(page.getByRole("button", { name: "Checkout now" })).toBeEnabled();
  await page.getByRole("button", { name: "Checkout now" }).click();
  await expect(page).toHaveURL(/\/orders/);
  await expect(page.getByText("Atlas Trail Jacket x 1")).toBeVisible();
  await expect(page).toHaveScreenshot("orders.png", { fullPage: true });
});
