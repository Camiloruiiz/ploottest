import { expect, test } from "@playwright/test";
import {
  createDemoOrderViaUi,
  isOrdersRequest,
  isProductsRequest,
  mockDelayedJson,
  mockFailure,
  resetDemoState,
  seedCart,
  seedDemoUser,
} from "../helpers/visual";

test.describe.configure({ mode: "serial" });

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

test("auth default view", async ({ page }) => {
  await page.goto("/auth?next=/cart");
  await expect(page.getByRole("heading", { name: "Sign in with a magic link" })).toBeVisible();
  await expect(page).toHaveScreenshot("auth-default.png", { fullPage: true });
});

test("auth success state", async ({ page }) => {
  await page.goto("/auth?next=/cart");
  await page.getByLabel("Email").fill("shopper@example.com");
  await page.getByRole("button", { name: "Send magic link" }).click();
  await expect(page.getByText("Demo magic link generated for local development.")).toBeVisible();
  await expect(page).toHaveScreenshot("auth-success.png", { fullPage: true });
});

test("auth error state", async ({ page }) => {
  await mockFailure(
    page,
    /\/api\/v1\/auth\/magic-link/,
    {
      ok: false,
      error: { code: "auth_unavailable", message: "Unable to send magic link." },
    },
    500,
  );

  await page.goto("/auth?next=/cart");
  await page.getByLabel("Email").fill("shopper@example.com");
  await page.getByRole("button", { name: "Send magic link" }).click();
  await expect(page.getByText("Unable to send magic link.")).toBeVisible();
  await expect(page).toHaveScreenshot("auth-error.png", { fullPage: true });
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
