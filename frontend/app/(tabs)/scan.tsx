import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AdminUserManagement from '../../components/admin/AdminUserManagement';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuthStore } from '../../src/store/auth.store';
import { TAB_BAR_HEIGHT, colors, commonStyles } from '../../styles';

/**
 * Scan screen - Crop disease scanning functionality
 * Allows users to take photos and scan for diseases
 */
export default function ScanScreen() {
  const user = useAuthStore((s) => s.user);
  const userType = (user?.userType ?? (user as any)?.user_type ?? '').toLowerCase();
  const isAdmin = userType === 'admin';

  if (isAdmin) {
    return <AdminUserManagement />;
  }

  const handleScanCrop = () => {
    // Navigate to scan camera in the stack navigator.
    // Use the group in the path to disambiguate from the tabs group.
    // router.push('/(stack)/scan/camera');
    console.log('Navigating to camera...');
    router.push('/(stack)/scan/camera'); // Try without the (stack) group
    console.log('Navigation attempted');
  };

  const handleChooseFromGallery = () => {
    // Navigate to gallery picker screen inside the stack group
    router.push('/(stack)/gallery/picker');
  };

  return (
    <SafeAreaView style={[commonStyles.flex1, commonStyles.bgNeutral50]}>
      <ScrollView
        contentContainerStyle={[commonStyles.px6, commonStyles.py4, { paddingBottom: TAB_BAR_HEIGHT + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[commonStyles.itemsCenter, commonStyles.mb8]}>
          {/* Icon with subtle ring */}
          <View
            style={[
              commonStyles.itemsCenter,
              commonStyles.justifyCenter,
              {
                width: 112,
                height: 112,
                borderRadius: 56,
                backgroundColor: colors.primary[50],
                borderWidth: 2,
                borderColor: colors.primary[200],
              },
              commonStyles.mb6,
            ]}
          >
            <Ionicons name="scan" size={48} color={colors.primary[600]} />
          </View>

          <Text style={[commonStyles.text2xl, commonStyles.fontBold, commonStyles.textPrimary, commonStyles.textCenter, commonStyles.mb3]}>
            Scan Your Crop
          </Text>

          <Text style={[commonStyles.textBase, commonStyles.textSecondary, commonStyles.textCenter]}>
            Start a scan or import an image to detect crop diseases
          </Text>
        </View>

        {/* Scan Options */}
        <View style={commonStyles.mb4}>
          <Card variant="default" padding="large">
            <View style={[commonStyles.itemsCenter, commonStyles.mb6]}>
              <Text style={[commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary, commonStyles.mb2]}>
                Start a Scan
              </Text>
              <Text style={[commonStyles.textBase, commonStyles.textSecondary, commonStyles.textCenter]}>
                Choose how you want to analyze your crop
              </Text>
            </View>

            <View style={[commonStyles.mb4]}>
              <View style={commonStyles.mb3}>
                <Button
                  title="Scan Crop"
                  onPress={handleScanCrop}
                  variant="primary"
                  size="large"
                  icon={<Ionicons name="scan" size={20} color="#ffffff" />}
                />
              </View>
              <Button
                title="Import from Gallery"
                onPress={handleChooseFromGallery}
                variant="outline"
                size="large"
                icon={<Ionicons name="images" size={20} color={colors.primary[600]} />}
              />
            </View>
          </Card>
        </View>

        {/* Tips */}
        <View>
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary, commonStyles.mb4]}>
            Tips for Better Results
          </Text>

          <Card variant="outlined" padding="medium">
            <View style={[commonStyles.mb1]}>
              <View style={[commonStyles.flexRow, commonStyles.itemsStart]}>
                <View style={[commonStyles.mt2, commonStyles.mr3, { width: 8, height: 8, backgroundColor: colors.primary[500], borderRadius: 4 }]} />
                <Text style={[commonStyles.textSm, { color: colors.neutral[700] }, commonStyles.flex1]}>
                  Ensure good lighting when taking photos
                </Text>
              </View>

              <View style={[commonStyles.flexRow, commonStyles.itemsStart]}>
                <View style={[commonStyles.mt2, commonStyles.mr3, { width: 8, height: 8, backgroundColor: colors.primary[500], borderRadius: 4 }]} />
                <Text style={[commonStyles.textSm, { color: colors.neutral[700] }, commonStyles.flex1]}>
                  Focus on the affected area of the plant
                </Text>
              </View>

              <View style={[commonStyles.flexRow, commonStyles.itemsStart]}>
                <View style={[commonStyles.mt2, commonStyles.mr3, { width: 8, height: 8, backgroundColor: colors.primary[500], borderRadius: 4 }]} />
                <Text style={[commonStyles.textSm, { color: colors.neutral[700] }, commonStyles.flex1]}>
                  Include both healthy and diseased parts for comparison
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
