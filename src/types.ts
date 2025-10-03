import { z } from 'zod';

const float32Array = z.preprocess(
  val => (val instanceof Float32Array ? Array.from(val) : val),
  z.array(z.number()),
);

export const CitySchema = z.object({
  id: z.number(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  elevation: z.number().optional(),
  timezone: z.string(),
  population: z.number().optional(),
  feature_code: z.string().optional(),
  country: z.string(),
  country_code: z.string().optional(),
  country_id: z.number().optional(),
  admin1: z.string(),
  admin1_id: z.number(),
  admin2: z.string().optional(),
  admin2_id: z.number().optional(),
  admin3: z.string().optional(),
  admin3_id: z.number().optional(),
});

export const CitiesSchema = z.array(CitySchema);

export type City = z.infer<typeof CitySchema>;

export const UnitPresets = { metric: 'metric', imperial: 'imperial' } as const;
export const TemperatureUnits = {
  celsius: '°C',
  fahrenheit: '°F',
} as const;
export const WindSpeedUnits = { kmh: 'km/h', mph: 'mph' } as const;
export const PrecipitationUnits = { mm: 'mm', inch: 'inch' } as const;

export const UnitsSchema = z.object({
  unitsPreset: z.enum([UnitPresets.metric, UnitPresets.imperial]),
  temperature: z.enum([TemperatureUnits.celsius, TemperatureUnits.fahrenheit]),
  windSpeed: z.enum([WindSpeedUnits.kmh, WindSpeedUnits.mph]),
  precipitation: z.enum([PrecipitationUnits.mm, PrecipitationUnits.inch]),
});

export const currentWeatherDataSchema = z.object({
  time: z.date(),
  temperature_2m: z.number(),
  weather_code: z.number(),
  relative_humidity_2m: z.number(),
  precipitation: z.number(),
  wind_speed_10m: z.number(),
  apparent_temperature: z.number(),
});

export const hourlyWeatherDataSchema = z.object({
  time: z.array(z.date()),
  temperature_2m: float32Array,
  weather_code: float32Array,
});

export const dailyWeatherDataSchema = z.object({
  time: z.array(z.date()),
  temperature_2m_max: float32Array,
  temperature_2m_min: float32Array,
  weather_code: float32Array,
});

export const weatherDataSchema = z.object({
  current: currentWeatherDataSchema,
  hourly: hourlyWeatherDataSchema,
  daily: dailyWeatherDataSchema,
});

export type CurrentWeatherData = z.infer<typeof currentWeatherDataSchema>;
export type HourlyWeather = z.infer<typeof hourlyWeatherDataSchema>;
export type DailyWeather = z.infer<typeof dailyWeatherDataSchema>;
export type WeatherData = z.infer<typeof weatherDataSchema>;

export type Units = z.infer<typeof UnitsSchema>;

export const ApiStates = {
  idle: 'idle',
  loading: 'loading',
  success: 'success',
  error: 'error',
} as const;

export const ApiStateSchema = z.enum([
  ApiStates.idle,
  ApiStates.loading,
  ApiStates.success,
  ApiStates.error,
]);

export type ApiState = z.infer<typeof ApiStateSchema>;
