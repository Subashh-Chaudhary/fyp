import { Request } from 'express';

// Interface for user objects from different tables
export interface UserWithPassword {
  id: number;
  email: string;
  name: string;
  password: string;
  [key: string]: any;
}

// Interface for authenticated user from Google OAuth
export interface AuthenticatedUser {
  id: number;
  email: string;
  name: string;
  social_provider: string;
  social_id: string;
  accessToken: string;
  refreshToken: string;
}

// Extended request interface for Google OAuth
export interface GoogleAuthRequest extends Request {
  user: AuthenticatedUser;
}
