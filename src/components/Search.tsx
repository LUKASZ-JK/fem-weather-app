import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { ApiStates, type City } from '@/types';
import { useWeatherStore } from '@/stores/weatherStore';
import cityService from '@/services/city';
import weatherService from '@/services/weather';
import { Input } from './ui/input';
import iconSearch from '../assets/icon-search.svg';
import iconLoading from '../assets/icon-loading.svg';

const Search = () => {
  const [query, setQuery] = useState('');
  const [showSearchResult, setShowSearchResult] = useState(false);

  const { cities, apiState, setCity, setCities, setWeatherData, setApiState } =
    useWeatherStore();
  const searchTimeoutRef = useRef<number | null>(null);

  let content = <></>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      void handleSearch(e.target.value);
    }, 1000);
  };

  const handleClick = () => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
    void handleSearch(query);
  };

  const handleSearch = async (query: string) => {
    if (query.length < 2) return;
    setCities([]);
    setShowSearchResult(true);
    setApiState(ApiStates.loadingCities);
    try {
      // await new Promise(resolve => setTimeout(resolve, 500));
      const cities = await cityService.getCities(query);
      if (cities.length === 0) {
        setCity(undefined);
        setShowSearchResult(false);
      }
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
    setApiState(ApiStates.loadingWeather);
    try {
      // await new Promise(resolve => setTimeout(resolve, 5000));
      const weatherData = await weatherService.getWeather(city);
      setWeatherData(weatherData);
      setApiState('success');
    } catch {
      setApiState('error');
    }
  };

  if (apiState === ApiStates.loadingCities) {
    content = (
      <div className="p-2">
        <img
          src={iconLoading}
          alt="Loading Icon"
          className="w-4 h-4 inline mr-4"
        />
        <span>Search in progress</span>
      </div>
    );
  } else if (cities) {
    content = (
      <>
        {cities.map(city => (
          <button
            className="block w-full text-left text-base p-2   
          hover:bg-neutral-700 hover:rounded-[10px]
          focus:rounded-[10px]
          focus-visible:outline-none
          focus-visible:bg-neutral-800 
            focus-visible:ring-2 
          focus-visible:ring-neutral 
            focus-visible:ring-offset-3 
          focus-visible:ring-offset-neutral-800"
            type="submit"
            key={city.id}
            onClick={() => void handleCitySelect(city)}>
            <span>
              {city.name}, {city.admin1} {city.country}
            </span>
          </button>
        ))}
      </>
    );
  }

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
            className="bg-neutral-800 text-neutral-200 text-xl p-6 pl-12 border-0 hover:bg-neutral-700 focus-visible:ring-2 focus-visible:ring-neutral focus-visible:ring-offset-3 focus-visible:ring-offset-neutral-900 "
            type="text"
            placeholder="Search for a place..."
            value={query}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <Button
          className="bg-blue-500 hover:bg-blue-700 text-xl  w-full mobile:w-auto mx-auto mobile:mr-0 mobile:ml-auto p-6 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-3 focus-visible:ring-offset-neutral-900 "
          type="submit"
          onClick={handleClick}>
          Search
        </Button>
      </div>

      {showSearchResult && (
        <div
          className="bg-neutral-800 text-neutral border-0 p-2 rounded-xl w-full tablet:w-85/100 absolute top-16 left-0 z-1 max-h-150 overflow-y-auto"
          role="listbox">
          {content}
        </div>
      )}

      <div />
    </div>
  );
};

export default Search;
