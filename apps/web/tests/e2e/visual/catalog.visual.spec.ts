import { expect, test } from "@playwright/test";
import { isProductsRequest, mockDelayedJson, mockFailure } from "../helpers/mocks";
import { resetDemoState } from "../helpers/state";

test.beforeEach(async ({ page }) => {
  await resetDemoState(page);
});

test("catalog default view", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Collect what you want/i })).toBeVisible();
  await expect(page).toHaveScreenshot("catalog-default.png", { fullPage: true });
});

test("catalog empty state", async ({ page }) => {
  await page.goto("/?q=zzzz");
  await expect(page.getByText("No products matched the current filters.")).toBeVisible();
  await expect(page).toHaveScreenshot("catalog-empty.png", { fullPage: true });
});

test("catalog loading state", async ({ page }) => {
  const release = await mockDelayedJson(
    page,
    isProductsRequest,
    {
      ok: true,
      data: {
        items: [],
        meta: { page: 1, pageSize: 6, total: 0, totalPages: 1 },
      },
    },
  );

  await page.goto("/");
  await expect(page.getByText("Loading catalog...")).toBeVisible();
  await expect(page).toHaveScreenshot("catalog-loading.png", { fullPage: true });
  await release();
});

test("catalog error state", async ({ page }) => {
  await mockFailure(
    page,
    isProductsRequest,
    {
      ok: false,
      error: { code: "products_fetch_failed", message: "Products exploded." },
    },
    500,
  );

  await page.goto("/");
  await expect(page.getByText("Products exploded.")).toBeVisible();
  await expect(page).toHaveScreenshot("catalog-error.png", { fullPage: true });
});
