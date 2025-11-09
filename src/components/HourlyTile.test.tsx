import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HourlyTile from './HourlyTile';
import * as weatherStore from '@/stores/weatherStore';
import { ApiStates } from '@/types';

describe('HourlyTile', () => {
  it('hides content when apiState is loadingWeather', () => {
    vi.spyOn(weatherStore, 'useWeatherStore').mockReturnValue({
      apiState: ApiStates.loadingWeather,
    });

    render(<HourlyTile weatherCode={2} time="12:00 PM" temperature={25.4} />);

    const content = screen.getByTestId('hourly-tile-12:00 PM').firstChild;
    expect(content).toHaveClass('invisible');
  });

  it('renders the time, weather icon, and rounded temperature', () => {
    vi.spyOn(weatherStore, 'useWeatherStore').mockReturnValue({
      apiState: ApiStates.success,
    });

    render(<HourlyTile weatherCode={1} time="3:00 PM" temperature={18.7} />);
    const tile = screen.getByTestId('hourly-tile-3:00 PM');

    expect(tile).toHaveTextContent('3:00 PM');
    expect(within(tile).getByTestId('weather-icon')).toBeInTheDocument();
    expect(tile).toHaveTextContent('19°'); // Rounded temperature
  });
});
