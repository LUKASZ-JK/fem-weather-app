import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DailyForecast from './DailyForecast';
import * as weatherStore from '@/stores/weatherStore';
import { ApiStates } from '@/types';

describe('DailyForecast', () => {
  it('renders no tiles when there is no daily data', () => {
    vi.spyOn(weatherStore, 'useWeatherStore').mockReturnValue({
      apiState: ApiStates.success,
      city: { name: 'London', timezone: 'Europe/London' },
      weatherData: null, // No daily data
    });

    render(<DailyForecast />);

    const tiles = screen.queryAllByTestId(/daily-tile-/);
    expect(tiles).toHaveLength(0); // No tiles should be rendered
  });

  it('renders loading state with placeholder tiles', () => {
    vi.spyOn(weatherStore, 'useWeatherStore').mockReturnValue({
      apiState: ApiStates.loadingWeather,
    });

    render(<DailyForecast />);

    const tiles = screen.getAllByTestId(/daily-tile-Day/);
    expect(tiles).toHaveLength(7); // 7 placeholder tiles
    tiles.forEach(tile => {
      expect(tile).toHaveTextContent('Day');
      expect(tile).toHaveTextContent('0°'); // Placeholder temperatures
    });
  });

  it('renders daily forecast tiles with correct data', () => {
    vi.spyOn(weatherStore, 'useWeatherStore').mockReturnValue({
      apiState: ApiStates.success,
      city: { name: 'London', timezone: 'Europe/London' },
      weatherData: {
        daily: {
          time: [
            new Date('2023-10-01'),
            new Date('2023-10-02'),
            new Date('2023-10-03'),
          ],
          weather_code: [1, 2, 3],
          temperature_2m_max: [20, 22, 18],
          temperature_2m_min: [10, 12, 8],
        },
      },
    });

    render(<DailyForecast />);

    const tiles = screen.getAllByTestId(/daily-tile-/);
    expect(tiles).toHaveLength(3);

    expect(tiles[0]).toHaveTextContent('Sun'); // Short weekday name
    expect(tiles[0]).toHaveTextContent('20°'); // Max temperature
    expect(tiles[0]).toHaveTextContent('10°'); // Min temperature

    expect(tiles[1]).toHaveTextContent('Mon');
    expect(tiles[1]).toHaveTextContent('22°');
    expect(tiles[1]).toHaveTextContent('12°');

    expect(tiles[2]).toHaveTextContent('Tue');
    expect(tiles[2]).toHaveTextContent('18°');
    expect(tiles[2]).toHaveTextContent('8°');
  });
});
