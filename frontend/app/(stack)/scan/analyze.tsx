import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { API_ENDPOINTS } from '../../../src/config/api.config';
import { httpClient } from '../../../src/services/http.client';
import { useAuthStore } from '../../../src/store/auth.store';
import { colors, commonStyles } from '../../../styles';


export default function AnalyzeScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const imageParam = (params?.image as string) || null;
  const [imageUri, setImageUri] = useState<string | null>(imageParam);
  const [working, setWorking] = useState(false);
  const [croppedUri, setCroppedUri] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    // If image present in params, set it
    if (imageParam) setImageUri(imageParam);
  }, [imageParam]);

  const cropCenterSquare = useCallback(async () => {
    if (!imageUri) return;
    try {
      setWorking(true);
      // Get image dimensions
      const { width, height } = await new Promise<{ width: number; height: number }>((resolve, reject) => {
        Image.getSize(imageUri, (w, h) => resolve({ width: w, height: h }), reject);
      });

      const size = Math.min(width, height);
      const originX = Math.round((width - size) / 2);
      const originY = Math.round((height - size) / 2);

      const manipResult = await manipulateAsync(
        imageUri,
        [
          {
            crop: {
              originX,
              originY,
              width: size,
              height: size,
            },
          },
        ],
        { compress: 0.9, format: SaveFormat.JPEG }
      );

      setCroppedUri(manipResult.uri);
    } catch (err) {
      console.warn('Crop failed', err);
    } finally {
      setWorking(false);
    }
  }, [imageUri]);

  const useFullImage = useCallback(() => {
    setCroppedUri(imageUri);
  }, [imageUri]);

  const uploadImage = useCallback(async () => {
    const uriToSend = croppedUri || imageUri;
    if (!uriToSend) return;

    try {
      setWorking(true);
      setResult(null);

      const formData = new FormData();
      // Extract filename
      const filename = uriToSend.split('/').pop() || 'scan.jpg';
      const match = filename.match(/([^?]+)\.(jpg|jpeg|png)$/i);
      const fileType = match ? `image/${match[2] || 'jpeg'}` : 'image/jpeg';

      // @ts-ignore - FormData file
      formData.append('image_url', {
        uri: uriToSend,
        name: filename,
        type: fileType,
      });

      if (user?.id) {
        formData.append('user_id', user.id);
      }

      const response = await httpClient.post<any>(API_ENDPOINTS.CROPS.LIST, formData as any, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });

      setResult(response);
    } catch (err) {
      console.error('Upload failed', err);
      setResult({ error: err instanceof Error ? err.message : String(err) });
    } finally {
      setWorking(false);
    }
  }, [croppedUri, imageUri, user]);

  const displayUri = croppedUri || imageUri;

  return (
    <SafeAreaView style={[commonStyles.flex1, commonStyles.bgNeutral50]}>
      <ScrollView contentContainerStyle={[commonStyles.px4, commonStyles.py4]}>
        <View style={[commonStyles.mb6]}>
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold]}>Analyze Image</Text>
          <Text style={[commonStyles.textSm, commonStyles.textSecondary, commonStyles.mt2]}>Crop and upload the image for ML analysis.</Text>
        </View>

        <Card variant="default" padding="large">
          <View style={[commonStyles.itemsCenter]}>
            {displayUri ? (
              <Image source={{ uri: displayUri }} style={{ width: '100%', height: 320, borderRadius: 12, backgroundColor: colors.neutral[200] }} resizeMode="cover" />
            ) : (
              <View style={{ width: '100%', height: 320, borderRadius: 12, backgroundColor: colors.neutral[100], alignItems: 'center', justifyContent: 'center' }}>
                <Text style={[commonStyles.textSm, commonStyles.textSecondary]}>No image available</Text>
              </View>
            )}

            <View style={[commonStyles.mt4, { width: '100%' }]}>
              <Button title="Crop Center (Square)" onPress={cropCenterSquare} variant="outline" size="large" />
            </View>

            <View style={[commonStyles.mt3, { width: '100%' }]}>
              <Button title="Use Full Image" onPress={useFullImage} variant="outline" size="large" />
            </View>

            <View style={[commonStyles.mt6, { width: '100%' }]}>
              <Button title={working ? 'Uploading...' : 'Upload & Scan'} onPress={uploadImage} variant="primary" size="large" disabled={working || !imageUri} />
            </View>

            {working && (
              <View style={[commonStyles.mt3]}>
                <ActivityIndicator color={colors.primary[600]} />
              </View>
            )}

            {result && (
              <View style={[commonStyles.mt4, { width: '100%' }]}> 
                <Text style={[commonStyles.fontSemibold, commonStyles.textBase, commonStyles.mb2]}>Result</Text>
                <Text style={[commonStyles.textSm, { color: colors.neutral[700] }]}>{JSON.stringify(result, null, 2)}</Text>
              </View>
            )}

            <View style={[commonStyles.mt4, { width: '100%' }]}> 
              <Button title="Back" onPress={() => router.back()} variant="outline" size="medium" />
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
