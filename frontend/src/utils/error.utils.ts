import { ErrorAlertData } from '../interfaces';

/**
 * Error handling utilities for consistent error message formatting and alert type determination
 */

export interface ErrorContext {
  userType?: string;
  email?: string;
  fieldName?: string;
}

/**
 * Get user-friendly error message based on error type and context
 */
export const getUserFriendlyErrorMessage = (error: string, context?: ErrorContext): string => {
  const { userType, email, fieldName } = context || {};

  if (error.includes('already exists')) {
    const userTypeText = userType === 'farmer' ? 'farmer' : 'expert';
    return `A ${userTypeText} with the email "${email}" already exists. Please try with a different email address.\n\nIf you already have an account, you can sign in instead.`;
  }

  if (error.includes('network') || error.includes('connection')) {
    return 'Network connection error. Please check your internet connection and try again.\n\nMake sure you have a stable internet connection and try again.';
  }

  if (error.includes('validation') || error.includes('invalid')) {
    return 'Please check your input and try again.\n\nMake sure all fields are filled correctly and your password meets the requirements.';
  }

  if (error.includes('timeout')) {
    return 'Request timed out. The server is taking too long to respond.\n\nPlease try again in a few moments.';
  }

  if (error.includes('server') || error.includes('500')) {
    return 'Server error occurred. Our team has been notified.\n\nPlease try again later or contact support if the problem persists.';
  }

  if (error.includes('unauthorized') || error.includes('401')) {
    return 'Authentication failed. Please check your credentials and try again.';
  }

  if (error.includes('forbidden') || error.includes('403')) {
    return 'Access denied. You don\'t have permission to perform this action.';
  }

  if (error.includes('not found') || error.includes('404')) {
    return 'The requested resource was not found. Please check the URL and try again.';
  }

  if (error.includes('rate limit') || error.includes('429')) {
    return 'Too many requests. Please wait a moment before trying again.';
  }

  // Default fallback
  return error || 'An unexpected error occurred. Please try again.';
};

/**
 * Determine alert type based on error content
 */
export const getAlertType = (error: string): 'error' | 'warning' | 'info' => {
  if (error.includes('already exists')) {
    return 'warning'; // User can try with different email
  }

  if (error.includes('network') || error.includes('connection')) {
    return 'error'; // Network issues are errors
  }

  if (error.includes('validation') || error.includes('invalid')) {
    return 'warning'; // Validation issues are warnings
  }

  if (error.includes('timeout')) {
    return 'warning'; // Timeouts are warnings (can retry)
  }

  if (error.includes('server') || error.includes('500')) {
    return 'error'; // Server errors are errors
  }

  if (error.includes('unauthorized') || error.includes('401')) {
    return 'warning'; // Auth issues are warnings
  }

  if (error.includes('forbidden') || error.includes('403')) {
    return 'error'; // Permission issues are errors
  }

  if (error.includes('not found') || error.includes('404')) {
    return 'warning'; // Not found issues are warnings
  }

  if (error.includes('rate limit') || error.includes('429')) {
    return 'warning'; // Rate limit issues are warnings
  }

  return 'error'; // Default to error
};

/**
 * Create error alert data with appropriate configuration
 */
export const createErrorAlertData = (
  error: string,
  title: string = 'Error',
  context?: ErrorContext
): ErrorAlertData => {
  const message = getUserFriendlyErrorMessage(error, context);
  const type = getAlertType(error);

  return {
    title,
    message,
    showRetry: true,
    type,
    quickAction: getQuickAction(error, context),
  };
};

/**
 * Get quick action based on error type
 */
export const getQuickAction = (error: string, context?: ErrorContext) => {
  if (error.includes('already exists')) {
    return {
      label: 'Sign In Instead',
      onPress: () => {
        // This will be handled by the component
      },
      variant: 'primary' as const,
    };
  }

  if (error.includes('network') || error.includes('connection')) {
    return {
      label: 'Check Connection',
      onPress: () => {
        // This will be handled by the component
      },
      variant: 'secondary' as const,
    };
  }

  return undefined;
};

/**
 * Get field-specific error message
 */
export const getFieldErrorMessage = (error: string, fieldName?: string): string => {
  if (!fieldName) return error;

  const fieldErrors: Record<string, string> = {
    email: 'Please enter a valid email address.',
    password: 'Password must meet the security requirements.',
    name: 'Please enter your full name.',
    confirm_password: 'Passwords do not match.',
    user_type: 'Please select your user type.',
  };

  return fieldErrors[fieldName] || error;
};

/**
 * Check if error is retryable
 */
export const isRetryableError = (error: string): boolean => {
  const retryableErrors = [
    'network',
    'connection',
    'timeout',
    'server',
    '500',
    'rate limit',
    '429'
  ];

  return retryableErrors.some(errorType => error.includes(errorType));
};
