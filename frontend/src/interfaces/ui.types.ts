import { Ionicons } from '@expo/vector-icons';
import { TextInputProps, ViewStyle } from 'react-native';

/**
 * UI Component Interface Types
 * Contains interfaces for reusable UI components
 */

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: any;
}

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'default' | 'outlined';
  style?: any;
}

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'small' | 'medium' | 'large' | 'none';
  margin?: 'small' | 'medium' | 'large' | 'none';
  style?: ViewStyle;
}

export interface ErrorAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onRetry?: () => void;
  showRetry?: boolean;
  type?: 'error' | 'warning' | 'info';
  quickAction?: {
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
  };
}

export interface ErrorAlertData {
  title: string;
  message: string;
  showRetry?: boolean;
  type?: 'error' | 'warning' | 'info';
  quickAction?: {
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
  };
}

export interface PasswordStrength {
  strength: 'weak' | 'fair' | 'good' | 'strong';
  score: number;
  checks: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
    special: boolean;
  };
  feedback: string[];
  isValid: boolean;
}
