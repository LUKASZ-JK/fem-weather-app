import { type City, type WeatherData, weatherDataSchema } from '@/types';
import { handleApiError } from '@/utils';
import { fetchWeatherApi } from 'openmeteo';

//open-meteo.com/en/docs?current=temperature_2m,weather_code,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m&hourly=temperature_2m,weather_code
//open-meteo.com/en/docs?current=temperature_2m,weather_code,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m&hourly=temperature_2m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=ms&precipitation_unit=inch#daily_weather_variables

const getWeather = async (city: City): Promise<WeatherData> => {
  try {
    const params: {
      latitude: number;
      longitude: number;
      daily: string[];
      hourly: string[];
      current: string[];
      temperature_unit?: string;
      precipitation_unit?: string;
      wind_speed_unit?: string;
      timezone: string;
    } = {
      'latitude': city.latitude,
      'longitude': city.longitude,
      'daily': ['temperature_2m_max', 'temperature_2m_min', 'weather_code'],
      'hourly': ['temperature_2m', 'weather_code'],
      'current': [
        'temperature_2m',
        'weather_code',
        'relative_humidity_2m',
        'precipitation',
        'wind_speed_10m',
        'apparent_temperature',
      ],
      'timezone': city.timezone,
    };

    // if (units.temperature === TemperatureUnits.fahrenheit) {
    //   params.temperature_unit = TemperatureUnits.fahrenheit;
    // }
    // if (units.precipitation === PrecipitationUnits.inch) {
    //   params.precipitation_unit = PrecipitationUnits.inch;
    // }
    // if (units.windSpeed === WindSpeedUnits.mph) {
    //   params.wind_speed_unit = WindSpeedUnits.mph;
    // }

    const url = 'https://api.open-meteo.com/v1/forecast';
    const responses = await fetchWeatherApi(url, params);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    const current = response.current();
    const hourly = response.hourly();
    const daily = response.daily();

    if (!current || !hourly || !daily)
      throw new Error('Missing fields in Weather API response');

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
      current: {
        time: new Date(Number(current.time()) * 1000),
        temperature_2m: current.variables(0)?.value(),
        weather_code: current.variables(1)?.value(),
        relative_humidity_2m: current.variables(2)?.value(),
        precipitation: current.variables(3)?.value(),
        wind_speed_10m: current.variables(4)?.value(),
        apparent_temperature: current.variables(5)?.value(),
      },
      hourly: {
        time: Array.from(
          {
            length:
              (Number(hourly.timeEnd()) - Number(hourly.time())) /
              hourly.interval(),
          },
          (_, i) =>
            new Date((Number(hourly.time()) + i * hourly.interval()) * 1000),
        ),
        temperature_2m: hourly.variables(0)?.valuesArray(),
        weather_code: hourly.variables(1)?.valuesArray(),
      },
      daily: {
        time: Array.from(
          {
            length:
              (Number(daily.timeEnd()) - Number(daily.time())) /
              daily.interval(),
          },
          (_, i) =>
            new Date((Number(daily.time()) + i * daily.interval()) * 1000),
        ),
        temperature_2m_max: daily.variables(0)?.valuesArray(),
        temperature_2m_min: daily.variables(1)?.valuesArray(),
        weather_code: daily.variables(2)?.valuesArray(),
      },
    };

    const results = weatherDataSchema.parse(weatherData);
    return results;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export default { getWeather };
