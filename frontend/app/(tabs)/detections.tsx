import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { httpClient } from '../../src/services/http.client';
import { useAuthStore } from '../../src/store/auth.store';
import { TAB_BAR_HEIGHT, colors, commonStyles } from '../../styles';

interface ReportUser { id: string; name: string; email?: string; avatar_url?: string }
interface ReportCrop { id: string; image_url?: string; scanned_at?: string }
interface ReportDisease { id: string; name: string; description?: string }
interface ReportSolution { id: string; description?: string }
interface ReportItem { id: string; generated_at: string; created_at: string; user: ReportUser; crop: ReportCrop; disease: ReportDisease; solution: ReportSolution; is_varified?: boolean }
interface ReportsPagination { page: number; limit: number; total: number; totalPages: number; hasNext: boolean; hasPrev: boolean }
interface ReportsResponse { success: boolean; data: { items: ReportItem[]; pagination: ReportsPagination }; message?: string }

const formatRelative = (iso: string) => {
  const diffSec = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diffSec < 60) return 'just now';
  const mins = Math.floor(diffSec / 60);
  if (diffSec < 3600) return `${mins}m ago`;
  const hours = Math.floor(diffSec / 3600);
  if (diffSec < 86400) return `${hours}h ago`;
  const days = Math.floor(diffSec / 86400);
  if (diffSec < 604800) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
};

