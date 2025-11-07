import { Ionicons } from '@expo/vector-icons';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Animated, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { API_ENDPOINTS } from '../../../src/config/api.config';
import { httpClient } from '../../../src/services/http.client';
import { useAuthStore } from '../../../src/store/auth.store';
import { colors, commonStyles } from '../../../styles';

interface PredictionResult {
  className: string;
  confidence: number; // 0-1
  disease: string;
  description: string;
  recommended_action: string;
}

export default function ScanCameraScreen() {
  // State reused from analyze screen
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [croppedUri, setCroppedUri] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const user = useAuthStore((s) => s.user);
  const [showDescription, setShowDescription] = useState(true);
  const [showRecommendation, setShowRecommendation] = useState(true);

  const captureImage = useCallback(async () => {
    try {
      setIsCapturing(true);
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        console.warn('Camera permission not granted');
        setIsCapturing(false);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.9,
      });

      if (!result.canceled && result.assets?.length) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        setCroppedUri(null);
        setResult(null);
      }
    } catch (err) {
      console.warn('Camera capture failed', err);
    } finally {
      setIsCapturing(false);
    }
  }, []);
  const cropCenterSquare = useCallback(async () => {
    if (!imageUri) return;
    try {
      setWorking(true);
      const { width, height } = await new Promise<{ width: number; height: number }>((resolve, reject) => {
        Image.getSize(imageUri, (w, h) => resolve({ width: w, height: h }), reject);
      });
      const size = Math.min(width, height);
      const originX = Math.round((width - size) / 2);
      const originY = Math.round((height - size) / 2);
      const manipResult = await manipulateAsync(
        imageUri,
        [
          { crop: { originX, originY, width: size, height: size } },
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
      const filename = uriToSend.split('/').pop() || 'scan.jpg';
      const match = filename.match(/([^?]+)\.(jpg|jpeg|png)$/i);
      const fileType = match ? `image/${match[2] || 'jpeg'}` : 'image/jpeg';
      // @ts-ignore RN FormData file
      formData.append('image_url', { uri: uriToSend, name: filename, type: fileType });
      if (user?.id) formData.append('user_id', user.id);

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

  // Derive a normalized prediction object from whatever backend sends
  const prediction: PredictionResult | null = useMemo(() => {
    if (!result) return null;
    try {
      // Flexible extraction attempts
      const root: any = result;
      const candidate = root?.prediction || root?.data?.prediction || (Array.isArray(root) ? root[0] : root);
      if (!candidate || typeof candidate !== 'object') return null;
      const confidenceRaw = candidate.confidence ?? candidate.score ?? candidate.probability ?? candidate.confidence_score;
      const confidenceNum = typeof confidenceRaw === 'number'
        ? confidenceRaw
        : typeof confidenceRaw === 'string'
          ? parseFloat(confidenceRaw)
          : 0;
      return {
        className: candidate.className || candidate.class || candidate.label || candidate.type || 'Unknown',
        confidence: isFinite(confidenceNum) ? confidenceNum : 0,
        disease: candidate.disease || candidate.className || candidate.class || candidate.label || '—',
        description: candidate.description || root.description || '',
        recommended_action: candidate.recommended_action || candidate.action || candidate.recommendation || '',
      };
    } catch (e) {
      return null;
    }
  }, [result]);

  const confidencePercent = useMemo<number | null>(() => {
    if (!prediction) return null;
    const pct = Math.min(100, Math.max(0, prediction.confidence <= 1 ? prediction.confidence * 100 : prediction.confidence));
    return parseFloat(pct.toFixed(1));
  }, [prediction]);

  // Animated confidence bar
  const confidenceAnim = React.useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const target = confidencePercent ?? 0;
    Animated.timing(confidenceAnim, {
      toValue: target,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [confidencePercent]);

  const confidenceBarWidth = confidenceAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const confidenceColor = useMemo(() => {
    const c = confidencePercent ?? 0;
    if (c >= 80) return colors.success?.[600] || '#16a34a';
    if (c >= 50) return colors.warning?.[600] || '#d97706';
    return colors.danger?.[600] || '#dc2626';
  }, [confidencePercent]);

  return (
    <SafeAreaView style={[commonStyles.flex1, commonStyles.bgNeutral50]}>
      {/* Header */}
      <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.justifyBetween, commonStyles.px4, commonStyles.py3]}>
        <TouchableOpacity accessibilityLabel="Go back" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={colors.neutral[800]} />
        </TouchableOpacity>
        <Text style={[commonStyles.textLg, commonStyles.fontSemibold]}>Scan</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={[commonStyles.px4, commonStyles.py2]}> 
        <Card variant="default" padding="large">
          <View style={[commonStyles.itemsCenter]}>
            {/* Image Preview */}
            {displayUri ? (
              <Image source={{ uri: displayUri }} style={{ width: '100%', height: 320, borderRadius: 12, backgroundColor: colors.neutral[200] }} resizeMode="cover" />
            ) : (
              <View style={{ width: '100%', height: 240, borderRadius: 12, backgroundColor: colors.neutral[100], alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.neutral[200] }}>
                <Ionicons name="scan" size={48} color={colors.neutral[400]} />
                <Text style={[commonStyles.textSm, commonStyles.textSecondary, commonStyles.mt2]}>Capture or choose an image to begin</Text>
              </View>
            )}

            {/* Actions BEFORE prediction */}
            {!prediction && (
              <>
                <View style={[commonStyles.mt6, { width: '100%' }]}> 
                  <Button title={isCapturing ? 'Opening Camera…' : 'Capture Photo'} onPress={captureImage} variant="primary" size="large" icon={<Ionicons name="camera" size={20} color="#fff" />} disabled={isCapturing || working} />
                </View>
                <View style={[commonStyles.mt6, { width: '100%' }]}> 
                  <Button title="Crop Center (Square)" onPress={cropCenterSquare} variant="outline" size="large" disabled={!imageUri || working} />
                </View>
                <View style={[commonStyles.mt3, { width: '100%' }]}> 
                  <Button title="Use Full Image" onPress={useFullImage} variant="outline" size="large" disabled={!imageUri || working} />
                </View>
                <View style={[commonStyles.mt6, { width: '100%' }]}> 
                  <Button title={working ? 'Uploading…' : 'Upload & Scan'} onPress={uploadImage} variant="primary" size="large" icon={<Ionicons name="cloud-upload" size={20} color="#fff" />} disabled={!imageUri || working} />
                </View>
              </>
            )}

            {working && !prediction && (
              <View style={[commonStyles.mt3]}>
                <ActivityIndicator color={colors.primary[600]} />
              </View>
            )}

            {/* Prediction View AFTER upload */}
            {prediction && (
              <View style={[commonStyles.mt6, { width: '100%', alignSelf: 'stretch' }]}> 
                <Text style={[commonStyles.textXl, commonStyles.fontSemibold, commonStyles.mb4]}>Prediction Result</Text>
                <View style={{ width: '100%', gap: 12 }}>
                  {/* Class and Disease Chips */}
                  <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                    <View style={{ paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999, backgroundColor: colors.neutral[100], borderWidth: 1, borderColor: colors.neutral[200] }}>
                      <Text style={[commonStyles.textSm, commonStyles.fontSemibold, { color: colors.neutral[800] }]}>Class: {prediction.className}</Text>
                    </View>
                    <View style={{ paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999, backgroundColor: colors.neutral[100], borderWidth: 1, borderColor: colors.neutral[200] }}>
                      <Text style={[commonStyles.textSm, commonStyles.fontSemibold, { color: colors.neutral[800] }]}>Disease: {prediction.disease}</Text>
                    </View>
                  </View>

                  {/* Confidence with animated bar */}
                  <View style={{ padding: 12, borderRadius: 10, backgroundColor: colors.neutral[100], borderWidth: 1, borderColor: colors.neutral[200] }}>
                    <Text style={[commonStyles.fontSemibold, commonStyles.textSm, { textTransform: 'uppercase', letterSpacing: 0.5, color: colors.neutral[600] }]}>Confidence</Text>
                    <View style={{ marginTop: 8 }}>
                      <View style={{ height: 10, borderRadius: 6, backgroundColor: colors.neutral[200], overflow: 'hidden' }}>
                        <Animated.View style={{ width: confidenceBarWidth, height: '100%', backgroundColor: confidenceColor }} />
                      </View>
                      <Text style={[commonStyles.textSm, commonStyles.mt2, { color: colors.neutral[700] }]}>
                        {confidencePercent != null ? confidencePercent.toFixed(1) : '0.0'}% {confidencePercent != null && (confidencePercent >= 80 ? '(High)' : confidencePercent >= 50 ? '(Medium)' : '(Low)')}
                      </Text>
                    </View>
                  </View>

                  {/* Collapsible Description */}
                  {!!prediction.description && (
                    <View style={{ borderRadius: 10, backgroundColor: colors.neutral[50], borderWidth: 1, borderColor: colors.neutral[200] }}>
                      <TouchableOpacity onPress={() => setShowDescription((s) => !s)} style={{ padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={[commonStyles.fontSemibold, commonStyles.textSm, { textTransform: 'uppercase', letterSpacing: 0.5, color: colors.neutral[600] }]}>Description</Text>
                        <Ionicons name={showDescription ? 'chevron-up' : 'chevron-down'} size={18} color={colors.neutral[600]} />
                      </TouchableOpacity>
                      {showDescription && (
                        <View style={{ paddingHorizontal: 12, paddingBottom: 12 }}>
                          <Text style={[commonStyles.textSm, { color: colors.neutral[700], marginTop: 4 }]}>{prediction.description}</Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Collapsible Recommended Action */}
                  {!!prediction.recommended_action && (
                    <View style={{ borderRadius: 10, backgroundColor: colors.primary[50], borderWidth: 1, borderColor: colors.primary[200] }}>
                      <TouchableOpacity onPress={() => setShowRecommendation((s) => !s)} style={{ padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={[commonStyles.fontSemibold, commonStyles.textSm, { textTransform: 'uppercase', letterSpacing: 0.5, color: colors.primary[700] }]}>Recommended Action</Text>
                        <Ionicons name={showRecommendation ? 'chevron-up' : 'chevron-down'} size={18} color={colors.primary[700]} />
                      </TouchableOpacity>
                      {showRecommendation && (
                        <View style={{ paddingHorizontal: 12, paddingBottom: 12 }}>
                          <Text style={[commonStyles.textSm, { color: colors.primary[800], marginTop: 4 }]}>{prediction.recommended_action}</Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
