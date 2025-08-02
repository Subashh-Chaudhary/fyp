import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAppStore } from '../../store';
import { colors, commonStyles, TAB_BAR_HEIGHT } from '../../styles';

/**
 * Scan tab screen - Allows users to capture or select images for disease detection
 * Provides camera and gallery access for crop image analysis
 */
export default function ScanScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const addScanToHistory = useAppStore((state) => state.addScanToHistory);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant camera roll permissions to select images.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const processImage = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      const mockResult = {
        id: Date.now().toString(),
        imageUrl: selectedImage,
        cropId: 'Tomato',
        confidence: 0.85,
        status: 'completed' as const,
        createdAt: new Date(),
        analysis: {
          detectedDiseases: [
            {
              name: 'Early Blight',
              confidence: 0.85,
              severity: 'high'
            }
          ],
          recommendations: [
            'Remove infected leaves immediately',
            'Improve air circulation around plants',
            'Apply fungicide treatment',
          ]
        }
      };

      addScanToHistory(mockResult);
      setSelectedImage(null);
      setIsProcessing(false);

      Alert.alert(
        'Analysis Complete',
        `Detected: ${mockResult.analysis.detectedDiseases[0].name} (${Math.round(mockResult.confidence * 100)}% confidence)`,
        [{ text: 'OK' }]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={[commonStyles.flex1, commonStyles.bgNeutral50]}>
      <View style={[commonStyles.flex1, commonStyles.px6, commonStyles.py4, { paddingBottom: TAB_BAR_HEIGHT }]}>
        {/* Header */}
        <View style={[commonStyles.mb6]}>
          <Text style={[commonStyles.text2xl, commonStyles.fontBold, commonStyles.textPrimary, commonStyles.mb2]}>
            Scan Crop
          </Text>
          <Text style={[commonStyles.textBase, commonStyles.textSecondary]}>
            Take a photo or select an image to detect crop diseases
          </Text>
        </View>

        {/* Image Preview */}
        {selectedImage ? (
          <Card variant="default" padding="medium" style={commonStyles.mb6}>
            <View style={commonStyles.itemsCenter}>
              <Image
                source={{ uri: selectedImage }}
                style={[{ width: '100%', height: 200, borderRadius: 12 }, commonStyles.mb4]}
                resizeMode="cover"
              />
              <View style={[commonStyles.flexRow, { gap: 12 }]}>
                <Button
                  title="Retake"
                  onPress={() => setSelectedImage(null)}
                  variant="outline"
                  size="medium"
                />
                <Button
                  title="Analyze"
                  onPress={processImage}
                  variant="primary"
                  size="medium"
                  loading={isProcessing}
                />
              </View>
            </View>
          </Card>
        ) : (
          /* Image Selection Options */
          <View style={[commonStyles.flex1, commonStyles.justifyCenter]}>
            <Card variant="default" padding="large">
              <View style={commonStyles.itemsCenter}>
                <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 80, height: 80, backgroundColor: colors.primary[100], borderRadius: 40 }, commonStyles.mb6]}>
                  <Ionicons name="camera" size={40} color={colors.primary[500]} />
                </View>

                <Text style={[commonStyles.textXl, commonStyles.fontBold, commonStyles.textPrimary, commonStyles.textCenter, commonStyles.mb2]}>
                  Select Image
                </Text>

                <Text style={[commonStyles.textBase, commonStyles.textSecondary, commonStyles.textCenter, commonStyles.mb6]}>
                  Choose an image from your gallery to analyze for crop diseases
                </Text>

                <Button
                  title="Choose from Gallery"
                  onPress={pickImage}
                  variant="primary"
                  size="large"
                  icon={<Ionicons name="images" size={20} color="#ffffff" />}
                />
              </View>
            </Card>
          </View>
        )}

        {/* Tips Section */}
        <Card variant="outlined" padding="medium">
          <View style={[commonStyles.flexRow, commonStyles.itemsStart]}>
            <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 32, height: 32, backgroundColor: colors.secondary[100], borderRadius: 16, marginRight: 12 }]}>
              <Ionicons name="bulb" size={16} color={colors.secondary[500]} />
            </View>
            <View style={commonStyles.flex1}>
              <Text style={[commonStyles.textSm, commonStyles.fontMedium, commonStyles.textPrimary, commonStyles.mb1]}>
                Tips for Better Results
              </Text>
              <Text style={[commonStyles.textXs, commonStyles.textSecondary]}>
                • Ensure good lighting • Focus on affected areas • Include both healthy and diseased parts
              </Text>
            </View>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}
