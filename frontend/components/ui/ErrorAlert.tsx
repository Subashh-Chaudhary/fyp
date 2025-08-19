import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

import { ErrorAlertProps } from '../../src/interfaces';
import { colors, commonStyles } from '../../styles';

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  visible,
  title,
  message,
  onClose,
  onRetry,
  showRetry = false,
  type = 'error',
  quickAction,
}) => {
  // Get styling based on alert type
  const getAlertStyles = () => {
    switch (type) {
      case 'warning':
        return {
          titleColor: colors.warning[700],
          buttonBg: colors.warning[500],
        };
      case 'info':
        return {
          titleColor: colors.secondary[700],
          buttonBg: colors.secondary[500],
        };
      default: // error
        return {
          titleColor: colors.danger[700],
          buttonBg: colors.danger[500],
        };
    }
  };

  const styles = getAlertStyles();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[
        commonStyles.flex1,
        commonStyles.justifyCenter,
        commonStyles.itemsCenter,
        { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
      ]}>
        <View style={[
          commonStyles.bgWhite,
          commonStyles.roundedLg,
          commonStyles.p4,
          { width: '85%', maxWidth: 350 }
        ]}>
          {/* Title */}
          {title && (
            <Text style={[
              commonStyles.textLg,
              commonStyles.fontBold,
              commonStyles.textCenter,
              commonStyles.mb3,
              { color: styles.titleColor }
            ]}>
              {title}
            </Text>
          )}

          {/* Message */}
          <Text style={[
            commonStyles.textBase,
            commonStyles.textSecondary,
            commonStyles.textCenter,
            commonStyles.mb4
          ]}>
            {message}
          </Text>

          {/* Quick Action Button */}
          {quickAction && (
            <TouchableOpacity
              style={[
                commonStyles.py2,
                commonStyles.px4,
                commonStyles.roundedMd,
                commonStyles.itemsCenter,
                commonStyles.mb3,
                {
                  width: '100%',
                  backgroundColor: quickAction.variant === 'primary' ? styles.buttonBg : colors.neutral[100],
                  borderWidth: 1,
                  borderColor: quickAction.variant === 'primary' ? styles.buttonBg : colors.neutral[200]
                }
              ]}
              onPress={quickAction.onPress}
              activeOpacity={0.7}
            >
              <Text style={[
                commonStyles.fontMedium,
                { color: quickAction.variant === 'primary' ? '#ffffff' : colors.neutral[700] }
              ]}>
                {quickAction.label}
              </Text>
            </TouchableOpacity>
          )}

          {/* Action Buttons */}
          <View style={[commonStyles.flexRow, { gap: 12 }]}>
            {showRetry && onRetry && (
              <TouchableOpacity
                style={[
                  commonStyles.flex1,
                  commonStyles.py2,
                  commonStyles.px4,
                  commonStyles.roundedMd,
                  commonStyles.itemsCenter,
                  { backgroundColor: colors.neutral[100], borderWidth: 1, borderColor: colors.neutral[200] }
                ]}
                onPress={onRetry}
                activeOpacity={0.7}
              >
                <Text style={[
                  commonStyles.fontMedium,
                  { color: colors.neutral[700] }
                ]}>
                  Try Again
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                commonStyles.flex1,
                commonStyles.py2,
                commonStyles.px4,
                commonStyles.roundedMd,
                commonStyles.itemsCenter,
                { backgroundColor: styles.buttonBg }
              ]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={[
                commonStyles.fontMedium,
                { color: '#ffffff' }
              ]}>
                {showRetry && onRetry ? 'Cancel' : 'OK'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
