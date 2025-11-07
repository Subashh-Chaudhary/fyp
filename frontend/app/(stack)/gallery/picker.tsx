import { Ionicons } from '@expo/vector-icons';
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

export default function GalleryPickerScreen() {
  const [permissionStatus, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [croppedUri, setCroppedUri] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [isPicking, setIsPicking] = useState(false);
  const [result, setResult] = useState<any>(null);
  const user = useAuthStore((s) => s.user);
  const [showDescription, setShowDescription] = useState(true);
  const [showRecommendation, setShowRecommendation] = useState(true);

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
        const uri = result.assets[0].uri;
        setImageUri(uri);
        setCroppedUri(null);
        setResult(null);
      }
    } catch (err) {
      console.warn('Image picking failed', err);
    } finally {
      setIsPicking(false);
    }
  }, []);

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

  interface PredictionResult {
    className: string;
    confidence: number; // 0-1
    disease: string;
    description: string;
    recommended_action: string;
  }

  const prediction: PredictionResult | null = useMemo(() => {
    if (!result) return null;
    try {
      const root: any = result;
      const candidate = root?.prediction || root?.data?.prediction || (Array.isArray(root) ? root[0] : root);
      if (!candidate || typeof candidate !== 'object') return null;
      const confidenceRaw = candidate.confidence ?? candidate.score ?? candidate.probability ?? candidate.confidence_score;
      const confidenceNum = typeof confidenceRaw === 'number' ? confidenceRaw : typeof confidenceRaw === 'string' ? parseFloat(confidenceRaw) : 0;
      return {
        className: candidate.className || candidate.class || candidate.label || candidate.type || 'Unknown',
        confidence: isFinite(confidenceNum) ? confidenceNum : 0,
        disease: candidate.disease || candidate.className || candidate.class || candidate.label || '—',
        description: candidate.description || root.description || '',
        recommended_action: candidate.recommended_action || candidate.action || candidate.recommendation || '',
      };
    } catch {
      return null;
    }
  }, [result]);

  const confidencePercent = useMemo<number | null>(() => {
    if (!prediction) return null;
    const pct = Math.min(100, Math.max(0, prediction.confidence <= 1 ? prediction.confidence * 100 : prediction.confidence));
    return parseFloat(pct.toFixed(1));
  }, [prediction]);

  const confidenceAnim = React.useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const target = confidencePercent ?? 0;
    Animated.timing(confidenceAnim, { toValue: target, duration: 800, useNativeDriver: false }).start();
  }, [confidencePercent]);
  const confidenceBarWidth = confidenceAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });
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
        <Text style={[commonStyles.textLg, commonStyles.fontSemibold]}>Choose from Gallery</Text>
        <View style={{ width: 28 }} />
      </View>

  <ScrollView contentContainerStyle={[commonStyles.px4, { paddingBottom: 24 }]}>
        <Card variant="default" padding="large">
          <View style={[commonStyles.itemsCenter]}>
            {imageUri ? (
              <>
                <Image
                  source={{ uri: imageUri }}
                  style={{ width: '100%', height: 240, borderRadius: 12, backgroundColor: colors.neutral[200] }}
                  resizeMode="cover"
                />
                {!prediction ? (
                  <Text style={[commonStyles.textSm, commonStyles.textSecondary, commonStyles.mt3]}>Image selected. You can crop or upload for analysis.</Text>
                ) : null}
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

            {/* Primary action: pick image (always visible) */}
            <View style={[commonStyles.mt6, { width: '100%' }]}>
              <Button title={imageUri ? 'Choose a Different Image' : 'Pick an Image'} onPress={pickImage} variant="primary" size="large" icon={<Ionicons name="images" size={20} color="#fff" />} disabled={!permissionGranted || isPicking || working} />
            </View>

            {/* Pre-prediction editing and upload actions */}
            {!!imageUri && !prediction && (
              <>
                <View style={[commonStyles.mt6, { width: '100%' }]}> 
                  <Button title={working ? 'Uploading…' : 'Upload & Scan'} onPress={uploadImage} variant="primary" size="large" icon={<Ionicons name="cloud-upload" size={20} color="#fff" />} disabled={working} />
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
