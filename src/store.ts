import { create } from 'zustand';
import { type Units } from '@/types';

interface UnitsStore {
  units: Units;
  setUnits: (units: Units) => void;
  setUnitsPreset: (unitsPreset: Units['unitsPreset']) => void;
  setTemperature: (temperature: Units['temperature']) => void;
  setWindSpeed: (windSpeed: Units['windSpeed']) => void;
  setPrecipitation: (precipitation: Units['precipitation']) => void;
}

export const useUnitsStore = create<UnitsStore>(set => ({
  units: {
    unitsPreset: 'metric',
    temperature: 'celsius',
    windSpeed: 'km/h',
    precipitation: 'mm',
  },

  setUnitsPreset: unitsPreset => {
    let temperature: Units['temperature'];
    let windSpeed: Units['windSpeed'];
    let precipitation: Units['precipitation'];

    switch (unitsPreset) {
      case 'imperial':
        temperature = 'fahrenheit';
        windSpeed = 'mph';
        precipitation = 'inch';
        break;
      case 'metric':
      default:
        temperature = 'celsius';
        windSpeed = 'km/h';
        precipitation = 'mm';
        break;
    }
    set({
      units: {
        unitsPreset,
        temperature,
        windSpeed,
        precipitation,
      },
    });
  },

  setUnits: units => set({ units }),

  setTemperature: temperature =>
    set(state => ({
      units: { ...state.units, temperature },
    })),

  setWindSpeed: windSpeed =>
    set(state => ({
      units: { ...state.units, windSpeed },
    })),

  setPrecipitation: precipitation =>
    set(state => ({
      units: { ...state.units, precipitation },
    })),
}));
