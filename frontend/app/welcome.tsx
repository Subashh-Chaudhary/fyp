import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAppStore, useAuthStore } from '../src/store';
import { colors, commonStyles } from '../styles';

/**
 * Welcome screen - First-time user onboarding
 * Introduces the app features and guides users through initial setup
 */
export default function WelcomeScreen() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const clearAllData = useAppStore((state) => state.resetApp);

  useEffect(() => {
    // Check if user is already logged in
    if (user) {
      // Use a small delay to ensure navigation is ready
      const timer = setTimeout(() => {
        router.replace('/(tabs)');
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleGetStarted = () => {
    // Navigate to auth group
    router.push('/(auth)/login');
  };

  const features = [
    {
      icon: 'camera',
      title: 'Smart Disease Detection',
      description: 'Upload crop images and get instant disease analysis using AI',
    },
    {
      icon: 'leaf',
      title: 'Expert Recommendations',
      description: 'Receive personalized treatment and prevention advice',
    },
    {
      icon: 'analytics',
      title: 'Track Progress',
      description: 'Monitor your crop health over time with detailed history',
    },
  ];

  return (
    <SafeAreaView style={[commonStyles.flex1, commonStyles.bgNeutral50]}>
      <View style={[commonStyles.flex1, commonStyles.px6, commonStyles.py4]}>
        {/* Header */}
        <View style={[commonStyles.itemsCenter, commonStyles.mb8]}>
          <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 100, height: 100, backgroundColor: colors.primary[100], borderRadius: 50 }, commonStyles.mb6]}>
            <Ionicons name="leaf" size={48} color={colors.primary[500]} />
          </View>

          <Text style={[commonStyles.text3xl, commonStyles.fontBold, commonStyles.textPrimary, commonStyles.textCenter, commonStyles.mb2]}>
            Crop Disease Detection
          </Text>

          <Text style={[commonStyles.textBase, commonStyles.textSecondary, commonStyles.textCenter]}>
            AI-powered crop disease detection and management
          </Text>
        </View>

        {/* Features */}
        <View style={[commonStyles.mb8]}>
          {features.map((feature, index) => (
            <Card key={index} variant="default" padding="medium" style={commonStyles.mb4}>
              <View style={[commonStyles.flexRow, commonStyles.itemsStart]}>
                <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 48, height: 48, backgroundColor: colors.primary[100], borderRadius: 24 }, commonStyles.mr4]}>
                  <Ionicons name={feature.icon as any} size={24} color={colors.primary[500]} />
                </View>

                <View style={commonStyles.flex1}>
                  <Text style={[commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary, commonStyles.mb1]}>
                    {feature.title}
                  </Text>
                  <Text style={[commonStyles.textBase, commonStyles.textSecondary]}>
                    {feature.description}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Get Started Button */}
        <View style={[commonStyles.mb6]}>
          <Button
            title="Get Started"
            onPress={handleGetStarted}
            variant="primary"
            size="large"
            icon={<Ionicons name="arrow-forward" size={20} color="#ffffff" />}
          />
        </View>

        {/* Test Auth Flow Button */}
        <View style={[commonStyles.mb6]}>
          <Button
            title="Test Auth Flow"
            onPress={() => router.push('/(auth)/login')}
            variant="outline"
            size="large"
            icon={<Ionicons name="log-in" size={20} color={colors.primary[500]} />}
          />
        </View>

        {/* Demo Info */}
        <Card variant="outlined" padding="medium">
          <View style={[commonStyles.flexRow, commonStyles.itemsStart]}>
            <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 32, height: 32, backgroundColor: colors.secondary[100], borderRadius: 16, marginRight: 12 }]}>
              <Ionicons name="information-circle" size={16} color={colors.secondary[500]} />
            </View>
            <View style={commonStyles.flex1}>
              <Text style={[commonStyles.textSm, commonStyles.fontMedium, commonStyles.textPrimary, commonStyles.mb1]}>
                Demo Mode
              </Text>
              <Text style={[commonStyles.textXs, commonStyles.textSecondary]}>
                This is a demo version. All data is simulated for demonstration purposes.
              </Text>
            </View>
          </View>
        </Card>

        {/* Development Tools */}
        <Card variant="outlined" padding="medium" style={commonStyles.mt4}>
          <View style={[commonStyles.flexRow, commonStyles.itemsStart, commonStyles.mb3]}>
            <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 32, height: 32, backgroundColor: colors.warning[100], borderRadius: 16, marginRight: 12 }]}>
              <Ionicons name="construct" size={16} color={colors.warning[500]} />
            </View>
            <View style={commonStyles.flex1}>
              <Text style={[commonStyles.textSm, commonStyles.fontMedium, commonStyles.textPrimary, commonStyles.mb1]}>
                Development Tools
              </Text>
              <Text style={[commonStyles.textXs, commonStyles.textSecondary]}>
                Clear data to test authentication flow
              </Text>
            </View>
          </View>

          <View style={[commonStyles.flexRow, { gap: 8 }]}>
            <Button
              title="Clear User"
              onPress={() => {
                setUser(null);
                // Force re-render
                setTimeout(() => {
                  router.replace('/welcome');
                }, 100);
              }}
              variant="outline"
              size="small"
              icon={<Ionicons name="person-remove" size={14} color={colors.warning[500]} />}
              style={{ flex: 1 }}
            />
            <Button
              title="Reset All"
              onPress={() => {
                clearAllData();
                // Force re-render
                setTimeout(() => {
                  router.replace('/welcome');
                }, 100);
              }}
              variant="outline"
              size="small"
              icon={<Ionicons name="refresh" size={14} color={colors.warning[500]} />}
              style={{ flex: 1 }}
            />
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}
