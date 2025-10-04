import { type Day } from '@/types';
import DaySelector from './DaySelector';
import { useEffect, useState } from 'react';
import { useWeatherStore } from '@/weatherStore';
import HourlyTile from './HourlyTile';
import { convertTemperature } from '@/utils';
import { useUnitsStore } from '@/unitsStore';

const HourlyForecast = () => {
  const { city, weatherData } = useWeatherStore();
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
  if (!hourly) return null;

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
        }) === day && entry.time >= new Date(),
    );

  return (
    <div>
      Hourly forecast
      <DaySelector day={day} handleDayChange={handleDayChange} />
      {weatherOnSelectedDay.map(entry => (
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
      ))}
    </div>
  );
};

export default HourlyForecast;
