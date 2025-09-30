import axios from 'axios';
import { z } from 'zod';

export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`,
  );
};

export const handleApiError = (error: unknown): string => {
  console.log(error);
  if (axios.isAxiosError(error)) {
    return `Axios error: ${error.message}`;
  } else if (error instanceof z.ZodError) {
    return `Validation issue: ${error.issues}`;
  } else {
    return 'Something went wrong';
  }
};