export default function DetectionsScreen() {
  const user = useAuthStore((s) => s.user);
  const [items, setItems] = useState<ReportItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});
  const [verifySubmitting, setVerifySubmitting] = useState<Record<string, boolean>>({});

  const fetchReports = useCallback(async (nextPage: number, opts?: { replace?: boolean; isRefresh?: boolean }) => {
    const isRefresh = !!opts?.isRefresh;
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError(null);
    try {
      const url = `/reports?page=${nextPage}&limit=10`;
      const res = await httpClient.get<ReportsResponse>(url);
      const newItems = res?.data?.items || [];
      setItems((prev) => (nextPage === 1 || opts?.replace ? newItems : [...prev, ...newItems]));
      const pagination = res?.data?.pagination;
      setHasNext(!!pagination?.hasNext);
      setPage(pagination?.page || nextPage);
    } catch (e: any) {
      setError(e.message || 'Failed to load reports');
    } finally {
      if (isRefresh) setRefreshing(false); else setLoading(false);
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports(1);
  }, [fetchReports]);

  const onRetry = useCallback(() => fetchReports(page || 1, { replace: page === 1 }), [fetchReports, page]);
  const loadMore = useCallback(() => { if (!loading && hasNext) fetchReports(page + 1); }, [loading, hasNext, fetchReports, page]);
  const onRefresh = useCallback(() => fetchReports(1, { replace: true, isRefresh: true }), [fetchReports]);

  const renderHeader = useMemo(() => (
    <View style={[commonStyles.itemsCenter, commonStyles.mb8, { paddingHorizontal: 24, paddingTop: 16 }]}> 
      <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 100, height: 100, backgroundColor: colors.secondary[100], borderRadius: 50 }, commonStyles.mb6]}>
        <Ionicons name="images" size={48} color={colors.secondary[500]} />
      </View>
      <Text style={[commonStyles.text2xl, commonStyles.fontBold, commonStyles.textPrimary, commonStyles.textCenter, commonStyles.mb3]}>Detections</Text>
      <Text style={[commonStyles.textBase, commonStyles.textSecondary, commonStyles.textCenter]}>All users' detection reports</Text>
    </View>
  ), []);

  const renderItem = useCallback(({ item: r }: { item: ReportItem }) => {
    return (
      <Card key={r.id} variant="default" padding="small" style={commonStyles.mb4}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <Image source={{ uri: r.crop?.image_url }} style={{ width: 82, height: 72, borderRadius: 12, backgroundColor: colors.neutral[200] }} />
          <View style={[commonStyles.ml4, { flex: 1 }]}> 
            <View style={[commonStyles.flexRow, commonStyles.justifyBetween, commonStyles.itemsStart]}> 
              <Text style={[commonStyles.textBase, commonStyles.fontSemibold, { color: colors.neutral[900], flexShrink: 1 }]} numberOfLines={1}>{(r.disease?.name ?? 'Unknown').replace(/_/g, ' ')}</Text>
              <Text style={[commonStyles.textXs, { color: colors.neutral[500] }]}>{formatRelative(r.generated_at)}</Text>
            </View>
            <Text style={[commonStyles.textSm, { color: colors.neutral[600], marginTop: 4 }]} numberOfLines={2}>{r.solution?.description ?? ''}</Text>
            <View style={[commonStyles.flexRow, commonStyles.mt3, { gap: 8 }]}> 
              <View style={{ paddingHorizontal: 10, paddingVertical: 2, backgroundColor: colors.primary[50], borderRadius: 999, borderWidth: 1, borderColor: colors.primary[200], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={[commonStyles.textXs, { color: colors.primary[700], fontWeight: '600' }]}>Report</Text>
              </View>
              <View style={{ paddingHorizontal: 10, paddingVertical: 2, backgroundColor: colors.secondary[50], borderRadius: 999, borderWidth: 1, borderColor: colors.secondary[200], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={[commonStyles.textXs, { color: colors.secondary[700], fontWeight: '600' }]}>{r.user?.name ?? 'User'}</Text>
              </View>

              {user?.userType === 'expert' ? (
                <View style={{ marginLeft: 'auto' }}>
                  {r.is_varified ? (
                    <View style={{ paddingHorizontal: 10, paddingVertical: 6, backgroundColor: colors.success[50], borderRadius: 999, borderWidth: 1, borderColor: colors.success[200], flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="checkmark-circle" size={16} color={colors.success[600]} />
                      <Text style={[commonStyles.textXs, { color: colors.success[700], fontWeight: '600', marginLeft: 6 }]}>Verified</Text>
                    </View>
                  ) : (
                    <Button
                      title="Verify"
                      variant="outline"
                      size="small"
                      loading={!!verifySubmitting[r.id]}
                      onPress={async () => {
                        try {
                          setVerifySubmitting((s) => ({ ...s, [r.id]: true }));
                          // send PUT to mark as verified
                          const res = await httpClient.put<{ success?: boolean; data?: { is_varified?: boolean } }>(`/reports/${r.id}`, { is_varified: true });
                          const updated = res?.data;
                          if (updated && updated.is_varified) {
                            setItems((prev) => prev.map((it) => (it.id === r.id ? { ...it, is_varified: true } : it)));
                          }
                        } catch (e: any) {
                          Alert.alert('Error', e?.message || 'Failed to verify report');
                        } finally {
                          setVerifySubmitting((s) => ({ ...s, [r.id]: false }));
                        }
                      }}
                    />
                  )}
                </View>
              ) : null}
            </View>
            <Text style={[commonStyles.textXs, { color: colors.neutral[500], marginTop: 6 }]}>Generated: {new Date(r.generated_at).toLocaleString()}</Text>
            <Text style={[commonStyles.textXs, { color: colors.neutral[500], marginTop: 2 }]}>Scanned: {new Date(r.crop?.scanned_at || r.created_at).toLocaleString()}</Text>

            {user?.userType === 'expert' ? (
              <View style={[commonStyles.mt3, { width: '100%' }]}> 
                <Input
                  label="Feedback"
                  placeholder="Enter feedback for this report"
                  value={feedbacks[r.id] || ''}
                  onChangeText={(t) => setFeedbacks((prev) => ({ ...prev, [r.id]: t }))}
                />

                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <View style={{ minWidth: 140 }}>
                    <Button
                      title="Submit Feedback"
                      variant="primary"
                      size="small"
                      loading={!!submitting[r.id]}
                      onPress={async () => {
                        const text = feedbacks[r.id] || '';
                        if (!text.trim()) {
                          Alert.alert('Validation', 'Please enter feedback before submitting.');
                          return;
                        }
                        try {
                          setSubmitting((s) => ({ ...s, [r.id]: true }));
                          // Attempt to post feedback to API; fallback to alert on failure
                          await httpClient.post(`/reports/${r.id}/feedback`, { feedback: text });
                          setFeedbacks((s) => ({ ...s, [r.id]: '' }));
                          Alert.alert('Success', 'Feedback submitted successfully.');
                        } catch (e: any) {
                          Alert.alert('Error', e?.message || 'Failed to submit feedback');
                        } finally {
                          setSubmitting((s) => ({ ...s, [r.id]: false }));
                        }
                      }}
                    />
                  </View>
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </Card>
    );
  }, []);

  const listEmpty = useMemo(() => (
    <View>
      {initialLoading ? (
        <Card variant="outlined" padding="large" style={commonStyles.mb4}> 
          <View style={[commonStyles.flexRow, commonStyles.itemsCenter]}> 
            <ActivityIndicator color={colors.primary[600]} />
            <Text style={[commonStyles.textSm, commonStyles.ml3, { color: colors.neutral[600] }]}>Loading reports…</Text>
          </View>
        </Card>
      ) : error ? (
        <Card variant="outlined" padding="large" style={commonStyles.mb4}> 
          <View style={[commonStyles.itemsCenter]}> 
            <Ionicons name="alert-circle" size={48} color={colors.danger[600]} style={commonStyles.mb3} />
            <Text style={[commonStyles.textBase, { color: colors.danger[700] }, commonStyles.mb2]}>Failed to load reports</Text>
            <Text style={[commonStyles.textSm, { color: colors.neutral[600] }, commonStyles.mb4]}>{error}</Text>
            <TouchableOpacity onPress={onRetry} style={{ paddingVertical: 10, paddingHorizontal: 18, backgroundColor: colors.primary[600], borderRadius: 8 }}>
              <Text style={[commonStyles.textSm, commonStyles.fontSemibold, { color: '#fff' }]}>Retry</Text>
            </TouchableOpacity>
          </View>
        </Card>
      ) : (
        <Card variant="outlined" padding="large" style={commonStyles.mb4}> 
          <View style={[commonStyles.itemsCenter]}> 
            <Ionicons name="images" size={64} color={colors.neutral[400]} style={commonStyles.mb4} />
            <Text style={[commonStyles.textLg, commonStyles.fontSemibold, { color: colors.neutral[700] }, commonStyles.mb2]}>No Reports</Text>
            <Text style={[commonStyles.textBase, commonStyles.textSecondary, commonStyles.textCenter, commonStyles.mb4]}>No detection reports found.</Text>
          </View>
        </Card>
      )}
    </View>
  ), [initialLoading, error, onRetry]);

  const listFooter = useMemo(() => (
    hasNext ? (
      <View style={{ paddingVertical: 12, alignItems: 'center' }}>
        {loading ? (
          <ActivityIndicator color={colors.primary[600]} />
        ) : (
          <TouchableOpacity onPress={loadMore} style={{ paddingHorizontal: 18, paddingVertical: 10, backgroundColor: colors.primary[600], borderRadius: 8 }}>
            <Text style={[commonStyles.textSm, commonStyles.fontSemibold, { color: '#fff' }]}>Load More</Text>
          </TouchableOpacity>
        )}
      </View>
    ) : null
  ), [hasNext, loading, loadMore]);

  return (
    <SafeAreaView style={[commonStyles.flex1, commonStyles.bgNeutral50]}>
      <FlatList
        data={items}
        keyExtractor={(r) => r.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={listEmpty}
        ListFooterComponent={listFooter}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: TAB_BAR_HEIGHT + 24 }}
        onEndReachedThreshold={0.4}
        onEndReached={() => { if (!loading && hasNext) loadMore(); }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary[600]]} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
