import { test, expect } from '@playwright/test';

test.describe('Current Weather Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByPlaceholder('Search for a place...');
    await searchInput.fill('London');
    const searchButton = page.getByRole('button', { name: /search/i });
    await searchButton.click();

    const cityButton = page.getByRole('button', {
      name: /london, england united kingdom/i,
    });
    await cityButton.click();
  });

  test('Displays loading state correctly', async ({ page }) => {
    // Verify that the current weather data is displayed correctly
    const currentWeather = page.getByTestId('current-weather');
    await expect(currentWeather).toBeVisible();

    // Verify that the loading spinner is visible
    const loadingSpinner = currentWeather.getByLabel('Loading spinner');
    await expect(loadingSpinner).toBeVisible();

    // Verify that the loading text is displayed
    const loadingText = currentWeather.getByText('Loading...');
    await expect(loadingText).toBeVisible();

    //Verify all conditon tiles have placeholders
    const feelsLikePlaceholder = currentWeather
      .getByTestId('condition-tile-Feels like')
      .getByText('-');
    await expect(feelsLikePlaceholder).toBeVisible();

    const humidityPlaceholder = currentWeather
      .getByTestId('condition-tile-Humidity')
      .getByText('-');
    await expect(humidityPlaceholder).toBeVisible();

    const windPlaceholder = currentWeather
      .getByTestId('condition-tile-Wind')
      .getByText('-');
    await expect(windPlaceholder).toBeVisible();

    const precipitationPlaceholder = currentWeather
      .getByTestId('condition-tile-Precipitation')
      .getByText('-');
    await expect(precipitationPlaceholder).toBeVisible();
  });

  test('Successful data retrieval and display', async ({ page }) => {
    // Verify that the current weather data is displayed correctly
    const currentWeather = page.getByTestId('current-weather');
    await expect(currentWeather).toBeVisible();

    // Verify the city name and country
    const cityName = currentWeather.locator('span', {
      hasText: /london, united kingdom/i,
    });
    await expect(cityName).toBeVisible();

    // Verify the current temperature and weather icon
    const temperature = currentWeather.getByText(/-?\d+ °C/); // Matches any number (including negative) followed by "°C"
    await expect(temperature).toBeVisible();

    const weatherIcon = currentWeather.getByTestId('weather-icon');
    await expect(weatherIcon).toBeVisible();

    // Verify additional weather details
    const feelsLike = currentWeather
      .getByTestId('condition-tile-Feels like')
      .getByText(/-?\d+°/);
    await expect(feelsLike).toBeVisible();

    const humidity = currentWeather
      .getByTestId('condition-tile-Humidity')
      .getByText(/\d+ %/i);
    await expect(humidity).toBeVisible();

    const wind = currentWeather
      .getByTestId('condition-tile-Wind')
      .getByText(/\d+ km\/h/i);
    await expect(wind).toBeVisible();

    const precipitation = currentWeather
      .getByTestId('condition-tile-Precipitation')
      .getByText(/\d+ mm/i);
    await expect(precipitation).toBeVisible();
  });
});
