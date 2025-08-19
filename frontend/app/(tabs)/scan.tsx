import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { colors, commonStyles } from '../../styles';

/**
 * Scan screen - Crop disease scanning functionality
 * Allows users to take photos and scan for diseases
 */
export default function ScanScreen() {
  const handleTakePhoto = () => {
    // TODO: Implement camera functionality
    console.log('Take photo');
  };

  const handleChooseFromGallery = () => {
    // TODO: Implement gallery picker
    console.log('Choose from gallery');
  };

  return (
    <SafeAreaView style={[commonStyles.flex1, commonStyles.bgNeutral50]}>
      <View style={[commonStyles.flex1, commonStyles.px6, commonStyles.py4]}>
        {/* Header */}
        <View style={[commonStyles.itemsCenter, commonStyles.mb8]}>
          <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 100, height: 100, backgroundColor: colors.primary[100], borderRadius: 50 }, commonStyles.mb6]}>
            <Ionicons name="camera" size={48} color={colors.primary[500]} />
          </View>

          <Text style={[commonStyles.text2xl, commonStyles.fontBold, commonStyles.textPrimary, commonStyles.textCenter, commonStyles.mb3]}>
            Scan Your Crop
          </Text>

          <Text style={[commonStyles.textBase, commonStyles.textSecondary, commonStyles.textCenter]}>
            Take a photo or choose from gallery to detect crop diseases
          </Text>
        </View>

        {/* Scan Options */}
        <View style={commonStyles.mb8}>
          <Card variant="default" padding="large">
            <View style={[commonStyles.itemsCenter, commonStyles.mb6]}>
              <Text style={[commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary, commonStyles.mb2]}>
                Choose Scan Method
              </Text>
              <Text style={[commonStyles.textBase, commonStyles.textSecondary, commonStyles.textCenter]}>
                Select how you want to scan your crop
              </Text>
            </View>

            <View style={[commonStyles.mb4]}>
              <Button
                title="Take Photo"
                onPress={handleTakePhoto}
                variant="primary"
                size="large"
                icon={<Ionicons name="camera" size={20} color="#ffffff" />}
              />

              <Button
                title="Choose from Gallery"
                onPress={handleChooseFromGallery}
                variant="outline"
                size="large"
                icon={<Ionicons name="images" size={20} color={colors.primary[600]} />}
              />
            </View>
          </Card>
        </View>

        {/* Tips */}
        <View style={commonStyles.mb6}>
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary, commonStyles.mb4]}>
            Tips for Better Results
          </Text>

          <Card variant="outlined" padding="medium">
            <View style={[commonStyles.mb3]}>
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

        {/* Coming Soon */}
        <Card variant="outlined" padding="medium">
          <View style={[commonStyles.itemsCenter]}>
            <Ionicons name="information-circle" size={32} color={colors.neutral[400]} style={commonStyles.mb3} />
            <Text style={[commonStyles.textBase, commonStyles.fontMedium, { color: colors.neutral[700] }, commonStyles.mb2]}>
              Coming Soon
            </Text>
            <Text style={[commonStyles.textSm, commonStyles.textSecondary, commonStyles.textCenter]}>
              Advanced scanning features including real-time analysis and disease tracking will be available soon.
            </Text>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}
