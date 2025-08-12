import { registerSchema } from '../validation/schemas/auth.schema';

describe('Registration Schema Validation', () => {
  it('should validate a valid farmer registration', async () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123!',
      confirm_password: 'Password123!',
      user_type: 'farmer' as const,
    };

    const result = await registerSchema.validate(validData);
    expect(result).toEqual(validData);
  });

  it('should validate a valid expert registration', async () => {
    const validData = {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'ExpertPass456!',
      confirm_password: 'ExpertPass456!',
      user_type: 'expert' as const,
    };

    const result = await registerSchema.validate(validData);
    expect(result).toEqual(validData);
  });

  it('should reject registration with mismatched passwords', async () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123!',
      confirm_password: 'DifferentPassword123!',
      user_type: 'farmer' as const,
    };

    await expect(registerSchema.validate(invalidData)).rejects.toThrow();
  });

  it('should reject registration with invalid email', async () => {
    const invalidData = {
      name: 'John Doe',
      email: 'invalid-email',
      password: 'Password123!',
      confirm_password: 'Password123!',
      user_type: 'farmer' as const,
    };

    await expect(registerSchema.validate(invalidData)).rejects.toThrow();
  });

  it('should reject registration with weak password', async () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'weak',
      confirm_password: 'weak',
      user_type: 'farmer' as const,
    };

    await expect(registerSchema.validate(invalidData)).rejects.toThrow();
  });

  it('should reject registration with invalid user type', async () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123!',
      confirm_password: 'Password123!',
      user_type: 'admin' as any,
    };

    await expect(registerSchema.validate(invalidData)).rejects.toThrow();
  });
});
