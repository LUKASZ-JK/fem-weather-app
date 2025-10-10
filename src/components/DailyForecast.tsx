import { useWeatherStore } from '@/weatherStore';
import DailyTile from './DailyTile';
import { convertTemperature } from '@/utils';
import { useUnitsStore } from '@/unitsStore';

const DailyForecast = () => {
  const { city, weatherData } = useWeatherStore();
  const { units } = useUnitsStore();

  const daily = weatherData?.daily;

  if (!daily) return null;

  return (
    <div className="w-full">
      <h2 className="text-2xl mt-8 mb-4">Daily forecast</h2>
      <div className="grid grid-cols-3 grid-rows-3 gap-4 mobile:grid-cols-7 mobile:grid-rows-1">
        {daily.time.map((date, i) => (
          <DailyTile
            key={date.toISOString()}
            day={date.toLocaleDateString(undefined, {
              timeZone: city?.timezone,
              weekday: 'short',
            })}
            weatherCode={daily.weather_code[i]}
            max={convertTemperature(
              daily.temperature_2m_max[i],
              units.temperature,
            )}
            min={convertTemperature(
              daily.temperature_2m_min[i],
              units.temperature,
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default DailyForecast;
