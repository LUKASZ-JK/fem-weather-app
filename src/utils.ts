import axios from 'axios';
import { z } from 'zod';
import {
  PrecipitationUnits,
  TemperatureUnits,
  WindSpeedUnits,
  type Units,
} from './types';

export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`,
  );
};

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return `Axios error: ${error.message}`;
  } else if (error instanceof z.ZodError) {
    return `Validation issue: ${JSON.stringify(error.issues, null, 2)}`;
  } else {
    let errorMessage = 'Something went wrong: ';
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    return errorMessage;
  }
};

export const convertTemperature = (
  value: number,
  unit: Units['temperature'],
): number => {
  if (unit === TemperatureUnits.fahrenheit) {
    return (value * 9) / 5 + 32;
  }
  return value;
};

export const convertPrecipation = (
  value: number,
  unit: Units['precipitation'],
): number => {
  if (unit === PrecipitationUnits.inch) {
    return value / 25.4;
  }
  return value;
};

export const convertWind = (
  value: number,
  unit: Units['windSpeed'],
): number => {
  if (unit === WindSpeedUnits.mph) {
    return value / 1.609344;
  }
  return value; // already km/h
};
