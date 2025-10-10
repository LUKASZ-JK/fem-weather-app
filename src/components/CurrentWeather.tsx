import { useUnitsStore } from '@/unitsStore';
import ConditionTile from './ConditionTile';
import { useWeatherStore } from '@/weatherStore';
import WeatherIcon from './WeatherIcon';
import { convertTemperature, convertWind, convertPrecipation } from '@/utils';
import bgLarge from '../assets/bg-today-large.svg';
import bgSmall from '../assets/bg-today-small.svg';

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

  // className="
  //   // bg-[url('./assets/bg-today-small.svg')]
  //   // tablet:bg-[url('./assets/bg-today-large.svg')] /* md and up */
  //   // w-full
  //   // h-full
  //   // bg-center
  //   // bg-contain
  //   // bg-no-repeat
  //   // overflow-hidden
  //   rounded-3xl
  //   p-8
  // "

  return (
    <div>
      <div className="relative">
        <img src={bgSmall} className="block mobile:hidden" />
        <img src={bgLarge} className="hidden mobile:block " />
        <div className="absolute inset-0 flex flex-col mobile:flex-row justify-around items-center px-2">
          <div className="text-center mobile:text-left">
            <span className="block font-bold text-3xl mb-2">
              {city?.name}, {city?.country}
            </span>
            <span className="opacity-80">
              {weatherData.current.time.toLocaleDateString(undefined, {
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
              weatherCode={currentWeatherData?.weather_code}
              size={128}
            />
            {temperature.toFixed(0)}
            {units.temperature}
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 grid-rows-2 gap-4 mobile:grid-cols-4 mobile:grid-rows-1">
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
    </div>
  );
};

export default CurrentWeather;
