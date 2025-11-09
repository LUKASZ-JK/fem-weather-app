import { Page, Locator, test, expect } from '@playwright/test';

async function reopenUnitsSelectorDropdown(
  page: Page,
  unitsSelectorButton: Locator,
) {
  // Wait for the dropdown menu to disappear
  await page.waitForSelector('[role="menu"]', { state: 'hidden' });

  // Ensure the UnitsSelector button is clickable
  await expect(unitsSelectorButton).toBeEnabled();

  // Reopen the dropdown
  await unitsSelectorButton.click();
}

test.describe('Units Selector Component', () => {
  test('Switching unit preset updates values correctly', async ({ page }) => {
    // Navigate to the app's base URL
    await page.goto('/');

    // Simulate selecting a city to display the CurrentWeather component
    const searchInput = page.getByPlaceholder('Search for a place...');
    await searchInput.fill('London');
    const searchButton = page.getByRole('button', { name: /search/i });
    await searchButton.click();
    const cityButton = page.getByRole('button', {
      name: /london, england united kingdom/i,
    });
    await cityButton.click();

    // Verify that the CurrentWeather component is visible
    const currentWeather = page.getByTestId('current-weather');
    await expect(currentWeather).toBeVisible();

    // Verify that the UnitsSelector component is visible
    const unitsSelector = page.getByTestId('units-selector');
    await expect(unitsSelector).toBeVisible();

    // Open the UnitsSelector dropdown
    const unitsSelectorButton = unitsSelector.getByTestId(
      'units-selector-button',
    );
    await unitsSelectorButton.click();

    // Ensure the dropdown menu is visible
    const dropdownMenu = page.getByRole('menu');
    await expect(dropdownMenu).toBeVisible();

    // Switch to Imperial preset
    const switchToImperial = page.getByRole('menuitem', {
      name: 'Switch to Imperial',
    });
    await switchToImperial.click();

    // Verify that the CurrentWeather component updates to Imperial units
    const temperatureImperial = currentWeather.getByText(/-?\d+ °F/); // Matches temperature in Fahrenheit
    await expect(temperatureImperial).toBeVisible();

    const windImperial = currentWeather.getByText(/\d+ mph/i); // Matches wind speed in mph
    await expect(windImperial).toBeVisible();

    const precipitationImperial = currentWeather.getByText(/\d+ in/i); // Matches precipitation in inches
    await expect(precipitationImperial).toBeVisible();

    // Reopen the UnitsSelector dropdown
    await reopenUnitsSelectorDropdown(page, unitsSelectorButton);

    // Switch back to Metric preset
    const switchToMetric = page.getByRole('menuitem', {
      name: 'Switch to Metric',
    });
    await switchToMetric.click();

    // Verify that the CurrentWeather component updates to Metric units
    const temperatureMetric = currentWeather.getByText(/-?\d+ °C/); // Matches temperature in Celsius
    await expect(temperatureMetric).toBeVisible();

    const windMetric = currentWeather.getByText(/\d+ km\/h/i); // Matches wind speed in km/h
    await expect(windMetric).toBeVisible();

    const precipitationMetric = currentWeather.getByText(/\d+ mm/i); // Matches precipitation in millimeters
    await expect(precipitationMetric).toBeVisible();
  });

  test('Selecting singular options updates values correctly', async ({
    page,
  }) => {
    // Navigate to the app's base URL
    await page.goto('/');

    // Simulate selecting a city to display the CurrentWeather component
    const searchInput = page.getByPlaceholder('Search for a place...');
    await searchInput.fill('London');
    const searchButton = page.getByRole('button', { name: /search/i });
    await searchButton.click();
    const cityButton = page.getByRole('button', {
      name: /london, england united kingdom/i,
    });
    await cityButton.click();

    // Verify that the CurrentWeather component is visible
    const currentWeather = page.getByTestId('current-weather');
    await expect(currentWeather).toBeVisible();

    // Open the UnitsSelector dropdown
    const unitsSelectorButton = page.getByTestId('units-selector-button');
    await unitsSelectorButton.click();

    // Select Fahrenheit for temperature
    const fahrenheitOption = page.getByText('Fahrenheit °F');
    await fahrenheitOption.click();
    const temperatureFahrenheit = currentWeather.getByText(/-?\d+ °F/);
    await expect(temperatureFahrenheit).toBeVisible();

    // Reopen the UnitsSelector dropdown
    await reopenUnitsSelectorDropdown(page, unitsSelectorButton);

    // Select mph for wind speed
    const mphOption = page.getByText('mph');
    await mphOption.click();
    const windMph = currentWeather.getByText(/\d+ mph/i);
    await expect(windMph).toBeVisible();

    // Reopen the UnitsSelector dropdown
    await reopenUnitsSelectorDropdown(page, unitsSelectorButton);

    // Select Inches for precipitation
    const inchesOption = page.getByText('Inches (in)');
    await inchesOption.click();
    const precipitationInches = currentWeather.getByText(/\d+ in/i);
    await expect(precipitationInches).toBeVisible();

    // Reopen the UnitsSelector dropdown
    await reopenUnitsSelectorDropdown(page, unitsSelectorButton);

    // Select Celsius for temperature
    const celsiusOption = page.getByText('Celsius °C');
    await celsiusOption.click();
    const temperatureCelsius = currentWeather.getByText(/-?\d+ °C/);
    await expect(temperatureCelsius).toBeVisible();

    // Reopen the UnitsSelector dropdown
    await reopenUnitsSelectorDropdown(page, unitsSelectorButton);

    // Select km/h for wind speed
    const kmhOption = page.getByText('km/h');
    await kmhOption.click();
    const windKmh = currentWeather.getByText(/\d+ km\/h/i);
    await expect(windKmh).toBeVisible();

    // Reopen the UnitsSelector dropdown
    await reopenUnitsSelectorDropdown(page, unitsSelectorButton);

    // Select Millimeters for precipitation
    const mmOption = page.getByText('Milimeters (mm)');
    await mmOption.click();
    const precipitationMm = currentWeather.getByText(/\d+ mm/i);
    await expect(precipitationMm).toBeVisible();
  });
});
