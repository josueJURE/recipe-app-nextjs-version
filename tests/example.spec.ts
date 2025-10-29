import { test, expect, type Page } from "@playwright/test";


interface PageType {
  page: Page;
}

test.beforeEach(async ({ page }: PageType) => {
  await page.goto("http://localhost:3000");
});

test.describe("Home page", () => {
  test("should display sign in page", async ({ page }: PageType) => {
    // The home page redirects to sign in, so we should see sign in elements
    await expect(page.locator('h2')).toContainText(/sign in/i);
  });
});


test.describe("Recipe form", () => {
  test("form should be displayed after authentication", async ({ page }: PageType) => {
    // Sign up or sign in to access the recipe page
    // First, try to sign up (or sign in if already exists)
    await page.goto("http://localhost:3000/sign-up");

    // Fill in sign up form
    const testEmail = `test${Date.now()}@example.com`;
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', "TestPassword123!");
    await page.fill('input[name="name"]', "Test User");

    // Submit sign up form
    await page.click('button[type="submit"]');

    // Wait for navigation after sign up/sign in
    await page.waitForURL(/recipe-ui/, { timeout: 10000 });

    // Now we should be on the recipe page, wait for form to be visible
    await page.waitForSelector("#form", { state: "visible", timeout: 10000 });
    await expect(page.locator("#form")).toBeVisible();

    // Verify form elements exist
    await expect(page.locator("#submit")).toBeVisible();
  });
});


