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

export interface ISocialUser {
  email?: string;
  name?: string;
  social_provider: string;
  social_id: string;
}

// Google Profile interface
export interface IGoogleProfile {
  id: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
  };
  emails: Array<{
    value: string;
    verified: boolean;
  }>;
  photos: Array<{
    value: string;
  }>;
}

// User data interface
export interface IUserData {
  id: string;
  email: string;
  name: string;
  social_provider: string;
  social_id: string;
}
