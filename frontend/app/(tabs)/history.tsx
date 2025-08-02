import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/ui/Card';
import { dateUtils } from '../../lib/utils';
import { useAppStore } from '../../store';
import { colors, commonStyles, TAB_BAR_HEIGHT } from '../../styles';

/**
 * History tab screen - Shows past scan results and analysis history
 * Displays detailed information about previous disease detections
 */
export default function HistoryScreen() {
  const scanHistory = useAppStore((state) => state.scanHistory);

  const renderScanItem = ({ item }: { item: any }) => (
    <Card variant="default" padding="medium" margin="small">
      <View style={[commonStyles.flexRow, commonStyles.itemsStart]}>
        {item.imageUri && (
          <Image
            source={{ uri: item.imageUri }}
            style={[{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }]}
            resizeMode="cover"
          />
        )}

        <View style={commonStyles.flex1}>
          <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.justifyBetween, commonStyles.mb2]}>
            <Text style={[commonStyles.textBase, commonStyles.fontSemibold, commonStyles.textPrimary]}>
              {item.cropId}
            </Text>
            <View style={[commonStyles.px2, commonStyles.py1, { backgroundColor: colors.primary[100], borderRadius: 9999 }]}>
              <Text style={[commonStyles.textXs, commonStyles.fontMedium, { color: colors.primary[700] }]}>
                {item.status}
              </Text>
            </View>
          </View>

          {item.diseaseName && (
            <Text style={[commonStyles.textSm, { color: colors.neutral[700] }, commonStyles.mb1]}>
              Disease: {item.diseaseName}
            </Text>
          )}

          {item.confidence && (
            <Text style={[commonStyles.textSm, commonStyles.textSecondary, commonStyles.mb2]}>
              Confidence: {Math.round(item.confidence * 100)}%
            </Text>
          )}

          <Text style={[commonStyles.textXs, commonStyles.textSecondary]}>
            {dateUtils.getRelativeTime(item.createdAt)}
          </Text>
        </View>

        <TouchableOpacity style={[commonStyles.px2, commonStyles.py1]}>
          <Ionicons name="chevron-forward" size={20} color={colors.neutral[400]} />
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={[commonStyles.flex1, commonStyles.bgNeutral50]}>
      <View style={[commonStyles.flex1, commonStyles.px6, commonStyles.py4]}>
        {/* Header */}
        <View style={[commonStyles.mb6]}>
          <Text style={[commonStyles.text2xl, commonStyles.fontBold, commonStyles.textPrimary, commonStyles.mb2]}>
            Scan History
          </Text>
          <Text style={[commonStyles.textBase, commonStyles.textSecondary]}>
            View your previous crop disease analysis results
          </Text>
        </View>

        {/* Stats */}
        <Card variant="default" padding="medium" style={commonStyles.mb6}>
          <View style={[commonStyles.flexRow, commonStyles.justifyBetween]}>
            <View style={commonStyles.itemsCenter}>
              <Text style={[commonStyles.text2xl, commonStyles.fontBold, { color: colors.primary[500] }]}>
                {scanHistory.length}
              </Text>
              <Text style={[commonStyles.textSm, commonStyles.textSecondary]}>Total Scans</Text>
            </View>

            <View style={commonStyles.itemsCenter}>
              <Text style={[commonStyles.text2xl, commonStyles.fontBold, { color: colors.secondary[500] }]}>
                {scanHistory.filter(scan => scan.status === 'completed').length}
              </Text>
              <Text style={[commonStyles.textSm, commonStyles.textSecondary]}>Completed</Text>
            </View>

            <View style={commonStyles.itemsCenter}>
              <Text style={[commonStyles.text2xl, commonStyles.fontBold, { color: colors.neutral[500] }]}>
                {scanHistory.filter(scan => scan.status === 'processing').length}
              </Text>
              <Text style={[commonStyles.textSm, commonStyles.textSecondary]}>Processing</Text>
            </View>
          </View>
        </Card>

        {/* Scan List */}
        {scanHistory.length > 0 ? (
          <FlatList
            data={scanHistory}
            renderItem={renderScanItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT }}
          />
        ) : (
          <Card variant="outlined" padding="large">
            <View style={commonStyles.itemsCenter}>
              <Ionicons name="time-outline" size={48} color={colors.neutral[400]} />
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
    </SafeAreaView>
  );
}
