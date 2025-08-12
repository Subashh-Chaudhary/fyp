import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ErrorAlert } from '../../components/ui/ErrorAlert';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../src/hooks';
import { ErrorAlertData, PasswordStrength } from '../../src/interfaces';
import { createRegistrationErrorAlert, formatRegistrationData, getUserTypeOptions, handleSocialAuth } from '../../src/utils/registration.utils';
import { checkPasswordStrength, getFieldError, hasAnyErrors, RegisterFormData, registerSchema } from '../../src/validation';
import { colors, commonStyles } from '../../styles';

/**
 * Register screen - User registration
 * Provides email/password registration with user type selection and enhanced validation
 */
export default function RegisterScreen() {
  const { register, isLoading, error } = useAuth();
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorAlertData, setErrorAlertData] = useState<ErrorAlertData>({
    title: '',
    message: '',
    showRetry: false,
    type: 'error',
  });
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    strength: 'weak',
    score: 0,
    checks: { length: false, lowercase: false, uppercase: false, number: false, special: false },
    feedback: [],
    isValid: false,
  });
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid, touchedFields }
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    mode: 'onChange', // Changed to onChange for real-time validation
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirm_password: '',
      user_type: 'farmer',
    },
  });

  const userType = watch('user_type') as 'farmer' | 'expert';
  const currentPassword = watch('password');

  // Monitor password changes for strength indicator
  React.useEffect(() => {
    if (currentPassword) {
      const strength = checkPasswordStrength(currentPassword);
      setPasswordStrength(strength);
      setShowPasswordStrength(true);
    } else {
      setShowPasswordStrength(false);
    }
  }, [currentPassword]);

  // User type options for the form
  const userTypeOptions = getUserTypeOptions();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Additional client-side validation before submission
      if (hasAnyErrors(errors)) {
        setErrorAlertData({
          title: 'Validation Error',
          message: 'Please fix all errors before submitting.',
          showRetry: false,
          type: 'warning',
        });
        setShowErrorAlert(true);
        return;
      }

      await register(formatRegistrationData(data));
    } catch (err: any) {
      // Handle specific error cases with user-friendly messages
      const errorAlert = createRegistrationErrorAlert(
        err.message || 'An error occurred during registration. Please try again.',
        { userType: data.user_type, email: data.email }
      );

      setErrorAlertData(errorAlert);
      setShowErrorAlert(true);
    }
  };

  const onSocialAuth = (provider: 'google' | 'facebook') => {
    const errorAlert = handleSocialAuth(provider);
    setErrorAlertData(errorAlert);
    setShowErrorAlert(true);
  };

  // Handle retry for registration
  const handleRetry = () => {
    setShowErrorAlert(false);
    // The form will be resubmitted when the user clicks the button again
  };

  // Helper function to get strength color
  const getStrengthColor = () => {
    switch (passwordStrength.strength) {
      case 'weak': return colors.danger[500];
      case 'fair': return colors.warning[500];
      case 'good': return colors.primary[500];
      case 'strong': return colors.success[500];
      default: return colors.neutral[400];
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
            contentContainerStyle={[commonStyles.px4, commonStyles.py4]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={[commonStyles.itemsCenter, commonStyles.mb8]}>
              <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 80, height: 80, backgroundColor: colors.primary[100], borderRadius: 40 }, commonStyles.mb4]}>
                <Ionicons name="leaf" size={36} color={colors.primary[500]} />
              </View>

              <Text style={[commonStyles.text2xl, commonStyles.fontBold, commonStyles.textPrimary, commonStyles.textCenter, commonStyles.mb2]}>
                Create Account
              </Text>

              <Text style={[commonStyles.textBase, commonStyles.textSecondary, commonStyles.textCenter]}>
                Join us to get started with crop disease detection
              </Text>
            </View>

            {/* Register Form */}
            <Card variant="default" padding="medium" style={{ marginBottom: 16, marginTop: -10 }}>
              <View style={{ gap: 0 }}>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Full Name"
                      placeholder="Enter your full name"
                      value={value}
                      onChangeText={(text) => onChange(text.replace(/[^a-zA-Z\s'-]/g, ''))} // Filter invalid characters
                      onBlur={onBlur}
                      icon="person"
                      returnKeyType="next"
                      error={getFieldError(errors, 'name')}
                      autoCapitalize="words"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Email"
                      placeholder="Enter your email"
                      value={value}
                      onChangeText={(text) => onChange(text.toLowerCase().trim())} // Auto-lowercase and trim
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      icon="mail"
                      returnKeyType="next"
                      error={getFieldError(errors, 'email')}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View>
                      <Input
                        label="Password"
                        placeholder="Enter your password"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry
                        icon="lock-closed"
                        returnKeyType="next"
                        error={getFieldError(errors, 'password')}
                        autoComplete="new-password"
                      />

                      {/* Password Strength Indicator */}
                      {showPasswordStrength && value && (
                        <View style={[commonStyles.mt2, commonStyles.mb2]}>
                          <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.mb2]}>
                            <Text style={[commonStyles.textSm, commonStyles.fontMedium, { color: colors.neutral[600] }]}>
                              Password strength:
                            </Text>
                            <Text style={[commonStyles.textSm, commonStyles.fontMedium, commonStyles.ml1, { color: getStrengthColor() }]}>
                              {passwordStrength.strength.charAt(0).toUpperCase() + passwordStrength.strength.slice(1)}
                            </Text>
                          </View>

                          {/* Strength Progress Bar */}
                          <View style={[commonStyles.flexRow, { gap: 2, marginBottom: 8 }]}>
                            {[1, 2, 3, 4, 5].map((level) => (
                              <View
                                key={level}
                                style={[
                                  commonStyles.flex1,
                                  { height: 4, borderRadius: 2 },
                                  {
                                    backgroundColor: passwordStrength.score >= level
                                      ? getStrengthColor()
                                      : colors.neutral[200]
                                  }
                                ]}
                              />
                            ))}
                          </View>

                          {/* Feedback */}
                          {passwordStrength.feedback.length > 0 && (
                            <Text style={[commonStyles.textXs, { color: colors.neutral[500] }]}>
                              Missing: {passwordStrength.feedback.join(', ')}
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  )}
                />

                <Controller
                  control={control}
                  name="confirm_password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Confirm Password"
                      placeholder="Confirm your password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry
                      icon="lock-closed"
                      returnKeyType="done"
                      error={getFieldError(errors, 'confirm_password')}
                      autoComplete="new-password"
                    />
                  )}
                />
              </View>

              <Controller
                control={control}
                name="user_type"
                render={({ field: { onChange, value } }) => (
                  <View style={[commonStyles.mt2, commonStyles.mb3]}>
                    <Text style={[commonStyles.textSm, commonStyles.fontMedium, commonStyles.textPrimary, commonStyles.mb2]}>
                      I am a:
                    </Text>
                    <View style={[commonStyles.flexRow, { gap: 8 }]}>
                      <TouchableOpacity
                        style={[
                          commonStyles.flex1,
                          commonStyles.py3,
                          commonStyles.px4,
                          commonStyles.roundedLg,
                          commonStyles.itemsCenter,
                          {
                            backgroundColor: value === 'farmer' ? colors.primary[500] : colors.neutral[100],
                            borderWidth: 1,
                            borderColor: value === 'farmer' ? colors.primary[500] : colors.neutral[200],
                          },
                        ]}
                        onPress={() => onChange('farmer')}
                      >
                        <Text style={[
                          commonStyles.fontMedium,
                          { color: value === 'farmer' ? '#ffffff' : colors.neutral[700] },
                        ]}>
                          Farmer
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          commonStyles.flex1,
                          commonStyles.py3,
                          commonStyles.px4,
                          commonStyles.roundedLg,
                          commonStyles.itemsCenter,
                          {
                            backgroundColor: value === 'expert' ? colors.primary[500] : colors.neutral[100],
                            borderWidth: 1,
                            borderColor: value === 'expert' ? colors.primary[500] : colors.neutral[200],
                          },
                        ]}
                        onPress={() => onChange('expert')}
                      >
                        <Text style={[
                          commonStyles.fontMedium,
                          { color: value === 'expert' ? '#ffffff' : colors.neutral[700] },
                        ]}>
                          Expert
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {getFieldError(errors, 'user_type') && (
                      <Text style={[commonStyles.textSm, { color: colors.danger[500] }, commonStyles.mt1]}>
                        {getFieldError(errors, 'user_type')}
                      </Text>
                    )}
                  </View>
                )}
              />



              <Button
                title="Create Account"
                onPress={handleSubmit(onSubmit)}
                variant="primary"
                size="large"
                loading={isLoading}
                disabled={isLoading || hasAnyErrors(errors)}
                icon={<Ionicons name="person-add" size={20} color="#ffffff" />}
              />

              {/* Enhanced Error Display */}
              {error && (
                <View style={[commonStyles.mt3, commonStyles.p3, { backgroundColor: colors.danger[50], borderRadius: 8, borderWidth: 1, borderColor: colors.danger[200] }]}>
                  <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.mb1]}>
                    <Ionicons name="alert-circle" size={16} color={colors.danger[600]} />
                    <Text style={[commonStyles.textSm, commonStyles.fontMedium, { color: colors.danger[600] }, commonStyles.ml1]}>
                      Registration Error
                    </Text>
                  </View>
                  <Text style={[commonStyles.textSm, { color: colors.danger[600] }]}>
                    {createRegistrationErrorAlert(error, { userType, email: watch('email') }).message}
                  </Text>
                  {error.includes('already exists') && (
                    <Text style={[commonStyles.textXs, { color: colors.danger[500] }, commonStyles.mt1]}>
                      Tip: You can also try signing in if you already have an account.
                    </Text>
                  )}
                </View>
              )}

              {/* Form Validation Summary (only show if there are errors and form was submitted) */}
              {hasAnyErrors(errors) && Object.keys(touchedFields).length > 0 && (
                <View style={[commonStyles.mt3, commonStyles.p3, { backgroundColor: colors.warning[50], borderRadius: 8, borderWidth: 1, borderColor: colors.warning[200] }]}>
                  <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.mb1]}>
                    <Ionicons name="warning" size={16} color={colors.warning[600]} />
                    <Text style={[commonStyles.textSm, commonStyles.fontMedium, { color: colors.warning[600] }, commonStyles.ml1]}>
                      Please fix the following errors:
                    </Text>
                  </View>
                  {Object.keys(errors).map((key) => {
                    const errorMessage = getFieldError(errors, key);
                    if (errorMessage) {
                      return (
                        <Text key={key} style={[commonStyles.textSm, { color: colors.warning[600] }, commonStyles.ml4]}>
                          • {errorMessage}
                        </Text>
                      );
                    }
                    return null;
                  })}
                </View>
              )}
            </Card>

            {/* Login Link */}
            <View style={[commonStyles.itemsCenter, commonStyles.mb4]}>
              <Text style={[commonStyles.textSm, commonStyles.textSecondary, commonStyles.textCenter, commonStyles.mb2]}>
                Already have an account? <Text style={[commonStyles.textSm, commonStyles.fontMedium, { color: colors.primary[600] }]} onPress={() => router.push('/(auth)/login')}>Sign In</Text>
              </Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Custom Error Alert */}
      <ErrorAlert
        visible={showErrorAlert}
        title={errorAlertData.title}
        message={errorAlertData.message}
        showRetry={errorAlertData.showRetry}
        onClose={() => setShowErrorAlert(false)}
        onRetry={handleRetry}
        type={errorAlertData.type}
        quickAction={errorAlertData.quickAction}
      />
    </SafeAreaView>
  );
}
