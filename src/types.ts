import { z } from 'zod';

export const CitySchema = z.object({
  id: z.number(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  elevation: z.number().optional(),
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
