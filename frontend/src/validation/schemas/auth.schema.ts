import * as yup from 'yup';

/**
 * Authentication validation schemas
 * Contains validation rules for login, register, and password reset forms
 */

// Common field validations
export const nameValidation = yup
  .string()
  .required('Full name is required')
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .matches(
    /^[a-zA-Z\s'-]+$/,
    'Name can only contain letters, spaces, apostrophes, and hyphens'
  )
  .trim();

export const emailValidation = yup
  .string()
  .required('Email is required')
  .email('Please enter a valid email address')
  .lowercase('Email must be lowercase')
  .trim();

export const passwordValidation = yup
  .string()
  .required('Password is required')
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  );

export const confirmPasswordValidation = (passwordField: string = 'password') =>
  yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref(passwordField)], 'Passwords must match');

export const userTypeValidation = yup
  .mixed<'farmer' | 'expert'>()
  .required('Please select your user type')
  .oneOf(['farmer', 'expert'], 'Invalid user type selected');

// Registration schema
export const registerSchema = yup.object().shape({
  name: nameValidation,
  email: emailValidation,
  password: passwordValidation,
  confirmPassword: confirmPasswordValidation(),
  userType: userTypeValidation
});

// Login schema
export const loginSchema = yup.object().shape({
  email: emailValidation,
  password: yup
    .string()
    .required('Password is required')
    .min(1, 'Password is required'),
});

// Forgot password schema
export const forgotPasswordSchema = yup.object().shape({
  email: emailValidation,
});

// Reset password schema
export const resetPasswordSchema = yup.object().shape({
  token: yup.string().required('Reset token is required'),
  password: passwordValidation,
  confirmPassword: confirmPasswordValidation(),
});

// Change password schema
export const changePasswordSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .required('Current password is required'),
  newPassword: passwordValidation,
  confirmNewPassword: confirmPasswordValidation('newPassword'),
});

// Type exports
export type RegisterFormData = yup.InferType<typeof registerSchema>;
export type LoginFormData = yup.InferType<typeof loginSchema>;
export type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>;
export type ChangePasswordFormData = yup.InferType<typeof changePasswordSchema>;
