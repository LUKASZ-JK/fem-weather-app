import WeatherIcon from './WeatherIcon';

type HourTileProps = {
  weatherCode: number;
  time: string;
  temperature: number;
};

const HourlyTile = ({ weatherCode, time, temperature }: HourTileProps) => {
  return (
    <div>
      <WeatherIcon weatherCode={weatherCode} />
      {time}
      {temperature.toFixed(0)}°
    </div>
  );
};

export default HourlyTile;
