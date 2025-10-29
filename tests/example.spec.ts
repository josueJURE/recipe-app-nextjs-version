import { test, expect, type Page } from "@playwright/test";


interface PageType {
  page: Page;
}

test.beforeEach(async ({ page }: PageType) => {
  await page.goto("http://localhost:3000");
});

// test.describe("Home page", () => {
//   test("should display sign in page", async ({ page }: PageType) => {
//     // The home page shows the sign in card
//     await expect(page.locator('[data-slot="card-title"]')).toContainText(/sign in/i);
//   });
// });


// test.describe("Recipe form", () => {
//   test("form should be displayed after authentication", async ({ page }: PageType) => {
//     // First, create a test account
//     await page.goto("http://localhost:3000/sign-up");

//     // Fill in sign up form with unique email
//     const testEmail = `test${Date.now()}@example.com`;
//     await page.fill('input[id="name"]', "Test User");
//     await page.fill('input[id="email"]', testEmail);
//     await page.fill('input[id="password"]', "TestPassword123!");
//     await page.fill('input[id="confirmPassword"]', "TestPassword123!");

//     // Submit sign up form
//     await page.click('button[type="submit"]');

//     // Wait for redirect to sign-in page
//     await page.waitForURL(/sign-in/, { timeout: 10000 });

//     // Now sign in with the new account
//     await page.fill('input[name="email"]', testEmail);
//     await page.fill('input[name="password"]', "TestPassword123!");
//     await page.click('button[type="submit"]');

//     // Wait for navigation to recipe page
//     await page.waitForURL(/recipe-ui/, { timeout: 10000 });

//     // Now we should be on the recipe page, wait for form to be visible
//     await page.waitForSelector("#form", { state: "visible", timeout: 10000 });
//     await expect(page.locator("#form")).toBeVisible();

//     // Verify form elements exist
//     await expect(page.locator("#submit")).toBeVisible();
//   });
// });


