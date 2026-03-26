import type { Page } from "@playwright/test";

type MockMatcher = string | RegExp | ((url: URL) => boolean);

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

export function isProductsRequest(url: URL) {
  return url.pathname.includes("/api/v1/products");
}

export function isOrdersRequest(url: URL) {
  return url.pathname.includes("/api/v1/orders");
}
