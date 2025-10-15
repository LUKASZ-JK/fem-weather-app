import { create } from 'zustand';
import type { City, WeatherData, ApiState } from '../types';
import { ApiStates } from '../types';

interface WeatherStore {
  city?: City;
  cities?: City[];
  weatherData?: WeatherData;
  apiState: ApiState;

  setCity: (city: City | undefined) => void;
  setCities: (cities: City[]) => void;
  setWeatherData: (data: WeatherData) => void;
  setApiState: (state: ApiState) => void;

  reset: () => void;
}

export const useWeatherStore = create<WeatherStore>(set => ({
  city: undefined,
  cities: [],
  weatherData: undefined,
  apiState: ApiStates.idle,

  setCity: city => set({ city }),
  setCities: cities => set({ cities }),
  setWeatherData: data => set({ weatherData: data }),
  setApiState: apiState => set({ apiState }),

  reset: () =>
    set({
      city: undefined,
      weatherData: undefined,
      apiState: ApiStates.idle,
    }),
}));
