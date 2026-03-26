import { expect, test } from "@playwright/test";

test("renders the MVP base landing page", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("PlootTest MVP Base")).toBeVisible();
  await expect(page.getByRole("heading", { name: /executable platform/i })).toBeVisible();
  await expect(page.getByText("NEXT_PUBLIC_SUPABASE_URL")).toBeVisible();

  await expect(page).toHaveScreenshot("home.png", {
    fullPage: true,
  });
});
