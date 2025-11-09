import { test, expect } from '@playwright/test';

test.describe('Hourly Forecast Component', () => {
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

    // Verify that the HourlyForecast component is visible
    const hourlyForecast = page.getByTestId('hourly-forecast');
    await expect(hourlyForecast).toBeVisible();

    //Verify header
    const header = hourlyForecast.locator('h3');
    await expect(header).toHaveText('Hourly forecast');

    // Verify that the DaySelector is present
    const daySelector = hourlyForecast.getByTestId('day-selector-button');
    await expect(daySelector).toBeVisible();

    // Verify that placeholder tiles are displayed during loading
    const placeholderTiles = hourlyForecast.locator(
      'data-testid=hourly-tile-12 PM',
    ); //Assuming placeholder tiles have this test id
    await expect(placeholderTiles).toHaveCount(12); // 12 placeholder tiles for loading state
  });

  test('Displays hourly tiles with time, weather icon, and temperature', async ({
    page,
  }) => {
    // Navigate to the app's base URL
    await page.goto('/');

    // Step 1: Select a city from the search results
    const searchInput = page.getByPlaceholder('Search for a place...');
    await searchInput.fill('London');
    const searchButton = page.getByRole('button', { name: /search/i });
    await searchButton.click();
    const cityButton = page.getByRole('button', {
      name: /london, england united kingdom/i,
    });
    await cityButton.click();

    // Step 2: Verify that the HourlyForecast component is visible
    const hourlyForecast = page.getByTestId('hourly-forecast');
    await expect(hourlyForecast).toBeVisible();

    //Verify header
    const header = hourlyForecast.locator('h3');
    await expect(header).toHaveText('Hourly forecast');

    // Verify that the DaySelector is present
    const daySelector = hourlyForecast.getByTestId('day-selector-button');
    await expect(daySelector).toBeVisible();

    // Verify that hourly tiles are displayed with time, weather icon, and temperature
    const currentTimeInLondon = new Date().toLocaleString('en-GB', {
      timeZone: 'Europe/London',
    });
    const currentHourInLondon = new Date(currentTimeInLondon).getHours();
    const hoursTillMidnight = 24 - currentHourInLondon - 1; // Calculate remaining hours till midnight and exclude current hour

    const hourlyTiles = hourlyForecast.getByTestId(/hourly-tile-\d+/);
    await expect(hourlyTiles).toHaveCount(hoursTillMidnight); // Ensure tiles are displayed for the remaining hours of the day

    const tileCount = await hourlyTiles.count();
    if (tileCount > 0) {
      const firstTile = hourlyTiles.nth(0);
      await expect(firstTile).toContainText(/AM|PM/); // Verify time format
      const weatherIcon = firstTile.getByTestId('weather-icon');
      await expect(weatherIcon).toBeVisible();
      await expect(firstTile).toContainText(/-?\d+°/); // Verify temperature is displayed
    }
  });

  test('Updates hourly tiles when a different day is selected', async ({
    page,
  }) => {
    // Navigate to the app's base URL
    await page.goto('/');

    // Step 1: Select a city from the search results
    const searchInput = page.getByPlaceholder('Search for a place...');
    await searchInput.fill('London');
    const searchButton = page.getByRole('button', { name: /search/i });
    await searchButton.click();
    const cityButton = page.getByRole('button', {
      name: /london, england united kingdom/i,
    });
    await cityButton.click();

    // Step 2: Verify that the HourlyForecast component is visible
    const hourlyForecast = page.getByTestId('hourly-forecast');
    await expect(hourlyForecast).toBeVisible();

    // Step 3: Change the day using the DaySelector
    const daySelectorButton = page.getByTestId('day-selector-button');
    await daySelectorButton.click();

    const dayDropdown = page.getByTestId('day-selector-dropdown');
    await expect(dayDropdown).toBeVisible();

    const today = new Date().toLocaleString('en-US', { weekday: 'long' });
    const daysOfWeek = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    const todayIndex = daysOfWeek.indexOf(today);
    const nextDay = daysOfWeek[(todayIndex + 1) % 7]; // Calculate the next day
    const nextDayOption = dayDropdown.locator(`text=${nextDay}`); // Select the calculated next day
    await nextDayOption.click();

    // Verify that the hourly tiles update for the selected day
    const hourlyTiles = hourlyForecast.getByTestId(/hourly-tile-\d+/);
    await expect(hourlyTiles).toHaveCount(24); // Ensure tiles are displayed for the new day
    const firstTile = hourlyTiles.nth(0);
    await expect(firstTile).toContainText(/AM|PM/); // Verify time format for the new day
    const weatherIcon = firstTile.getByTestId('weather-icon');
    await expect(weatherIcon).toBeVisible();
    await expect(firstTile).toContainText(/-?\d+°/); // Verify temperature is displayed
  });
});
