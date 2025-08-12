import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Animated, Dimensions, Modal, Text, TouchableOpacity, View } from 'react-native';
import { ErrorAlertProps } from '../../src/interfaces';
import { colors, commonStyles } from '../../styles';

const { width } = Dimensions.get('window');

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
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim]);

  // Get styling based on alert type
  const getAlertStyles = () => {
    switch (type) {
      case 'warning':
        return {
          iconBg: colors.warning[100],
          iconColor: colors.warning[600],
          titleColor: colors.warning[700],
          buttonBg: colors.warning[500],
          iconName: 'warning' as const,
        };
      case 'info':
        return {
          iconBg: colors.secondary[100],
          iconColor: colors.secondary[600],
          titleColor: colors.secondary[700],
          buttonBg: colors.secondary[500],
          iconName: 'information-circle' as const,
        };
      default: // error
        return {
          iconBg: colors.danger[100],
          iconColor: colors.danger[600],
          titleColor: colors.danger[700],
          buttonBg: colors.danger[500],
          iconName: 'alert-circle' as const,
        };
    }
  };

  const styles = getAlertStyles();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[
        commonStyles.flex1,
        commonStyles.justifyCenter,
        commonStyles.itemsCenter,
        {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          opacity: fadeAnim,
        }
      ]}>
        <Animated.View style={[
          commonStyles.bgWhite,
          commonStyles.roundedXl,
          commonStyles.p6,
          {
            width: width * 0.85,
            maxWidth: 400,
            transform: [{ scale: scaleAnim }],
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }
        ]}>
          {/* Header with Icon */}
          <View style={[commonStyles.itemsCenter, commonStyles.mb4]}>
            <View style={[
              commonStyles.itemsCenter,
              commonStyles.justifyCenter,
              { width: 60, height: 60, backgroundColor: styles.iconBg, borderRadius: 30 },
              commonStyles.mb3
            ]}>
              <Ionicons name={styles.iconName} size={32} color={styles.iconColor} />
            </View>

            <Text style={[
              commonStyles.textXl,
              commonStyles.fontBold,
              commonStyles.textCenter,
              { color: styles.titleColor }
            ]}>
              {title}
            </Text>
          </View>

          {/* Error Message */}
          <Text style={[
            commonStyles.textBase,
            commonStyles.textSecondary,
            commonStyles.textCenter,
            commonStyles.mb6,
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
                commonStyles.roundedLg,
                commonStyles.itemsCenter,
                commonStyles.mb4,
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
                  commonStyles.py3,
                  commonStyles.px4,
                  commonStyles.roundedLg,
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
                commonStyles.py3,
                commonStyles.px4,
                commonStyles.roundedLg,
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
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};
