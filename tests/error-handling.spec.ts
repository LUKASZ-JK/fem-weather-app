import test, { expect } from '@playwright/test';

test.describe('Error Handling', () => {
  test('Cities service failure displays error message', async ({ page }) => {
    // Intercept the search API request and simulate a failure
    await page.route('**/v1/search?**', route => route.abort());

    // Navigate to the app's base URL
    await page.goto('/');

    // Type a valid city name into the search input
    const searchInput = page.getByPlaceholder('Search for a place...');
    await searchInput.fill('London');

    // Click the "Search" button
    const searchButton = page.getByRole('button', { name: /search/i });
    await searchButton.click();

    // Verify that an error message is displayed
    const errorMessage = page.getByText(/something went wrong/i);
    await expect(errorMessage).toBeVisible();
  });

  test('Weather service failure displays error message', async ({ page }) => {
    // Intercept the weather API request and simulate a failure
    await page.route('**/v1/forecast?**', route => route.abort());

    // Navigate to the app's base URL
    await page.goto('/');

    const searchInput = page.getByRole('textbox', {
      name: 'Search for a place...',
    });
    await searchInput.fill('London');

    const searchButton = page.getByRole('button', { name: /search/i });
    await searchButton.click();

    const cityButton = page.getByRole('button', {
      name: /london, england united kingdom/i,
    });
    await cityButton.click();

    // Verify that an error message is displayed
    const errorMessage = page.getByText(/something went wrong/i);
    await expect(errorMessage).toBeVisible();
  });

  test('Retry button reloads the app after an error', async ({ page }) => {
    // Intercept the search API request and simulate a failure
    await page.route('**/v1/search?**', route => route.abort());

    // Navigate to the app's base URL
    await page.goto('/');

    // Type a valid city name into the search input
    const searchInput = page.getByPlaceholder('Search for a place...');
    await searchInput.fill('London');

    // Click the "Search" button
    const searchButton = page.getByRole('button', { name: /search/i });
    await searchButton.click();

    // Verify that an error message is displayed
    const errorMessage = page.getByText(/something went wrong/i);
    await expect(errorMessage).toBeVisible();

    // Click the "Retry" button
    const retryButton = page.getByRole('button', { name: /retry/i });
    await retryButton.click();

    // Verify that the page is reloaded and the search input is reset
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeEmpty();
  });
});
