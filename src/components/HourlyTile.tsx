import { useWeatherStore } from '@/stores/weatherStore';
import WeatherIcon from './WeatherIcon';
import { ApiStates } from '@/types';

type HourTileProps = {
  weatherCode: number;
  time: string;
  temperature: number;
};

const HourlyTile = ({ weatherCode, time, temperature }: HourTileProps) => {
  const { apiState } = useWeatherStore();

  return (
    <div className="bg-neutral-700 rounded-2xl py-2 mr-4 flex flex-row text-center items-center gap-2">
      <div
        className={`flex flex-row items-center w-full ${
          apiState === ApiStates.loadingWeather ? 'invisible' : ''
        }`}>
        <WeatherIcon weatherCode={weatherCode} size={64} />
        <span className="text-xl">{time}</span>
        <span className="ms-auto me-4 text-base">
          {temperature.toFixed(0)}°
        </span>
      </div>
    </div>
  );
};

export default HourlyTile;
