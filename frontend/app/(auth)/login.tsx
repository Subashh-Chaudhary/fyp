import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ErrorAlert } from '../../components/ui/ErrorAlert';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../src/hooks';
import { loginSchema, type LoginFormData } from '../../src/validation';
import { colors, commonStyles } from '../../styles';

/**
 * Login screen - User authentication
 * Provides email/password login and social authentication
 */
export default function LoginScreen() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const { login, isLoading, error } = useAuth();

  // Clear errors when user starts typing
  const clearErrors = () => {
    setErrors({});
  };

  // Validate form using schema
  const validateForm = async (): Promise<boolean> => {
    try {
      await loginSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationError: any) {
      const newErrors: Partial<LoginFormData> = {};

      if (validationError.inner) {
        validationError.inner.forEach((err: any) => {
          if (err.path) {
            newErrors[err.path as keyof LoginFormData] = err.message;
          }
        });
      }

      setErrors(newErrors);
      return false;
    }
  };

  const handleEmailAuth = async () => {
    if (await validateForm()) {
      try {
        await login({
          email: formData.email.trim(),
          password: formData.password,
        });
      } catch (err: any) {
        // Error is already handled by the useAuth hook
        console.log('Login error in component:', err.message);
      }
    }
  };

  const handleSocialAuth = (provider: 'google' | 'facebook') => {
    // TODO: Implement social authentication
    Alert.alert('Coming Soon', `${provider.charAt(0).toUpperCase() + provider.slice(1)} authentication will be available soon!`);
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password');
  };

  const handleCreateAccount = () => {
    router.push('/(auth)/register');
  };

  const handleRetry = () => {
    // Clear any existing errors and try again
    clearErrors();
    setShowErrorAlert(false);
  };

  const handleCheckConnection = () => {
    // TODO: Implement network status check
    Alert.alert('Network Status', 'Checking your internet connection...');
    setShowErrorAlert(false);
  };

  // Show error alert when there's an error from useAuth
  React.useEffect(() => {
    if (error) {
      setShowErrorAlert(true);
    }
  }, [error]);

  // Get quick action based on error type
  const getQuickAction = () => {
    if (!error) {
      return {
        label: 'Sign In Again',
        onPress: handleRetry,
        variant: 'primary' as const,
      };
    }

    if (error.includes('network') || error.includes('connection')) {
      return {
        label: 'Check Internet Connection',
        onPress: handleCheckConnection,
        variant: 'secondary' as const,
      };
    } else {
      return {
        label: 'Try Signing In Again',
        onPress: handleRetry,
        variant: 'primary' as const,
      };
    }
  };

  const updateField = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <SafeAreaView style={[commonStyles.flex1, commonStyles.bgNeutral50]}>
      <KeyboardAvoidingView
        style={commonStyles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={commonStyles.flex1}
            contentContainerStyle={[commonStyles.px4, commonStyles.py10]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={[commonStyles.itemsCenter, commonStyles.mb8]}>
              <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 80, height: 80, backgroundColor: colors.primary[100], borderRadius: 40 }, commonStyles.mb4]}>
                <Ionicons name="leaf" size={36} color={colors.primary[500]} />
              </View>

              <Text style={[commonStyles.text2xl, commonStyles.fontBold, commonStyles.textPrimary, commonStyles.textCenter, commonStyles.mb2]}>
                Welcome Back
              </Text>

              <Text style={[commonStyles.textBase, commonStyles.textSecondary, commonStyles.textCenter]}>
                Sign in to continue to your account
              </Text>
            </View>

            {/* Login Form */}
            <Card variant="default" padding="large">
              <Input
                label="Email"
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(text) => updateField('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                icon="mail"
                returnKeyType="next"
                error={errors.email || ''}
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChangeText={(text) => updateField('password', text)}
                secureTextEntry
                icon="lock-closed"
                returnKeyType="done"
                error={errors.password || ''}
              />

              <TouchableOpacity
                style={[commonStyles.itemsEnd, commonStyles.mb4]}
                onPress={handleForgotPassword}
              >
                <Text style={[commonStyles.textSm, { color: colors.primary[500] }]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <Button
                title="Sign In"
                onPress={handleEmailAuth}
                variant="primary"
                size="large"
                loading={isLoading}
                icon={<Ionicons name="log-in" size={20} color="#ffffff" />}
              />
            </Card>

            {/* Register Link */}
            <View style={[commonStyles.itemsCenter, commonStyles.mb3]}>
              <Text style={[commonStyles.textSm, commonStyles.textSecondary, commonStyles.textCenter, commonStyles.mb2]}>
                Don&apos;t have an account? <Text style={[commonStyles.textSm, commonStyles.fontMedium, { color: colors.primary[600] }]} onPress={handleCreateAccount}>Create Account</Text>
              </Text>
            </View>

            {/* Social Login */}
            <View style={[commonStyles.mb6]}>
              <Text style={[commonStyles.textBase, commonStyles.fontMedium, commonStyles.textSecondary, commonStyles.textCenter, commonStyles.mb4]}>
                Or continue with
              </Text>

              <View style={[commonStyles.flexRow, { gap: 12, paddingHorizontal: 20 }]}>
                <TouchableOpacity
                  style={[
                    commonStyles.flex1,
                    commonStyles.flexRow,
                    commonStyles.itemsCenter,
                    commonStyles.justifyCenter,
                    commonStyles.py3,
                    commonStyles.px4,
                    {
                      backgroundColor: '#DB4437', // Google red
                      borderRadius: 8,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                      elevation: 2,
                    },
                  ]}
                  onPress={() => handleSocialAuth('google')}
                  disabled={isLoading}
                >
                  <Ionicons name="logo-google" size={20} color="#ffffff" />
                  <Text style={[commonStyles.textSm, commonStyles.fontMedium, { color: '#ffffff' }, commonStyles.ml2]}>
                    Google
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    commonStyles.flex1,
                    commonStyles.flexRow,
                    commonStyles.itemsCenter,
                    commonStyles.justifyCenter,
                    commonStyles.py3,
                    commonStyles.px4,
                    {
                      backgroundColor: '#4267B2', // Facebook blue
                      borderRadius: 8,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                      elevation: 2,
                    },
                  ]}
                  onPress={() => handleSocialAuth('facebook')}
                  disabled={isLoading}
                >
                  <Ionicons name="logo-facebook" size={20} color="#ffffff" />
                  <Text style={[commonStyles.textSm, commonStyles.fontMedium, { color: '#ffffff' }, commonStyles.ml2]}>
                    Facebook
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Error Alert */}
      {showErrorAlert && (
        <ErrorAlert
          visible={showErrorAlert}
          title="Login Error"
          message={error || 'An error occurred during login. Please try again.'}
          showRetry={false}
          type="error"
          quickAction={getQuickAction()}
        />
      )}
    </SafeAreaView>
  );
}
