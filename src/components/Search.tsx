import { useState } from 'react';
import { Button } from './ui/button';
import type { City } from '@/types';
import { useWeatherStore } from '@/weatherStore';
import cityService from '@/services/city';
import weatherService from '@/services/weather';
import { useUnitsStore } from '@/unitsStore';

const Search = () => {
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const { setCity, setWeatherData, setApiState } = useWeatherStore();
  const { units } = useUnitsStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = async (query: string) => {
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
      setApiState('error');
      console.error(error);
    }
  };

  <Button onClick={() => handleSearch(query)}>Search</Button>;
  return (
    <div>
      <input type="text" placeholder="Search..." onChange={handleChange} />
      <Button onClick={() => handleSearch(query)}>Search</Button>
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
  );
};

export default Search;
