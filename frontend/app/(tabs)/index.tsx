import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '../../components/ui/Card';
import { TAB_BAR_HEIGHT, colors, commonStyles } from '../../styles';

// (removed Sparkline in favor of MiniLineChart)

// 100% stacked bar to preview category distribution
const StackedBar: React.FC<{ parts: { value: number; color: string; label: string }[] }>
  = ({ parts }) => {
    const total = parts.reduce((s, p) => s + p.value, 0) || 1;
    return (
      <View>
        <View style={{ flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden', backgroundColor: colors.neutral[200] }}>
          {parts.map((p, i) => (
            <View key={i} style={{ width: `${(p.value / total) * 100}%`, backgroundColor: p.color }} />
          ))}
        </View>
        <View style={[commonStyles.flexRow, commonStyles.itemsCenter, { flexWrap: 'wrap', gap: 12 }, commonStyles.mt2]}>
          {parts.map((p, i) => (
            <View key={i} style={[commonStyles.flexRow, commonStyles.itemsCenter]}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: p.color, marginRight: 6 }} />
              <Text style={[commonStyles.textSm, commonStyles.textSecondary]}>{p.label} ({Math.round((p.value / total) * 100)}%)</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

// Minimal line chart using Views (no external deps)
const MiniLineChart: React.FC<{ data: number[]; width?: number; height?: number; color?: string; thickness?: number }>
  = ({ data, width = 180, height = 60, color = colors.primary[600], thickness = 2 }) => {
    if (!data || data.length < 2) return null;
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = Math.max(1, max - min);
    const points = data.map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return { x, y };
    });
    return (
      <View style={{ width, height }}>
        {/* segments */}
        {points.slice(0, -1).map((p, i) => {
          const p2 = points[i + 1];
          const dx = p2.x - p.x;
          const dy = p2.y - p.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
          return (
            <View
              key={i}
              style={{
                position: 'absolute',
                left: p.x,
                top: p.y,
                width: len,
                height: thickness,
                backgroundColor: color,
                transform: [{ rotateZ: `${angle}deg` }],
                borderRadius: thickness,
              }}
            />
          );
        })}
        {/* points */}
        {points.map((p, i) => (
          <View
            key={`pt-${i}`}
            style={{
              position: 'absolute',
              left: p.x - 2.5,
              top: p.y - 2.5,
              width: 5,
              height: 5,
              borderRadius: 3,
              backgroundColor: color,
            }}
          />
        ))}
      </View>
    );
  };

// Grid pattern for charts (light, non-intrusive)
const PatternGrid: React.FC<{ width: number; height: number; gap?: number; color?: string; opacity?: number }>
  = ({ width, height, gap = 16, color = colors.neutral[300], opacity = 0.25 }) => {
    const vCount = Math.floor(width / gap);
    const hCount = Math.floor(height / gap);
    const lines = [] as React.ReactNode[];
    for (let i = 0; i <= vCount; i++) {
      const left = i * gap;
      lines.push(
        <View key={`v-${i}`} style={{ position: 'absolute', left, top: 0, width: 1, height, backgroundColor: color, opacity }} />
      );
    }
    for (let i = 0; i <= hCount; i++) {
      const top = i * gap;
      lines.push(
        <View key={`h-${i}`} style={{ position: 'absolute', left: 0, top, width, height: 1, backgroundColor: color, opacity }} />
      );
    }
    return <View style={{ width, height, position: 'absolute', left: 0, top: 0 }}>{lines}</View>;
  };

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
                  <View style={{overflow: 'hidden'}}>
                    <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.mb2]}>
                          <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 36, height: 36, borderRadius: 8, backgroundColor: colors.secondary[100] }, commonStyles.mr2]}>
                            <Ionicons name="analytics-outline" size={18} color={colors.secondary[700]} />
                          </View>
                          <Text style={[commonStyles.textBase, commonStyles.fontSemibold, commonStyles.textPrimary, {flexShrink: 1}]}>Insights & trends</Text>
                        </View>
                    <Text style={[commonStyles.textSm, commonStyles.textSecondary]}>
                      Track disease patterns and crop health over time with clear visuals.
                    </Text>
                  </View>
                  <View style={{ marginTop: 8, width: 125, height: 48, position: 'relative' }}>
                    <PatternGrid width={125} height={48} gap={16} color={colors.neutral[300]} opacity={0.25} />
                    <View style={{ position: 'absolute', left: 0, top: 0 }}>
                      <MiniLineChart data={[5, 12, 9, 15, 11, 16, 22, 18,25 ]} width={125} height={48} color={colors.secondary[600]} />
                    </View>
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
                    <StackedBar parts={[{ value: 70, color: colors.success[500], label: 'Effective' }, { value: 30, color: colors.neutral[300], label: 'Pending' }]} />
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

        {/* Analytics */}
        <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.mb3]}>
          <View style={{ width: 4, height: 18, backgroundColor: colors.primary[500], borderRadius: 2, marginRight: 8 }} />
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary]}>Analytics</Text>
        </View>
        {/* Analytics Preview */}
        <View style={commonStyles.mb6}>
          <Card variant="default" padding="medium" style={commonStyles.mb4}>
            <Text style={[commonStyles.textSm, commonStyles.textSecondary, commonStyles.mb2]}>Crop health trend</Text>
            <MiniLineChart data={[30, 45, 35, 55, 60, 50, 70, 65, 80]} width={240} height={72} color={colors.primary[600]} />
          </Card>

          <Card variant="default" padding="medium">
            <Text style={[commonStyles.textSm, commonStyles.textSecondary, commonStyles.mb2]}>Detected disease categories</Text>
            <StackedBar
              parts={[
                { value: 35, color: colors.primary[500], label: 'Fungal' },
                { value: 25, color: colors.secondary[500], label: 'Bacterial' },
                { value: 20, color: colors.success[500], label: 'Viral' },
                { value: 20, color: colors.neutral[400], label: 'Nutrient' },
              ]}
            />
          </Card>
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
