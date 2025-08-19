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

  // Handle modal close - if no onClose provided, we can't close the modal
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={[
        commonStyles.flex1,
        commonStyles.justifyCenter,
        commonStyles.itemsCenter,
        { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
      ]}>
        {/* Add background tap handler when no close button */}
        {!onClose && (
          <TouchableOpacity
            style={[{ position: 'absolute', width: '100%', height: '100%' }]}
            activeOpacity={1}
            onPress={() => {}} // Do nothing on tap, just prevent modal from closing
          />
        )}

        <View style={[
          commonStyles.bgWhite,
          commonStyles.roundedLg,
          commonStyles.p4,
          {
            width: '85%',
            maxWidth: 350,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 8,
          }
        ]}>
          {/* Title */}
          {title && (
            <Text style={[
              commonStyles.textLg,
              commonStyles.fontBold,
              commonStyles.textCenter,
              commonStyles.mb4,
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
            commonStyles.mb5,
            { lineHeight: 22 }
          ]}>
            {message}
          </Text>

          {/* Quick Action Button */}
          {quickAction && (
            <TouchableOpacity
              style={[
                commonStyles.py3,
                commonStyles.px4,
                commonStyles.roundedMd,
                commonStyles.itemsCenter,
                {
                  width: '100%',
                  backgroundColor: quickAction.variant === 'primary' ? styles.buttonBg : colors.neutral[100],
                  borderWidth: 1,
                  borderColor: quickAction.variant === 'primary' ? styles.buttonBg : colors.neutral[200],
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2,
                }
              ]}
              onPress={quickAction.onPress}
              activeOpacity={0.7}
            >
              <Text style={[
                commonStyles.fontMedium,
                commonStyles.textBase,
                { color: quickAction.variant === 'primary' ? '#ffffff' : colors.neutral[700] }
              ]}>
                {quickAction.label}
              </Text>
            </TouchableOpacity>
          )}

          {/* Action Buttons */}
          <View style={[
            commonStyles.flexRow,
            { gap: 12 },
            // Adjust layout based on available buttons
            (!showRetry || !onRetry) && { justifyContent: 'center' }
          ]}>
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

            {/* Only show close button when there's no quickAction and onClose is provided */}
            {!quickAction && onClose && (
              <TouchableOpacity
                style={[
                  showRetry && onRetry ? commonStyles.flex1 : { minWidth: 120 },
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
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};
