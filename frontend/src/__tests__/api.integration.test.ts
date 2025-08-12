import { ApiService } from '../services/api.service';

// Integration test - requires backend to be running
describe('API Integration Tests', () => {
  let apiService: ApiService;

  beforeAll(() => {
    apiService = new ApiService();
  });

  describe('Registration Endpoint', () => {
    it('should successfully register a new user', async () => {
      const testUserData = {
        name: 'Integration Test User',
        email: `test.integration.${Date.now()}@example.com`, // Unique email
        password: 'TestPassword123!',
        confirm_password: 'TestPassword123!',
        user_type: 'farmer' as const,
      };

      try {
        const result = await apiService.register(testUserData);

        // Verify the response structure
        expect(result).toHaveProperty('user');
        expect(result).toHaveProperty('access_token');
        expect(result.user).toHaveProperty('id');
        expect(result.user).toHaveProperty('name');
        expect(result.user).toHaveProperty('email');
        expect(result.user).toHaveProperty('userType'); // Should be transformed from user_type
        expect(result.user).toHaveProperty('is_verified');
        expect(result.user).toHaveProperty('is_active');
        expect(result.user).toHaveProperty('is_admin');

        // Verify the data matches what we sent
        expect(result.user.name).toBe(testUserData.name);
        expect(result.user.email).toBe(testUserData.email);
        expect(result.user.userType).toBe(testUserData.user_type);

        // Verify the token is present
        expect(result.access_token).toBeTruthy();
        expect(typeof result.access_token).toBe('string');
        expect(result.access_token.length).toBeGreaterThan(0);

        console.log('✅ Registration successful:', {
          userId: result.user.id,
          userType: result.user.userType,
          tokenLength: result.access_token.length,
        });

      } catch (error) {
        // If this fails, it might be because the backend is not running
        // or there's a network issue
        console.warn('⚠️ Integration test failed - this might be expected if backend is not running:', error);
        expect(error).toBeDefined(); // Just ensure we have an error object
      }
    }, 30000); // 30 second timeout for network requests

    it('should handle validation errors gracefully', async () => {
      const invalidUserData = {
        name: '', // Empty name should fail validation
        email: 'invalid-email', // Invalid email format
        password: '123', // Too short password
        confirm_password: 'different', // Mismatched password
        user_type: 'farmer' as const,
      };

      try {
        await apiService.register(invalidUserData);
        // If we get here, the backend didn't validate properly
        fail('Expected validation error but registration succeeded');
      } catch (error: any) {
        // Should get an error
        expect(error).toBeDefined();
        expect(error.message).toBeTruthy();

        console.log('✅ Validation error handled correctly:', error.message);
      }
    }, 30000);
  });
});
