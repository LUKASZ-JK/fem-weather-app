import { type City, type WeatherData, weatherDataSchema } from '@/types';
import { handleApiError } from '@/utils';
import { fetchWeatherApi } from 'openmeteo';

//open-meteo.com/en/docs?current=temperature_2m,weather_code,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m&hourly=temperature_2m,weather_code
//open-meteo.com/en/docs?current=temperature_2m,weather_code,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m&hourly=temperature_2m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=ms&precipitation_unit=inch#daily_weather_variables

const getWeather = async (city: City): Promise<WeatherData> => {
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

  // Attributes for timezone and location
  const latitude = response.latitude();
  const longitude = response.longitude();
  const elevation = response.elevation();
  //const utcOffsetSeconds = response.utcOffsetSeconds();

  console.log(
    `\nCoordinates: ${latitude}°N ${longitude}°E`,
    `\nElevation: ${elevation}m asl`,
    // `\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`,
  );

  const current = response.current()!;
  const hourly = response.hourly()!;
  const daily = response.daily()!;

  // Note: The order of weather variables in the URL query and the indices below need to match!
  const weatherData = {
    current: {
      time: new Date(Number(current.time()) * 1000),
      temperature_2m: current.variables(0)!.value(),
      weather_code: current.variables(1)!.value(),
      relative_humidity_2m: current.variables(2)!.value(),
      precipitation: current.variables(3)!.value(),
      wind_speed_10m: current.variables(4)!.value(),
      apparent_temperature: current.variables(5)!.value(),
    },
    hourly: {
      time: [
        ...Array(
          (Number(hourly.timeEnd()) - Number(hourly.time())) /
            hourly.interval(),
        ),
      ].map(
        (_, i) =>
          new Date((Number(hourly.time()) + i * hourly.interval()) * 1000),
      ),
      temperature_2m: hourly.variables(0)!.valuesArray(),
      weather_code: hourly.variables(1)!.valuesArray(),
    },
    daily: {
      time: [
        ...Array(
          (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval(),
        ),
      ].map(
        (_, i) =>
          new Date((Number(daily.time()) + i * daily.interval()) * 1000),
      ),
      temperature_2m_max: daily.variables(0)!.valuesArray(),
      temperature_2m_min: daily.variables(1)!.valuesArray(),
      weather_code: daily.variables(2)!.valuesArray(),
    },
  };

  // 'weatherData' now contains a simple structure with arrays with datetime and weather data
  // console.log(
  //   `\nCurrent time: ${weatherData.current.time}`,
  //   `\nCurrent temperature_2m: ${weatherData.current.temperature_2m}`,
  //   `\nCurrent weather_code: ${weatherData.current.weather_code}`,
  //   `\nCurrent relative_humidity_2m: ${weatherData.current.relative_humidity_2m}`,
  //   `\nCurrent precipitation: ${weatherData.current.precipitation}`,
  //   `\nCurrent wind_speed_10m: ${weatherData.current.wind_speed_10m}`,
  //   `\nCurrent apparent_temperature: ${weatherData.current.apparent_temperature}`,
  // );
  // console.log('\nHourly data', weatherData.hourly);
  // console.log('\nDaily data', weatherData.daily);

  try {
    const results = weatherDataSchema.parse(weatherData);
    return results;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export default { getWeather };
