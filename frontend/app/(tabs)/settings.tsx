import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAppStore } from '../../store';
import { colors, commonStyles, TAB_BAR_HEIGHT } from '../../styles';

/**
 * Settings tab screen - User preferences and account management
 * Provides theme switching, notifications, and account settings
 */
export default function SettingsScreen() {
  const { user, logout, theme, toggleTheme, setUser, clearAllData } = useAppStore((state) => ({
    user: state.user,
    logout: state.logout,
    theme: state.theme,
    toggleTheme: state.toggleTheme,
    setUser: state.setUser,
    clearAllData: state.clearAllData,
  }));

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/welcome');
          }
        },
      ]
    );
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: 'person',
          title: 'Profile',
          subtitle: user?.name || 'User',
          action: 'chevron-forward',
          onPress: () => {},
        },
        {
          icon: 'mail',
          title: 'Email',
          subtitle: user?.email || 'user@example.com',
          action: 'chevron-forward',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: 'moon',
          title: 'Dark Mode',
          subtitle: theme === 'dark' ? 'Enabled' : 'Disabled',
          action: 'switch',
          value: theme === 'dark',
          onPress: toggleTheme,
        },
        {
          icon: 'notifications',
          title: 'Notifications',
          subtitle: 'Scan reminders and updates',
          action: 'chevron-forward',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'App',
      items: [
        {
          icon: 'information-circle',
          title: 'About',
          subtitle: 'Version 1.0.0',
          action: 'chevron-forward',
          onPress: () => {},
        },
        {
          icon: 'help-circle',
          title: 'Help & Support',
          subtitle: 'Get help and contact support',
          action: 'chevron-forward',
          onPress: () => {},
        },
        {
          icon: 'document-text',
          title: 'Privacy Policy',
          subtitle: 'Read our privacy policy',
          action: 'chevron-forward',
          onPress: () => {},
        },
      ],
    },
  ];

  const renderSettingItem = (item: any) => (
    <TouchableOpacity
      key={item.title}
      onPress={item.onPress}
      style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.justifyBetween, commonStyles.py3]}
    >
      <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.flex1]}>
        <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 40, height: 40, backgroundColor: colors.neutral[100], borderRadius: 20 }, commonStyles.mr3]}>
          <Ionicons name={item.icon as any} size={20} color={colors.neutral[600]} />
        </View>

        <View style={commonStyles.flex1}>
          <Text style={[commonStyles.textBase, commonStyles.fontMedium, commonStyles.textPrimary]}>
            {item.title}
          </Text>
          <Text style={[commonStyles.textSm, commonStyles.textSecondary]}>
            {item.subtitle}
          </Text>
        </View>
      </View>

      {item.action === 'switch' ? (
        <Switch
          value={item.value}
          onValueChange={item.onPress}
          trackColor={{ false: colors.neutral[300], true: colors.primary[300] }}
          thumbColor={item.value ? colors.primary[500] : colors.neutral[400]}
        />
      ) : (
        <Ionicons name={item.action as any} size={20} color={colors.neutral[400]} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[commonStyles.flex1, commonStyles.bgNeutral50]}>
      <ScrollView
        style={commonStyles.flex1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT }}
      >
        <View style={[commonStyles.px6, commonStyles.py4]}>
          {/* Header */}
          <View style={[commonStyles.mb6]}>
            <Text style={[commonStyles.text2xl, commonStyles.fontBold, commonStyles.textPrimary, commonStyles.mb2]}>
              Settings
            </Text>
            <Text style={[commonStyles.textBase, commonStyles.textSecondary]}>
              Manage your account and preferences
            </Text>
          </View>

          {/* Settings Sections */}
          {settingsSections.map((section) => (
            <Card key={section.title} variant="default" padding="medium" style={commonStyles.mb4}>
              <Text style={[commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary, commonStyles.mb3]}>
                {section.title}
              </Text>

              <View style={{ gap: 8 }}>
                {section.items.map(renderSettingItem)}
              </View>
            </Card>
          ))}

          {/* Development Tools */}
          <View style={[commonStyles.mt6]}>
            <Card variant="outlined" padding="medium" style={commonStyles.mb4}>
              <View style={[commonStyles.flexRow, commonStyles.itemsStart, commonStyles.mb4]}>
                <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 40, height: 40, backgroundColor: colors.warning[100], borderRadius: 20 }, commonStyles.mr3]}>
                  <Ionicons name="construct" size={20} color={colors.warning[500]} />
                </View>
                <View style={commonStyles.flex1}>
                  <Text style={[commonStyles.textBase, commonStyles.fontSemibold, commonStyles.textPrimary, commonStyles.mb1]}>
                    Development Tools
                  </Text>
                  <Text style={[commonStyles.textSm, commonStyles.textSecondary]}>
                    Clear user data to test authentication flow
                  </Text>
                </View>
              </View>

              <View style={[commonStyles.flexRow, { gap: 12 }]}>
                <Button
                  title="Clear User"
                  onPress={() => {
                    Alert.alert(
                      'Clear User Data',
                      'This will clear all user data and redirect you to the welcome screen. Are you sure?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Clear',
                          style: 'destructive',
                          onPress: () => {
                            setUser(null);
                            router.replace('/welcome');
                          }
                        },
                      ]
                    );
                  }}
                  variant="outline"
                  size="medium"
                  icon={<Ionicons name="trash" size={16} color={colors.warning[500]} />}
                  style={{ flex: 1 }}
                />
                <Button
                  title="Reset App"
                  onPress={() => {
                    Alert.alert(
                      'Reset App',
                      'This will clear all data and reset the app to initial state. Are you sure?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Reset',
                          style: 'destructive',
                          onPress: () => {
                            clearAllData();
                            router.replace('/welcome');
                          }
                        },
                      ]
                    );
                  }}
                  variant="outline"
                  size="medium"
                  icon={<Ionicons name="refresh" size={16} color={colors.warning[500]} />}
                  style={{ flex: 1 }}
                />
              </View>
            </Card>

            {/* Profile Card */}
            <Card variant="default" padding="large" style={commonStyles.mb4}>
              <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.mb4]}>
                <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 60, height: 60, backgroundColor: colors.primary[100], borderRadius: 30 }, commonStyles.mr4]}>
                  <Ionicons name="person" size={28} color={colors.primary[500]} />
                </View>

                <View style={commonStyles.flex1}>
                  <Text style={[commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary, commonStyles.mb1]}>
                    {user?.name || 'Demo User'}
                  </Text>
                  <Text style={[commonStyles.textBase, commonStyles.textSecondary, commonStyles.mb1]}>
                    {user?.email || 'demo@example.com'}
                  </Text>
                  <View style={[commonStyles.px2, commonStyles.py1, { backgroundColor: colors.primary[100], borderRadius: 9999, alignSelf: 'flex-start' }]}>
                    <Text style={[commonStyles.textXs, commonStyles.fontMedium, { color: colors.primary[700] }]}>
                      {user?.userType === 'farmer' ? 'Farmer' : 'Expert'}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={[commonStyles.flexRow, { gap: 12 }]}>
                <Button
                  title="Edit Profile"
                  onPress={() => {}}
                  variant="outline"
                  size="medium"
                  icon={<Ionicons name="pencil" size={16} color={colors.primary[500]} />}
                  style={{ flex: 1 }}
                />
                <Button
                  title="View History"
                  onPress={() => {}}
                  variant="outline"
                  size="medium"
                  icon={<Ionicons name="time" size={16} color={colors.primary[500]} />}
                  style={{ flex: 1 }}
                />
              </View>
            </Card>

            {/* Logout Section */}
            <Card variant="outlined" padding="medium">
              <View style={[commonStyles.flexRow, commonStyles.itemsStart, commonStyles.mb4]}>
                <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 40, height: 40, backgroundColor: colors.danger[100], borderRadius: 20 }, commonStyles.mr3]}>
                  <Ionicons name="log-out" size={20} color={colors.danger[500]} />
                </View>
                <View style={commonStyles.flex1}>
                  <Text style={[commonStyles.textBase, commonStyles.fontSemibold, commonStyles.textPrimary, commonStyles.mb1]}>
                    Sign Out
                  </Text>
                  <Text style={[commonStyles.textSm, commonStyles.textSecondary]}>
                    You&apos;ll need to sign in again to access your account
                  </Text>
                </View>
              </View>

              <Button
                title="Sign Out"
                onPress={handleLogout}
                variant="danger"
                size="large"
                icon={<Ionicons name="log-out" size={20} color="#ffffff" />}
              />
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
