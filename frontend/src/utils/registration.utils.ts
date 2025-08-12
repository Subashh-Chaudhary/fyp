import { router } from 'expo-router';

import { ErrorAlertData } from '../interfaces';

import { createErrorAlertData } from './error.utils';

/**
 * Registration-specific utility functions
 */

export interface RegistrationErrorContext {
  userType: string;
  email: string;
}

/**
 * Create registration error alert data with navigation actions
 */
export const createRegistrationErrorAlert = (
  error: string,
  context: RegistrationErrorContext
): ErrorAlertData => {
  const baseAlert = createErrorAlertData(error, 'Registration Failed', context);

  // Override quick actions with navigation handlers
  if (error.includes('already exists')) {
    baseAlert.quickAction = {
      label: 'Sign In Instead',
      onPress: () => {
        router.push('/(auth)/login');
      },
      variant: 'primary' as const,
    };
  }

  if (error.includes('network') || error.includes('connection')) {
    baseAlert.quickAction = {
      label: 'Check Connection',
      onPress: () => {
        // Could add network status check here
        // For now, just close the alert
      },
      variant: 'secondary' as const,
    };
  }

  return baseAlert;
};

/**
 * Handle social authentication (placeholder for future implementation)
 */
export const handleSocialAuth = (provider: 'google' | 'facebook'): ErrorAlertData => {
  return {
    title: 'Coming Soon',
    message: `${provider.charAt(0).toUpperCase() + provider.slice(1)} authentication will be available soon!`,
    showRetry: false,
    type: 'info',
  };
};

/**
 * Validate form data before submission
 */
export const validateRegistrationForm = (errors: any): boolean => {
  return Object.keys(errors).length === 0;
};

/**
 * Format user type for display
 */
export const formatUserType = (userType: string): string => {
  return userType.charAt(0).toUpperCase() + userType.slice(1);
};

/**
 * Get user type options for registration
 */
export const getUserTypeOptions = () => [
  { value: 'farmer', label: 'Farmer' },
  { value: 'expert', label: 'Expert' },
];

/**
 * Clean and format registration data
 */
export const formatRegistrationData = (data: any) => ({
  name: data.name.trim(),
  email: data.email.toLowerCase().trim(),
  password: data.password,
  confirm_password: data.confirm_password,
  user_type: data.user_type,
});
