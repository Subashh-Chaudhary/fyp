import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { InputProps } from '../../src/interfaces';
import { colors, commonStyles } from '../../styles';

/**
 * Reusable Input component with validation and styling options
 * Supports labels, error states, and icons
 */
export function Input({
  label,
  error,
  icon,
  variant = 'default',
  style,
  ...props
}: InputProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'default':
        return {
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: error ? colors.danger[500] : colors.neutral[200],
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: error ? colors.danger[500] : colors.neutral[300],
        };
      default:
        return {
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: error ? colors.danger[500] : colors.neutral[200],
        };
    }
  };

  return (
    <View style={commonStyles.mb4}>
      {label && (
        <Text style={[commonStyles.textSm, commonStyles.fontMedium, commonStyles.textPrimary, commonStyles.mb2]}>
          {label}
        </Text>
      )}

      <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.roundedLg, getVariantStyles(), style]}>
        {icon && (
          <View style={[commonStyles.px3, commonStyles.py3]}>
            <Ionicons name={icon} size={20} color={colors.neutral[500]} />
          </View>
        )}

        <TextInput
          style={[
            commonStyles.flex1,
            commonStyles.py3,
            { color: colors.neutral[900] },
            icon ? { paddingLeft: 0 } : { paddingLeft: 16 },
            { paddingRight: 16 },
          ]}
          placeholderTextColor={colors.neutral[400]}
          {...props}
        />
      </View>

      {error && (
        <Text style={[commonStyles.textSm, { color: colors.danger[500] }, commonStyles.mt1]}>
          {error}
        </Text>
      )}
    </View>
  );
}
