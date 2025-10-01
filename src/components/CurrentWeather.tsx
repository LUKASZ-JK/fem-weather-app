import type { City, CurrentWeatherData } from '@/types';

type CurrentWeatherProps = {
  city: City | undefined;
  currentWeatherData: CurrentWeatherData | undefined;
};

const CurrentWeather = ({ city, currentWeatherData }: CurrentWeatherProps) => {
  return (
    <div>
      {city?.name} {currentWeatherData?.apparent_temperature.toFixed()}°C
    </div>
  );
};

export default CurrentWeather;
