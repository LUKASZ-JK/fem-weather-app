import { useUnitsStore } from '@/unitsStore';
import ConditionTile from './ConditionTile';
import { useWeatherStore } from '@/weatherStore';
import WeatherIcon from './WeatherIcon';
import { convertTemperature, convertWind, convertPrecipation } from '@/utils';

const CurrentWeather = () => {
  const { city, weatherData } = useWeatherStore();
  const { units } = useUnitsStore();
  const currentWeatherData = weatherData?.current;

  if (!currentWeatherData) return null;

  const temperature = convertTemperature(
    weatherData.current.temperature_2m,
    units.temperature,
  );

  const apparentTemperature = convertTemperature(
    weatherData.current.apparent_temperature,
    units.temperature,
  );

  const humidity = currentWeatherData?.relative_humidity_2m;

  const wind = convertWind(weatherData.current.wind_speed_10m, units.windSpeed);

  const precipation = convertPrecipation(
    weatherData.current.precipitation,
    units.precipitation,
  );

  return (
    <div>
      {city?.name},{city?.country}
      {weatherData.current.time.toLocaleTimeString(undefined, {
        timeZone: city?.timezone,
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        hour12: true,
        minute: '2-digit',
      })}
      <WeatherIcon weatherCode={currentWeatherData?.weather_code} />
      {temperature.toFixed(0)}
      {units.temperature}
      <ConditionTile
        title={'Feels like'}
        value={apparentTemperature}
        units={'°'}
      />
      <ConditionTile title={'Humidity'} value={humidity} units={'%'} />
      <ConditionTile title={'Wind'} value={wind} units={units.windSpeed} />
      <ConditionTile
        title={'Precipitation'}
        value={precipation}
        units={units.precipitation}
      />
    </div>
  );
};

export default CurrentWeather;
