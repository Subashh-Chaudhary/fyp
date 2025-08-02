import { Request } from 'express';
import { UserRole } from '../enums/user-role.enum';

// Interface for user objects from different tables
export interface UserWithPassword {
  id: string;
  email: string;
  name: string;
  password: string;
  user_type: UserRole;
  [key: string]: any;
}

// Interface for authenticated user from Google OAuth
export interface AuthenticatedUser {
  id: string;
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
