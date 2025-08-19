import { FieldErrors, FieldValues } from 'react-hook-form';

/**
 * Validation utility functions
 * Provides helper functions for form validation and error handling
 */

/**
 * Gets the first error message for a specific field
 * @param errors - React Hook Form errors object
 * @param fieldName - Name of the field to get error for
 * @returns Error message string or undefined
 */
export const getFieldError = (
  errors: FieldErrors<FieldValues>,
  fieldName: string
): string | undefined => {
  const error = errors[fieldName];
  if (error && typeof error.message === 'string') {
    return error.message;
  }
  return undefined;
};

/**
 * Checks if a specific field has an error
 * @param errors - React Hook Form errors object
 * @param fieldName - Name of the field to check
 * @returns Boolean indicating if field has error
 */
export const hasFieldError = (
  errors: FieldErrors<FieldValues>,
  fieldName: string
): boolean => {
  return !!errors[fieldName];
};

/**
 * Gets all error messages as an array
 * @param errors - React Hook Form errors object
 * @returns Array of error messages
 */
export const getAllErrors = (errors: FieldErrors<FieldValues>): string[] => {
  const errorMessages: string[] = [];

  Object.keys(errors).forEach((key) => {
    const error = errors[key];
    if (error && typeof error.message === 'string') {
      errorMessages.push(error.message);
    }
  });

  return errorMessages;
};

/**
 * Checks if form has any errors
 * @param errors - React Hook Form errors object
 * @returns Boolean indicating if form has any errors
 */
export const hasAnyErrors = (errors: FieldErrors<FieldValues>): boolean => {
  return Object.keys(errors).length > 0;
};

/**
 * Formats validation error for display
 * @param error - Error message or object
 * @returns Formatted error string
 */
export const formatValidationError = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error.message === 'string') {
    return error.message;
  }

  if (error && Array.isArray(error)) {
    return error.join(', ');
  }

  return 'Invalid input';
};

/**
 * Password strength checker
 * @param password - Password string to check
 * @returns Object with strength level and feedback
 */
export const checkPasswordStrength = (password: string) => {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;

  let strength: 'weak' | 'fair' | 'good' | 'strong';
  const feedback: string[] = [];

  if (score < 3) {
    strength = 'weak';
  } else if (score < 4) {
    strength = 'fair';
  } else if (score < 5) {
    strength = 'good';
  } else {
    strength = 'strong';
  }

  if (!checks.length) {feedback.push('At least 8 characters');}
  if (!checks.lowercase) {feedback.push('One lowercase letter');}
  if (!checks.uppercase) {feedback.push('One uppercase letter');}
  if (!checks.number) {feedback.push('One number');}
  if (!checks.special) {feedback.push('One special character');}

  return {
    strength,
    score,
    checks,
    feedback,
    isValid: score === 5,
  };
};

/**
 * Email validation helper
 * @param email - Email string to validate
 * @returns Boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Phone number validation helper (international format)
 * @param phone - Phone number string to validate
 * @returns Boolean indicating if phone number is valid
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Name validation helper
 * @param name - Name string to validate
 * @returns Boolean indicating if name is valid
 */
export const isValidName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s'-]{2,50}$/;
  return nameRegex.test(name.trim());
};

/**
 * Sanitizes input by removing leading/trailing whitespace and normalizing
 * @param input - Input string to sanitize
 * @returns Sanitized string
 */
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/\s+/g, ' ');
};
