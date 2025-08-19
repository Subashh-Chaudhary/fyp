import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '../../components/ui/Card';
import { colors, commonStyles } from '../../styles';

/**
 * History screen - Shows user's scan history
 * Displays past crop scans and their results
 */
export default function HistoryScreen() {
  return (
    <SafeAreaView style={[commonStyles.flex1, commonStyles.bgNeutral50]}>
      <View style={[commonStyles.flex1, commonStyles.px6, commonStyles.py4]}>
        {/* Header */}
        <View style={[commonStyles.itemsCenter, commonStyles.mb8]}>
          <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 100, height: 100, backgroundColor: colors.secondary[100], borderRadius: 50 }, commonStyles.mb6]}>
            <Ionicons name="time" size={48} color={colors.secondary[500]} />
          </View>

          <Text style={[commonStyles.text2xl, commonStyles.fontBold, commonStyles.textPrimary, commonStyles.textCenter, commonStyles.mb3]}>
            Scan History
          </Text>

          <Text style={[commonStyles.textBase, commonStyles.textSecondary, commonStyles.textCenter]}>
            View your previous crop scans and analysis results
          </Text>
        </View>

        {/* Empty State */}
        <Card variant="outlined" padding="large">
          <View style={[commonStyles.itemsCenter]}>
            <Ionicons name="time-outline" size={64} color={colors.neutral[400]} style={commonStyles.mb4} />
            <Text style={[commonStyles.textLg, commonStyles.fontSemibold, { color: colors.neutral[700] }, commonStyles.mb2]}>
              No Scans Yet
            </Text>
            <Text style={[commonStyles.textBase, commonStyles.textSecondary, commonStyles.textCenter, commonStyles.mb4]}>
              You haven&apos;t scanned any crops yet. Start by taking a photo of your crop to detect diseases.
            </Text>

            <View style={[commonStyles.flexRow, commonStyles.itemsCenter, { backgroundColor: colors.primary[100], borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 }]}>
              <Ionicons name="camera" size={20} color={colors.primary[600]} style={commonStyles.mr2} />
              <Text style={[commonStyles.textSm, commonStyles.fontMedium, { color: colors.primary[600] }]}>
                Start Scanning
              </Text>
            </View>
          </View>
        </Card>

        {/* Coming Soon Features */}
        <View style={commonStyles.mt6}>
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary, commonStyles.mb4]}>
            Coming Soon
          </Text>

          <Card variant="outlined" padding="medium">
            <View style={[commonStyles.mb3]}>
              <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.mb3]}>
                <Ionicons name="analytics" size={20} color={colors.primary[500]} style={commonStyles.mr3} />
                <Text style={[commonStyles.textBase, commonStyles.textPrimary]}>
                  Detailed scan analytics and trends
                </Text>
              </View>

              <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.mb3]}>
                <Ionicons name="share" size={20} color={colors.primary[500]} style={commonStyles.mr3} />
                <Text style={[commonStyles.textBase, commonStyles.textPrimary]}>
                  Share results with experts
                </Text>
              </View>

              <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.mb3]}>
                <Ionicons name="download" size={20} color={colors.primary[500]} style={commonStyles.mr3} />
                <Text style={[commonStyles.textBase, commonStyles.textPrimary]}>
                  Export scan reports
                </Text>
              </View>

              <View style={[commonStyles.flexRow, commonStyles.itemsCenter]}>
                <Ionicons name="search" size={20} color={colors.primary[500]} style={commonStyles.mr3} />
                <Text style={[commonStyles.textBase, commonStyles.textPrimary]}>
                  Search and filter scan history
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </View>
    </SafeAreaView>
  );
}
