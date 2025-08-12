import { ApiService } from '../services/api.service';
import { httpClient } from '../services/http.client';

// Mock the http client
jest.mock('../services/http.client');
const mockHttpClient = httpClient as jest.Mocked<typeof httpClient>;

describe('ApiService', () => {
  let apiService: ApiService;

  beforeEach(() => {
    apiService = new ApiService();
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should transform backend response correctly', async () => {
      // Mock the backend response structure
      const mockBackendResponse = {
        success: true,
        statusCode: 201,
        message: 'User registered successfully',
        data: {
          user: {
            id: '21ba8bbb-cf28-48bf-91a8-4d87b853d854',
            name: 'Isha Tharu',
            email: 'isha@gmail.com',
            user_type: 'farmer',
            is_verified: false,
            is_active: true,
            is_admin: false,
            created_at: '2025-08-12T16:55:02.200Z',
            updated_at: '2025-08-12T16:55:02.200Z',
            phone: null,
            address: null,
            avatar_url: null,
            verification_token: 'e2fd8c458995576b5566cce37ed37f283e606fb5695fb0ae9db2a0c2c5d30165',
            verification_expires_at: '2025-08-13T16:55:02.198Z',
            password_reset_token: null,
            reset_token_expires_at: null,
            refresh_token: null,
            refresh_token_expires_at: null,
            last_login_at: null,
            auth_provider: null,
            provider_id: null,
          },
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        meta: {
          timestamp: '2025-08-12T16:55:02.210Z',
          path: '/auth/register',
          method: 'POST',
        },
      };

      const mockRegisterData = {
        name: 'Isha Tharu',
        email: 'isha@gmail.com',
        password: 'password123',
        confirm_password: 'password123',
        user_type: 'farmer' as const,
      };

      // Mock the HTTP client response - this should return the full response structure
      mockHttpClient.post.mockResolvedValue(mockBackendResponse);

      // Call the register method
      const result = await apiService.register(mockRegisterData);

      // Verify the transformation
      expect(result).toEqual({
        user: {
          id: '21ba8bbb-cf28-48bf-91a8-4d87b853d854',
          name: 'Isha Tharu',
          email: 'isha@gmail.com',
          userType: 'farmer', // Should be transformed from user_type
          is_verified: false,
          is_active: true,
          is_admin: false,
          created_at: '2025-08-12T16:55:02.200Z',
          updated_at: '2025-08-12T16:55:02.200Z',
          phone: null,
          address: null,
          avatar_url: null,
          verification_token: 'e2fd8c458995576b5566cce37ed37f283e606fb5695fb0ae9db2a0c2c5d30165',
          verification_expires_at: '2025-08-13T16:55:02.198Z',
          password_reset_token: null,
          reset_token_expires_at: null,
          refresh_token: null,
          refresh_token_expires_at: null,
          last_login_at: null,
          auth_provider: null,
          provider_id: null,
        },
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      });

      // Verify the HTTP client was called correctly
      expect(mockHttpClient.post).toHaveBeenCalledWith('/auth/register', mockRegisterData);
    });

    it('should throw error for unsuccessful response', async () => {
      const mockErrorResponse = {
        success: false,
        statusCode: 400,
        message: 'Validation failed',
        data: null,
        meta: {
          timestamp: '2025-08-12T16:55:02.210Z',
          path: '/auth/register',
          method: 'POST',
        },
      };

      const mockRegisterData = {
        name: 'Isha Tharu',
        email: 'isha@gmail.com',
        password: 'password123',
        confirm_password: 'password123',
        user_type: 'farmer' as const,
      };

      mockHttpClient.post.mockResolvedValue(mockErrorResponse);

      // Should throw an error for unsuccessful response
      await expect(apiService.register(mockRegisterData)).rejects.toThrow(
        'Validation failed'
      );
    });

    it('should throw user-friendly error for user already exists (409)', async () => {
      const mockConflictResponse = {
        success: false,
        statusCode: 409,
        message: 'User with this email already exists',
        error: 'Conflict',
        data: null,
        meta: {
          timestamp: '2025-08-12T16:55:02.210Z',
          path: '/auth/register',
          method: 'POST',
        },
      };

      const mockRegisterData = {
        name: 'Isha Tharu',
        email: 'isha@gmail.com',
        password: 'password123',
        confirm_password: 'password123',
        user_type: 'farmer' as const,
      };

      mockHttpClient.post.mockResolvedValue(mockConflictResponse);

      // Should throw an error with the user-friendly message
      await expect(apiService.register(mockRegisterData)).rejects.toThrow(
        'User with this email already exists'
      );
    });
  });
});
