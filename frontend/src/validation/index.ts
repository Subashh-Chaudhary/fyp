/**
 * Validation module exports
 * Central export file for all validation schemas and utilities
 */

// Schema exports
export {
  changePasswordSchema, confirmPasswordValidation, emailValidation, forgotPasswordSchema, loginSchema, nameValidation, passwordValidation, registerSchema, resetPasswordSchema, userTypeValidation, type ChangePasswordFormData, type ForgotPasswordFormData, type LoginFormData, type RegisterFormData, type ResetPasswordFormData
} from './schemas/auth.schema';

// Utility exports
export {
  checkPasswordStrength, formatValidationError, getAllErrors, getFieldError, hasAnyErrors, hasFieldError, isValidEmail, isValidName, isValidPhone, sanitizeInput
} from './utils/validation.utils';

