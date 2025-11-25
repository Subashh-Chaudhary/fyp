import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Modal, Platform, Pressable, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { httpClient } from '../../src/services/http.client';
import { useAuthStore } from '../../src/store/auth.store';
import { TAB_BAR_HEIGHT, colors, commonStyles } from '../../styles';

interface HistoryDisease { id: string; name: string; description: string; }
interface HistorySolution { id: string; description: string; }
interface HistoryCrop { id: string; image_url: string; disease_id: string; scanned_at: string; }
interface HistoryReport { id: string; crop: HistoryCrop; disease: HistoryDisease; solution: HistorySolution; generated_at: string; is_varified?: boolean; feedback_id?: string | null; confidence?: number; severity?: string }
interface HistoryUser { id: string; name: string; email?: string; avatar_url?: string }
interface HistoryItem { id: string; viewed_at: string; created_at: string; report: HistoryReport; user?: HistoryUser }
interface HistoryPagination { page: number; limit: number; total: number; totalPages: number; hasNext: boolean; hasPrev: boolean; }
interface FeedbackItem { id: string; feedback_text: string; varified_at?: string; created_at: string; updated_at: string; expert?: { id: string; name: string; email?: string; avatar_url?: string } }
interface HistoriesResponse { success: boolean; data: { items: HistoryItem[]; pagination: HistoryPagination }; message?: string; }

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

