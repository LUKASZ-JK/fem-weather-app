import axios from 'axios';
import { CitiesSchema, type City } from '../types';
import { handleApiError } from '../utils';
const apiBaseUrl = 'https://geocoding-api.open-meteo.com/v1';

const getCities = async (name: string, count: number = 10): Promise<City[]> => {
  const { data } = await axios.get(
    `${apiBaseUrl}/search?name=${name}&count=${count}&language=en&format=json`,
  );
  try {
    const results = CitiesSchema.parse(data.results);
    return results;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export default { getCities };
