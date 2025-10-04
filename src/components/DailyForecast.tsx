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
    <div>
      Daily forecast
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
  );
};

export default DailyForecast;
