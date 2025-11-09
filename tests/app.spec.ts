import { test, expect } from '@playwright/test';

test.describe('App Initialization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Displays header, main title, and default components', async ({
    page,
  }) => {
    // Verify that the header with the logo is visible
    const logo = page.getByRole('link', {
      name: /Logo representing stylized Sun with a text 'Weather Now'/i,
    });
    await expect(logo).toBeVisible();

    // Verify that the UnitsSelector is visible
    const unitsSelector = page.getByTestId('units-selector');
    await expect(unitsSelector).toBeVisible();

    // Verify that the main title is displayed
    const mainTitle = page.getByRole('heading', {
      name: /How's the sky looking today\?/i,
    });
    await expect(mainTitle).toBeVisible();

    // Verify that the Search component is visible
    const searchComponent = page.getByRole('textbox', {
      name: 'Search for a place...',
    });
    await expect(searchComponent).toBeVisible();
  });
});
