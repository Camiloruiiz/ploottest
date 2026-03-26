import { expect, type Page } from "@playwright/test";

export const ATLAS_ID = "6df858c8-fccf-43dc-9d2f-08d4d5bf5f00";
export const MERCURY_ID = "b0f280b8-1515-4d8d-b91b-171dd6612872";

export async function searchCatalog(page: Page, query: string) {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Catalog" })).toBeVisible();
  const responsePromise = page.waitForResponse((response) => {
    return response.url().includes("/api/v1/products") && response.ok();
  });
  await page.getByLabel("Search products").fill(query);
  await responsePromise;
  await expect(page.getByText("Unexpected token '<', \"<!DOCTYPE \"... is not valid JSON")).toHaveCount(0);
}

export async function addProductToCart(page: Page, productId: string, query?: string) {
  if (query) {
    await searchCatalog(page, query);
  }

  await expect(page.getByTestId(`add-to-cart-${productId}`)).toBeVisible();
  await page.getByTestId(`add-to-cart-${productId}`).click();
}

export async function requestDemoMagicLink(page: Page, email = "shopper@example.com", next = "/cart") {
  await page.goto(`/auth?next=${encodeURIComponent(next)}`);
  await expect(page.getByRole("heading", { name: "Sign in with a magic link" })).toBeVisible();
  await page.getByLabel("Email").fill(email);
  await page.getByRole("button", { name: "Send magic link" }).click();
}

export async function signInDemoUser(page: Page, email = "shopper@example.com", next = "/cart") {
  await requestDemoMagicLink(page, email, next);
  await page.getByRole("link", { name: "Open demo magic link" }).click();
}

export async function completeDemoCheckout(page: Page, productId = ATLAS_ID, query = "Atlas") {
  await signInDemoUser(page);
  await addProductToCart(page, productId, query);
  await page.goto("/cart");
  await page.getByRole("button", { name: "Checkout" }).click();
  await page.waitForURL(/\/orders/);
}

export async function createDemoOrderViaUi(page: Page) {
  await completeDemoCheckout(page);
}
