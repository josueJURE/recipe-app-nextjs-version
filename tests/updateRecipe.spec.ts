// tests/updateRecipe.spec.ts

import { test, expect, request } from '@playwright/test';

test.describe('POST /api/updateRecipe', () => {
  test('should return 200 and a valid response when sent correct data', async ({}) => {
    const requestContext = await request.newContext();

    const response = await requestContext.post('http://localhost:3000/api/updateRecipe', {
      data: {
        countrySelected: 'Italy',
        dietaryRequirements: {
          vegan: true,
          other: {
            checked: true,
            text: 'gluten-free',
          },
        },
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const text = await response.text();
    expect(text).toContain("Vegan and Gluten-Free Eggplant Parmesan")
  
  });
});
