import { fetchWeatherApi } from 'openmeteo';

//https://open-meteo.com/en/docs?current=temperature_2m,weather_code,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m&hourly=temperature_2m,weather_code

const getWeather = async (lat: number, long: number) => {
  const params = {
    'latitude': lat,
    'longitude': long,
    'hourly': ['temperature_2m', 'weather_code'],
    'current': [
      'temperature_2m',
      'weather_code',
      'apparent_temperature',
      'relative_humidity_2m',
      'precipitation',
      'wind_speed_10m',
    ],
  };
  const url = 'https://api.open-meteo.com/v1/forecast';
  const responses = await fetchWeatherApi(url, params);

  // Process first location. Add a for-loop for multiple locations or weather models
  const response = responses[0];

  // Attributes for timezone and location
  const latitude = response.latitude();
  const longitude = response.longitude();
  const elevation = response.elevation();
  const utcOffsetSeconds = response.utcOffsetSeconds();

  console.log(
    `\nCoordinates: ${latitude}°N ${longitude}°E`,
    `\nElevation: ${elevation}m asl`,
    `\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`,
  );

  const current = response.current()!;
  const hourly = response.hourly()!;

  // Note: The order of weather variables in the URL query and the indices below need to match!
  const weatherData = {
    current: {
      time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
      temperature_2m: current.variables(0)!.value(),
      weather_code: current.variables(1)!.value(),
      apparent_temperature: current.variables(2)!.value(),
      relative_humidity_2m: current.variables(3)!.value(),
      precipitation: current.variables(4)!.value(),
      wind_speed_10m: current.variables(5)!.value(),
    },
    hourly: {
      time: [
        ...Array(
          (Number(hourly.timeEnd()) - Number(hourly.time())) /
            hourly.interval(),
        ),
      ].map(
        (_, i) =>
          new Date(
            (Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) *
              1000,
          ),
      ),
      temperature_2m: hourly.variables(0)!.valuesArray(),
      weather_code: hourly.variables(1)!.valuesArray(),
    },
  };

  // 'weatherData' now contains a simple structure with arrays with datetime and weather data
  console.log(
    `\nCurrent time: ${weatherData.current.time}`,
    `\nCurrent temperature_2m: ${weatherData.current.temperature_2m}`,
    `\nCurrent weather_code: ${weatherData.current.weather_code}`,
    `\nCurrent apparent_temperature: ${weatherData.current.apparent_temperature}`,
    `\nCurrent relative_humidity_2m: ${weatherData.current.relative_humidity_2m}`,
    `\nCurrent precipitation: ${weatherData.current.precipitation}`,
    `\nCurrent wind_speed_10m: ${weatherData.current.wind_speed_10m}`,
  );
  console.log('\nHourly data', weatherData.hourly);
};

export default { getWeather };
