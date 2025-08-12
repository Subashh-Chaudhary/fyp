import { API_ENDPOINTS } from '../config/api.config';
import {
  AuthApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '../interfaces/api.types';
import { User } from '../interfaces/entities.types';
import { httpClient } from './http.client';

// Transform backend user data to frontend interface
const transformUserData = (backendUser: any): User => {
  return {
    id: backendUser.id,
    name: backendUser.name,
    email: backendUser.email,
    userType: backendUser.user_type, // Map user_type to userType
    phone: backendUser.phone,
    address: backendUser.address,
    avatar_url: backendUser.avatar_url,
    is_verified: backendUser.is_verified,
    is_active: backendUser.is_active,
    is_admin: backendUser.is_admin,
    created_at: backendUser.created_at,
    updated_at: backendUser.updated_at,
    verification_token: backendUser.verification_token,
    verification_expires_at: backendUser.verification_expires_at,
    password_reset_token: backendUser.password_reset_token,
    reset_token_expires_at: backendUser.reset_token_expires_at,
    refresh_token: backendUser.refresh_token,
    refresh_token_expires_at: backendUser.refresh_token_expires_at,
    last_login_at: backendUser.last_login_at,
    auth_provider: backendUser.auth_provider,
    provider_id: backendUser.provider_id,
  };
};

// Validate API response structure
const validateApiResponse = (response: any, endpoint: string): void => {
  if (!response || typeof response !== 'object') {
    throw new Error(`Invalid response from ${endpoint}: Response is not an object`);
  }

  // Check if the response indicates an error (success: false or statusCode >= 400)
  if (response.success === false || response.statusCode >= 400) {
    // Extract the user-friendly error message from the API response
    const errorMessage = response.message || response.error || 'Unknown error occurred';
    throw new Error(errorMessage);
  }

  if (!response.data) {
    throw new Error(`Invalid response from ${endpoint}: Missing data field`);
  }
};

// Main API Service Class
export class ApiService {
  // Test endpoint to verify connectivity
  async testConnection(): Promise<{ message: string; timestamp: string }> {
    return httpClient.get<{ message: string; timestamp: string }>('/health');
  }

  // Authentication Services
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await httpClient.post<AuthApiResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);

    // Validate response structure
    validateApiResponse(response, 'login');

    // Transform the user data to match frontend interface
    return {
      user: transformUserData(response.data.user),
      access_token: response.data.access_token,
    };
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    console.log("API Service userData", userData);
    const response = await httpClient.post<AuthApiResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);

    // Validate response structure
    validateApiResponse(response, 'register');

    // Transform the user data to match frontend interface
    return {
      user: transformUserData(response.data.user),
      access_token: response.data.access_token,
    };
  }

  async logout(): Promise<void> {
    try {
      await httpClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
      httpClient.clearAuthToken();
    } catch (error) {
      // Even if logout fails, clear the token locally
      httpClient.clearAuthToken();
      throw error;
    }
  }
}

// Create and export singleton instance
export const apiService = new ApiService();
