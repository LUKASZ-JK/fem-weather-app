import { useWeatherStore } from '@/stores/weatherStore';
import DailyTile from './DailyTile';
import { convertTemperature } from '@/utils';
import { useUnitsStore } from '@/stores/unitsStore';
import { ApiStates } from '@/types';
import type { JSX } from 'react';

const DailyForecast = () => {
  const { city, weatherData, apiState } = useWeatherStore();
  const { units } = useUnitsStore();

  const daily = weatherData?.daily;

  let dailyTiles: JSX.Element[] = [];

  if (apiState === ApiStates.loadingWeather) {
    dailyTiles = Array.from({ length: 7 }).map((_, i) => (
      <DailyTile key={i} day="Day" weatherCode={0} max={0} min={0} />
    ));
  } else if (daily) {
    dailyTiles = daily.time.map((date, i) => (
      <DailyTile
        key={date.toISOString()}
        day={date.toLocaleDateString(undefined, {
          timeZone: city?.timezone,
          weekday: 'short',
        })}
        weatherCode={daily.weather_code[i]}
        max={convertTemperature(daily.temperature_2m_max[i], units.temperature)}
        min={convertTemperature(daily.temperature_2m_min[i], units.temperature)}
      />
    ));
  }

  return (
    <div data-testid="daily-forecast" className="w-full">
      <h2 className="text-2xl mt-8 mb-4">Daily forecast</h2>
      <div className="grid grid-cols-3 grid-rows-3 gap-4 mobile:grid-cols-7 mobile:grid-rows-1">
        {dailyTiles}
      </div>
    </div>
  );
};

export default DailyForecast;
