import { expect, test } from "@playwright/test";
import { requestDemoMagicLink } from "../helpers/flow";
import { mockFailure } from "../helpers/mocks";
import { resetDemoState } from "../helpers/state";

test.beforeEach(async ({ page }) => {
  await resetDemoState(page);
});

test("auth default view", async ({ page }) => {
  await page.goto("/auth?next=/cart");
  await expect(page.getByRole("heading", { name: "Sign in with a magic link" })).toBeVisible();
  await expect(page).toHaveScreenshot("auth-default.png", { fullPage: true });
});

test("auth success state", async ({ page }) => {
  await requestDemoMagicLink(page);
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
