import WeatherIcon from './WeatherIcon';
type DailyTileProps = {
  day: string;
  weatherCode: number;
  max: number;
  min: number;
};

const DailyTile = ({ day, weatherCode, max, min }: DailyTileProps) => {
  return (
    <div className="bg-neutral-800 rounded-2xl py-4 flex flex-col text-center items-center gap-2">
      {day}
      <WeatherIcon weatherCode={weatherCode} size={64} />
      <div className="flex w-full justify-space-between">
        <span className="mx-auto">{max.toFixed(0)}°</span>
        <span className="text-neutral-200 mx-auto">{min.toFixed(0)}°</span>
      </div>
    </div>
  );
};

export default DailyTile;
