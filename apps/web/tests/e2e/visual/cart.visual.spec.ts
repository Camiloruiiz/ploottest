import { expect, test } from "@playwright/test";
import { mockFailure } from "../helpers/mocks";
import { resetDemoState, seedCart, seedDemoUser } from "../helpers/state";

test.beforeEach(async ({ page }) => {
  await resetDemoState(page);
});

test("cart empty state", async ({ page }) => {
  await page.goto("/cart");
  await expect(page.getByText("Your cart is empty.")).toBeVisible();
  await expect(page).toHaveScreenshot("cart-empty.png", { fullPage: true });
});

test("cart filled state", async ({ page }) => {
  await seedCart(page, "multiple");
  await page.goto("/cart");
  await expect(page.getByText("Mercury Field Pack")).toBeVisible();
  await expect(page).toHaveScreenshot("cart-filled.png", { fullPage: true });
});

test("cart checkout error state", async ({ page }) => {
  await seedDemoUser(page, "shopper@example.com");
  await seedCart(page, "single");
  await mockFailure(
    page,
    /\/api\/v1\/orders$/,
    {
      ok: false,
      error: { code: "stock_insufficient", message: "Insufficient stock for Atlas Trail Jacket." },
    },
    409,
  );

  await page.goto("/cart");
  await page.getByRole("button", { name: "Checkout" }).click();
  await expect(page.getByText("Insufficient stock for Atlas Trail Jacket.")).toBeVisible();
  await expect(page).toHaveScreenshot("cart-error.png", { fullPage: true });
});
