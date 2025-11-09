import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Search from './Search';
import * as weatherStore from '@/stores/weatherStore';
import cityService from '@/services/city';
import weatherService from '@/services/weather';
import { ApiStates } from '@/types';
import { mockUseWeatherStore } from '../../testSetup';

describe('Search', () => {
  const mockCities = [
    {
      id: 1,
      name: 'London',
      admin1: 'England',
      country: 'UK',
      latitude: 51.5074,
      longitude: -0.1278,
      timezone: 'Europe/London',
    },
    {
      id: 2,
      name: 'London',
      admin1: 'Ontario',
      country: 'Canada',
      latitude: 42.9837,
      longitude: -81.2497,
      timezone: 'America/Toronto',
    },
  ];
  it('renders the search input and button', () => {
    render(<Search />);

    const input = screen.getByPlaceholderText(/search for a place/i);
    const button = screen.getByRole('button', { name: /search/i });

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('updates the query when the user types in the input', async () => {
    render(<Search />);

    const input = screen.getByPlaceholderText(/search for a place/i);
    await userEvent.type(input, 'London');

    expect(input).toHaveValue('London');
  });

  it('does not search for cities when the query is less than 2 letters', async () => {
    const getCitiesSpy = vi.spyOn(cityService, 'getCities');
    const setCities = vi.fn();
    const setApiState = vi.fn();
    mockUseWeatherStore({
      setCities,
      setApiState,
    });

    render(<Search />);

    const input = screen.getByPlaceholderText(/search for a place/i);
    const button = screen.getByRole('button', { name: /search/i });

    // Type a single letter and click the search button
    await userEvent.type(input, 'L');
    await userEvent.click(button);

    // Ensure no API calls or state updates are made
    expect(getCitiesSpy).not.toHaveBeenCalled();
    expect(setCities).not.toHaveBeenCalled();
    expect(setApiState).not.toHaveBeenCalled();
  });

  it('sets a loading state while searching and displays loading indicators', async () => {
    const setApiState = vi.fn();
    mockUseWeatherStore({
      apiState: ApiStates.loadingCities,
      setApiState,
    });
    render(<Search />);

    const input = screen.getByPlaceholderText(/search for a place/i);
    const button = screen.getByRole('button', { name: /search/i });

    await userEvent.type(input, 'London');
    await userEvent.click(button);

    expect(setApiState).toHaveBeenCalledWith(ApiStates.loadingCities);
    expect(screen.getByText(/search in progress/i)).toBeInTheDocument();
    expect(screen.getByAltText(/loading icon/i)).toBeInTheDocument();
  });

  it('hides the results when no matching cities are found', async () => {
    vi.spyOn(cityService, 'getCities').mockResolvedValue([]);

    const setCities = vi.fn();
    const setCity = vi.fn();
    const setApiState = vi.fn();
    mockUseWeatherStore({
      setCities,
      setCity,
      setApiState,
    });

    render(<Search />);

    const input = screen.getByPlaceholderText(/search for a place/i);
    const button = screen.getByRole('button', { name: /search/i });

    await userEvent.type(input, 'UnknownPlace');
    await userEvent.click(button);

    await waitFor(() => {
      expect(cityService.getCities).toHaveBeenCalledWith('UnknownPlace');
      expect(setCities).toHaveBeenCalledWith([]);
      expect(setApiState).toHaveBeenCalledWith(ApiStates.success);
    });

    // Ensure the listbox is not displayed
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('calls the cityService and displays results', async () => {
    vi.spyOn(cityService, 'getCities').mockResolvedValue(mockCities);

    const setCities = vi.fn();
    const setApiState = vi.fn();
    mockUseWeatherStore({
      setCities,
      setApiState,
      cities: mockCities,
    });

    render(<Search />);

    const input = screen.getByPlaceholderText(/search for a place/i);
    const button = screen.getByRole('button', { name: /search/i });

    await userEvent.type(input, 'London');
    await userEvent.click(button);

    await waitFor(() => {
      expect(cityService.getCities).toHaveBeenCalledWith('London');
      expect(setCities).toHaveBeenCalledWith(mockCities);
      expect(setApiState).toHaveBeenCalledWith(ApiStates.success);
    });

    // Check if results are displayed inside a div with role="listbox"
    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();
    mockCities.forEach(city => {
      expect(listbox).toHaveTextContent(
        new RegExp(`${city.name}, ${city.admin1} ${city.country}`, 'i'),
      );
    });
  });

  it('handles city selection and fetches weather data', async () => {
    const mockWeatherData = {
      current: {
        time: new Date(),
        temperature_2m: 15,
        weather_code: 1,
        relative_humidity_2m: 80,
        precipitation: 0,
        wind_speed_10m: 10,
        apparent_temperature: 14,
      },
      hourly: {
        time: [new Date()],
        temperature_2m: [15],
        weather_code: [1],
      },
      daily: {
        time: [new Date()],
        weather_code: [1],
        temperature_2m_max: [20],
        temperature_2m_min: [10],
      },
    };

    vi.spyOn(weatherService, 'getWeather').mockResolvedValue(mockWeatherData);
    vi.spyOn(cityService, 'getCities').mockResolvedValue(mockCities);

    const setCity = vi.fn();
    const setWeatherData = vi.fn();
    const setApiState = vi.fn();
    vi.spyOn(weatherStore, 'useWeatherStore').mockReturnValue({
      cities: mockCities,
      weatherData: mockWeatherData,
      setCity,
      setCities: vi.fn(),
      setWeatherData,
      setApiState,
    });

    render(<Search />);

    const input = screen.getByPlaceholderText(/search for a place/i);
    const button = screen.getByRole('button', { name: /search/i });

    await userEvent.type(input, 'London');
    await userEvent.click(button);

    const cityButton = screen.getByRole('button', {
      name: new RegExp(
        `${mockCities[0].name}, ${mockCities[0].admin1} ${mockCities[0].country}`,
        'i',
      ),
    });
    expect(cityButton).toBeInTheDocument();
    await userEvent.click(cityButton);

    await waitFor(() => {
      expect(setCity).toHaveBeenCalledWith(mockCities[0]);
      expect(setApiState).toHaveBeenCalledWith(ApiStates.loadingWeather);
      expect(weatherService.getWeather).toHaveBeenCalledWith(mockCities[0]);
      expect(setWeatherData).toHaveBeenCalledWith(mockWeatherData);
      expect(setApiState).toHaveBeenCalledWith(ApiStates.success);
    });
  });

  it('handles city selection and displays an error when weatherService fails', async () => {
    const mockError = new Error('Weather fetch failed');
    vi.spyOn(weatherService, 'getWeather').mockRejectedValue(mockError);
    vi.spyOn(cityService, 'getCities').mockResolvedValue(mockCities);

    const setCity = vi.fn();
    const setWeatherData = vi.fn();
    const setApiState = vi.fn();
    vi.spyOn(weatherStore, 'useWeatherStore').mockReturnValue({
      cities: mockCities,
      setCity,
      setCities: vi.fn(),
      setWeatherData,
      setApiState,
    });

    render(<Search />);

    const input = screen.getByPlaceholderText(/search for a place/i);
    const button = screen.getByRole('button', { name: /search/i });

    await userEvent.type(input, 'London');
    await userEvent.click(button);

    const cityButton = screen.getByRole('button', {
      name: new RegExp(
        `${mockCities[0].name}, ${mockCities[0].admin1} ${mockCities[0].country}`,
        'i',
      ),
    });
    expect(cityButton).toBeInTheDocument();
    await userEvent.click(cityButton);

    // Wait for the weatherService to fail
    await waitFor(() => {
      expect(setCity).toHaveBeenCalledWith(mockCities[0]);
      expect(setApiState).toHaveBeenCalledWith(ApiStates.loadingWeather);
      expect(weatherService.getWeather).toHaveBeenCalledWith(mockCities[0]);
      expect(setApiState).toHaveBeenCalledWith(ApiStates.error); // Ensure error state is set
    });
  });

  it('displays an error state when the search fails', async () => {
    vi.spyOn(cityService, 'getCities').mockRejectedValue(
      new Error('Search failed'),
    );

    const setApiState = vi.fn();
    mockUseWeatherStore({
      setApiState,
    });

    render(<Search />);

    const input = screen.getByPlaceholderText(/search for a place/i);
    const button = screen.getByRole('button', { name: /search/i });

    await userEvent.type(input, 'London');
    await userEvent.click(button);

    await waitFor(() => {
      expect(cityService.getCities).toHaveBeenCalledWith('London');
      expect(setApiState).toHaveBeenCalledWith(ApiStates.error);
    });
  });

  it('searches for cities after debounce when the user types', async () => {
    const getCitiesSpy = vi.spyOn(cityService, 'getCities');
    render(<Search />);

    const input = screen.getByPlaceholderText(/search for a place/i);
    await userEvent.type(input, 'London');

    // Wait for debounce (500ms) plus some buffer
    await waitFor(
      () => {
        expect(getCitiesSpy).toHaveBeenCalledWith('London');
      },
      { timeout: 700 },
    );
  });
});
