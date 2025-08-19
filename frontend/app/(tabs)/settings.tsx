import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '../../components/ui/Card';
import { useAuth } from '../../src/hooks';
import { colors, commonStyles } from '../../styles';

/**
 * Settings screen - User preferences and account management
 * Provides access to user settings, profile, and logout
 */
export default function SettingsScreen() {
  const { user, logout, isFarmer, isExpert } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfile = () => {
    // TODO: Navigate to profile edit
    console.log('Navigate to profile edit');
  };

  const handleNotifications = () => {
    // TODO: Navigate to notification settings
    console.log('Navigate to notification settings');
  };

  const handlePrivacy = () => {
    // TODO: Navigate to privacy settings
    console.log('Navigate to privacy settings');
  };

  const handleHelp = () => {
    // TODO: Navigate to help/support
    console.log('Navigate to help/support');
  };

  const handleAbout = () => {
    // TODO: Navigate to about page
    console.log('Navigate to about page');
  };

  return (
    <SafeAreaView style={[commonStyles.flex1, commonStyles.bgNeutral50]}>
      <ScrollView
        style={commonStyles.flex1}
        contentContainerStyle={[commonStyles.px6, commonStyles.py4]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[commonStyles.itemsCenter, commonStyles.mb8]}>
          <Text style={[commonStyles.text2xl, commonStyles.fontBold, commonStyles.textPrimary, commonStyles.mb2]}>
            Settings
          </Text>
          <Text style={[commonStyles.textBase, commonStyles.textSecondary, commonStyles.textCenter]}>
            Manage your account and preferences
          </Text>
        </View>

        {/* User Profile Section */}
        <Card variant="default" padding="medium" style={commonStyles.mb6}>
          <TouchableOpacity onPress={handleProfile} style={[commonStyles.flexRow, commonStyles.itemsCenter]}>
            <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 60, height: 60, backgroundColor: colors.primary[100], borderRadius: 30 }, commonStyles.mr4]}>
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
                <View style={[commonStyles.px2, commonStyles.py1, { backgroundColor: colors.primary[100], borderRadius: 12 }]}>
                  <Text style={[commonStyles.textSm, commonStyles.fontMedium, { color: colors.primary[600] }]}>
                    {isFarmer() ? 'Farmer' : isExpert() ? 'Expert' : 'User'}
                  </Text>
                </View>
              </View>
            </View>

            <Ionicons name="chevron-forward" size={20} color={colors.neutral[400]} />
          </TouchableOpacity>
        </Card>

        {/* Settings Options */}
        <View style={commonStyles.mb6}>
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary, commonStyles.mb4]}>
            Preferences
          </Text>

          <Card variant="outlined" padding="none">
            <TouchableOpacity
              style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.justifyBetween, commonStyles.p4, { borderBottomWidth: 1, borderBottomColor: colors.neutral[200] }]}
              onPress={handleNotifications}
            >
              <View style={[commonStyles.flexRow, commonStyles.itemsCenter]}>
                <Ionicons name="notifications-outline" size={20} color={colors.neutral[600]} style={commonStyles.mr3} />
                <Text style={[commonStyles.textBase, commonStyles.textPrimary]}>Notifications</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.neutral[400]} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.justifyBetween, commonStyles.p4, { borderBottomWidth: 1, borderBottomColor: colors.neutral[200] }]}
              onPress={handlePrivacy}
            >
              <View style={[commonStyles.flexRow, commonStyles.itemsCenter]}>
                <Ionicons name="shield-outline" size={20} color={colors.neutral[600]} style={commonStyles.mr3} />
                <Text style={[commonStyles.textBase, commonStyles.textPrimary]}>Privacy & Security</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.neutral[400]} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.justifyBetween, commonStyles.p4]}
              onPress={handleHelp}
            >
              <View style={[commonStyles.flexRow, commonStyles.itemsCenter]}>
                <Ionicons name="help-circle-outline" size={20} color={colors.neutral[600]} style={commonStyles.mr3} />
                <Text style={[commonStyles.textBase, commonStyles.textPrimary]}>Help & Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.neutral[400]} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* App Info */}
        <View style={commonStyles.mb6}>
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary, commonStyles.mb4]}>
            App Information
          </Text>

          <Card variant="outlined" padding="none">
            <TouchableOpacity
              style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.justifyBetween, commonStyles.p4]}
              onPress={handleAbout}
            >
              <View style={[commonStyles.flexRow, commonStyles.itemsCenter]}>
                <Ionicons name="information-circle-outline" size={20} color={colors.neutral[600]} style={commonStyles.mr3} />
                <Text style={[commonStyles.textBase, commonStyles.textPrimary]}>About</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.neutral[400]} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* Logout Button */}
        <View style={commonStyles.mb6}>
          <TouchableOpacity
            style={[
              commonStyles.py4,
              commonStyles.px6,
              { backgroundColor: colors.danger[50], borderRadius: 12, borderWidth: 1, borderColor: colors.danger[200] }
            ]}
            onPress={handleLogout}
          >
            <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.justifyCenter]}>
              <Ionicons name="log-out-outline" size={20} color={colors.danger[600]} style={commonStyles.mr2} />
              <Text style={[commonStyles.textBase, commonStyles.fontMedium, { color: colors.danger[600] }]}>
                Sign Out
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={[commonStyles.itemsCenter]}>
          <Text style={[commonStyles.textSm, commonStyles.textMuted]}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
