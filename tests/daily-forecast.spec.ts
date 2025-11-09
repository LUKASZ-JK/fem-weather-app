import { test, expect } from '@playwright/test';

test.describe('Daily Forecast Component', () => {
  test('Displays loading state with placeholder tiles', async ({ page }) => {
    // Navigate to the app's base URL
    await page.goto('/');

    // Simulate selecting a city to trigger loading state
    const searchInput = page.getByPlaceholder('Search for a place...');
    await searchInput.fill('London');
    const searchButton = page.getByRole('button', { name: /search/i });
    await searchButton.click();
    const cityButton = page.getByRole('button', {
      name: /london, england united kingdom/i,
    });
    await cityButton.click();

    // Verify that the DailyForecast component is visible
    const dailyForecast = page.getByTestId('daily-forecast');
    await expect(dailyForecast).toBeVisible();

    // Verify that placeholder tiles are displayed during loading
    const placeholderTiles = dailyForecast.locator('text=Day');
    await expect(placeholderTiles).toHaveCount(7); // 7 placeholder tiles for 7 days
  });

  test('Displays daily weather data for the selected city and starts with current day', async ({
    page,
  }) => {
    // Navigate to the app's base URL
    await page.goto('/');

    // Simulate selecting a city
    const searchInput = page.getByPlaceholder('Search for a place...');
    await searchInput.fill('London');
    const searchButton = page.getByRole('button', { name: /search/i });
    await searchButton.click();
    const cityButton = page.getByRole('button', {
      name: /london, england united kingdom/i,
    });
    await cityButton.click();

    // Verify that the DailyForecast component is visible
    const dailyForecast = page.getByTestId('daily-forecast');
    await expect(dailyForecast).toBeVisible();

    // Verify that daily tiles are displayed with weather data
    const dailyTiles = dailyForecast.locator('.grid > div'); // Assuming tiles are direct children of the grid
    await expect(dailyTiles).toHaveCount(7); // 7 days of forecast

    // Verify that each tile contains the correct data
    const firstTile = dailyTiles.nth(0);
    const currentDay = new Date().toLocaleDateString('en-US', {
      weekday: 'short',
    });
    await expect(firstTile).toContainText(currentDay); // Verify the first tile starts with the current day
    const weatherIcon = firstTile.getByTestId('weather-icon');
    await expect(weatherIcon).toBeVisible();
    const temperature = firstTile.getByText(/-?\d+°/);
    await expect(temperature).toHaveCount(2);
  });
});
