import { registerSchema } from '../../validation/schemas/auth.schema';

describe('Registration Schema Validation', () => {
  describe('Valid Registration Data', () => {
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

    it('should validate registration with special characters in name', async () => {
      const validData = {
        name: "O'Connor-Smith",
        email: 'test@example.com',
        password: 'Password123!',
        confirm_password: 'Password123!',
        user_type: 'farmer' as const,
      };

      const result = await registerSchema.validate(validData);
      expect(result).toEqual(validData);
    });
  });

  describe('Name Validation', () => {
    it('should reject empty name', async () => {
      const invalidData = {
        name: '',
        email: 'test@example.com',
        password: 'Password123!',
        confirm_password: 'Password123!',
        user_type: 'farmer' as const,
      };

      await expect(registerSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject name with less than 2 characters', async () => {
      const invalidData = {
        name: 'A',
        email: 'test@example.com',
        password: 'Password123!',
        confirm_password: 'Password123!',
        user_type: 'farmer' as const,
      };

      await expect(registerSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject name with more than 50 characters', async () => {
      const invalidData = {
        name: 'A'.repeat(51),
        email: 'test@example.com',
        password: 'Password123!',
        confirm_password: 'Password123!',
        user_type: 'farmer' as const,
      };

      await expect(registerSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject name with invalid characters', async () => {
      const invalidData = {
        name: 'John123',
        email: 'test@example.com',
        password: 'Password123!',
        confirm_password: 'Password123!',
        user_type: 'farmer' as const,
      };

      await expect(registerSchema.validate(invalidData)).rejects.toThrow();
    });
  });

  describe('Email Validation', () => {
    it('should reject empty email', async () => {
      const invalidData = {
        name: 'John Doe',
        email: '',
        password: 'Password123!',
        confirm_password: 'Password123!',
        user_type: 'farmer' as const,
      };

      await expect(registerSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject invalid email format', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'Password123!',
        confirm_password: 'Password123!',
        user_type: 'farmer' as const,
      };

      await expect(registerSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject email without domain', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'test@',
        password: 'Password123!',
        confirm_password: 'Password123!',
        user_type: 'farmer' as const,
      };

      await expect(registerSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should accept valid email formats', async () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
      ];

      for (const email of validEmails) {
        const validData = {
          name: 'John Doe',
          email,
          password: 'Password123!',
          confirm_password: 'Password123!',
          user_type: 'farmer' as const,
        };

        const result = await registerSchema.validate(validData);
        expect(result.email).toBe(email.toLowerCase());
      }
    });
  });

  describe('Password Validation', () => {
    it('should reject empty password', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'test@example.com',
        password: '',
        confirm_password: '',
        user_type: 'farmer' as const,
      };

      await expect(registerSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject password with less than 8 characters', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'Pass1!',
        confirm_password: 'Pass1!',
        user_type: 'farmer' as const,
      };

      await expect(registerSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject password without uppercase letter', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123!',
        confirm_password: 'password123!',
        user_type: 'farmer' as const,
      };

      await expect(registerSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject password without lowercase letter', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'PASSWORD123!',
        confirm_password: 'PASSWORD123!',
        user_type: 'farmer' as const,
      };

      await expect(registerSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject password without number', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'Password!',
        confirm_password: 'Password!',
        user_type: 'farmer' as const,
      };

      await expect(registerSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject password without special character', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'Password123',
        confirm_password: 'Password123',
        user_type: 'farmer' as const,
      };

      await expect(registerSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should accept strong passwords', async () => {
      const strongPasswords = [
        'Password123!',
        'SecurePass456@',
        'MySecret789%',
        'ComplexPwd999&',
      ];

      for (const password of strongPasswords) {
        const validData = {
          name: 'John Doe',
          email: 'test@example.com',
          password,
          confirm_password: password,
          user_type: 'farmer' as const,
        };

        const result = await registerSchema.validate(validData);
        expect(result.password).toBe(password);
      }
    });
  });

  describe('Password Confirmation', () => {
    it('should reject mismatched passwords', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'Password123!',
        confirm_password: 'DifferentPassword123!',
        user_type: 'farmer' as const,
      };

      await expect(registerSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject empty confirm password', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'Password123!',
        confirm_password: '',
        user_type: 'farmer' as const,
      };

      await expect(registerSchema.validate(invalidData)).rejects.toThrow();
    });
  });

  describe('User Type Validation', () => {
    it('should reject empty user type', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'Password123!',
        confirm_password: 'Password123!',
        user_type: '' as any,
      };

      await expect(registerSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject invalid user type', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'Password123!',
        confirm_password: 'Password123!',
        user_type: 'admin' as any,
      };

      await expect(registerSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should accept farmer user type', async () => {
      const validData = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'Password123!',
        confirm_password: 'Password123!',
        user_type: 'farmer' as const,
      };

      const result = await registerSchema.validate(validData);
      expect(result.user_type).toBe('farmer');
    });

    it('should accept expert user type', async () => {
      const validData = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'Password123!',
        confirm_password: 'Password123!',
        user_type: 'expert' as const,
      };

      const result = await registerSchema.validate(validData);
      expect(result.user_type).toBe('expert');
    });
  });

  describe('Data Transformation', () => {
    it('should trim whitespace from name', async () => {
      const validData = {
        name: '  John Doe  ',
        email: 'test@example.com',
        password: 'Password123!',
        confirm_password: 'Password123!',
        user_type: 'farmer' as const,
      };

      const result = await registerSchema.validate(validData);
      expect(result.name).toBe('John Doe');
    });

    it('should convert email to lowercase', async () => {
      const validData = {
        name: 'John Doe',
        email: 'TEST@EXAMPLE.COM',
        password: 'Password123!',
        confirm_password: 'Password123!',
        user_type: 'farmer' as const,
      };

      const result = await registerSchema.validate(validData);
      expect(result.email).toBe('test@example.com');
    });

    it('should trim whitespace from email', async () => {
      const validData = {
        name: 'John Doe',
        email: '  test@example.com  ',
        password: 'Password123!',
        confirm_password: 'Password123!',
        user_type: 'farmer' as const,
      };

      const result = await registerSchema.validate(validData);
      expect(result.email).toBe('test@example.com');
    });
  });
});
