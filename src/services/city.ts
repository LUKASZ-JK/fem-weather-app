import axios from 'axios';
import { CitiesSchema, type City } from '../types';
import { handleApiError } from '../utils';
const apiBaseUrl = 'https://geocoding-api.open-meteo.com/v1';

const getCities = async (name: string, count: number = 10): Promise<City[]> => {
  try {
    const params = new URLSearchParams({
      name,
      count: String(count),
      language: 'en',
      format: 'json',
    });

    const { data } = await axios.get<unknown>(`${apiBaseUrl}/search?${params}`);

    if (data !== null && typeof data === 'object' && 'results' in data) {
      const results = CitiesSchema.parse(
        (data as { results: unknown }).results,
      );
      return results;
    }
    throw new Error('Missing result field in Cities API');
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export default { getCities };
