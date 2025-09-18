import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { colors, commonStyles } from '../../../styles';

export default function GalleryPickerScreen() {
  const [permissionStatus, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isPicking, setIsPicking] = useState(false);

  const permissionGranted = useMemo(() => permissionStatus?.granted === true, [permissionStatus]);

  useEffect(() => {
    // Request permission on mount if not determined
    if (!permissionStatus || permissionStatus.status === 'undetermined') {
      requestPermission();
    }
  }, [permissionStatus, requestPermission]);

  const pickImage = useCallback(async () => {
    try {
      setIsPicking(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.9,
      });

      if (!result.canceled && result.assets?.length) {
        setImageUri(result.assets[0].uri);
      }
    } catch (err) {
      console.warn('Image picking failed', err);
    } finally {
      setIsPicking(false);
    }
  }, []);

  const onUseImage = useCallback(() => {
    // TODO: navigate to analysis screen or return image to previous screen
    // For now, just go back after selecting
    router.back();
  }, []);

  return (
    <SafeAreaView style={[commonStyles.flex1, commonStyles.bgNeutral50]}>
      {/* Header */}
      <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.justifyBetween, commonStyles.px4, commonStyles.py3]}>
        <TouchableOpacity accessibilityLabel="Go back" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={colors.neutral[800]} />
        </TouchableOpacity>
        <Text style={[commonStyles.textLg, commonStyles.fontSemibold]}>Choose from Gallery</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={[commonStyles.flex1, commonStyles.px4]}>
        <Card variant="default" padding="large">
          <View style={[commonStyles.itemsCenter]}>
            {imageUri ? (
              <>
                <Image
                  source={{ uri: imageUri }}
                  style={{ width: '100%', height: 240, borderRadius: 12, backgroundColor: colors.neutral[200] }}
                  resizeMode="cover"
                />
                <Text style={[commonStyles.textSm, commonStyles.textSecondary, commonStyles.mt3]}>Image selected. Continue to analyze.</Text>
              </>
            ) : (
              <>
                <View
                  style={{
                    width: '100%',
                    height: 200,
                    borderRadius: 12,
                    backgroundColor: colors.neutral[100],
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: colors.neutral[200],
                  }}
                >
                  {isPicking ? (
                    <ActivityIndicator color={colors.primary[600]} />
                  ) : (
                    <Ionicons name="images" size={48} color={colors.neutral[400]} />
                  )}
                </View>
                <Text style={[commonStyles.textSm, commonStyles.textSecondary, commonStyles.mt3]}>No image selected</Text>
              </>
            )}

            {!permissionGranted && (
              <View style={[commonStyles.mt3]}>
                <Text style={[commonStyles.textSm, { color: colors.danger[600] }]}>Permission to access photos is required.</Text>
              </View>
            )}

            <View style={[commonStyles.mt6, { width: '100%' }]}>
              <Button
                title={imageUri ? 'Choose a Different Image' : 'Pick an Image'}
                onPress={pickImage}
                variant="primary"
                size="large"
                icon={<Ionicons name="images" size={20} color="#fff" />}
                disabled={!permissionGranted || isPicking}
              />
            </View>

            {imageUri && (
              <View style={[commonStyles.mt3, { width: '100%' }]}>
                <Button
                  title="Use This Image"
                  onPress={onUseImage}
                  variant="outline"
                  size="large"
                  icon={<Ionicons name="checkmark" size={20} color={colors.primary[600]} />}
                />
              </View>
            )}
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}
