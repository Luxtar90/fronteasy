// src/utils/axiosUtils.ts
import { AxiosError } from 'axios';

export function isAxiosError(error: any): error is AxiosError {
  return (error as AxiosError).isAxiosError !== undefined;
}

export interface ErrorResponse {
  message: string;
}
