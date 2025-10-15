import { ApiStates, type Day } from '@/types';
import DaySelector from './DaySelector';
import { useEffect, useState } from 'react';
import { useWeatherStore } from '@/stores/weatherStore';
import HourlyTile from './HourlyTile';
import { convertTemperature } from '@/utils';
import { useUnitsStore } from '@/stores/unitsStore';

const HourlyForecast = () => {
  const { city, weatherData, apiState } = useWeatherStore();
  const [day, setDay] = useState<Day | undefined>(undefined);
  const { units } = useUnitsStore();

  const handleDayChange = (newDay: Day) => {
    setDay(newDay);
  };

  useEffect(() => {
    const today = weatherData?.current.time.toLocaleDateString('en-US', {
      timeZone: city?.timezone,
      weekday: 'long',
    });
    setDay(today as Day);
  }, [weatherData, city?.timezone]);

  const hourly = weatherData?.hourly;
  let hourlyTiles = [<></>];

  if (apiState === ApiStates.loadingWeather) {
    hourlyTiles = Array.from({ length: 12 }).map((_, i) => (
      <HourlyTile key={i} time="12 PM" weatherCode={0} temperature={0} />
    ));
  } else if (hourly) {
    const weatherOnSelectedDay = hourly.time
      .map((time, i) => ({
        time,
        temperature: hourly.temperature_2m[i],
        weatherCode: hourly.weather_code[i],
      }))
      .filter(
        entry =>
          entry.time.toLocaleDateString('en-US', {
            timeZone: city?.timezone,
            weekday: 'long',
          }) === day && entry.time >= weatherData.current.time,
      );

    hourlyTiles = weatherOnSelectedDay.map(entry => (
      <HourlyTile
        key={entry.time.toISOString()}
        time={entry.time.toLocaleTimeString(undefined, {
          timeZone: city?.timezone,
          hour: 'numeric',
          hour12: true,
        })}
        weatherCode={entry.weatherCode}
        temperature={convertTemperature(entry.temperature, units.temperature)}
      />
    ));
  }

  return (
    <div className="flex flex-col bg-neutral-800 rounded-2xl p-6 h-[650px]">
      <div className="flex flex-shrink-0 justify-between items-center mb-4">
        <h3 className="text-xl mobile:text-2xl">Hourly forecast</h3>
        <DaySelector day={day} handleDayChange={handleDayChange} />
      </div>
      <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-y-auto">
        {hourlyTiles}
      </div>
    </div>
  );
};

export default HourlyForecast;
