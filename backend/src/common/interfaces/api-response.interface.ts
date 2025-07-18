import { HttpStatus } from '@nestjs/common';

export interface IApiResponse<T> {
  status: 'success' | 'error';
  statusCode: HttpStatus;
  message: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: unknown;
  };
  timestamp?: string;
  path?: string;
}
