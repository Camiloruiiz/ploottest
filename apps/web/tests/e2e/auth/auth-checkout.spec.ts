import { expect, test } from "@playwright/test";
import { completeDemoCheckout } from "../helpers/flow";
import { resetDemoState } from "../helpers/state";

test.beforeEach(async ({ page }) => {
  await resetDemoState(page);
});

test("user can sign in, checkout and review orders", async ({ page }) => {
  await completeDemoCheckout(page);
  await expect(page.getByText("Atlas Trail Jacket x 1")).toBeVisible();
});
