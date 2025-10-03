import { useUnitsStore } from '@/unitsStore';
import ConditionTile from './ConditionTile';
import { useWeatherStore } from '@/weatherStore';

const CurrentWeather = () => {
  const { city, weatherData } = useWeatherStore();
  const { units } = useUnitsStore();
  const currentWeatherData = weatherData?.current;

  return (
    <div>
      {city?.name} {currentWeatherData?.temperature_2m.toFixed()}
      {units.temperature}
      <ConditionTile
        title={'Feels like'}
        value={currentWeatherData?.apparent_temperature}
        units={units.temperature}
      />
      <ConditionTile
        title={'Humidity'}
        value={currentWeatherData?.relative_humidity_2m}
        units={'%'}
      />
      <ConditionTile
        title={'Wind'}
        value={currentWeatherData?.wind_speed_10m}
        units={units.windSpeed}
      />
      <ConditionTile
        title={'Precipitation'}
        value={currentWeatherData?.precipitation}
        units={units.precipitation}
      />
    </div>
  );
};

export default CurrentWeather;
