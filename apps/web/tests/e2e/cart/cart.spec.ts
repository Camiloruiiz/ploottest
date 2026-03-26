import { expect, test } from "@playwright/test";
import { addProductToCart, ATLAS_ID } from "../helpers/flow";
import { resetDemoState } from "../helpers/state";

test.beforeEach(async ({ page }) => {
  await resetDemoState(page);
});

test("cart persists across reloads", async ({ page }) => {
  await addProductToCart(page, ATLAS_ID, "Atlas");
  await page.goto("/cart");
  await expect(page.getByRole("heading", { name: "Your purchase draft" })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Atlas Trail Jacket")).toBeVisible();
});
