import WeatherIcon from './WeatherIcon';
type DailyTileProps = {
  day: string;
  weatherCode: number;
  max: number;
  min: number;
};

const DailyTile = ({ day, weatherCode, max, min }: DailyTileProps) => {
  return (
    <div>
      {day}
      <WeatherIcon weatherCode={weatherCode} />
      <span>{max.toFixed(0)}°</span>
      <span>{min.toFixed(0)}°</span>
    </div>
  );
};

export default DailyTile;
