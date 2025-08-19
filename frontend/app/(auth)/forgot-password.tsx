import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../../src/validation';
import { colors, commonStyles } from '../../styles';

/**
 * Forgot Password screen - Password recovery
 * Allows users to reset their password via email
 */
export default function ForgotPasswordScreen() {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  });
  const [errors, setErrors] = useState<Partial<ForgotPasswordFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Validate form using schema
  const validateForm = async (): Promise<boolean> => {
    try {
      await forgotPasswordSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationError: any) {
      const newErrors: Partial<ForgotPasswordFormData> = {};

      if (validationError.inner) {
        validationError.inner.forEach((err: any) => {
          if (err.path) {
            newErrors[err.path as keyof ForgotPasswordFormData] = err.message;
          }
        });
      }

      setErrors(newErrors);
      return false;
    }
  };

  const handleResetPassword = async () => {
    if (await validateForm()) {
      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setIsSent(true);
        Alert.alert(
          'Reset Link Sent',
          'If an account with that email exists, we&apos;ve sent a password reset link.',
          [{ text: 'OK' }]
        );
      }, 1500);
    }
  };

  const handleBackToLogin = () => {
    router.push('/(auth)/login');
  };

  const updateField = (field: keyof ForgotPasswordFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <SafeAreaView style={[commonStyles.flex1, commonStyles.bgNeutral50]}>
      <View style={[commonStyles.flex1, commonStyles.px6, commonStyles.py4]}>
        {/* Header */}
        <View style={[commonStyles.itemsCenter, commonStyles.mb8]}>
          <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 80, height: 80, backgroundColor: colors.primary[100], borderRadius: 40 }, commonStyles.mb4]}>
            <Ionicons name="lock-open" size={36} color={colors.primary[500]} />
          </View>

          <Text style={[commonStyles.text2xl, commonStyles.fontBold, commonStyles.textPrimary, commonStyles.textCenter, commonStyles.mb2]}>
            Forgot Password?
          </Text>

          <Text style={[commonStyles.textBase, commonStyles.textSecondary, commonStyles.textCenter]}>
            Enter your email address and we&apos;ll send you a link to reset your password
          </Text>
        </View>

        {/* Reset Form */}
        <Card variant="default" padding="large" style={commonStyles.mb6}>
          {isSent ? (
            <View style={[commonStyles.itemsCenter, commonStyles.py6]}>
              <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 64, height: 64, backgroundColor: colors.success[100], borderRadius: 32 }, commonStyles.mb4]}>
                <Ionicons name="checkmark-circle" size={32} color={colors.success[600]} />
              </View>
              <Text style={[commonStyles.textLg, commonStyles.fontMedium, commonStyles.textPrimary, commonStyles.textCenter, commonStyles.mb2]}>
                Reset Link Sent!
              </Text>
              <Text style={[commonStyles.textSm, commonStyles.textSecondary, commonStyles.textCenter]}>
                Check your email for password reset instructions
              </Text>
            </View>
          ) : (
            <>
              <Input
                label="Email"
                placeholder="Enter your email address"
                value={formData.email}
                onChangeText={(text) => updateField('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                icon="mail"
                error={errors.email || ''}
              />

              <Button
                title="Send Reset Link"
                onPress={handleResetPassword}
                variant="primary"
                size="large"
                loading={isLoading}
                icon={<Ionicons name="mail" size={20} color="#ffffff" />}
              />
            </>
          )}
        </Card>

        {/* Instructions */}
        <Card variant="outlined" padding="medium" style={commonStyles.mb6}>
          <View style={[commonStyles.flexRow, commonStyles.itemsStart]}>
            <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 32, height: 32, backgroundColor: colors.secondary[100], borderRadius: 16, marginRight: 12 }]}>
              <Ionicons name="information-circle" size={16} color={colors.secondary[500]} />
            </View>
            <View style={commonStyles.flex1}>
              <Text style={[commonStyles.textSm, commonStyles.fontMedium, commonStyles.textPrimary, commonStyles.mb1]}>
                What happens next?
              </Text>
              <Text style={[commonStyles.textXs, commonStyles.textSecondary]}>
                • Check your email for a password reset link{'\n'}
                • Click the link to create a new password{'\n'}
                • Return here to sign in with your new password
              </Text>
            </View>
          </View>
        </Card>

        {/* Back to Login */}
        <View style={[commonStyles.flexRow, commonStyles.justifyCenter, commonStyles.itemsCenter]}>
          <Text style={[commonStyles.textBase, commonStyles.textSecondary]}>
            Remember your password?{' '}
          </Text>
          <Button
            title="Back to Login"
            onPress={handleBackToLogin}
            variant="outline"
            size="small"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
