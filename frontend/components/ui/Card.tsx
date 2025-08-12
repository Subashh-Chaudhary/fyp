import React from 'react';
import { View } from 'react-native';
import { CardProps } from '../../src/interfaces';
import { colors, commonStyles } from '../../styles';

/**
 * Reusable Card component with different variants and padding options
 * Provides consistent styling for content containers throughout the app
 */
export function Card({
  children,
  variant = 'default',
  padding = 'medium',
  margin = 'none',
  style,
}: CardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'default':
        return {
          backgroundColor: '#ffffff',
          borderWidth: 0,
          borderColor: 'transparent',
          shadow: commonStyles.shadow,
        };
      case 'outlined':
        return {
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: colors.neutral[200],
          shadow: null,
        };
      case 'elevated':
        return {
          backgroundColor: '#ffffff',
          borderWidth: 0,
          borderColor: 'transparent',
          shadow: commonStyles.shadowMd,
        };
      default:
        return {
          backgroundColor: '#ffffff',
          borderWidth: 0,
          borderColor: 'transparent',
          shadow: commonStyles.shadow,
        };
    }
  };

  const getPaddingStyles = () => {
    switch (padding) {
      case 'small':
        return { padding: 12 };
      case 'medium':
        return { padding: 16 };
      case 'large':
        return { padding: 24 };
      case 'none':
        return { padding: 0 };
      default:
        return { padding: 16 };
    }
  };

  const getMarginStyles = () => {
    switch (margin) {
      case 'small':
        return { marginBottom: 8 };
      case 'medium':
        return { marginBottom: 16 };
      case 'large':
        return { marginBottom: 24 };
      case 'none':
        return { marginBottom: 0 };
      default:
        return { marginBottom: 0 };
    }
  };

  const variantStyles = getVariantStyles();
  const paddingStyles = getPaddingStyles();
  const marginStyles = getMarginStyles();

  return (
    <View
      style={[
        commonStyles.roundedLg,
        variantStyles,
        paddingStyles,
        marginStyles,
        style,
      ]}
    >
      {children}
    </View>
  );
}
