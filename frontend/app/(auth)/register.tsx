import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useAppStore } from '../../store';
import { colors, commonStyles } from '../../styles';

/**
 * Register screen - User registration
 * Provides email/password registration with user type selection
 */
export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<'farmer' | 'expert'>('farmer');
  const [isLoading, setIsLoading] = useState(false);

  const setUser = useAppStore((state) => state.setUser);

  const handleEmailAuth = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        userType,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUser(newUser);
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  const handleSocialAuth = (provider: 'google' | 'facebook') => {
    setIsLoading(true);

    // Simulate social authentication
    setTimeout(() => {
      const newUser = {
        id: Date.now().toString(),
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        email: `${provider}@example.com`,
        userType: 'farmer' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUser(newUser);
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 1500);
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
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={name}
                  onChangeText={setName}
                  icon="person"
                  returnKeyType="next"
                />

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
                  returnKeyType="next"
                />

                <Input
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  icon="lock-closed"
                  returnKeyType="done"
                />
              </View>

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
                        backgroundColor: userType === 'farmer' ? colors.primary[500] : colors.neutral[100],
                        borderWidth: 1,
                        borderColor: userType === 'farmer' ? colors.primary[500] : colors.neutral[200],
                      },
                    ]}
                    onPress={() => setUserType('farmer')}
                  >
                    <Text style={[
                      commonStyles.fontMedium,
                      { color: userType === 'farmer' ? '#ffffff' : colors.neutral[700] },
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
                        backgroundColor: userType === 'expert' ? colors.primary[500] : colors.neutral[100],
                        borderWidth: 1,
                        borderColor: userType === 'expert' ? colors.primary[500] : colors.neutral[200],
                      },
                    ]}
                    onPress={() => setUserType('expert')}
                  >
                    <Text style={[
                      commonStyles.fontMedium,
                      { color: userType === 'expert' ? '#ffffff' : colors.neutral[700] },
                    ]}>
                      Expert
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Button
                title="Create Account"
                onPress={handleEmailAuth}
                variant="primary"
                size="large"
                loading={isLoading}
                icon={<Ionicons name="person-add" size={20} color="#ffffff" />}
              />
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
    </SafeAreaView>
  );
}
