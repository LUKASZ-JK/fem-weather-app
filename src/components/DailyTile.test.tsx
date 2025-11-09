import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DailyTile from './DailyTile';
import * as weatherStore from '@/stores/weatherStore';
import { ApiStates } from '@/types';

describe('DailyTile', () => {
  it('hides content when apiState is loadingWeather', () => {
    vi.spyOn(weatherStore, 'useWeatherStore').mockReturnValue({
      apiState: ApiStates.loadingWeather,
    });

    render(<DailyTile day="Tuesday" weatherCode={2} max={30} min={20} />);

    const content = screen.getByTestId('daily-tile-Tuesday').firstChild;
    expect(content).toHaveClass('invisible');
  });

  it('renders the day, weather icon, and rounded temperatures', () => {
    vi.spyOn(weatherStore, 'useWeatherStore').mockReturnValue({
      apiState: ApiStates.success,
    });

    render(<DailyTile day="Monday" weatherCode={1} max={25.6} min={15.3} />);
    const tile = screen.getByTestId('daily-tile-Monday');

    expect(tile).toHaveTextContent('Monday');
    expect(within(tile).getByTestId('weather-icon')).toBeInTheDocument();
    expect(tile).toHaveTextContent('26°');
    expect(tile).toHaveTextContent('15°');
  });
});
