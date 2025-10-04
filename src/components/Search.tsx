import { useState } from 'react';
import { Button } from './ui/button';
import type { City } from '@/types';
import { useWeatherStore } from '@/weatherStore';
import cityService from '@/services/city';
import weatherService from '@/services/weather';

const Search = () => {
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const { setCity, setWeatherData, setApiState } = useWeatherStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = async (query: string) => {
    const cities = await cityService.getCities(query);
    setCities(cities);
  };

  const handleCitySelect = async (city: City) => {
    setCity(city);
    setApiState('loading');
    try {
      const weatherData = await weatherService.getWeather(city);
      setWeatherData(weatherData);
      setApiState('success');
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
              {city.name}, {city.admin1} {city.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
