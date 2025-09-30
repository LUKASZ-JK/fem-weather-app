import './App.css';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import cityService from '@/services/city';
import weatherService from '@/services/weather';
import type { City } from './types';

function App() {
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [city, setCity] = useState<City>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = async () => {
    const cities = await cityService.getCities(query);
    setCities(cities);
    console.log(cities);
  };

  const handleCitySelect = (city: City) => {
    setCity(city);
    weatherService.getWeather(city.latitude, city.longitude);
  };

  return (
    <>
      <div>
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
      {city && (
        <div>
          <h2>
            {city.name}, {city.country}
          </h2>
        </div>
      )}
    </>
  );
}

export default App;
