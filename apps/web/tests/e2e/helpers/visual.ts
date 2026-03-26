import type { Page } from "@playwright/test";

const DEMO_USER_KEY = "ploottest_demo_user";
const CART_KEY = "ploottest_cart";
const ATLAS_ID = "6df858c8-fccf-43dc-9d2f-08d4d5bf5f00";
const MERCURY_ID = "b0f280b8-1515-4d8d-b91b-171dd6612872";

type MockMatcher = string | RegExp | ((url: URL) => boolean);
type SeedCartItem = {
  product_id: string;
  name: string;
  unit_price_cents: number;
  quantity: number;
  stock: number;
};

export async function resetDemoState(page: Page) {
  await page.request.post("/api/v1/testing/reset");
  await page.goto("/");
  await page.evaluate(
    ([cartKey, demoUserKey]) => {
      window.localStorage.removeItem(cartKey);
      window.localStorage.removeItem(demoUserKey);
      document.cookie = "ploottest_session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    },
    [CART_KEY, DEMO_USER_KEY],
  );
}

export async function seedDemoUser(page: Page, email: string) {
  await page.addInitScript(
    ([demoUserKey, value]) => {
      window.localStorage.setItem(demoUserKey, value);
    },
    [DEMO_USER_KEY, email],
  );
}

export async function seedCart(page: Page, mode: "single" | "multiple") {
  const items: SeedCartItem[] =
    mode === "single"
      ? [
          {
            product_id: ATLAS_ID,
            name: "Atlas Trail Jacket",
            unit_price_cents: 12900,
            quantity: 1,
            stock: 18,
          },
        ]
      : [
          {
            product_id: ATLAS_ID,
            name: "Atlas Trail Jacket",
            unit_price_cents: 12900,
            quantity: 2,
            stock: 18,
          },
          {
            product_id: MERCURY_ID,
            name: "Mercury Field Pack",
            unit_price_cents: 9400,
            quantity: 1,
            stock: 27,
          },
        ];

  await page.addInitScript(
    ({ cartKey, payload }: { cartKey: string; payload: SeedCartItem[] }) => {
      window.localStorage.setItem(cartKey, JSON.stringify({ items: payload }));
    },
    { cartKey: CART_KEY, payload: items },
  );
}

export async function mockJson(page: Page, pattern: MockMatcher, body: unknown, status = 200) {
  await page.route(pattern, async (route) => {
    await route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });
}

export async function mockFailure(page: Page, pattern: MockMatcher, body: unknown, status = 500) {
  await mockJson(page, pattern, body, status);
}

export async function mockDelayedJson(page: Page, pattern: MockMatcher, body: unknown) {
  let resolver: (() => Promise<void>) | null = null;

  await page.route(pattern, async (route) => {
    await new Promise<void>((resolve) => {
      resolver = async () => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(body),
        });
        resolve();
      };
    });
  });

  return async () => {
    if (resolver) {
      await resolver();
    }
  };
}

export async function createDemoOrderViaUi(page: Page) {
  await page.goto("/auth?next=/cart");
  await page.getByLabel("Email").fill("shopper@example.com");
  await page.getByRole("button", { name: "Send magic link" }).click();
  await page.getByRole("link", { name: "Open demo magic link" }).click();
  await page.goto("/");
  await page.getByTestId(`add-to-cart-${ATLAS_ID}`).click();
  await page.getByRole("link", { name: /Cart \(1\)/i }).click();
  await page.getByRole("button", { name: "Checkout" }).click();
  await page.waitForURL(/\/orders/);
}

export function isProductsRequest(url: URL) {
  return url.pathname.includes("/api/v1/products");
}

export function isOrdersRequest(url: URL) {
  return url.pathname.includes("/api/v1/orders");
}
