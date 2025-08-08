import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { dateUtils } from '../../lib/utils';
import { useAppStore, useAuthStore } from '../../src/store';
import { colors, commonStyles, TAB_BAR_HEIGHT } from '../../styles';

/**
 * Home tab screen - Main dashboard for the app
 * Shows quick stats, recent scans, and quick actions
 */
export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const scanHistory = useAppStore((state) => state.scanHistory);

  // Calculate quick stats
  const totalScans = scanHistory.length;
  const recentScans = scanHistory.slice(0, 3);
  const todayScans = scanHistory.filter(scan => dateUtils.isToday(scan.createdAt)).length;

  return (
    <SafeAreaView style={[commonStyles.flex1, commonStyles.bgNeutral50]}>
      <ScrollView
        style={commonStyles.flex1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT }}
      >
        {/* Header */}
        <View style={[commonStyles.px6, commonStyles.py4]}>
          <Text style={[commonStyles.text2xl, commonStyles.fontBold, commonStyles.textPrimary, commonStyles.mb1]}>
            Welcome back!
          </Text>
          <Text style={[commonStyles.textBase, commonStyles.textSecondary]}>
            {user?.name || 'User'} • {user?.userType === 'farmer' ? 'Farmer' : 'Expert'}
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={[commonStyles.px6, commonStyles.mb6]}>
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary, commonStyles.mb4]}>
            Quick Stats
          </Text>

          <View style={[commonStyles.flexRow, { gap: 16 }]}>
            <Card variant="default" padding="medium" style={{ flex: 1 }}>
              <View style={commonStyles.itemsCenter}>
                <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 48, height: 48, backgroundColor: colors.primary[100], borderRadius: 24 }, commonStyles.mb2]}>
                  <Ionicons name="camera" size={24} color={colors.primary[500]} />
                </View>
                <Text style={[commonStyles.text2xl, commonStyles.fontBold, commonStyles.textPrimary]}>{totalScans}</Text>
                <Text style={[commonStyles.textSm, commonStyles.textSecondary, commonStyles.textCenter]}>Total Scans</Text>
              </View>
            </Card>

            <Card variant="default" padding="medium" style={{ flex: 1 }}>
              <View style={commonStyles.itemsCenter}>
                <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 48, height: 48, backgroundColor: colors.secondary[100], borderRadius: 24 }, commonStyles.mb2]}>
                  <Ionicons name="today" size={24} color={colors.secondary[500]} />
                </View>
                <Text style={[commonStyles.text2xl, commonStyles.fontBold, commonStyles.textPrimary]}>{todayScans}</Text>
                <Text style={[commonStyles.textSm, commonStyles.textSecondary, commonStyles.textCenter]}>Today</Text>
              </View>
            </Card>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={[commonStyles.px6, commonStyles.mb6]}>
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary, commonStyles.mb4]}>
            Quick Actions
          </Text>

          <View style={{ gap: 12 }}>
            <Button
              title="Scan New Crop"
              onPress={() => {/* Navigate to scan */}}
              variant="primary"
              size="large"
              icon={<Ionicons name="camera" size={20} color="#ffffff" />}
            />

            <Button
              title="View History"
              onPress={() => {/* Navigate to history */}}
              variant="outline"
              size="large"
              icon={<Ionicons name="time" size={20} color={colors.primary[500]} />}
            />
          </View>
        </View>

        {/* Recent Scans */}
        <View style={[commonStyles.px6, commonStyles.mb6]}>
          <View style={[commonStyles.flexRow, commonStyles.justifyBetween, commonStyles.itemsCenter, commonStyles.mb4]}>
            <Text style={[commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary]}>
              Recent Scans
            </Text>
            <TouchableOpacity>
              <Text style={[commonStyles.textPrimary, commonStyles.fontMedium, { color: colors.primary[500] }]}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentScans.length > 0 ? (
            <View style={{ gap: 12 }}>
              {recentScans.map((scan) => (
                <Card key={scan.id} variant="default" padding="medium">
                  <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.justifyBetween]}>
                    <View style={commonStyles.flex1}>
                      <Text style={[commonStyles.textBase, commonStyles.fontMedium, commonStyles.textPrimary, commonStyles.mb1]}>
                        {scan.cropId}
                      </Text>
                      <Text style={[commonStyles.textSm, commonStyles.textSecondary]}>
                        {dateUtils.getRelativeTime(scan.createdAt)}
                      </Text>
                    </View>
                    <View style={commonStyles.itemsEnd}>
                      <View style={[commonStyles.px2, commonStyles.py1, { backgroundColor: colors.primary[100], borderRadius: 9999 }]}>
                        <Text style={[commonStyles.textXs, commonStyles.fontMedium, { color: colors.primary[700] }]}>
                          {scan.status}
                        </Text>
                      </View>
                      {scan.confidence && (
                        <Text style={[commonStyles.textSm, commonStyles.textSecondary, commonStyles.mt1]}>
                          {Math.round(scan.confidence * 100)}% confidence
                        </Text>
                      )}
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          ) : (
            <Card variant="outlined" padding="large">
              <View style={commonStyles.itemsCenter}>
                <Ionicons name="camera-outline" size={48} color={colors.neutral[400]} />
                <Text style={[commonStyles.textBase, commonStyles.fontMedium, { color: colors.neutral[700] }, commonStyles.mt3, commonStyles.mb1]}>
                  No scans yet
                </Text>
                <Text style={[commonStyles.textSm, commonStyles.textSecondary, commonStyles.textCenter]}>
                  Start by scanning your first crop image
                </Text>
              </View>
            </Card>
          )}
        </View>

        {/* Tips Section */}
        <View style={[commonStyles.px6, commonStyles.mb6]}>
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary, commonStyles.mb4]}>
            Tips for Better Results
          </Text>

          <Card variant="default" padding="medium">
            <View style={{ gap: 12 }}>
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
