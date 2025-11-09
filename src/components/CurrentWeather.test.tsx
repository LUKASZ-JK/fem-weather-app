import { render, screen, within } from '@testing-library/react';
import CurrentWeather from './CurrentWeather';
import * as weatherStore from '@/stores/weatherStore';
import { ApiStates } from '@/types';

describe('CurrentWeather', () => {
  it('renders loading state when apiState is loadingWeather', () => {
    vi.spyOn(weatherStore, 'useWeatherStore').mockReturnValue({
      apiState: ApiStates.loadingWeather,
    });

    render(<CurrentWeather />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByTestId('loading-text')).toBeInTheDocument();
  });

  it('renders weather data when apiState is success', () => {
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

    render(<CurrentWeather />);

    const currentWeatherLargeTile = screen.getByTestId(
      'current-weather-large-tile',
    );

    expect(currentWeatherLargeTile).toHaveTextContent('15 °C');
    expect(currentWeatherLargeTile).toHaveTextContent('London, UK');
    expect(currentWeatherLargeTile).toHaveTextContent('Sunday, Oct 1, 2023');

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

    expect(feelsLikeTile).toHaveTextContent('12°');
    expect(humidityTile).toHaveTextContent('80 %');
    expect(windTile).toHaveTextContent('10 km/h');
    expect(precipitationTile).toHaveTextContent('2 mm');
  });
});
