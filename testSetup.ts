import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { PrecipitationUnits, TemperatureUnits, WindSpeedUnits } from '@/types';
import * as unitsStore from '@/stores/unitsStore';
import type { UnitsStore } from '@/stores/unitsStore';
import * as weatherStore from '@/stores/weatherStore';
import type { WeatherStore } from '@/stores/weatherStore';
import { ApiStates } from '@/types';

const defaultUnits = {
  unitsPreset: 'metric',
  temperature: TemperatureUnits.celsius,
  windSpeed: WindSpeedUnits.kmh,
  precipitation: PrecipitationUnits.mm,
};

export const mockUseUnitsStore = (overrides: Partial<UnitsStore> = {}) => {
  vi.spyOn(unitsStore, 'useUnitsStore').mockReturnValue({
    units: defaultUnits,
    setUnitsPreset: vi.fn(),
    setTemperature: vi.fn(),
    setWindSpeed: vi.fn(),
    setPrecipitation: vi.fn(),
    ...overrides, // Allow overriding specific properties
  });
};

const defaultWeatherStore = {
  city: undefined,
  cities: [],
  weatherData: undefined,
  apiState: ApiStates.idle,
};

export const mockUseWeatherStore = (overrides: Partial<WeatherStore> = {}) => {
  vi.spyOn(weatherStore, 'useWeatherStore').mockReturnValue({
    ...defaultWeatherStore,
    setCity: vi.fn(),
    setCities: vi.fn(),
    setWeatherData: vi.fn(),
    setApiState: vi.fn(),
    reset: vi.fn(),
    ...overrides, // Allow overriding specific properties
  });
};

beforeEach(() => {
  mockUseUnitsStore();
  mockUseWeatherStore();
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.restoreAllMocks();
});
