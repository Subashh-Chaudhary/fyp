import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';
import { APP_INFO_ITEMS } from '../../constants';
import { useAuth } from '../../src/hooks';
import { colors, commonStyles } from '../../styles';

/**
 * Settings screen - User preferences and account management
 * Provides access to user settings, profile, and logout
 */
export default function SettingsScreen() {
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Profile section handlers
  const handleEditProfile = () => {
    router.push('/(stack)/profile/edit');
  };

  const handleDocuments = () => {
    console.log('Navigate to documents');
  };
  
  // Preferences section handlers
  const handleNotifications = () => {
    console.log('Navigate to notification settings');
  };

  const handleLanguageRegion = () => {
    console.log('Navigate to language & region settings');
  };

  const handleThemeAppearance = () => {
    console.log('Navigate to theme & appearance settings');
  };

  // Privacy & Security section handlers
  const handleChangePassword = () => {
    console.log('Navigate to change password');
  };

  const handleBiometricLogin = () => {
    console.log('Navigate to biometric login settings');
  };

  const handleDeleteAccount = () => {
    console.log('Navigate to delete account');
  };

  // App Information section handlers handled via routes in APP_INFO_ITEMS

  // Map static info keys to local handlers
  const appInfoHandlers: Record<string, () => void> = APP_INFO_ITEMS.reduce((acc, item) => {
    if (item.route) {
      acc[item.key] = () => router.push(item.route as any);
    }
    return acc;
  }, {} as Record<string, () => void>);

  const renderSettingItem = (
    icon: keyof typeof Ionicons.glyphMap,
    title: string,
    subtitle: string,
    onPress: () => void,
    isDestructive: boolean = false
  ) => (
    <TouchableOpacity
      style={[
        commonStyles.flexRow,
        commonStyles.itemsCenter,
        commonStyles.justifyBetween,
        commonStyles.p4,
        {
          backgroundColor: 'white',
          borderRadius: 12,
          marginBottom: 8,
          borderWidth: 1,
          borderColor: isDestructive ? colors.danger[200] : colors.neutral[100],
        }
      ]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.flex1]}>
        <View style={[
          commonStyles.itemsCenter,
          commonStyles.justifyCenter,
          {
            width: 44,
            height: 44,
            backgroundColor: isDestructive ? colors.danger[50] : colors.primary[50],
            borderRadius: 22,
            marginRight: 16,
          }
        ]}>
          <Ionicons
            name={icon}
            size={22}
            color={isDestructive ? colors.danger[500] : colors.primary[500]}
          />
        </View>
        <View style={commonStyles.flex1}>
          <Text style={[
            commonStyles.textBase,
            commonStyles.fontSemibold,
            { color: isDestructive ? colors.danger[700] : colors.neutral[800] }
          ]}>
            {title}
          </Text>
          <Text style={[
            commonStyles.textSm,
            { color: colors.neutral[500], marginTop: 2 }
          ]}>
            {subtitle}
          </Text>
        </View>
      </View>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={colors.neutral[400]}
      />
    </TouchableOpacity>
  );

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={commonStyles.mb8}>
      <Text style={[
        commonStyles.textLg,
        commonStyles.fontBold,
        { color: colors.neutral[800] },
        commonStyles.mb4
      ]}>
        {title}
      </Text>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={[commonStyles.flex1, { backgroundColor: colors.neutral[50] }]}>
      <ScrollView
        style={commonStyles.flex1}
        contentContainerStyle={[commonStyles.px6, commonStyles.py6]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[commonStyles.itemsCenter, commonStyles.mb8]}>
          <Text style={[
            commonStyles.text2xl,
            commonStyles.fontBold,
            { color: colors.neutral[900] },
            commonStyles.mb2
          ]}>
            Settings
          </Text>
          <Text style={[
            commonStyles.textBase,
            { color: colors.neutral[600] },
            commonStyles.textCenter
          ]}>
            Manage your account and preferences
          </Text>
        </View>

        {/* Profile Section */}
        {renderSection('Profile', (
          <>
            {renderSettingItem(
              'person-outline',
              'Edit Profile',
              'Update your personal information',
              handleEditProfile
            )}
            {(user?.userType === 'expert' || (user as any)?.user_type === 'expert') && renderSettingItem(
              'document-outline',
              'Documents',
              'Manage your uploaded documents',
              handleDocuments
            )}
          </>
        ))}

        {/* Preferences Section */}
        {renderSection('Preferences', (
          <>
            {renderSettingItem(
              'notifications-outline',
              'Notifications',
              'Customize notification preferences',
              handleNotifications
            )}
            {renderSettingItem(
              'language-outline',
              'Language & Region',
              'Set your preferred language',
              handleLanguageRegion
            )}
            {renderSettingItem(
              'color-palette-outline',
              'Theme & Appearance',
              'Choose your preferred theme',
              handleThemeAppearance
            )}
          </>
        ))}

        {/* Privacy & Security Section */}
        {renderSection('Privacy & Security', (
          <>
            {renderSettingItem(
              'lock-closed-outline',
              'Change Password',
              'Update your account password',
              handleChangePassword
            )}
            {renderSettingItem(
              'finger-print-outline',
              'Biometric Login',
              'Enable fingerprint or face ID',
              handleBiometricLogin
            )}
            {renderSettingItem(
              'trash-outline',
              'Delete Account',
              'Permanently remove your account',
              handleDeleteAccount,
              true
            )}
          </>
        ))}

        {/* App Information Section */}
        {renderSection('App Information', (
          <>
            {APP_INFO_ITEMS.map((item) => (
              <React.Fragment key={item.key}>
                {renderSettingItem(
                  item.icon as keyof typeof Ionicons.glyphMap,
                  item.title,
                  item.subtitle,
                  appInfoHandlers[item.key]
                )}
              </React.Fragment>
            ))}
          </>
        ))}

        {/* Logout Button */}
        <View style={[commonStyles.mb6, { marginBottom: 70 }]}>
          <TouchableOpacity
            style={[
              commonStyles.py4,
              commonStyles.px6,
              {
                backgroundColor: colors.danger[500],
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
              }
            ]}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <View style={[commonStyles.flexRow, commonStyles.itemsCenter]}>
              <Ionicons name="log-out-outline" size={20} color="white" style={commonStyles.mr2} />
              <Text style={[
                commonStyles.textBase,
                commonStyles.fontSemibold,
                { color: 'white' }
              ]}>
                Sign Out
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
