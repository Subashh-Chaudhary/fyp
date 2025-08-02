import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/ui/Card';
import { colors, commonStyles, TAB_BAR_HEIGHT } from '../../styles';

/**
 * Feed tab screen - Shows news, tips, and community content
 * Provides educational content and updates for users
 */
export default function FeedScreen() {
  // Mock data for feed items
  const feedItems = [
    {
      id: '1',
      type: 'article',
      title: 'Common Tomato Diseases and Prevention',
      excerpt: 'Learn about the most common diseases affecting tomato plants and how to prevent them...',
      author: 'Dr. Sarah Johnson',
      date: '2 hours ago',
      image: require('../../assets/images/icon.png'),
      readTime: '5 min read',
    },
    {
      id: '2',
      type: 'tip',
      title: 'Best Practices for Crop Photography',
      excerpt: 'Get better scan results by following these photography tips for crop disease detection...',
      author: 'AI Expert Team',
      date: '1 day ago',
      image: require('../../assets/images/icon.png'),
      readTime: '3 min read',
    },
    {
      id: '3',
      type: 'update',
      title: 'New Disease Detection Model Released',
      excerpt: 'Our AI model has been updated with improved accuracy for detecting early-stage diseases...',
      author: 'CropDisease Team',
      date: '3 days ago',
      image: require('../../assets/images/icon.png'),
      readTime: '2 min read',
    },
  ];

  const renderFeedItem = (item: any) => (
    <Card key={item.id} variant="default" padding="medium" margin="small">
      <View style={commonStyles.flexRow}>
        <Image
          source={item.image}
          style={[{ width: 64, height: 64, borderRadius: 8, marginRight: 16 }]}
          resizeMode="cover"
        />
        <View style={commonStyles.flex1}>
          <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.mb2]}>
            <View style={[commonStyles.px2, commonStyles.py1, { backgroundColor: colors.primary[100], borderRadius: 9999, marginRight: 8 }]}>
              <Text style={[commonStyles.textXs, commonStyles.fontMedium, { color: colors.primary[700] }, { textTransform: 'capitalize' }]}>
                {item.type}
              </Text>
            </View>
            <Text style={[commonStyles.textXs, { color: colors.neutral[500] }]}>{item.readTime}</Text>
          </View>

          <Text style={[commonStyles.textBase, commonStyles.fontSemibold, { color: colors.neutral[900] }, commonStyles.mb2, { lineHeight: 20 }]}>
            {item.title}
          </Text>

          <Text style={[commonStyles.textSm, { color: colors.neutral[600] }, commonStyles.mb3, { lineHeight: 16 }]} numberOfLines={2}>
            {item.excerpt}
          </Text>

          <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.justifyBetween]}>
            <Text style={[commonStyles.textXs, { color: colors.neutral[500] }]}>
              By {item.author}
            </Text>
            <Text style={[commonStyles.textXs, { color: colors.neutral[500] }]}>
              {item.date}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );

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
            Feed
          </Text>
          <Text style={[commonStyles.textBase, commonStyles.textSecondary]}>
            Stay updated with the latest news and tips
          </Text>
        </View>

        {/* Featured Section */}
        <View style={[commonStyles.px6, commonStyles.mb6]}>
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary, commonStyles.mb4]}>
            Featured
          </Text>

          <Card variant="elevated" padding="large">
            <View style={commonStyles.itemsCenter}>
              <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 64, height: 64, backgroundColor: colors.primary[100], borderRadius: 32 }, commonStyles.mb4]}>
                <Ionicons name="star" size={32} color={colors.primary[500]} />
              </View>
              <Text style={[commonStyles.textXl, commonStyles.fontBold, commonStyles.textPrimary, commonStyles.textCenter, commonStyles.mb2]}>
                Weekly Disease Report
              </Text>
              <Text style={[commonStyles.textBase, commonStyles.textSecondary, commonStyles.textCenter, commonStyles.mb4, { lineHeight: 20 }]}>
                Get insights into the most common crop diseases detected this week and prevention strategies.
              </Text>
              <TouchableOpacity style={[commonStyles.bgPrimary, commonStyles.px6, commonStyles.py3, commonStyles.roundedLg]}>
                <Text style={[commonStyles.textWhite, commonStyles.fontSemibold]}>Read Report</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {/* Feed Items */}
        <View style={[commonStyles.px6, commonStyles.mb6]}>
          <View style={[commonStyles.flexRow, commonStyles.justifyBetween, commonStyles.itemsCenter, commonStyles.mb4]}>
            <Text style={[commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary]}>
              Latest Articles
            </Text>
            <TouchableOpacity>
              <Text style={[commonStyles.textPrimary, commonStyles.fontMedium, { color: colors.primary[500] }]}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={{ gap: 16 }}>
            {feedItems.map(renderFeedItem)}
          </View>
        </View>

        {/* Quick Tips */}
        <View style={[commonStyles.px6, commonStyles.mb6]}>
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary, commonStyles.mb4]}>
            Quick Tips
          </Text>

          <View style={{ gap: 12 }}>
            <Card variant="default" padding="medium">
              <View style={[commonStyles.flexRow, commonStyles.itemsStart]}>
                <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 32, height: 32, backgroundColor: colors.secondary[100], borderRadius: 16, marginRight: 12 }]}>
                  <Ionicons name="bulb" size={16} color={colors.secondary[500]} />
                </View>
                <View style={commonStyles.flex1}>
                  <Text style={[commonStyles.textSm, commonStyles.fontMedium, commonStyles.textPrimary, commonStyles.mb1]}>
                    Early Detection Saves Crops
                  </Text>
                  <Text style={[commonStyles.textXs, commonStyles.textSecondary]}>
                    Regular scanning helps catch diseases before they spread
                  </Text>
                </View>
              </View>
            </Card>

            <Card variant="default" padding="medium">
              <View style={[commonStyles.flexRow, commonStyles.itemsStart]}>
                <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 32, height: 32, backgroundColor: colors.primary[100], borderRadius: 16, marginRight: 12 }]}>
                  <Ionicons name="leaf" size={16} color={colors.primary[500]} />
                </View>
                <View style={commonStyles.flex1}>
                  <Text style={[commonStyles.textSm, commonStyles.fontMedium, commonStyles.textPrimary, commonStyles.mb1]}>
                    Weather Considerations
                  </Text>
                  <Text style={[commonStyles.textXs, commonStyles.textSecondary]}>
                    Some diseases are more common in specific weather conditions
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        </View>

        {/* Community Section */}
        <View style={[commonStyles.px6, commonStyles.mb6]}>
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary, commonStyles.mb4]}>
            Community
          </Text>

          <Card variant="default" padding="large">
            <View style={commonStyles.itemsCenter}>
              <Ionicons name="people" size={48} color={colors.neutral[400]} />
              <Text style={[commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary, commonStyles.mt3, commonStyles.mb2]}>
                Join the Community
              </Text>
              <Text style={[commonStyles.textSm, commonStyles.textSecondary, commonStyles.textCenter, commonStyles.mb4, { lineHeight: 20 }]}>
                Connect with other farmers and experts to share experiences and learn from each other.
              </Text>
              <TouchableOpacity style={[commonStyles.borderPrimary, commonStyles.px6, commonStyles.py3, commonStyles.roundedLg]}>
                <Text style={[commonStyles.fontSemibold, { color: colors.primary[500] }]}>Join Forum</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
