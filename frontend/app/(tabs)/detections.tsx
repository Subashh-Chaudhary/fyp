import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Modal, Platform, Pressable, RefreshControl, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { httpClient } from '../../src/services/http.client';
import { useAuthStore } from '../../src/store/auth.store';
import { TAB_BAR_HEIGHT, colors, commonStyles } from '../../styles';

interface ReportUser { id: string; name: string; email?: string; avatar_url?: string; phone?: string; address?: string; is_verified?: boolean; is_active?: boolean; created_at?: string }
interface ReportCrop { id: string; image_url?: string; scanned_at?: string }
interface ReportDisease { id: string; name: string; description?: string }
interface ReportSolution { id: string; description?: string }
interface ReportItem { id: string; generated_at: string; created_at: string; user: ReportUser; crop: ReportCrop; disease: ReportDisease; solution: ReportSolution; is_varified?: boolean; confidence?: number; severity?: string }
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
  const showToast = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('', msg);
    }
  };
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
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<ReportUser | null>(null);

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
          <TouchableOpacity onPress={() => { if (r.crop?.image_url) setPreviewUri(r.crop.image_url); }} activeOpacity={0.8}>
            <Image source={{ uri: r.crop?.image_url }} style={{ width: 82, height: 72, borderRadius: 12, backgroundColor: colors.neutral[200] }} />
          </TouchableOpacity>
          <View style={[commonStyles.ml4, { flex: 1 }]}>
            <View style={[commonStyles.flexRow, commonStyles.justifyBetween, commonStyles.itemsStart]}>
              <Text style={[commonStyles.textBase, commonStyles.fontSemibold, { color: colors.neutral[900], flexShrink: 1 }]} numberOfLines={1}>{(r.disease?.name ?? 'Unknown').replace(/_/g, ' ')}</Text>
              <Text style={[commonStyles.textXs, { color: colors.neutral[500] }]}>{formatRelative(r.generated_at)}</Text>
            </View>
            <Text style={[commonStyles.textSm, { color: colors.neutral[600], marginTop: 4 }]} numberOfLines={2}>{r.solution?.description ?? ''}</Text>
            <View style={[commonStyles.flexRow, commonStyles.mt3, { gap: 8, flexWrap: 'wrap' }]}>
              {typeof r.confidence === 'number' && (
                <View style={{ paddingHorizontal: 10, paddingVertical: 2, backgroundColor: colors.primary[50], borderRadius: 999, borderWidth: 1, borderColor: colors.primary[200], flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="analytics" size={12} color={colors.primary[600]} style={{ marginRight: 4 }} />
                  <Text style={[commonStyles.textXs, { color: colors.primary[700], fontWeight: '600' }]}>{(r.confidence * 100).toFixed(1)}%</Text>
                </View>
              )}

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
            <TouchableOpacity
              onPress={() => setSelectedUserForDetails(r.user)}
              activeOpacity={0.7}
              style={{ paddingHorizontal: 15, paddingVertical: 6, backgroundColor: colors.secondary[50], borderRadius: 999, borderWidth: 1, borderColor: colors.secondary[200], alignItems: 'center', justifyContent: 'center', marginTop: 6, alignSelf: 'flex-start' }}
            >
              <Text style={[commonStyles.textXs, { color: colors.secondary[700], fontWeight: '600' }]}>{r.user?.name ?? 'User'}</Text>
            </TouchableOpacity>
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
                          showToast('Please enter feedback before submitting.');
                          return;
                        }
                        try {
                          setSubmitting((s) => ({ ...s, [r.id]: true }));
                          // Post feedback to /feedbacks endpoint with required payload
                          const payload = { report_id: r.id, expert_id: user?.id, feedback_text: text } as Record<string, any>;
                          const res = await httpClient.post<any>('/feedbacks', payload);
                          setFeedbacks((s) => ({ ...s, [r.id]: '' }));
                          const msg = (res as any)?.message || 'Feedback created successfully.';
                          showToast(msg);
                        } catch (e: any) {
                          showToast(e?.message || 'Failed to submit feedback');
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
  }, [feedbacks, submitting, verifySubmitting, user, items]);

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
      <Modal visible={!!previewUri} transparent animationType="fade" onRequestClose={() => setPreviewUri(null)}>
        <Pressable style={styles.modalContainer} onPress={() => setPreviewUri(null)}>
          <Image source={{ uri: previewUri || undefined }} style={styles.previewImage} resizeMode="contain" />
          <TouchableOpacity style={styles.closeBtn} onPress={() => setPreviewUri(null)}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </Pressable>
      </Modal>

      {/* User Details Modal */}
      <Modal visible={!!selectedUserForDetails} transparent animationType="slide" onRequestClose={() => setSelectedUserForDetails(null)}>
        <Pressable style={styles.userModalContainer} onPress={() => setSelectedUserForDetails(null)}>
          <Pressable style={styles.userModalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.userModalHeader}>
              <Text style={[commonStyles.textLg, commonStyles.fontBold, { color: colors.neutral[900] }]}>User Details</Text>
              <TouchableOpacity onPress={() => setSelectedUserForDetails(null)}>
                <Ionicons name="close" size={24} color={colors.neutral[600]} />
              </TouchableOpacity>
            </View>

            {selectedUserForDetails && (
              <View style={{ paddingTop: 16 }}>
                {/* Avatar */}
                <View style={[commonStyles.itemsCenter, commonStyles.mb6]}>
                  {selectedUserForDetails.avatar_url ? (
                    <Image
                      source={{ uri: selectedUserForDetails.avatar_url }}
                      style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: colors.neutral[200] }}
                    />
                  ) : (
                    <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: colors.neutral[200], alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name="person" size={48} color={colors.neutral[500]} />
                    </View>
                  )}
                  <Text style={[commonStyles.textXl, commonStyles.fontBold, { color: colors.neutral[900], marginTop: 12 }]}>{selectedUserForDetails.name}</Text>
                </View>

                {/* User Information */}
                <View style={{ gap: 12 }}>
                  {selectedUserForDetails.email && (
                    <View style={styles.userDetailRow}>
                      <Ionicons name="mail" size={20} color={colors.primary[600]} />
                      <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text style={[commonStyles.textXs, { color: colors.neutral[500] }]}>Email</Text>
                        <Text style={[commonStyles.textSm, { color: colors.neutral[800] }]}>{selectedUserForDetails.email}</Text>
                      </View>
                    </View>
                  )}

                  {selectedUserForDetails.phone && (
                    <View style={styles.userDetailRow}>
                      <Ionicons name="call" size={20} color={colors.primary[600]} />
                      <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text style={[commonStyles.textXs, { color: colors.neutral[500] }]}>Phone</Text>
                        <Text style={[commonStyles.textSm, { color: colors.neutral[800] }]}>{selectedUserForDetails.phone}</Text>
                      </View>
                    </View>
                  )}

                  {selectedUserForDetails.address && (
                    <View style={styles.userDetailRow}>
                      <Ionicons name="location" size={20} color={colors.primary[600]} />
                      <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text style={[commonStyles.textXs, { color: colors.neutral[500] }]}>Address</Text>
                        <Text style={[commonStyles.textSm, { color: colors.neutral[800] }]}>{selectedUserForDetails.address}</Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.userDetailRow}>
                    <Ionicons name="shield-checkmark" size={20} color={colors.primary[600]} />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text style={[commonStyles.textXs, { color: colors.neutral[500] }]}>Account Status</Text>
                      <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                        {selectedUserForDetails.is_verified ? (
                          <View style={{ paddingHorizontal: 8, paddingVertical: 3, backgroundColor: colors.success[50], borderRadius: 12, borderWidth: 1, borderColor: colors.success[200] }}>
                            <Text style={[commonStyles.textXs, { color: colors.success[700], fontWeight: '600' }]}>Verified</Text>
                          </View>
                        ) : (
                          <View style={{ paddingHorizontal: 8, paddingVertical: 3, backgroundColor: colors.warning[50], borderRadius: 12, borderWidth: 1, borderColor: colors.warning[200] }}>
                            <Text style={[commonStyles.textXs, { color: colors.warning[700], fontWeight: '600' }]}>Unverified</Text>
                          </View>
                        )}
                        {selectedUserForDetails.is_active ? (
                          <View style={{ paddingHorizontal: 8, paddingVertical: 3, backgroundColor: colors.success[50], borderRadius: 12, borderWidth: 1, borderColor: colors.success[200] }}>
                            <Text style={[commonStyles.textXs, { color: colors.success[700], fontWeight: '600' }]}>Active</Text>
                          </View>
                        ) : (
                          <View style={{ paddingHorizontal: 8, paddingVertical: 3, backgroundColor: colors.danger[50], borderRadius: 12, borderWidth: 1, borderColor: colors.danger[200] }}>
                            <Text style={[commonStyles.textXs, { color: colors.danger[700], fontWeight: '600' }]}>Inactive</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>

                  {selectedUserForDetails.created_at && (
                    <View style={styles.userDetailRow}>
                      <Ionicons name="calendar" size={20} color={colors.primary[600]} />
                      <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text style={[commonStyles.textXs, { color: colors.neutral[500] }]}>Member Since</Text>
                        <Text style={[commonStyles.textSm, { color: colors.neutral[800] }]}>{new Date(selectedUserForDetails.created_at).toLocaleDateString()}</Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.userDetailRow}>
                    <Ionicons name="key" size={20} color={colors.primary[600]} />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text style={[commonStyles.textXs, { color: colors.neutral[500] }]}>User ID</Text>
                      <Text style={[commonStyles.textXs, { color: colors.neutral[600], fontFamily: 'monospace' }]}>{selectedUserForDetails.id}</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  closeBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  closeText: {
    color: '#fff',
    fontSize: 14,
  },
  userModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  userModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
  },
  userModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  userDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.neutral[50],
    borderRadius: 12,
  },
});
