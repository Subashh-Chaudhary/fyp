import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '../../components/ui/Card';
import { colors, commonStyles } from '../../styles';

/**
 * Feed screen - Community feed and expert insights
 * Shows community posts, expert advice, and agricultural tips
 */
export default function FeedScreen() {
  return (
    <SafeAreaView style={[commonStyles.flex1, commonStyles.bgNeutral50]}>
      <View style={[commonStyles.flex1, commonStyles.px6, commonStyles.py4]}>
        {/* Header */}
        <View style={[commonStyles.itemsCenter, commonStyles.mb8]}>
          <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 100, height: 100, backgroundColor: colors.secondary[100], borderRadius: 50 }, commonStyles.mb6]}>
            <Ionicons name="newspaper" size={48} color={colors.secondary[500]} />
          </View>

          <Text style={[commonStyles.text2xl, commonStyles.fontBold, commonStyles.textPrimary, commonStyles.textCenter, commonStyles.mb3]}>
            Community Feed
          </Text>

          <Text style={[commonStyles.textBase, commonStyles.textSecondary, commonStyles.textCenter]}>
            Stay updated with expert advice and community insights
          </Text>
        </View>

        {/* Empty State */}
        <Card variant="outlined" padding="large">
          <View style={[commonStyles.itemsCenter]}>
            <Ionicons name="newspaper-outline" size={64} color={colors.neutral[400]} style={commonStyles.mb4} />
            <Text style={[commonStyles.textLg, commonStyles.fontSemibold, { color: colors.neutral[700] }, commonStyles.mb2]}>
              No Posts Yet
            </Text>
            <Text style={[commonStyles.textBase, commonStyles.textSecondary, commonStyles.textCenter, commonStyles.mb4]}>
              The community feed is empty. Check back later for expert advice and community updates.
            </Text>

            <View style={[commonStyles.flexRow, commonStyles.itemsCenter, { backgroundColor: colors.secondary[100], borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 }]}>
              <Ionicons name="refresh" size={20} color={colors.secondary[600]} style={commonStyles.mr2} />
              <Text style={[commonStyles.textSm, commonStyles.fontMedium, { color: colors.secondary[600] }]}>
                Pull to Refresh
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
                <Ionicons name="people" size={20} color={colors.primary[500]} style={commonStyles.mr3} />
                <Text style={[commonStyles.textBase, commonStyles.textPrimary]}>
                  Community posts and discussions
                </Text>
              </View>

              <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.mb3]}>
                <Ionicons name="bulb" size={20} color={colors.primary[500]} style={commonStyles.mr3} />
                <Text style={[commonStyles.textBase, commonStyles.textPrimary]}>
                  Expert tips and advice
                </Text>
              </View>

              <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.mb3]}>
                <Ionicons name="trending-up" size={20} color={colors.primary[500]} style={commonStyles.mr3} />
                <Text style={[commonStyles.textBase, commonStyles.textPrimary]}>
                  Trending agricultural topics
                </Text>
              </View>

              <View style={[commonStyles.flexRow, commonStyles.itemsCenter]}>
                <Ionicons name="chatbubbles" size={20} color={colors.primary[500]} style={commonStyles.mr3} />
                <Text style={[commonStyles.textBase, commonStyles.textPrimary]}>
                  Interactive Q&A sessions
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </View>
    </SafeAreaView>
  );
}
