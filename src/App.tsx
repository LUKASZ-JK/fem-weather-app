import './App.css';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import cityService from '@/services/city';
import weatherService from '@/services/weather';
import type { City, WeatherData } from './types';
import { useUnitsStore } from './store';
import UnitsSelector from './components/UnitsSelector';
import CurrentWeather from './components/CurrentWeather';

function App() {
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [city, setCity] = useState<City>();
  const [weatherData, setWeatherData] = useState<WeatherData>();
  const { units } = useUnitsStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = async () => {
    const cities = await cityService.getCities(query);
    setCities(cities);
    console.log(cities);
  };

  const handleCitySelect = async (city: City) => {
    setCity(city);
    try {
      const weatherData = await weatherService.getWeather(city, units);
      setWeatherData(weatherData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div>
        <UnitsSelector />
        <input type="text" placeholder="Search..." onChange={handleChange} />
        <Button onClick={handleSearch}>Search</Button>
        {cities.length > 0 && (
          <ul>
            {cities.map(city => (
              <li key={city.id} onClick={() => handleCitySelect(city)}>
                {city.name}, {city.country}
              </li>
            ))}
          </ul>
        )}
      </div>
      <CurrentWeather city={city} currentWeatherData={weatherData?.current} />
    </>
  );
}

export default App;
