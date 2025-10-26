import { useUnitsStore } from '@/stores/unitsStore';
import ConditionTile from './ConditionTile';
import { useWeatherStore } from '@/stores/weatherStore';
import WeatherIcon from './WeatherIcon';
import { convertTemperature, convertWind, convertPrecipation } from '@/utils';
import bgLarge from '../assets/bg-today-large.svg';
import bgSmall from '../assets/bg-today-small.svg';
import { ApiStates } from '@/types';
import { Spinner } from './ui/spinner';

const CurrentWeather = () => {
  const { city, weatherData, apiState } = useWeatherStore();
  const { units } = useUnitsStore();

  let content;
  let temperature = 0;
  let apparentTemperature = 0;
  let humidity = 0;
  let wind = 0;
  let precipation = 0;

  const currentWeatherData = weatherData?.current;

  if (apiState === ApiStates.loadingWeather) {
    content = (
      <div className="absolute inset-0 flex flex-col justify-center items-center gap-4">
        <Spinner data-testid="loading-spinner" className="size-8" />
        <span data-testid="loading-text" className="text-lg text-neutral-200">
          Loading...
        </span>
      </div>
    );
  } else if (currentWeatherData) {
    temperature = convertTemperature(
      currentWeatherData.temperature_2m,
      units.temperature,
    );

    apparentTemperature = convertTemperature(
      currentWeatherData.apparent_temperature,
      units.temperature,
    );

    humidity = currentWeatherData.relative_humidity_2m;

    wind = convertWind(currentWeatherData.wind_speed_10m, units.windSpeed);

    precipation = convertPrecipation(
      currentWeatherData.precipitation,
      units.precipitation,
    );

    content = (
      <div className="absolute inset-0 flex flex-col mobile:flex-row justify-around items-center px-2">
        <div className="text-center mobile:text-left">
          <span className="block font-bold text-3xl mb-2">
            {city?.name}, {city?.country}
          </span>
          <span className="opacity-80">
            {currentWeatherData.time.toLocaleDateString(undefined, {
              timeZone: city?.timezone,
              weekday: 'long',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
        <div className="flex font-semibold italic tracking-tight items-center text-8xl">
          <WeatherIcon
            weatherCode={currentWeatherData.weather_code}
            size={128}
          />
          {`${temperature.toFixed(0)} ${units.temperature}`}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        data-testid="current-weather-large-tile"
        className="relative bg-neutral-800 rounded-[20px]">
        <img
          src={bgSmall}
          className={`block mobile:hidden ${apiState === ApiStates.loadingWeather ? 'invisible' : ''}`}
        />
        <img
          src={bgLarge}
          className={`hidden mobile:block ${apiState === ApiStates.loadingWeather ? 'invisible' : ''}`}
        />
        {content}
      </div>
      <div
        data-testid="current-weather-condition-tiles"
        className="mt-8 grid grid-cols-2 grid-rows-2 gap-4 mobile:grid-cols-4 mobile:grid-rows-1">
        <ConditionTile
          title={'Feels like'}
          value={apparentTemperature}
          units={units.temperature}
        />
        <ConditionTile title={'Humidity'} value={humidity} units={'%'} />
        <ConditionTile title={'Wind'} value={wind} units={units.windSpeed} />
        <ConditionTile
          title={'Precipitation'}
          value={precipation}
          units={units.precipitation}
        />
      </div>
    </div>
  );
};

export default CurrentWeather;
