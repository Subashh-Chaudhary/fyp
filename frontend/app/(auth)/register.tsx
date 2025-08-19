import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../src/hooks';
import { registerSchema, type RegisterFormData } from '../../src/validation';
import { colors, commonStyles } from '../../styles';

/**
 * Registration screen - User account creation
 * Provides form for new user registration with validation
 */
export default function RegisterScreen() {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    user_type: 'farmer',
  });
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});

  const { register, isLoading, error } = useAuth();

  // Clear errors when user starts typing
  const clearErrors = () => {
    setErrors({});
  };

  // Validate form using schema
  const validateForm = async (): Promise<boolean> => {
    try {
      await registerSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationError: any) {
      const newErrors: Partial<RegisterFormData> = {};

      if (validationError.inner) {
        validationError.inner.forEach((err: any) => {
          if (err.path) {
            newErrors[err.path as keyof RegisterFormData] = err.message;
          }
        });
      }

      setErrors(newErrors);
      return false;
    }
  };

  const handleRegister = async () => {
    if (await validateForm()) {
      try {
        await register({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          confirm_password: formData.confirm_password,
          user_type: formData.user_type,
        });
      } catch (err: any) {
        // Error is already handled by the useAuth hook
        console.log('Registration error in component:', err.message);
      }
    }
  };

  // const handleSocialAuth = (provider: 'google' | 'facebook') => {
  //   // TODO: Implement social authentication
  //   Alert.alert('Coming Soon', `${provider.charAt(0).toUpperCase() + provider.slice(1)} authentication will be available soon!`);
  // };

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  const handleRetry = () => {
    // Clear any existing errors and try again
    clearErrors();
  };

  const handleCheckConnection = () => {
    // TODO: Implement network status check
    Alert.alert('Network Status', 'Checking your internet connection...');
  };

  // Get error display component based on error type
  const getErrorDisplay = () => {
    if (!error) {
      return null;
    }

    let quickAction = null;

    if (error.includes('already exists')) {
      quickAction = (
        <TouchableOpacity
          style={[commonStyles.mt3, commonStyles.py2, commonStyles.px4, { backgroundColor: colors.primary[100], borderRadius: 6 }]}
          onPress={handleLogin}
        >
          <Text style={[commonStyles.textSm, { color: colors.primary[600] }]}>
            Sign In Instead
          </Text>
        </TouchableOpacity>
      );
    } else if (error.includes('network') || error.includes('connection')) {
      quickAction = (
        <TouchableOpacity
          style={[commonStyles.mt3, commonStyles.py2, commonStyles.px4, { backgroundColor: colors.primary[100], borderRadius: 6 }]}
          onPress={handleCheckConnection}
        >
          <Text style={[commonStyles.textSm, { color: colors.primary[600] }]}>
            Check Connection
          </Text>
        </TouchableOpacity>
      );
    } else {
      quickAction = (
        <TouchableOpacity
          style={[commonStyles.mt3, commonStyles.py2, commonStyles.px4, { backgroundColor: colors.primary[100], borderRadius: 6 }]}
          onPress={handleRetry}
        >
          <Text style={[commonStyles.textSm, { color: colors.primary[600] }]}>
            Try Again
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={[commonStyles.mt3, commonStyles.p3, { backgroundColor: colors.danger[50], borderRadius: 8, borderWidth: 1, borderColor: colors.danger[200] }]}>
        <Text style={[commonStyles.textSm, { color: colors.danger[600] }, commonStyles.mb2]}>
          {error}
        </Text>
        {quickAction}
      </View>
    );
  };

  const updateField = (field: keyof RegisterFormData, value: string | 'farmer' | 'expert') => {
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
            contentContainerStyle={[commonStyles.px4, commonStyles.py7]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={[commonStyles.itemsCenter, commonStyles.mb8]}>
              <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 80, height: 80, backgroundColor: colors.primary[100], borderRadius: 40 }, commonStyles.mb4]}>
                <Ionicons name="person-add" size={36} color={colors.primary[500]} />
              </View>

              <Text style={[commonStyles.text2xl, commonStyles.fontBold, commonStyles.textPrimary, commonStyles.textCenter, commonStyles.mb2]}>
                Create Account
              </Text>

              <Text style={[commonStyles.textBase, commonStyles.textSecondary, commonStyles.textCenter]}>
                Join our community of farmers and experts
              </Text>
            </View>

            {/* Registration Form */}
            <Card variant="default" padding="large">
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(text) => updateField('name', text)}
                icon="person"
                returnKeyType="next"
                error={errors.name || ''}
              />

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
                placeholder="Create a strong password"
                value={formData.password}
                onChangeText={(text) => updateField('password', text)}
                secureTextEntry
                icon="lock-closed"
                returnKeyType="next"
                error={errors.password || ''}
              />

              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirm_password}
                onChangeText={(text) => updateField('confirm_password', text)}
                secureTextEntry
                icon="lock-closed"
                returnKeyType="done"
                error={errors.confirm_password || ''}
              />

              {/* User Type Selection */}
              <View style={commonStyles.mb4}>
                <Text style={[commonStyles.textBase, commonStyles.fontMedium, commonStyles.textPrimary, commonStyles.mb2]}>
                  I am a:
                </Text>
                <View style={[commonStyles.flexRow, { gap: 12 }]}>
                  <TouchableOpacity
                    style={[
                      commonStyles.flex1,
                      commonStyles.py2,
                      commonStyles.px4,
                      commonStyles.itemsCenter,
                      commonStyles.justifyCenter,
                      {
                        backgroundColor: formData.user_type === 'farmer' ? colors.primary[100] : colors.neutral[100],
                        borderRadius: 8,
                        borderWidth: 2,
                        borderColor: formData.user_type === 'farmer' ? colors.primary[300] : colors.neutral[200],
                      },
                    ]}
                    onPress={() => updateField('user_type', 'farmer')}
                  >
                    <Ionicons
                      name="leaf"
                      size={20}
                      color={formData.user_type === 'farmer' ? colors.primary[600] : colors.neutral[500]}
                      style={commonStyles.mb1}
                    />
                    <Text style={[
                      commonStyles.textSm,
                      commonStyles.fontMedium,
                      { color: formData.user_type === 'farmer' ? colors.primary[600] : colors.neutral[500] }
                    ]}>
                      Farmer
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      commonStyles.flex1,
                      commonStyles.py2,
                      commonStyles.px4,
                      commonStyles.itemsCenter,
                      commonStyles.justifyCenter,
                      {
                        backgroundColor: formData.user_type === 'expert' ? colors.primary[100] : colors.neutral[100],
                        borderRadius: 8,
                        borderWidth: 2,
                        borderColor: formData.user_type === 'expert' ? colors.primary[300] : colors.neutral[200],
                      },
                    ]}
                    onPress={() => updateField('user_type', 'expert')}
                  >
                    <Ionicons
                      name="school"
                      size={20}
                      color={formData.user_type === 'expert' ? colors.primary[600] : colors.neutral[500]}
                      style={commonStyles.mb1}
                    />
                    <Text style={[
                      commonStyles.textSm,
                      commonStyles.fontMedium,
                      { color: formData.user_type === 'expert' ? colors.primary[600] : colors.neutral[500] }
                    ]}>
                      Expert
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Button
                title="Create Account"
                onPress={handleRegister}
                variant="primary"
                size="large"
                loading={isLoading}
                icon={<Ionicons name="person-add" size={20} color="#ffffff" />}
              />

              {/* Error Display */}
              {getErrorDisplay()}
            </Card>

            {/* Login Link */}
            <View style={[commonStyles.itemsCenter, commonStyles.mb2]}>
              <Text style={[commonStyles.textSm, commonStyles.textSecondary, commonStyles.textCenter, commonStyles.mb2]}>
                Already have an account? <Text style={[commonStyles.textSm, commonStyles.fontMedium, { color: colors.primary[600] }]} onPress={handleLogin}>Sign In</Text>
              </Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
