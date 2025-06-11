import { test, expect, type Page } from "@playwright/test";


interface PageType {
  page: Page;
}

test.beforeEach(async ({ page }: PageType) => {
  await page.goto("http://localhost:3000");
});

test.describe("Home page", () => {
  test("dear dev: should have correct metadata", async ({ page }: PageType) => {
    await expect(page.locator('#header')).toHaveText(
      "Unsure what to cook? Let recipe for sucess inspire your next meal from any country in the world"
    );
  });
});


test.describe("form", () => {
  test("form should be displayed", async ({ page }: PageType) => {
    // Wait for form to be visible
    await page.waitForSelector("#form", { state: "visible" });
    await expect(page.locator("#form")).toBeVisible();

    // Verify form elements exist
    await expect(page.locator("#submit")).toBeVisible();
  });
});
