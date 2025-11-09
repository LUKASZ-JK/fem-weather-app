import { useWeatherStore } from '@/stores/weatherStore';
import WeatherIcon from './WeatherIcon';
import { ApiStates } from '@/types';
type DailyTileProps = {
  day: string;
  weatherCode: number;
  max: number;
  min: number;
};

const DailyTile = ({ day, weatherCode, max, min }: DailyTileProps) => {
  const { apiState } = useWeatherStore();

  return (
    <div
      data-testid={`daily-tile-${day}`}
      className="bg-neutral-800 rounded-2xl py-4 flex flex-col text-center items-center gap-2">
      <div
        className={`flex flex-col items-center w-full ${
          apiState === ApiStates.loadingWeather ? 'invisible' : ''
        }`}>
        <span>{day}</span>
        <WeatherIcon weatherCode={weatherCode} size={64} />
        <div className="flex w-full justify-between px-4">
          <span className="mx-auto">{max.toFixed(0)}°</span>
          <span className="text-neutral-200 mx-auto">{min.toFixed(0)}°</span>
        </div>
      </div>
    </div>
  );
};

export default DailyTile;
