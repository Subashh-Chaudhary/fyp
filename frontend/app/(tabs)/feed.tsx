import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Linking, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AdminFeedManagement from '../../components/admin/AdminFeedManagement';
import { Card } from '../../components/ui/Card';
import { getNews } from '../../lib/api';
import { NewsItem } from '../../src/interfaces';
import { useAuthStore } from '../../src/store/auth.store';
import { colors, commonStyles } from '../../styles';

// Small helper to show relative time (e.g. "2h" or "3m")
const timeAgo = (d?: Date | null) => {
  if (!d) return '';
  const sec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (sec < 60) return `${sec}s`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h`;
  return `${Math.floor(sec / 86400)}d`;
};

export default function FeedScreen() {
  const user = useAuthStore((s) => s.user);
  const userType = (user?.userType ?? (user as any)?.user_type ?? '').toLowerCase();
  const isAdmin = userType === 'admin';

  // If admin, show admin feed management


  // Otherwise show regular feed for farmers/experts
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) setLoading(true);
    setError(null);
    try {
      const res = await getNews({ all: true, limit: 20 });

      if (!res || res.success === false) {
        const msg = Array.isArray(res?.message) ? (res!.message as string[]).join('; ') : (res?.message as string | undefined);
        setError(msg ?? 'Failed to load news');
        setNews([]);
        return;
      }

      const items: NewsItem[] = res.data?.items ?? [];

      // local start/end of day to avoid timezone boundary issues
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(startOfDay.getDate() + 1);

      const parseDate = (it: any) => {
        const d = it?.publish_date ?? it?.created_at ?? it?.createdAt ?? it?.createdAtUtc ?? null;
        if (!d) return null;
        const dt = new Date(d);
        return Number.isNaN(dt.getTime()) ? null : dt;
      };

      const todays = items.filter((it) => {
        const dt = parseDate(it);
        if (!dt) return false;
        return dt >= startOfDay && dt < endOfDay;
      });

      setNews(todays);
    } catch (e) {
      setError((e as Error).message ?? 'Unknown error');
      setNews([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      fetchNews({ silent: true });
    }
  }, [fetchNews, isAdmin]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNews({ silent: true });
  };

  const openUrl = async (url?: string) => {
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
    } catch (e) {
      // ignore
    }
  };

  if (isAdmin) {
    return <AdminFeedManagement />;
  }

  return (
    <SafeAreaView style={[commonStyles.flex1, commonStyles.bgNeutral50]}>
      <View style={[commonStyles.flex1, commonStyles.px6, commonStyles.py4]}>
        {/* Header with manual reload */}
        <View style={[commonStyles.flexRow, commonStyles.justifyBetween, commonStyles.itemsCenter, commonStyles.mb6]}>
          <View style={[commonStyles.itemsCenter]}>
            <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 72, height: 72, backgroundColor: colors.secondary[100], borderRadius: 36 }, commonStyles.mb3]}>
              <Ionicons name="newspaper" size={36} color={colors.secondary[500]} />
            </View>

            <Text style={[commonStyles.text2xl, commonStyles.fontBold, commonStyles.textPrimary, commonStyles.textCenter]}>
              Community Feed
            </Text>
            <Text style={[commonStyles.textSm, commonStyles.textSecondary, commonStyles.textCenter]}>
              Stay updated with expert advice and community insights
            </Text>
          </View>
        </View>

        {/* Content */}
        {loading && !refreshing ? (
          <View style={[commonStyles.flex1, commonStyles.itemsCenter, commonStyles.justifyCenter]}>
            <ActivityIndicator size="large" color={colors.primary[500]} />
          </View>
        ) : error ? (
          <Card variant="outlined" padding="large">
            <View style={{ alignItems: 'center' }}>
              <Text style={[commonStyles.textBase, commonStyles.textPrimary, commonStyles.mb2]}>{error}</Text>
              <TouchableOpacity onPress={() => fetchNews()} style={{ marginTop: 8 }}>
                <View style={{ backgroundColor: colors.primary[500], paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}>
                  <Text style={[commonStyles.textSm, commonStyles.textWhite]}>Retry</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Card>
        ) : news.length === 0 ? (
          <Card variant="outlined" padding="large">
            <View style={[commonStyles.itemsCenter]}>
              <Ionicons name="newspaper-outline" size={64} color={colors.neutral[400]} style={commonStyles.mb4} />
              <Text style={[commonStyles.textLg, commonStyles.fontSemibold, { color: colors.neutral[700] }, commonStyles.mb2]}>
                No News Today
              </Text>
              <Text style={[commonStyles.textBase, commonStyles.textSecondary, commonStyles.textCenter, commonStyles.mb4]}>
                There are no news items published today. Check back later.
              </Text>
              <TouchableOpacity onPress={() => fetchNews()}>
                <View style={{ backgroundColor: colors.primary[50], paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}>
                  <Text style={[commonStyles.textSm, { color: colors.primary[600] }]}>Reload</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Card>
        ) : (
          <FlatList
            data={news}
            keyExtractor={(item) => item.id}
            style={{ marginBottom: 55 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary[500]]} tintColor={colors.primary[500]} />}
            renderItem={({ item }) => {
              const dateStr = item.publish_date ?? item.created_at ?? undefined;
              const dt = dateStr ? new Date(dateStr) : null;

              return (
                <TouchableOpacity activeOpacity={0.85} onPress={() => openUrl(item.url)} style={{ marginBottom: 12 }}>
                  <Card variant="elevated" padding="medium" style={{ borderRadius: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>

                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary, { flex: 1 }]} numberOfLines={2}>{item.title}</Text>
                          <Text style={[commonStyles.textXs, { color: colors.neutral[500], marginLeft: 12 }]}>{dt ? timeAgo(dt) : ''}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 }}>
                          <View style={{ backgroundColor: colors.secondary[50], paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: colors.secondary[100] }}>
                            <Text style={[commonStyles.textXs, { color: colors.secondary[700] }]}>{item.category ?? 'General'}</Text>
                          </View>
                        </View>

                        <View style={{ marginTop: 8 }}>
                          <Text style={[commonStyles.textSm, commonStyles.textSecondary]} numberOfLines={3}>{item.content ?? ''}</Text>
                        </View>

                        <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Text style={[commonStyles.textXs, { color: colors.neutral[500] }]}>{item.source ?? 'Unknown'}</Text>
                          <Ionicons name="chevron-forward" size={20} color={colors.neutral[300]} />
                        </View>
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
