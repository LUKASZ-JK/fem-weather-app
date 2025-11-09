import { test, expect } from '@playwright/test';

test.describe('Search Component', () => {
  test('Displays loading state during search', async ({ page }) => {
    // Navigate to the app's base URL
    await page.goto('/');

    // Type a city name into the search input
    const searchInput = page.getByPlaceholder('Search for a place...');
    await searchInput.fill('Paris');

    // Click the "Search" button
    const searchButton = page.getByRole('button', { name: /search/i });
    await searchButton.click();

    // Verify that the loading message and icon are displayed
    const loadingMessage = page.getByText('Search in progress');
    const loadingIcon = page.locator('img[alt="Loading Icon"]');
    await expect(loadingMessage).toBeVisible();
    await expect(loadingIcon).toBeVisible();
  });

  test('Successful search results and weather data display', async ({
    page,
  }) => {
    // Navigate to the app's base URL
    await page.goto('/');

    // Type a valid city name into the search input
    const searchInput = page.getByRole('textbox', {
      name: 'Search for a place...',
    });
    await searchInput.fill('London');

    // Click the "Search" button
    const searchButton = page.getByRole('button', { name: /search/i });
    await searchButton.click();

    // Verify that the search results are displayed
    const searchResults = page.getByRole('listbox');
    await expect(searchResults).toBeVisible();
    await expect(searchResults).toContainText(
      /london, england united kingdom/i,
    );

    // Select a city from the results
    const cityButton = page.getByRole('button', {
      name: /london, england united kingdom/i,
    });
    await cityButton.click();

    // Verify that the weather data is displayed
    const currentWeather = page.getByTestId('current-weather');
    await expect(currentWeather).toBeVisible();
    await expect(currentWeather).toContainText(/london/i);
  });

  test('Displays message when no search results are found', async ({
    page,
  }) => {
    // Navigate to the app's base URL
    await page.goto('/');

    // Type a city name that does not exist
    const searchInput = page.getByPlaceholder('Search for a place...');
    await searchInput.fill('UnknownPlace');

    // Click the "Search" button
    const searchButton = page.getByRole('button', { name: /search/i });
    await searchButton.click();

    // Verify that a "No search result found!" message is displayed
    const noResultsMessage = page.getByText('No search result found!');
    await expect(noResultsMessage).toBeVisible();
  });
});
