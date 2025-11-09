import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';
import * as weatherStore from './stores/weatherStore';
import { ApiStates } from './types';
import userEvent from '@testing-library/user-event';

describe('App', () => {
  it('renders the header and main title', () => {
    render(<App />);

    expect(
      screen.getByAltText(/logo representing stylized sun/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/how's the sky looking today\?/i),
    ).toBeInTheDocument();

    expect(screen.getByTestId('units-selector')).toBeInTheDocument();
    expect(screen.getByTestId('search')).toBeInTheDocument();
  });

  it('renders the error state when apiState is error', async () => {
    const user = userEvent.setup();
    vi.spyOn(weatherStore, 'useWeatherStore').mockReturnValue({
      apiState: ApiStates.error,
      city: null,
      cities: [],
    });

    render(<App />);

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(
      screen.getByText(/we couldn't connect to the server/i),
    ).toBeInTheDocument();
    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();

    // Simulate click on retry button
    await user.click(retryButton);
    expect(screen.getByAltText(/spinning circle/i)).toBeInTheDocument();
  });

  it('renders the search component and no results message when apiState is success but no cities are found', () => {
    vi.spyOn(weatherStore, 'useWeatherStore').mockReturnValue({
      apiState: ApiStates.success,
      city: null,
      cities: [],
    });

    render(<App />);

    expect(screen.getByTestId('search')).toBeInTheDocument();
    expect(screen.getByText(/no search result found/i)).toBeInTheDocument();
  });

  it('renders the current weather, daily forecast, and hourly forecast when a city is selected', () => {
    vi.spyOn(weatherStore, 'useWeatherStore').mockReturnValue({
      apiState: ApiStates.success,
      city: { name: 'London', country: 'UK' },
      cities: [],
    });

    render(<App />);

    expect(screen.getByTestId('current-weather')).toBeInTheDocument();
    expect(screen.getByTestId('daily-forecast')).toBeInTheDocument();
    expect(screen.getByTestId('hourly-forecast')).toBeInTheDocument();
  });
});
