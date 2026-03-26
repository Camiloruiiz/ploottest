import type { Page } from "@playwright/test";
import { ATLAS_ID, MERCURY_ID } from "./flow";

const DEMO_USER_KEY = "ploottest_demo_user";
const CART_KEY = "ploottest_cart";

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
