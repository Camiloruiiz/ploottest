import { expect, test } from "@playwright/test";
import { searchCatalog } from "../helpers/flow";
import { resetDemoState } from "../helpers/state";

test.beforeEach(async ({ page }) => {
  await resetDemoState(page);
});

test("catalog supports search and sort", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Catalog" })).toBeVisible();
  await searchCatalog(page, "Pack");
  await expect(page.getByText("Mercury Field Pack")).toBeVisible();
  await page.locator("select").nth(1).selectOption("price_desc");
});
