import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../src/hooks';
import { colors, commonStyles } from '../../styles';

/**
 * Home/Dashboard screen - Main screen for authenticated users
 * Shows user info, quick actions, and recent activity
 */
export default function HomeScreen() {
  const { user, logout, isFarmer, isExpert } = useAuth();

  const handleScan = () => {
    router.push('/(tabs)/scan');
  };

  const handleHistory = () => {
    router.push('/(tabs)/history');
  };

  const handleSettings = () => {
    router.push('/(tabs)/settings');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <SafeAreaView style={[commonStyles.flex1, commonStyles.bgNeutral50]}>
      <ScrollView
        style={commonStyles.flex1}
        contentContainerStyle={[commonStyles.px6, commonStyles.py4]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[commonStyles.flexRow, commonStyles.justifyBetween, commonStyles.itemsCenter, commonStyles.mb6]}>
          <View>
            <Text style={[commonStyles.text2xl, commonStyles.fontBold, commonStyles.textPrimary]}>
              Welcome back!
            </Text>
            <Text style={[commonStyles.textBase, commonStyles.textSecondary]}>
              {user?.name || 'User'}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            style={[commonStyles.p2, { backgroundColor: colors.danger[100 ], borderRadius: 8 }]}
          >
            <Ionicons name="log-out-outline" size={24} color={colors.danger[600]} />
          </TouchableOpacity>
        </View>

        {/* User Info Card */}
        <Card variant="default" padding="medium" style={commonStyles.mb6}>
          <View style={[commonStyles.flexRow, commonStyles.itemsCenter]}>
            <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 60, height: 60, backgroundColor: colors.primary[100 ], borderRadius: 30 }, commonStyles.mr4]}>
              <Ionicons name="person" size={30} color={colors.primary[500]} />
            </View>

            <View style={commonStyles.flex1}>
              <Text style={[commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary, commonStyles.mb1]}>
                {user?.name || 'User Name'}
              </Text>
              <Text style={[commonStyles.textBase, commonStyles.textSecondary, commonStyles.mb1]}>
                {user?.email || 'user@example.com'}
              </Text>
              <View style={[commonStyles.flexRow, commonStyles.itemsCenter]}>
                <View style={[commonStyles.px2, commonStyles.py1, { backgroundColor: colors.primary[100 ], borderRadius: 12 }]}>
                  <Text style={[commonStyles.textSm, commonStyles.fontMedium, { color: colors.primary[600] }]}>
                    {isFarmer() ? 'Farmer' : isExpert() ? 'Expert' : 'User'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <View style={commonStyles.mb6}>
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary, commonStyles.mb4]}>
            Quick Actions
          </Text>

          <View style={[commonStyles.flexRow, { gap: 12 }]}>
            <TouchableOpacity
              style={[
                commonStyles.flex1,
                commonStyles.itemsCenter,
                commonStyles.justifyCenter,
                commonStyles.py6,
                commonStyles.px4,
                { backgroundColor: colors.primary[100 ], borderRadius: 12 }
              ]}
              onPress={handleScan}
            >
              <Ionicons name="camera" size={32} color={colors.primary[600]} style={commonStyles.mb2} />
              <Text style={[commonStyles.textBase, commonStyles.fontMedium, { color: colors.primary[600] }]}>
                Scan Crop
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                commonStyles.flex1,
                commonStyles.itemsCenter,
                commonStyles.justifyCenter,
                commonStyles.py6,
                commonStyles.px4,
                { backgroundColor: colors.secondary[100 ], borderRadius: 12 }
              ]}
              onPress={handleHistory}
            >
              <Ionicons name="time" size={32} color={colors.secondary[600]} style={commonStyles.mb2} />
              <Text style={[commonStyles.textBase, commonStyles.fontMedium, { color: colors.secondary[600] }]}>
                History
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={commonStyles.mb6}>
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary, commonStyles.mb4]}>
            Recent Activity
          </Text>

          <Card variant="outlined" padding="medium">
            <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.mb3]}>
              <Ionicons name="information-circle" size={20} color={colors.neutral[500]} style={commonStyles.mr3} />
              <Text style={[commonStyles.textBase, commonStyles.textSecondary]}>
                No recent scans found
              </Text>
            </View>
            <Text style={[commonStyles.textSm, commonStyles.textMuted]}>
              Start by scanning your first crop image to see your activity here.
            </Text>
          </Card>
        </View>

        {/* Settings */}
        <View style={commonStyles.mb6}>
          <Button
            title="Settings"
            onPress={handleSettings}
            variant="outline"
            size="medium"
            icon={<Ionicons name="settings-outline" size={20} color={colors.primary[600]} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
