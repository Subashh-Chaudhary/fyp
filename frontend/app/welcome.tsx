import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../components/ui/Button';
import { colors, commonStyles } from '../styles';

/**
 * Welcome screen - Entry point for unauthenticated users
 * Provides navigation to login and registration
 */
export default function WelcomeScreen() {
  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  const handleRegister = () => {
    router.push('/(auth)/register');
  };

  return (
    <SafeAreaView style={[commonStyles.flex1, commonStyles.bgNeutral50]}>
      <View style={[commonStyles.flex1, commonStyles.justifyCenter, commonStyles.itemsCenter, commonStyles.px6]}>
        {/* App Logo */}
        <View style={[commonStyles.itemsCenter, commonStyles.mb8]}>
          <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 120, height: 120, backgroundColor: colors.primary[100], borderRadius: 60 }, commonStyles.mb6]}>
            <Ionicons name="leaf" size={60} color={colors.primary[500]} />
          </View>

          <Text style={[commonStyles.text3xl, commonStyles.fontBold, commonStyles.textPrimary, commonStyles.textCenter, commonStyles.mb3]}>
            Crop Disease Scanner
          </Text>

          <Text style={[commonStyles.textLg, commonStyles.textSecondary, commonStyles.textCenter]}>
            Identify crop diseases and get expert recommendations with AI-powered scanning technology
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={[commonStyles.mb8]}>
          <Button
            title="Get Started"
            onPress={handleRegister}
            variant="primary"
            size="large"
            icon={<Ionicons name="arrow-forward" size={20} color="#ffffff" />}
            style={commonStyles.mb4}
          />

          <Button
            title="Sign In"
            onPress={handleLogin}
            variant="outline"
            size="large"
            icon={<Ionicons name="log-in" size={20} color={colors.primary[600]} />}
          />
        </View>

        {/* Features */}
        <View style={[commonStyles.mb8]}>
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary, commonStyles.textCenter, commonStyles.mb4]}>
            Key Features
          </Text>

          <View style={[commonStyles.mb3]}>
            <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.mb3]}>
              <Ionicons name="camera" size={20} color={colors.primary[500]} style={commonStyles.mr3} />
              <Text style={[commonStyles.textBase, commonStyles.textSecondary]}>
                Instant disease detection with photo scanning
              </Text>
            </View>

            <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.mb3]}>
              <Ionicons name="medical" size={20} color={colors.primary[500]} style={commonStyles.mr3} />
              <Text style={[commonStyles.textBase, commonStyles.textSecondary]}>
                Expert treatment recommendations
              </Text>
            </View>

            <View style={[commonStyles.flexRow, commonStyles.itemsCenter]}>
              <Ionicons name="people" size={20} color={colors.primary[500]} style={commonStyles.mr3} />
              <Text style={[commonStyles.textBase, commonStyles.textSecondary]}>
                Connect with agricultural experts
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={[commonStyles.itemsCenter]}>
          <Text style={[commonStyles.textSm, commonStyles.textSecondary, commonStyles.textCenter]}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
