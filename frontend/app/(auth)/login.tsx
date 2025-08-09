import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../src/hooks';
import { colors, commonStyles } from '../../styles';

/**
 * Login screen - User authentication
 * Provides email/password login and social authentication
 */
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, isLoading, error } = useAuth();

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      await login({
        email,
        password,
      });
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Invalid email or password');
    }
  };

  const handleSocialAuth = (provider: 'google' | 'facebook') => {
    // TODO: Implement social authentication
    Alert.alert('Coming Soon', `${provider.charAt(0).toUpperCase() + provider.slice(1)} authentication will be available soon!`);
  };

  const handleDemoLogin = () => {
    // TODO: Remove demo login in production
    Alert.alert('Demo Login', 'Demo login functionality will be removed in production');
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
            contentContainerStyle={[commonStyles.px6, commonStyles.py4]}
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
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                icon="mail"
                returnKeyType="next"
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                icon="lock-closed"
                returnKeyType="done"
              />

              <TouchableOpacity
                style={[commonStyles.itemsEnd, commonStyles.mb4]}
                onPress={() => router.push('/(auth)/forgot-password')}
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

              {/* Error Display */}
              {error && (
                <View style={[commonStyles.mt3, commonStyles.p3, { backgroundColor: colors.danger[50], borderRadius: 8, borderWidth: 1, borderColor: colors.danger[200] }]}>
                  <Text style={[commonStyles.textSm, { color: colors.danger[600] }]}>
                    {error}
                  </Text>
                </View>
              )}
            </Card>

            {/* Register Link */}
            <View style={[commonStyles.itemsCenter, commonStyles.mb3]}>
              <Text style={[commonStyles.textSm, commonStyles.textSecondary, commonStyles.textCenter, commonStyles.mb2]}>
                Don&apos;t have an account? <Text style={[commonStyles.textSm, commonStyles.fontMedium, { color: colors.primary[600] }]} onPress={() => router.push('/(auth)/register')}>Create Account</Text>
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
    </SafeAreaView>
  );
}