export default function HistoryScreen() {
  const user = useAuthStore((s) => s.user);
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [pdfGenerating, setPdfGenerating] = useState<Record<string, boolean>>({});
  const [reportFeedbacks, setReportFeedbacks] = useState<Record<string, FeedbackItem[]>>({});
  const [feedbackLoading, setFeedbackLoading] = useState<Record<string, boolean>>({});
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);

  const generateReportHtml = (h: HistoryItem, expert?: any) => {
    const user = (h as any).user || { name: 'User', email: '' };
    const report = h.report || ({} as any);
    const cropImg = report?.crop?.image_url || '';
    const diseaseName = (report?.disease?.name || 'Unknown').replace(/_/g, ' ');
    const solution = report?.solution?.description || '';
    const scannedAt = report?.crop?.scanned_at || report?.generated_at || '';
    const verified = !!report?.is_varified;
    const expertHtml = expert ? `<h3>Verified By</h3><p>${expert.name || ''} (${expert.email || ''})</p>` : (verified ? '<p>Verified (expert details not available)</p>' : '<p>Status: Unverified</p>');

    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #222 }
            .header { text-align: center; margin-bottom: 16px }
            .section { margin-bottom: 12px }
            .img { width: 100%; max-height: 400px; object-fit: contain; }
            .meta { color: #666; font-size: 12px }
            .badge { display:inline-block; padding:6px 10px; border-radius:12px; font-weight:600 }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Crop Scan Report (Crop Disease Detection System)</h1>
            <h2>Scan Disease Detection Report</h2>
            <div class="meta">Generated: ${new Date(report?.generated_at || '').toLocaleString()} — Scanned: ${new Date(scannedAt).toLocaleString()}</div>
          </div>

          <div class="section">
            <h2>User</h2>
            <p><strong>${user.name}</strong><br/>${user.email || ''}</p>
          </div>

          <div class="section">
            <h2>Crop Image</h2>
            ${cropImg ? `<img class="img" src="${cropImg}" />` : '<p>No image available</p>'}
          </div>

          <div class="section">
            <h2>Detection</h2>
            <p><strong>${diseaseName}</strong></p>
            <p>${report?.disease?.description || ''}</p>
          </div>

          <div class="section">
            <h2>Recommended Action</h2>
            <p>${solution}</p>
          </div>

          <div class="section">
            <h2>Verification</h2>
            ${expertHtml}
          </div>
        </body>
      </html>
    `;
  };

  const onDownloadReport = async (h: HistoryItem) => {
    try {
      setPdfGenerating((s) => ({ ...s, [h.id]: true }));
      let expert: any = null;
      const feedbackId = (h.report as any)?.feedback_id;
      if (feedbackId) {
        try {
          const res = await httpClient.get<any>(`/feedbacks/${feedbackId}`);
          expert = res?.data?.expert || null;
        } catch (e) {
          // ignore
        }
      }

      const html = generateReportHtml(h, expert);
      const { uri } = await Print.printToFileAsync({ html });

      // On Android try to save to Downloads via MediaLibrary first
      if (Platform.OS === 'android') {
        try {
          const { status } = await MediaLibrary.requestPermissionsAsync();
          if (status === 'granted') {
            const asset = await MediaLibrary.createAssetAsync(uri);
            try {
              // Attempt to place the file in the Downloads album (may vary by device)
              await MediaLibrary.createAlbumAsync('Download', asset, false);
            } catch {
              // ignore album creation error - asset still created
            }
            Alert.alert('Saved', 'PDF saved to your device. You can find it in your Files/Downloads.');
            return;
          }
        } catch (e) {
          // fall back to sharing below
        }
      }

      // Fallback: share the file (works on iOS and Android) or show uri on web
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
      } else {
        Alert.alert('PDF Generated', `File: ${uri}`);
      }
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to generate PDF');
    } finally {
      setPdfGenerating((s) => ({ ...s, [h.id]: false }));
    }
  };

  const fetchReportFeedbacks = useCallback(async (reportId: string) => {
    console.log('[History] fetchReportFeedbacks called with reportId:', reportId);
    if (!reportId) {
      console.log('[History] No reportId provided, returning');
      return;
    }
    if (reportFeedbacks[reportId]) {
      console.log('[History] Feedbacks already loaded for report:', reportId);
      return;
    }
    if (feedbackLoading[reportId]) {
      console.log('[History] Already loading feedbacks for report:', reportId);
      return;
    }

    console.log('[History] Starting to fetch feedbacks for report:', reportId);
    setFeedbackLoading((s) => ({ ...s, [reportId]: true }));
    try {
      const url = `/reports/${reportId}/feedbacks`;
      console.log('[History] Fetching from URL:', url);
      const res = await httpClient.get<{ success: boolean; data: { items: FeedbackItem[] } }>(url);
      console.log('[History] Feedback response:', res);
      const items = res?.data?.items || [];
      console.log('[History] Setting feedbacks, count:', items.length);
      setReportFeedbacks((s) => ({ ...s, [reportId]: items }));
    } catch (e: any) {
      console.error('[History] Error fetching feedbacks:', e);
      // Set empty array so we don't keep trying
      setReportFeedbacks((s) => ({ ...s, [reportId]: [] }));
    } finally {
      setFeedbackLoading((s) => ({ ...s, [reportId]: false }));
    }
  }, [reportFeedbacks, feedbackLoading]);

  const toggleExpand = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      const willExpand = !next.has(id);
      if (willExpand) next.add(id); else next.delete(id);
      // after state update, if expanding fetch feedbacks for the report
      if (willExpand) {
        const found = items.find((it) => it.id === id) as any;
        const reportId = found?.report?.id;
        if (reportId) fetchReportFeedbacks(reportId);
      }
      return next;
    });
  }, [items, fetchReportFeedbacks]);

  const fetchHistories = useCallback(async (nextPage: number, opts?: { replace?: boolean; isRefresh?: boolean }) => {
    if (!user?.id) return;
    const isRefresh = !!opts?.isRefresh;
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError(null);
    try {
      // Backend route includes the `scans` prefix
      const url = `/scans/users/${user.id}/histories?page=${nextPage}&limit=10`;
      const res = await httpClient.get<HistoriesResponse>(url);
      const newItems = res?.data?.items || [];
      setItems((prev) => (nextPage === 1 || opts?.replace ? newItems : [...prev, ...newItems]));
      const pagination = res?.data?.pagination;
      setHasNext(!!pagination?.hasNext);
      setPage(pagination?.page || nextPage);
    } catch (e: any) {
      setError(e.message || 'Failed to load history');
    } finally {
      if (isRefresh) setRefreshing(false); else setLoading(false);
      setInitialLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchHistories(1);
  }, [fetchHistories]);

  const onRetry = useCallback(() => fetchHistories(page || 1, { replace: page === 1 }), [fetchHistories, page]);
  const loadMore = useCallback(() => { if (!loading && hasNext) fetchHistories(page + 1); }, [loading, hasNext, fetchHistories, page]);
  const onRefresh = useCallback(() => fetchHistories(1, { replace: true, isRefresh: true }), [fetchHistories]);

  // (FlatList Empty handled by listEmpty memo)

  const renderHeader = useMemo(() => (
    <View style={[commonStyles.itemsCenter, commonStyles.mb8, { paddingHorizontal: 24, paddingTop: 16 }]}>
      <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 100, height: 100, backgroundColor: colors.secondary[100], borderRadius: 50 }, commonStyles.mb6]}>
        <Ionicons name="time" size={48} color={colors.secondary[500]} />
      </View>
      <Text style={[commonStyles.text2xl, commonStyles.fontBold, commonStyles.textPrimary, commonStyles.textCenter, commonStyles.mb3]}>Scan History</Text>
      <Text style={[commonStyles.textBase, commonStyles.textSecondary, commonStyles.textCenter]}>View your previous crop scans and analysis results</Text>
    </View>
  ), []);

  const renderItem = useCallback(({ item: h }: { item: HistoryItem }) => {
    const diseaseName = h.report?.disease?.name || 'Unknown';
    const solution = h.report?.solution?.description || '';
    const expandedState = expanded.has(h.id);
    return (
      <Card key={h.id} variant="default" padding="small" style={commonStyles.mb4}>
        <TouchableOpacity onPress={() => toggleExpand(h.id)} activeOpacity={0.85} style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <TouchableOpacity onPress={() => { if (h.report?.crop?.image_url) setPreviewUri(h.report.crop.image_url); }} activeOpacity={0.8}>
            <Image source={{ uri: h.report?.crop?.image_url }} style={{ width: 82, height: 72, borderRadius: 12, backgroundColor: colors.neutral[200] }} />
          </TouchableOpacity>
          <View style={[commonStyles.ml4, { flex: 1 }]}>
            <View style={[commonStyles.flexRow, commonStyles.justifyBetween, commonStyles.itemsStart]}>
              <Text style={[commonStyles.textBase, commonStyles.fontSemibold, { color: colors.neutral[900], flexShrink: 1 }]} numberOfLines={1}>{diseaseName.replace(/_/g, ' ')}</Text>
              <Text style={[commonStyles.textXs, { color: colors.neutral[500] }]}>{formatRelative(h.viewed_at)}</Text>
            </View>
            <Text style={[commonStyles.textSm, { color: colors.neutral[600], marginTop: 4 }]} numberOfLines={expandedState ? undefined : 2}>{solution}</Text>
            <View style={[commonStyles.flexRow, commonStyles.mt3, { gap: 8, alignItems: 'center' }]}>
              <View style={{ marginLeft: 'auto', flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                {typeof h.report?.confidence === 'number' && (
                  <View style={{ paddingHorizontal: 10, paddingVertical: 4, backgroundColor: colors.primary[50], borderRadius: 999, borderWidth: 1, borderColor: colors.primary[200], flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="analytics" size={14} color={colors.primary[600]} />
                    <Text style={[commonStyles.textXs, { color: colors.primary[700], fontWeight: '600', marginLeft: 6 }]}>{(h.report.confidence * 100).toFixed(1)}%</Text>
                  </View>
                )}
              </View>
              <View>
                {h.report?.is_varified ? (
                  <View style={{ paddingHorizontal: 10, paddingVertical: 4, backgroundColor: colors.success[50], borderRadius: 999, borderWidth: 1, borderColor: colors.success[200], flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="checkmark-circle" size={14} color={colors.success[600]} />
                    <Text style={[commonStyles.textXs, { color: colors.success[700], fontWeight: '600', marginLeft: 6 }]}>Verified</Text>
                  </View>
                ) : (
                  <View style={{ paddingHorizontal: 10, paddingVertical: 4, backgroundColor: colors.danger[50], borderRadius: 999, borderWidth: 1, borderColor: colors.danger[200], flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="close-circle" size={14} color={colors.danger[600]} />
                    <Text style={[commonStyles.textXs, { color: colors.danger[700], fontWeight: '600', marginLeft: 6 }]}>Unverified</Text>
                  </View>
                )}
              </View>

            </View>
            <View style={{ minWidth: 80, marginTop: 6 }}>
              <Button
                title="Download"
                size="small"
                loading={!!pdfGenerating[h.id]}
                onPress={() => onDownloadReport(h)}
              />
            </View>
            <Text style={[commonStyles.textXs, { color: colors.neutral[500], marginTop: 6 }]}>Scanned: {new Date(h.report?.crop?.scanned_at).toLocaleString()}</Text>
            <TouchableOpacity
              onPress={() => toggleExpand(h.id)}
              activeOpacity={0.85}
              style={{
                marginTop: 8,
                alignSelf: 'flex-end',
                paddingVertical: 3,
                paddingHorizontal: 6,
                borderRadius: 12,
                backgroundColor: colors.secondary[50],
                borderWidth: 1,
                borderColor: colors.secondary[200],
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons name={expandedState ? 'chevron-up' : 'chevron-down'} size={14} color={colors.secondary[600]} style={{ marginRight: 4 }} />
              <Text style={[commonStyles.textXs, commonStyles.fontSemibold, { color: colors.secondary[600] }]}>{expandedState ? 'Show less' : 'Show more'}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>


        {/* Report Details - Full Width */}
        <View style={{ backgroundColor: colors.neutral[50], borderRadius: 0, padding: 16, marginHorizontal: -8, marginTop: 12 }}>
          <View style={[commonStyles.flexRow, commonStyles.justifyBetween, commonStyles.itemsCenter, commonStyles.mb3]}>
            <Text style={[commonStyles.textSm, commonStyles.fontSemibold, { color: colors.neutral[800] }]}>Report Status</Text>
            {h.report?.is_varified ? (
              <View style={{ paddingHorizontal: 10, paddingVertical: 4, backgroundColor: colors.success[50], borderRadius: 999, borderWidth: 1, borderColor: colors.success[200], flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="checkmark-circle" size={14} color={colors.success[600]} />
                <Text style={[commonStyles.textXs, { color: colors.success[700], fontWeight: '600', marginLeft: 6 }]}>Verified</Text>
              </View>
            ) : (
              <View style={{ paddingHorizontal: 10, paddingVertical: 4, backgroundColor: colors.warning[50], borderRadius: 999, borderWidth: 1, borderColor: colors.warning[200], flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="alert-circle" size={14} color={colors.warning[600]} />
                <Text style={[commonStyles.textXs, { color: colors.warning[700], fontWeight: '600', marginLeft: 6 }]}>Pending Verification</Text>
              </View>
            )}
          </View>

          {/* Disease and Solution Details */}
          <View style={{ marginTop: 12, marginBottom: 12 }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.neutral[200] }}>
              <View style={[commonStyles.flexRow, commonStyles.itemsCenter, { marginBottom: 8 }]}>
                <Ionicons name="medkit" size={18} color={colors.primary[600]} style={{ marginRight: 8 }} />
                <Text style={[commonStyles.textSm, commonStyles.fontSemibold, { color: colors.neutral[800] }]}>Disease Information</Text>
              </View>
              <Text style={[commonStyles.textSm, { color: colors.neutral[700], lineHeight: 20 }]}>{h.report?.disease?.description || 'No description available'}</Text>
            </View>

            <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.neutral[200], marginTop: 8 }}>
              <View style={[commonStyles.flexRow, commonStyles.itemsCenter, { marginBottom: 8 }]}>
                <Ionicons name="bulb" size={18} color={colors.success[600]} style={{ marginRight: 8 }} />
                <Text style={[commonStyles.textSm, commonStyles.fontSemibold, { color: colors.neutral[800] }]}>Recommended Solution</Text>
              </View>
              <Text style={[commonStyles.textSm, { color: colors.neutral[700], lineHeight: 20 }]}>{solution}</Text>
            </View>
          </View>

          {/* Fetch Feedbacks Button */}
          {!reportFeedbacks[h.report.id] && !feedbackLoading[h.report.id] && (
            <TouchableOpacity
              onPress={() => fetchReportFeedbacks(h.report.id)}
              style={{ paddingVertical: 8, paddingHorizontal: 12, backgroundColor: colors.primary[50], borderRadius: 8, borderWidth: 1, borderColor: colors.primary[200], flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
            >
              <Ionicons name="chatbox-ellipses" size={16} color={colors.primary[600]} style={{ marginRight: 6 }} />
              <Text style={[commonStyles.textSm, { color: colors.primary[700], fontWeight: '600' }]}>View Feedback</Text>
            </TouchableOpacity>
          )}

          {/* Loading State */}
          {feedbackLoading[h.report.id] && (
            <View style={{ paddingVertical: 12, alignItems: 'center' }}>
              <ActivityIndicator color={colors.primary[600]} />
            </View>
          )}

          {/* Feedback Display */}
          {reportFeedbacks[h.report.id] && (
            <View style={{ marginTop: 8 }}>
              {reportFeedbacks[h.report.id].length > 0 ? (
                <View>
                  <Text style={[commonStyles.textSm, commonStyles.fontSemibold, { color: colors.neutral[700], marginBottom: 8 }]}>Expert Feedback ({reportFeedbacks[h.report.id].length})</Text>
                  {reportFeedbacks[h.report.id].map((feedback) => (
                    <View key={feedback.id} style={{ marginBottom: 12, padding: 12, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: colors.neutral[200] }}>
                      <View style={[commonStyles.flexRow, commonStyles.justifyBetween, commonStyles.itemsStart, commonStyles.mb2]}>
                        <View style={[commonStyles.flexRow, commonStyles.itemsCenter, { flex: 1 }]}>
                          {feedback.expert?.avatar_url ? (
                            <Image source={{ uri: feedback.expert.avatar_url }} style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.neutral[200], marginRight: 8 }} />
                          ) : (
                            <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.neutral[200], alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                              <Ionicons name="person" size={14} color={colors.neutral[500]} />
                            </View>
                          )}
                          <View style={{ flex: 1 }}>
                            <Text style={[commonStyles.textSm, { color: colors.neutral[800], fontWeight: '600' }]}>{feedback.expert?.name || 'Expert'}</Text>
                            {feedback.expert?.email && (
                              <Text style={[commonStyles.textXs, { color: colors.neutral[500] }]}>{feedback.expert.email}</Text>
                            )}
                          </View>
                        </View>
                      </View>
                      <Text style={[commonStyles.textSm, { color: colors.neutral[700], marginTop: 4 }]} numberOfLines={3}>{feedback.feedback_text}</Text>
                      <View style={[commonStyles.flexRow, commonStyles.justifyBetween, commonStyles.itemsCenter, { marginTop: 8 }]}>
                        <Text style={[commonStyles.textXs, { color: colors.neutral[500] }]}>{feedback.varified_at ? new Date(feedback.varified_at).toLocaleDateString() : new Date(feedback.created_at).toLocaleDateString()}</Text>
                        <TouchableOpacity
                          onPress={() => setSelectedFeedback(feedback)}
                          style={{ paddingVertical: 4, paddingHorizontal: 10, backgroundColor: colors.primary[50], borderRadius: 6, borderWidth: 1, borderColor: colors.primary[200] }}
                        >
                          <Text style={[commonStyles.textXs, { color: colors.primary[700], fontWeight: '600' }]}>View Full</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                  <Ionicons name="chatbox-outline" size={32} color={colors.neutral[400]} style={{ marginBottom: 8 }} />
                  <Text style={[commonStyles.textSm, { color: colors.neutral[600] }]}>No feedback available for this report</Text>
                </View>
              )}
            </View>
          )}
        </View>
        {expandedState && (
          <View style={{ marginTop: 12 }}>
            <Text style={[commonStyles.textSm, commonStyles.fontSemibold, { color: colors.neutral[800] }]}>Disease Description</Text>
            <Text style={[commonStyles.textSm, { color: colors.neutral[700], marginTop: 4 }]}>{h.report?.disease?.description}</Text>
            <Text style={[commonStyles.textSm, commonStyles.fontSemibold, { color: colors.neutral[800], marginTop: 12 }]}>Recommended Action</Text>
            <Text style={[commonStyles.textSm, { color: colors.neutral[700], marginTop: 4 }]}>{solution}</Text>
          </View>
        )}
      </Card>
    );
  }, [expanded, toggleExpand, reportFeedbacks, feedbackLoading, fetchReportFeedbacks, setSelectedFeedback, user, pdfGenerating, onDownloadReport]);

  const listEmpty = useMemo(() => (
    <View>
      {initialLoading ? (
        <Card variant="outlined" padding="large" style={commonStyles.mb4}>
          <View style={[commonStyles.flexRow, commonStyles.itemsCenter]}>
            <ActivityIndicator color={colors.primary[600]} />
            <Text style={[commonStyles.textSm, commonStyles.ml3, { color: colors.neutral[600] }]}>Loading history…</Text>
          </View>
        </Card>
      ) : error ? (
        <Card variant="outlined" padding="large" style={commonStyles.mb4}>
          <View style={[commonStyles.itemsCenter]}>
            <Ionicons name="alert-circle" size={48} color={colors.danger[600]} style={commonStyles.mb3} />
            <Text style={[commonStyles.textBase, { color: colors.danger[700] }, commonStyles.mb2]}>Failed to load history</Text>
            <Text style={[commonStyles.textSm, { color: colors.neutral[600] }, commonStyles.mb4]}>{error}</Text>
            <TouchableOpacity onPress={onRetry} style={{ paddingVertical: 10, paddingHorizontal: 18, backgroundColor: colors.primary[600], borderRadius: 8 }}>
              <Text style={[commonStyles.textSm, commonStyles.fontSemibold, { color: '#fff' }]}>Retry</Text>
            </TouchableOpacity>
          </View>
        </Card>
      ) : (
        <Card variant="outlined" padding="large" style={commonStyles.mb4}>
          <View style={[commonStyles.itemsCenter]}>
            <Ionicons name="time-outline" size={64} color={colors.neutral[400]} style={commonStyles.mb4} />
            <Text style={[commonStyles.textLg, commonStyles.fontSemibold, { color: colors.neutral[700] }, commonStyles.mb2]}>No Scans Yet</Text>
            <Text style={[commonStyles.textBase, commonStyles.textSecondary, commonStyles.textCenter, commonStyles.mb4]}>You have no scan history yet. Start scanning crops to see them appear here.</Text>
            <View style={[commonStyles.flexRow, commonStyles.itemsCenter, { backgroundColor: colors.primary[100], borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 }]}>
              <Ionicons name="camera" size={20} color={colors.primary[600]} style={commonStyles.mr2} />
              <Text style={[commonStyles.textSm, commonStyles.fontMedium, { color: colors.primary[600] }]}>Start Scanning</Text>
            </View>
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
        keyExtractor={(h) => h.id}
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

      {/* Feedback Details Modal */}
      <Modal visible={!!selectedFeedback} transparent animationType="fade" onRequestClose={() => setSelectedFeedback(null)}>
        <Pressable style={styles.modalContainer} onPress={() => setSelectedFeedback(null)}>
          <Pressable style={styles.feedbackModalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={[commonStyles.textLg, commonStyles.fontBold, { color: colors.neutral[900] }]}>Feedback Details</Text>
              <TouchableOpacity onPress={() => setSelectedFeedback(null)}>
                <Ionicons name="close" size={24} color={colors.neutral[600]} />
              </TouchableOpacity>
            </View>

            {selectedFeedback && (
              <View style={{ paddingTop: 16 }}>
                {/* Expert Info */}
                <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.mb4]}>
                  {selectedFeedback.expert?.avatar_url ? (
                    <Image
                      source={{ uri: selectedFeedback.expert.avatar_url }}
                      style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.neutral[200], marginRight: 12 }}
                    />
                  ) : (
                    <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.neutral[200], alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                      <Ionicons name="person" size={24} color={colors.neutral[500]} />
                    </View>
                  )}
                  <View>
                    <Text style={[commonStyles.textBase, commonStyles.fontSemibold, { color: colors.neutral[900] }]}>{selectedFeedback.expert?.name || 'Expert'}</Text>
                    {selectedFeedback.expert?.email && (
                      <Text style={[commonStyles.textSm, { color: colors.neutral[600] }]}>{selectedFeedback.expert.email}</Text>
                    )}
                  </View>
                </View>

                {/* Feedback Text */}
                <View style={{ marginBottom: 16 }}>
                  <Text style={[commonStyles.textSm, commonStyles.fontSemibold, { color: colors.neutral[700], marginBottom: 8 }]}>Feedback</Text>
                  <View style={{ padding: 16, backgroundColor: colors.neutral[50], borderRadius: 12, borderWidth: 1, borderColor: colors.neutral[200] }}>
                    <Text style={[commonStyles.textSm, { color: colors.neutral[800], lineHeight: 20 }]}>{selectedFeedback.feedback_text}</Text>
                  </View>
                </View>

                {/* Metadata */}
                <View style={{ gap: 12 }}>
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar" size={20} color={colors.primary[600]} />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text style={[commonStyles.textXs, { color: colors.neutral[500] }]}>Created</Text>
                      <Text style={[commonStyles.textSm, { color: colors.neutral[800] }]}>{new Date(selectedFeedback.created_at).toLocaleString()}</Text>
                    </View>
                  </View>

                  {selectedFeedback.varified_at && (
                    <View style={styles.detailRow}>
                      <Ionicons name="checkmark-circle" size={20} color={colors.success[600]} />
                      <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text style={[commonStyles.textXs, { color: colors.neutral[500] }]}>Verified</Text>
                        <Text style={[commonStyles.textSm, { color: colors.neutral[800] }]}>{new Date(selectedFeedback.varified_at).toLocaleString()}</Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.detailRow}>
                    <Ionicons name="key" size={20} color={colors.primary[600]} />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text style={[commonStyles.textXs, { color: colors.neutral[500] }]}>Feedback ID</Text>
                      <Text style={[commonStyles.textXs, { color: colors.neutral[600], fontFamily: 'monospace' }]}>{selectedFeedback.id}</Text>
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
    height: '100%',
    width: '100%',
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
  feedbackModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '75%',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.neutral[50],
    borderRadius: 12,
  },
});
