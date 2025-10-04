import iconDrizzle from '../assets/icon-drizzle.webp';
import iconFog from '../assets/icon-fog.webp';
import iconOvercast from '../assets/icon-overcast.webp';
import iconPartlyCloudy from '../assets/icon-partly-cloudy.webp';
import iconRain from '../assets/icon-rain.webp';
import iconSnow from '../assets/icon-snow.webp';
import iconStorm from '../assets/icon-storm.webp';
import iconSunny from '../assets/icon-sunny.webp';
import type { WeatherIconName } from '@/types';

export const WeatherIconMap: Record<WeatherIconName, string> = {
  drizzle: iconDrizzle,
  fog: iconFog,
  overcast: iconOvercast,
  'partly-cloudy': iconPartlyCloudy,
  rain: iconRain,
  snow: iconSnow,
  storm: iconStorm,
  sunny: iconSunny,
} as const;

type WeatherIconProps = {
  weatherCode?: number;
};

const WeatherIcon = ({ weatherCode }: WeatherIconProps) => {
  const getWeatherIcon = (code: number | undefined): WeatherIconName => {
    switch (code) {
      case 0:
        return 'sunny';
      case 1:
      case 2:
        return 'partly-cloudy';
      case 3:
        return 'overcast';
      case 45:
      case 48:
        return 'fog';
      case 51:
      case 53:
      case 55:
      case 56:
      case 57:
        return 'drizzle';
      case 61:
      case 63:
      case 65:
      case 66:
      case 67:
      case 80:
      case 81:
      case 82:
        return 'rain';
      case 71:
      case 73:
      case 75:
      case 77:
      case 85:
      case 86:
        return 'snow';
      case 95:
      case 96:
      case 99:
        return 'storm';
      default:
        return 'sunny';
    }
  };

  const iconName = getWeatherIcon(weatherCode);
  const icon = WeatherIconMap[iconName];

  return <img src={icon} alt={iconName} className="w-4 h-4" />;
};

export default WeatherIcon;
