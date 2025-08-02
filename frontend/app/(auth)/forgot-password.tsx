import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { colors, commonStyles } from '../../styles';

/**
 * Forgot Password screen - Password recovery
 * Allows users to reset their password via email
 */
export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

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
  };

  const handleBackToLogin = () => {
    router.push('/(auth)/login');
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
          <Input
            label="Email"
            placeholder="Enter your email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail"
          />

          <Button
            title="Send Reset Link"
            onPress={handleResetPassword}
            variant="primary"
            size="large"
            loading={isLoading}
            icon={<Ionicons name="mail" size={20} color="#ffffff" />}
          />
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
