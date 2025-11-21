import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';
import { Avatar } from '../../../components/ui/Avatar';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { API_ENDPOINTS } from '../../../src/config/api.config';
import { useAuth } from '../../../src/hooks';
import { useUpdateProfile, useUploadAvatar } from '../../../src/hooks/api.hooks';
import { httpClient } from '../../../src/services/http.client';
import { useAuthStore } from '../../../src/store/auth.store';
import { colors, commonStyles } from '../../../styles';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const setUser = useAuthStore((s) => s.setUser);

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [address, setAddress] = useState(user?.address ?? '');
  const [isActive, setIsActive] = useState(!!user?.is_active);
  const [isAdmin, setIsAdmin] = useState(!!user?.is_admin);
  const [refreshing, setRefreshing] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar_url ?? null);

  const initialsName = useMemo(() => (name || user?.name || '').trim(), [name, user?.name]);

  const updateProfile = useUpdateProfile({
    onSuccess: async (updated) => {
      await setUser(updated);
    },
  });

  const uploadAvatar = useUploadAvatar({
    onSuccess: async (data) => {
      if (data?.avatar_url) {
        setAvatarPreview(data.avatar_url);
      }
      if (data?.user) {
        await setUser(data.user);
      } else if (user) {
        await setUser({ ...user, avatar_url: data.avatar_url });
      }
    },
  });

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setAvatarPreview(asset.uri);
      if (user?.id) {
        uploadAvatar.mutate({
          userId: user.id,
          file: { uri: asset.uri, name: asset.fileName || 'avatar.jpg', type: asset.mimeType || 'image/jpeg' },
        });
      }
    }
  };

  const saveChanges = () => {
    if (!user) return;

    updateProfile.mutate({
      id: user.id,
      name,
      email,
      phone: phone || null,
      address: address || null,
      is_active: isActive,
      is_admin: isAdmin,
    });
  };

  const canEditAdmin = !!user?.is_admin;

  const hasChanges = () => {
    return (
      name !== (user?.name ?? '') ||
      email !== (user?.email ?? '') ||
      (phone || '') !== (user?.phone || '') ||
      (address || '') !== (user?.address || '') ||
      isActive !== !!user?.is_active ||
      isAdmin !== !!user?.is_admin
    );
  };

  // Pull-to-refresh handler: refetch user profile from backend
  const onRefresh = useCallback(async () => {
    if (!user?.id) return;
    try {
      setRefreshing(true);
  // Fetch latest user profile (GET /profile)
      const response = await httpClient.get<any>(API_ENDPOINTS.USER.PROFILE, {
        params: { id: user.id },
      });
      const data = (response as any).data ?? response;
      const freshUser = (data?.user as any) ?? data;
      if (freshUser && typeof freshUser === 'object') {
        await setUser({
          ...user,
          ...freshUser,
        });
        // Sync local form state with refreshed data
        setName(freshUser.name ?? user.name);
        setEmail(freshUser.email ?? user.email);
        setPhone(freshUser.phone ?? user.phone);
        setAddress(freshUser.address ?? user.address);
        setIsActive(!!freshUser.is_active);
        setIsAdmin(!!freshUser.is_admin);
        setAvatarPreview(freshUser.avatar_url ?? avatarPreview);
      }
    } catch (e) {
      console.warn('Failed to refresh profile:', e);
    } finally {
      setRefreshing(false);
    }
  }, [user, avatarPreview, setUser]);

  // Auto-fetch latest profile when screen mounts or when user id becomes available
  useEffect(() => {
    if (!user?.id) return;
    // call onRefresh to populate the form with freshest server data
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const userType = (user?.userType ?? (user as any)?.user_type ?? '').toLowerCase();

  const userTypeConfig = userType === 'expert' ? {
    bg: colors.primary[50],
    border: colors.primary[200],
    icon: 'school-outline',
    color: colors.primary[700],
    label: 'Expert',
  } : userType === 'farmer' ? {
    bg: colors.success[50],
    border: colors.success[200],
    icon: 'leaf-outline',
    color: colors.success[700],
    label: 'Farmer',
  } : {
    bg: colors.neutral[100],
    border: colors.neutral[200],
    icon: 'person-outline',
    color: colors.neutral[700],
    label: 'User',
  };

  return (
    <SafeAreaView style={[commonStyles.flex1, { backgroundColor: colors.neutral[50] }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        style={commonStyles.flex1}
      >
        <ScrollView
          contentContainerStyle={[commonStyles.px6, commonStyles.py6]}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary[500]]} tintColor={colors.primary[500]} />}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          contentInsetAdjustmentBehavior="always"
        >
          {/* Header */}
          <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.mb6]}>
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={[commonStyles.p2, { marginRight: 8 }]}>
              <Ionicons name="chevron-back" size={24} color={colors.neutral[800]} />
            </TouchableOpacity>
            <Text style={[commonStyles.textXl, commonStyles.fontBold, { color: colors.neutral[900] }]}>Edit Profile</Text>
          </View>

          {/* Avatar with verified badge below */}
          <View style={[commonStyles.itemsCenter, commonStyles.mb6]}>
            <Avatar uri={avatarPreview} name={initialsName} onEdit={pickImage} loading={uploadAvatar.isPending} />
            <Text style={[commonStyles.textSm, { color: colors.neutral[500], marginTop: 8 }]}>Tap camera to change avatar</Text>
            {/* User type badge */}
            <View
              style={{
                marginTop: 12,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: userTypeConfig.bg,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: userTypeConfig.border,
              }}
            >
              <Ionicons
                name={userTypeConfig.icon as any}
                size={18}
                color={userTypeConfig.color}
              />
              <View style={{ marginLeft: 8 }}>
                <Text
                  style={{
                    color: userTypeConfig.color,
                    fontWeight: '700',
                    fontSize: 14,
                  }}
                >
                  {userTypeConfig.label}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: 4,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: user?.is_verified ? colors.primary[50] : colors.neutral[100],
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: user?.is_verified ? colors.primary[200] : colors.neutral[200],
              }}
            >
              <Ionicons
                name={user?.is_verified ? 'checkmark-circle' : 'alert-circle-outline'}
                size={18}
                color={user?.is_verified ? colors.primary[600] : colors.neutral[600]}
              />
              <Text
                style={{
                  marginLeft: 8,
                  color: user?.is_verified ? colors.primary[700] : colors.neutral[700],
                  fontWeight: '600',
                  fontSize: 14,
                }}
              >
                {user?.is_verified ? 'Verified' : 'Not Verified'}
              </Text>
            </View>
          </View>

          {/* Error / Status Messages */}
          {(updateProfile.error || uploadAvatar.error) && (
            <View style={[commonStyles.roundedLg, commonStyles.mb4, { backgroundColor: colors.danger[50], padding: 12, borderWidth: 1, borderColor: colors.danger[200] }]}>
              <Text style={[commonStyles.textSm, { color: colors.danger[700] }]}> {(updateProfile.error || uploadAvatar.error)?.message}</Text>
            </View>
          )}

          {(updateProfile.isSuccess) && (
            <View style={[commonStyles.roundedLg, commonStyles.mb4, { backgroundColor: colors.primary[50], padding: 12, borderWidth: 1, borderColor: colors.primary[200] }]}>
              <Text style={[commonStyles.textSm, { color: colors.primary[700] }]}>Profile updated successfully.</Text>
            </View>
          )}

          {/* Form */}
          <View style={[commonStyles.roundedXl, { backgroundColor: '#fff', padding: 16, borderWidth: 1, borderColor: colors.neutral[100] }, commonStyles.mb6]}>
            <Input label="Full Name" value={name} onChangeText={setName} placeholder="Your name" icon="person-outline" />
            <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" icon="mail-outline" keyboardType="email-address" autoCapitalize="none" />
            <Input label="Phone" value={phone || ''} onChangeText={setPhone} placeholder="+1 555-555-5555" icon="call-outline" keyboardType="phone-pad" />
            <Input label="Address" value={address || ''} onChangeText={setAddress} placeholder="City, Country" icon="location-outline" />

            {/* Status toggles */}
            <View style={[commonStyles.mt4]}>
              {/* Active */}
              <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.justifyBetween, commonStyles.mb3]}>
                <View>
                  <Text style={[commonStyles.textBase, commonStyles.fontSemibold, { color: colors.neutral[800] }]}>Active</Text>
                  <Text style={[commonStyles.textSm, { color: colors.neutral[500] }]}>Account can sign in and use app</Text>
                </View>
                <Switch
                  value={isActive}
                  onValueChange={setIsActive}
                  trackColor={{ false: colors.neutral[300], true: colors.primary[300] }}
                  thumbColor={isActive ? colors.primary[600] : '#f4f3f4'}
                />
              </View>
            </View>
          </View>

          <Button
            title={updateProfile.isPending ? 'Saving...' : 'Save Changes'}
            onPress={saveChanges}
            loading={updateProfile.isPending}
            disabled={!hasChanges() || updateProfile.isPending}
            style={{ width: '100%' }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
