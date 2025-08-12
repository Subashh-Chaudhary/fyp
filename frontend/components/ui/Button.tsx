import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { ButtonProps } from '../../src/interfaces';
import { colors, commonStyles } from '../../styles';

/**
 * Reusable Button component with multiple variants and sizes
 * Supports loading states, icons, and different styling options
 */
export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: colors.primary[500],
          text: '#ffffff',
          border: 'transparent',
        };
      case 'secondary':
        return {
          background: colors.secondary[500],
          text: '#ffffff',
          border: 'transparent',
        };
      case 'outline':
        return {
          background: 'transparent',
          text: colors.primary[500],
          border: colors.primary[500],
        };
      case 'danger':
        return {
          background: colors.danger[500],
          text: '#ffffff',
          border: 'transparent',
        };
      default:
        return {
          background: colors.primary[500],
          text: '#ffffff',
          border: 'transparent',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: 8,
          fontSize: 14,
          iconSize: 16,
        };
      case 'medium':
        return {
          padding: 12,
          fontSize: 16,
          iconSize: 18,
        };
      case 'large':
        return {
          padding: 16,
          fontSize: 18,
          iconSize: 20,
        };
      default:
        return {
          padding: 12,
          fontSize: 16,
          iconSize: 18,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        commonStyles.flexRow,
        commonStyles.itemsCenter,
        commonStyles.justifyCenter,
        commonStyles.roundedLg,
        {
          backgroundColor: variantStyles.background,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: variantStyles.border,
          paddingHorizontal: sizeStyles.padding * 1.5,
          paddingVertical: sizeStyles.padding,
          opacity: disabled || loading ? 0.6 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantStyles.text} />
      ) : (
        <>
          {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
          <Text
            style={[
              commonStyles.fontSemibold,
              {
                color: variantStyles.text,
                fontSize: sizeStyles.fontSize,
              },
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
