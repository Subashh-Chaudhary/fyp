import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '../../components/ui/Card';
import { TAB_BAR_HEIGHT, colors, commonStyles } from '../../styles';

// (removed Sparkline in favor of MiniLineChart)

// (removed chart components as they are no longer used)

export default function HomeScreen() {
  const heroHeight = Math.min(350, Math.max(360, Dimensions.get('window').height * 0.6));
  return (
    <SafeAreaView style={[commonStyles.flex1, commonStyles.bgNeutral50]}>
      <ScrollView
        style={commonStyles.flex1}
        contentContainerStyle={[commonStyles.px6, commonStyles.py3, { paddingBottom: TAB_BAR_HEIGHT }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Clean top header with system title */}
        <View style={[commonStyles.mb2, { paddingVertical: 8 }]}>
          <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.mb2]}>
            <View style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: colors.primary[100], alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
              <Ionicons name="leaf" size={20} color={colors.primary[600]} />
            </View>
            <Text style={[commonStyles.textLg, commonStyles.fontBold, commonStyles.textPrimary]}>Crop Disease Detection System</Text>
          </View>
        </View>

        {/* Immersive hero: split layout (left text, right image) with full height */}
        <View style={{ borderRadius: 10, overflow: 'hidden', marginBottom: 24, backgroundColor: '#fff' }}>
          <View style={{ flexDirection: 'row', height: heroHeight }}>
            <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
              <Text style={[commonStyles.text2xl, commonStyles.fontBold, commonStyles.textPrimary, { lineHeight: 30 }]}>Protect Your Crops,{"\n"}Secure Your Harvest</Text>
              <Text style={[commonStyles.textSm, commonStyles.textSecondary, { marginTop: 6 }]}>AI-powered detection. Clear treatment and prevention guidance.</Text>
            </View>
            <View style={{ flex: 1.2 }}>
              <Image
                source={{ uri: 'https://cropnuts.com/wp-content/uploads/2024/10/1.png' }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        {/* Small helper for subtle section headers */}
        {/** We keep headings minimal and elegant to maintain fluent layout **/}
        {/** Features **/}
        <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.mb3]}>
          <View style={{ width: 4, height: 18, backgroundColor: colors.primary[500], borderRadius: 2, marginRight: 8 }} />
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary]}>Features</Text>
        </View>

        {/* Overview (no label) */}
        <Card variant="default" padding="medium" style={commonStyles.mb6}>
          <Text style={[commonStyles.textBase, commonStyles.textSecondary, commonStyles.mb3]}>
            Upload crop images to detect possible diseases and get treatment suggestions with prevention tips.
          </Text>
          <View style={{ rowGap: 8 }}>
            <View style={[commonStyles.flexRow, commonStyles.itemsCenter]}>
              <Ionicons name="cloud-upload-outline" size={18} color={colors.primary[600]} style={commonStyles.mr2} />
              <Text style={[commonStyles.textSm, commonStyles.textPrimary]}>Upload crop images</Text>
            </View>
            <View style={[commonStyles.flexRow, commonStyles.itemsCenter]}>
              <Ionicons name="search-outline" size={18} color={colors.primary[600]} style={commonStyles.mr2} />
              <Text style={[commonStyles.textSm, commonStyles.textPrimary]}>Detect possible diseases</Text>
            </View>
            <View style={[commonStyles.flexRow, commonStyles.itemsCenter]}>
              <Ionicons name="medkit-outline" size={18} color={colors.primary[600]} style={commonStyles.mr2} />
              <Text style={[commonStyles.textSm, commonStyles.textPrimary]}>Get treatment and prevention tips</Text>
            </View>
          </View>
        </Card>

        {/* Features */}
        <View style={commonStyles.mb6}>
          <View style={{ gap: 12 }}>
            <View style={[commonStyles.flexRow]}>
              <Card variant="outlined" padding="medium" style={{ flex: 1, marginRight: 8 }}>
                <View style={{ minHeight: 132, justifyContent: 'space-between' }}>
                  <View>
                    <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.mb2]}>
                      <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 36, height: 36, borderRadius: 8, backgroundColor: colors.primary[100] }, commonStyles.mr2]}>
                        <Ionicons name="camera" size={18} color={colors.primary[600]} />
                      </View>
                      <Text style={[commonStyles.textBase, commonStyles.fontSemibold, commonStyles.textPrimary]}>Image-based detection</Text>
                    </View>
                    <Text style={[commonStyles.textSm, commonStyles.textSecondary]}>
                      Capture or upload a crop image to instantly analyze plant health.
                    </Text>
                  </View>
                  <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: colors.primary[50], alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name="camera" size={26} color={colors.primary[600]} />
                    </View>
                  </View>
                </View>
              </Card>

              <Card variant="outlined" padding="medium" style={{ flex: 1, marginLeft: 8 }}>
                <View style={{ minHeight: 132, justifyContent: 'space-between' }}>
                  <View style={{ overflow: 'hidden' }}>
                    <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.mb2]}>
                      <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 36, height: 36, borderRadius: 8, backgroundColor: colors.secondary[100] }, commonStyles.mr2]}>
                        <Ionicons name="analytics-outline" size={18} color={colors.secondary[700]} />
                      </View>
                      <Text style={[commonStyles.textBase, commonStyles.fontSemibold, commonStyles.textPrimary, { flexShrink: 1 }]}>Insights & trends</Text>
                    </View>
                    <Text style={[commonStyles.textSm, commonStyles.textSecondary]}>
                      Track disease patterns and crop health over time with clear visuals.
                    </Text>
                  </View>
                  <View style={{ marginTop: 8, width: 125, height: 48, position: 'relative', justifyContent: 'center' }}>
                    <Text style={[commonStyles.textXs, commonStyles.textSecondary]}>View detailed analytics</Text>
                  </View>
                </View>
              </Card>
            </View>

            <View style={[commonStyles.flexRow]}>
              <Card variant="outlined" padding="medium" style={{ flex: 1, marginRight: 8 }}>
                <View style={{ minHeight: 132, justifyContent: 'space-between' }}>
                  <View>
                    <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.mb2]}>
                      <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 36, height: 36, borderRadius: 8, backgroundColor: colors.success[100] }, commonStyles.mr2]}>
                        <Ionicons name="leaf-outline" size={18} color={colors.success[700]} />
                      </View>
                      <Text style={[commonStyles.textBase, commonStyles.fontSemibold, commonStyles.textPrimary]}>Treatments & prevention</Text>
                    </View>
                    <Text style={[commonStyles.textSm, commonStyles.textSecondary]}>
                      Get actionable steps with safe treatments and prevention tips tailored to crops.
                    </Text>
                  </View>
                  <View style={{ marginTop: 8 }}>
                    <Text style={[commonStyles.textXs, { color: colors.success[600] }]}>Verified Solutions</Text>
                  </View>
                </View>
              </Card>

              <Card variant="outlined" padding="medium" style={{ flex: 1, marginLeft: 8 }}>
                <View style={{ minHeight: 132, justifyContent: 'space-between' }}>
                  <View>
                    <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.mb2]}>
                      <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 36, height: 36, borderRadius: 8, backgroundColor: colors.neutral[100] }, commonStyles.mr2]}>
                        <Ionicons name="cloud-outline" size={18} color={colors.neutral[600]} />
                      </View>
                      <Text style={[commonStyles.textBase, commonStyles.fontSemibold, commonStyles.textPrimary]}>Cloud sync & access</Text>
                    </View>
                    <Text style={[commonStyles.textSm, commonStyles.textSecondary]}>
                      Securely store analyses and access them across devices.
                    </Text>
                  </View>
                  <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: colors.neutral[100], alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                      <Ionicons name="cloud-outline" size={22} color={colors.neutral[600]} />
                    </View>
                    <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: colors.primary[50], alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name="cloud-upload-outline" size={22} color={colors.primary[600]} />
                    </View>
                  </View>
                </View>
              </Card>
            </View>
          </View>
        </View>

        {/* Model Performance */}
        <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.mb3]}>
          <View style={{ width: 4, height: 18, backgroundColor: colors.primary[500], borderRadius: 2, marginRight: 8 }} />
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary]}>Model Performance</Text>
        </View>

        <View style={commonStyles.mb6}>
          <Card variant="default" padding="medium" style={commonStyles.mb4}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: -8 }}>
              <View style={{ width: '50%', padding: 8 }}>
                <View style={{ padding: 12, backgroundColor: colors.success[50], borderRadius: 12, borderWidth: 1, borderColor: colors.success[100] }}>
                  <Text style={[commonStyles.textXs, commonStyles.textSecondary, { marginBottom: 4 }]}>Validation Accuracy</Text>
                  <Text style={[commonStyles.textXl, commonStyles.fontBold, { color: colors.success[700] }]}>99.83%</Text>
                </View>
              </View>
              <View style={{ width: '50%', padding: 8 }}>
                <View style={{ padding: 12, backgroundColor: colors.primary[50], borderRadius: 12, borderWidth: 1, borderColor: colors.primary[100] }}>
                  <Text style={[commonStyles.textXs, commonStyles.textSecondary, { marginBottom: 4 }]}>Training Accuracy</Text>
                  <Text style={[commonStyles.textXl, commonStyles.fontBold, { color: colors.primary[700] }]}>99.77%</Text>
                </View>
              </View>
              <View style={{ width: '50%', padding: 8 }}>
                <View style={{ padding: 12, backgroundColor: colors.neutral[50], borderRadius: 12, borderWidth: 1, borderColor: colors.neutral[200] }}>
                  <Text style={[commonStyles.textXs, commonStyles.textSecondary, { marginBottom: 4 }]}>Validation Loss</Text>
                  <Text style={[commonStyles.textLg, commonStyles.fontBold, { color: colors.neutral[700] }]}>0.0070</Text>
                </View>
              </View>
              <View style={{ width: '50%', padding: 8 }}>
                <View style={{ padding: 12, backgroundColor: colors.neutral[50], borderRadius: 12, borderWidth: 1, borderColor: colors.neutral[200] }}>
                  <Text style={[commonStyles.textXs, commonStyles.textSecondary, { marginBottom: 4 }]}>Training Loss</Text>
                  <Text style={[commonStyles.textLg, commonStyles.fontBold, { color: colors.neutral[700] }]}>0.0069</Text>
                </View>
              </View>
            </View>
            <View style={{ marginTop: 8, padding: 12, backgroundColor: colors.secondary[50], borderRadius: 12, borderWidth: 1, borderColor: colors.secondary[100], flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={[commonStyles.textSm, commonStyles.fontSemibold, { color: colors.secondary[800] }]}>Top-3 Accuracy</Text>
              <Text style={[commonStyles.textLg, commonStyles.fontBold, { color: colors.secondary[700] }]}>99.95%+</Text>
            </View>
          </Card>
        </View>

        {/* Supported Crops */}
        <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.mb3]}>
          <View style={{ width: 4, height: 18, backgroundColor: colors.primary[500], borderRadius: 2, marginRight: 8 }} />
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary]}>Supported Crops & Diseases</Text>
        </View>

        <View style={commonStyles.mb6}>
          {[
            { name: 'Apple', diseases: 'Apple Scab, Black Rot, Cedar Apple Rust, Healthy', count: 4 },
            { name: 'Blueberry', diseases: 'Healthy', count: 1 },
            { name: 'Cherry', diseases: 'Powdery Mildew, Healthy', count: 2 },
            { name: 'Corn (Maize)', diseases: 'Gray Leaf Spot, Common Rust, Northern Leaf Blight, Healthy', count: 4 },
            { name: 'Grape', diseases: 'Black Rot, Esca, Leaf Blight, Healthy', count: 4 },
            { name: 'Orange', diseases: 'Huanglongbing (Citrus Greening)', count: 1 },
            { name: 'Peach', diseases: 'Bacterial Spot, Healthy', count: 2 },
            { name: 'Pepper (Bell)', diseases: 'Bacterial Spot, Healthy', count: 2 },
            { name: 'Potato', diseases: 'Early Blight, Late Blight, Healthy', count: 3 },
            { name: 'Raspberry', diseases: 'Healthy', count: 1 },
            { name: 'Soybean', diseases: 'Healthy', count: 1 },
            { name: 'Squash', diseases: 'Powdery Mildew', count: 1 },
            { name: 'Strawberry', diseases: 'Leaf Scorch, Healthy', count: 2 },
            { name: 'Tomato', diseases: 'Bacterial Spot, Early Blight, Late Blight, Leaf Mold, Septoria Leaf Spot, Spider Mites, Target Spot, Yellow Leaf Curl Virus, Mosaic Virus, Healthy', count: 10 },
          ].map((crop, index) => (
            <Card key={index} variant="outlined" padding="medium" style={{ marginBottom: 12 }}>
              <View style={[commonStyles.flexRow, commonStyles.justifyBetween, commonStyles.itemsCenter, commonStyles.mb2]}>
                <View style={[commonStyles.flexRow, commonStyles.itemsCenter]}>
                  <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary[50], alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                    <Ionicons name="leaf" size={16} color={colors.primary[600]} />
                  </View>
                  <Text style={[commonStyles.textBase, commonStyles.fontSemibold, commonStyles.textPrimary]}>{crop.name}</Text>
                </View>
                <View style={{ paddingHorizontal: 8, paddingVertical: 2, backgroundColor: colors.neutral[100], borderRadius: 12 }}>
                  <Text style={[commonStyles.textXs, commonStyles.fontMedium, { color: colors.neutral[600] }]}>{crop.count} Classes</Text>
                </View>
              </View>
              <Text style={[commonStyles.textSm, { color: colors.neutral[600], lineHeight: 20 }]}>
                {crop.diseases}
              </Text>
            </Card>
          ))}
        </View>

        {/* Footer (minimal, non-overlapping) */}
        <View style={[commonStyles.itemsCenter, { paddingTop: 8 }]}>
          <Text style={[commonStyles.textSm, commonStyles.textMuted]}>© 2025 Crop Disease Detection System</Text>
          <Text style={[commonStyles.textXs, commonStyles.textMuted, commonStyles.mt1]}>v0.1</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
