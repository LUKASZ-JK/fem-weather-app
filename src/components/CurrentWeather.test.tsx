import { render, screen, within } from '@testing-library/react';
import CurrentWeather from './CurrentWeather';
import * as unitsStore from '@/stores/unitsStore';
import * as weatherStore from '@/stores/weatherStore';
import { ApiStates } from '@/types';

describe('CurrentWeather', () => {
  test('renders loading state when apiState is loadingWeather', () => {
    vi.spyOn(weatherStore, 'useWeatherStore').mockReturnValue({
      apiState: ApiStates.loadingWeather,
    });
    vi.spyOn(unitsStore, 'useUnitsStore').mockReturnValue({
      units: { temperature: '°C', windSpeed: 'km/h', precipitation: 'mm' },
    });

    render(<CurrentWeather />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByTestId('loading-text')).toBeInTheDocument();
  });

  test('renders weather data when apiState is success', () => {
    vi.spyOn(weatherStore, 'useWeatherStore').mockReturnValue({
      apiState: ApiStates.success,
      city: { name: 'London', country: 'UK', timezone: 'Europe/London' },
      weatherData: {
        current: {
          temperature_2m: 15,
          apparent_temperature: 12,
          relative_humidity_2m: 80,
          wind_speed_10m: 10,
          precipitation: 2,
          weather_code: 1,
          time: new Date('2023-10-01T12:00:00Z'),
        },
      },
    });
    vi.spyOn(unitsStore, 'useUnitsStore').mockReturnValue({
      units: { temperature: '°C', windSpeed: 'km/h', precipitation: 'mm' },
    });

    render(<CurrentWeather />);

    const currentWeatherLargeTile = screen.getByTestId(
      'current-weather-large-tile',
    );
    expect(
      within(currentWeatherLargeTile).getByText('15 °C'),
    ).toBeInTheDocument();
    expect(
      within(currentWeatherLargeTile).getByText('London, UK'),
    ).toBeInTheDocument();
    expect(
      within(currentWeatherLargeTile).getByText('Sunday, Oct 1, 2023'),
    ).toBeInTheDocument();

    const weatherIcon = within(currentWeatherLargeTile).getByTestId(
      'weather-icon',
    );
    expect(weatherIcon).toBeInTheDocument();
    expect(weatherIcon).toHaveAttribute('alt', 'partly-cloudy');

    const conditionTiles = screen.getByTestId(
      'current-weather-condition-tiles',
    );
    const feelsLikeTile = within(conditionTiles).getByTestId(
      'condition-tile-Feels like',
    );
    const humidityTile = within(conditionTiles).getByTestId(
      'condition-tile-Humidity',
    );
    const windTile = within(conditionTiles).getByTestId('condition-tile-Wind');
    const precipitationTile = within(conditionTiles).getByTestId(
      'condition-tile-Precipitation',
    );

    expect(within(feelsLikeTile).getByText('12 °C')).toBeInTheDocument();
    expect(within(humidityTile).getByText('80 %')).toBeInTheDocument();
    expect(within(windTile).getByText('10 km/h')).toBeInTheDocument();
    expect(within(precipitationTile).getByText('2 mm')).toBeInTheDocument();
  });
});
