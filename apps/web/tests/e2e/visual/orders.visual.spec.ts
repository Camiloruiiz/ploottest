import { expect, test } from "@playwright/test";
import { createDemoOrderViaUi } from "../helpers/flow";
import { isOrdersRequest, mockFailure } from "../helpers/mocks";
import { resetDemoState, seedDemoUser } from "../helpers/state";

test.beforeEach(async ({ page }) => {
  await resetDemoState(page);
});

test("orders empty state", async ({ page }) => {
  await seedDemoUser(page, "shopper@example.com");
  await page.goto("/orders");
  await expect(page.getByText("No orders yet.")).toBeVisible();
  await expect(page).toHaveScreenshot("orders-empty.png", { fullPage: true });
});

test("orders filled state", async ({ page }) => {
  await createDemoOrderViaUi(page);
  await expect(page.getByText("Atlas Trail Jacket x 1")).toBeVisible();
  await expect(page).toHaveScreenshot("orders-filled.png", { fullPage: true });
});

test("orders error state", async ({ page }) => {
  await seedDemoUser(page, "shopper@example.com");
  await mockFailure(
    page,
    isOrdersRequest,
    {
      ok: false,
      error: { code: "orders_fetch_failed", message: "Orders are currently unavailable." },
    },
    500,
  );

  await page.goto("/orders");
  await expect(page.getByText("Orders are currently unavailable.")).toBeVisible();
  await expect(page).toHaveScreenshot("orders-error.png", { fullPage: true });
});
