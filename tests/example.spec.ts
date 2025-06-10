import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000");
});

test.describe("Home page", () => {
  test("dear dev: should have correct metadata", async ({ page }) => {
    await expect(page.locator('#header')).toHaveText(
      "Unsure what to cook? Let recipe for sucess inspire your next meal from any country in the world"
    );
  });
});
