import { useState, useRef } from 'react';
import { Button } from './ui/button';
import type { City } from '@/types';
import { useWeatherStore } from '@/weatherStore';
import cityService from '@/services/city';
import weatherService from '@/services/weather';
import { Input } from './ui/input';
import iconSearch from '../assets/icon-search.svg';

const Search = () => {
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const { setCity, setWeatherData, setApiState } = useWeatherStore();
  const searchTimeoutRef = useRef<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(e.target.value);
    }, 1000);
  };

  const handleClick = () => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
    handleSearch(query);
  };

  const handleSearch = async (query: string) => {
    setCities([]);
    setShowSearchResult(true);
    setApiState('loading');
    try {
      const cities = await cityService.getCities(query);
      setQuery('');
      setCities(cities);
      setApiState('success');
    } catch {
      setApiState('error');
    }
  };

  const handleCitySelect = async (city: City) => {
    setCity(city);
    setShowSearchResult(false);
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

  return (
    <div className="flex flex-col relative mb-8 justify-center items-center">
      <div className="flex flex-col mobile:flex-row gap-4 mobile:w-xl tablet:w-4xl mx-auto">
        <div className="relative w-full tablet:w-85/100">
          <img
            src={iconSearch}
            alt="Search Icon"
            className="absolute left-3 top-1/2 -translate-y-1/2"
          />
          <Input
            className="bg-neutral-800 text-neutral-200 text-xl p-6 focus:bg-neutral-700 border-0 focus-visible:ring-0 pl-12"
            type="text"
            placeholder="Search for a place..."
            value={query}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <Button
          className="bg-blue-500 hover:bg-blue-700 text-xl  w-full mobile:w-auto mx-auto mobile:mr-0 mobile:ml-auto p-6 "
          onClick={handleClick}>
          Search
        </Button>
      </div>

      {showSearchResult && (
        <div className="bg-neutral-800 text-neutral border-0 p-2 rounded-xl w-full tablet:w-85/100 absolute top-16 left-0 z-1 max-h-150 overflow-y-auto">
          {cities.map(city => (
            <div
              className="text-base hover:bg-neutral-700 hover:rounded-[10px] p-2"
              key={city.id}
              onClick={() => handleCitySelect(city)}>
              <span>
                {city.name}, {city.admin1} {city.country}
              </span>
            </div>
          ))}
        </div>
      )}

      <div />
    </div>
  );
};

export default Search;
