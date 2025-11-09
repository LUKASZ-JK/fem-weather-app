import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import HourlyForecast from './HourlyForecast';
import * as weatherStore from '@/stores/weatherStore';
import { ApiStates } from '@/types';

describe('HourlyForecast', () => {
  it('renders loading state with placeholder tiles', () => {
    vi.spyOn(weatherStore, 'useWeatherStore').mockReturnValue({
      apiState: ApiStates.loadingWeather,
      weatherData: null,
      city: null,
    });

    render(<HourlyForecast />);

    const tiles = screen.getAllByTestId(/hourly-tile-/);
    expect(tiles).toHaveLength(12); // 12 placeholder tiles
    tiles.forEach(tile => {
      expect(tile).toHaveTextContent('12 PM');
    });
  });

  it('renders the DaySelector with the correct day', () => {
    vi.spyOn(weatherStore, 'useWeatherStore').mockReturnValue({
      apiState: ApiStates.success,
      city: { name: 'London', timezone: 'Europe/London' },
      weatherData: {
        current: {
          time: new Date('2023-10-01T12:00:00Z'),
        },
        hourly: {
          time: [],
          temperature_2m: [],
          weather_code: [],
        },
      },
    });

    render(<HourlyForecast />);

    const daySelector = screen.getByTestId('day-selector-button');
    expect(daySelector).toHaveTextContent('Sunday');
  });

  it('renders hourly tiles with correct data', () => {
    vi.spyOn(weatherStore, 'useWeatherStore').mockReturnValue({
      apiState: ApiStates.success,
      city: { name: 'London', timezone: 'Europe/London' },
      weatherData: {
        current: {
          time: new Date('2023-10-01T12:30:00Z'),
        },
        hourly: {
          time: [
            new Date('2023-10-01T11:00:00Z'),
            new Date('2023-10-01T12:00:00Z'),
            new Date('2023-10-01T13:00:00Z'),
            new Date('2023-10-01T14:00:00Z'),
          ],
          temperature_2m: [13, 14, 15, 16],
          weather_code: [1, 2, 3, 4],
        },
      },
    });

    render(<HourlyForecast />);

    const tiles = screen.getAllByTestId(/hourly-tile-/);
    expect(tiles).toHaveLength(2);

    // London is in UTC+1 (BST)
    expect(tiles[0]).toHaveTextContent(/2 PM.*15°/); // 2 PM UTC (+ 1 hour), 15°C
    expect(tiles[1]).toHaveTextContent(/3 PM.*16°/); // 3 PM UTC (+ 1 hour), 16°C
  });

  it('renders no tiles when there is no hourly data', () => {
    vi.spyOn(weatherStore, 'useWeatherStore').mockReturnValue({
      apiState: ApiStates.success,
      city: { name: 'London', timezone: 'Europe/London' },
      weatherData: null,
    });

    render(<HourlyForecast />);

    const tiles = screen.queryAllByTestId('hourly-tile');
    expect(tiles).toHaveLength(0);
  });

  it('updates the hourly tiles when a new day is selected', async () => {
    const user = userEvent.setup();
    vi.spyOn(weatherStore, 'useWeatherStore').mockReturnValue({
      apiState: ApiStates.success,
      city: { name: 'London', timezone: 'Europe/London' },
      weatherData: {
        current: {
          time: new Date('2023-10-01T12:00:00Z'),
        },
        hourly: {
          time: [
            new Date('2023-10-01T13:00:00Z'),
            new Date('2023-10-02T14:00:00Z'),
          ],
          temperature_2m: [15, 16],
          weather_code: [1, 2],
        },
      },
    });

    render(<HourlyForecast />);

    const daySelector = screen.getByTestId('day-selector-button');
    expect(daySelector).toHaveTextContent('Sunday');

    // Simulate selecting a new day
    await user.click(daySelector);
    const mondayOption = screen.getByText('Monday');
    await user.click(mondayOption);

    const tiles = screen.getAllByTestId(/hourly-tile-/);
    expect(tiles).toHaveLength(1);
    expect(tiles[0]).toHaveTextContent(/3 PM/); // 3 PM UTC (+ 1 hour)
  });
});
