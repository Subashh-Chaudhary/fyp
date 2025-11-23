import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, Platform, RefreshControl, ScrollView, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { httpClient } from '../../src/services/http.client';
import { TAB_BAR_HEIGHT, colors, commonStyles } from '../../styles';

interface NewsItem {
    id: string;
    title: string;
    content: string;
    source: string;
    category: string;
    url: string;
    is_active: boolean;
    publish_date: string | null;
    created_at: string;
    last_updated: string;
}

interface NewsFormData {
    title: string;
    content: string;
    source: string;
    category: string;
    url: string;
    is_active: boolean;
}

const showToast = (msg: string) => {
    if (Platform.OS === 'android') {
        ToastAndroid.show(msg, ToastAndroid.LONG);
    } else {
        Alert.alert('', msg);
    }
};

// Helper to extract user-friendly error messages from API responses
const extractErrorMessage = (error: any): string => {
    // Check if error has responseData with validation messages
    if (error?.responseData?.message) {
        const messages = error.responseData.message;

        // If it's an array of validation messages, join them
        if (Array.isArray(messages)) {
            return messages.join('\n');
        }

        // If it's a string, return it
        if (typeof messages === 'string') {
            return messages;
        }
    }

    // Check for standard error message
    if (error?.message) {
        return error.message;
    }

    // Fallback
    return 'An error occurred';
};

export default function AdminFeedManagement() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState<NewsFormData>({
        title: '',
        content: '',
        source: '',
        category: '',
        url: '',
        is_active: true,
    });

    const fetchNews = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        setError(null);

        try {
            const response = await httpClient.get<{ success: boolean; data: { items: NewsItem[] } }>('/news');
            if (response.success && response.data?.items) {
                // Sort by created_at descending (latest first)
                const sorted = response.data.items.sort((a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );
                setNews(sorted);
            } else {
                setError('Failed to load news');
            }
        } catch (e: any) {
            setError(extractErrorMessage(e));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    const handleCreateNews = async () => {
        if (!formData.title.trim() || !formData.content.trim()) {
            showToast('Title and content are required');
            return;
        }

        setSubmitting(true);
        try {
            const response = await httpClient.post<{ success: boolean; data: NewsItem }>('/news', formData);
            if (response.success) {
                showToast('News created successfully');
                setCreateModalVisible(false);
                resetForm();
                fetchNews();
            }
        } catch (e: any) {
            showToast(e.message || 'Failed to create news');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateNews = async () => {
        if (!selectedNews || !formData.title.trim() || !formData.content.trim()) {
            showToast('Title and content are required');
            return;
        }

        setSubmitting(true);
        try {
            const response = await httpClient.put<{ success: boolean; data: NewsItem }>(`/news/${selectedNews.id}`, formData);
            if (response.success) {
                showToast('News updated successfully');
                setEditModalVisible(false);
                setSelectedNews(null);
                resetForm();
                fetchNews();
            }
        } catch (e: any) {
            showToast(e.message || 'Failed to update news');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteNews = (newsItem: NewsItem) => {
        Alert.alert(
            'Delete News',
            'Are you sure you want to delete this news item?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await httpClient.delete(`/news/${newsItem.id}`);
                            showToast('News deleted successfully');
                            fetchNews();
                        } catch (e: any) {
                            showToast(e.message || 'Failed to delete news');
                        }
                    },
                },
            ]
        );
    };

    const openCreateModal = () => {
        resetForm();
        setCreateModalVisible(true);
    };

    const openEditModal = (newsItem: NewsItem) => {
        setSelectedNews(newsItem);
        setFormData({
            title: newsItem.title,
            content: newsItem.content,
            source: newsItem.source,
            category: newsItem.category,
            url: newsItem.url,
            is_active: newsItem.is_active,
        });
        setEditModalVisible(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            content: '',
            source: '',
            category: '',
            url: '',
            is_active: true,
        });
    };

    const renderNewsItem = ({ item }: { item: NewsItem }) => (
        <Card variant="default" padding="medium" style={commonStyles.mb4}>
            <View>
                <View style={[commonStyles.flexRow, commonStyles.justifyBetween, commonStyles.itemsStart, commonStyles.mb2]}>
                    <Text style={[commonStyles.textLg, commonStyles.fontSemibold, { color: colors.neutral[900], flex: 1, marginRight: 8 }]} numberOfLines={2}>
                        {item.title}
                    </Text>
                    <View style={[commonStyles.flexRow, { gap: 8 }]}>
                        <TouchableOpacity onPress={() => openEditModal(item)} style={{ padding: 8, backgroundColor: colors.primary[50], borderRadius: 8 }}>
                            <Ionicons name="create-outline" size={20} color={colors.primary[600]} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteNews(item)} style={{ padding: 8, backgroundColor: colors.danger[50], borderRadius: 8 }}>
                            <Ionicons name="trash-outline" size={20} color={colors.danger[600]} />
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={[commonStyles.textSm, { color: colors.neutral[700] }, commonStyles.mb3]} numberOfLines={3}>
                    {item.content}
                </Text>

                <View style={[commonStyles.flexRow, commonStyles.itemsCenter, { gap: 8, flexWrap: 'wrap' }]}>
                    <View style={{ paddingHorizontal: 8, paddingVertical: 4, backgroundColor: colors.secondary[50], borderRadius: 8, borderWidth: 1, borderColor: colors.secondary[200] }}>
                        <Text style={[commonStyles.textXs, { color: colors.secondary[700] }]}>{item.category}</Text>
                    </View>
                    <View style={{ paddingHorizontal: 8, paddingVertical: 4, backgroundColor: item.is_active ? colors.success[50] : colors.neutral[100], borderRadius: 8, borderWidth: 1, borderColor: item.is_active ? colors.success[200] : colors.neutral[200] }}>
                        <Text style={[commonStyles.textXs, { color: item.is_active ? colors.success[700] : colors.neutral[600] }]}>
                            {item.is_active ? 'Active' : 'Inactive'}
                        </Text>
                    </View>
                </View>

                <View style={[commonStyles.flexRow, commonStyles.justifyBetween, commonStyles.itemsCenter, { marginTop: 12 }]}>
                    <Text style={[commonStyles.textXs, { color: colors.neutral[500] }]}>
                        {item.source}
                    </Text>
                    <Text style={[commonStyles.textXs, { color: colors.neutral[500] }]}>
                        {new Date(item.created_at).toLocaleDateString()}
                    </Text>
                </View>
            </View>
        </Card>
    );

    const renderModal = (visible: boolean, onClose: () => void, onSubmit: () => void, title: string) => (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                <View style={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%' }}>
                    <View style={[commonStyles.flexRow, commonStyles.justifyBetween, commonStyles.itemsCenter, { padding: 20, borderBottomWidth: 1, borderBottomColor: colors.neutral[200] }]}>
                        <Text style={[commonStyles.textXl, commonStyles.fontBold, { color: colors.neutral[900] }]}>{title}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={colors.neutral[600]} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={{ padding: 20 }} showsVerticalScrollIndicator={false}>
                        <Input
                            label="Title *"
                            placeholder="Enter news title"
                            value={formData.title}
                            onChangeText={(text) => setFormData({ ...formData, title: text })}
                        />

                        <View style={commonStyles.mb4}>
                            <Text style={[commonStyles.textSm, commonStyles.fontMedium, { color: colors.neutral[700] }, commonStyles.mb2]}>Content *</Text>
                            <TextInput
                                placeholder="Enter news content"
                                value={formData.content}
                                onChangeText={(text) => setFormData({ ...formData, content: text })}
                                multiline
                                numberOfLines={4}
                                style={{
                                    borderWidth: 1,
                                    borderColor: colors.neutral[300],
                                    borderRadius: 8,
                                    padding: 12,
                                    fontSize: 14,
                                    color: colors.neutral[900],
                                    textAlignVertical: 'top',
                                    minHeight: 100,
                                }}
                            />
                        </View>

                        <Input
                            label="Source"
                            placeholder="Enter news source"
                            value={formData.source}
                            onChangeText={(text) => setFormData({ ...formData, source: text })}
                        />

                        <Input
                            label="Category"
                            placeholder="Enter category"
                            value={formData.category}
                            onChangeText={(text) => setFormData({ ...formData, category: text })}
                        />

                        <Input
                            label="URL"
                            placeholder="Enter news URL"
                            value={formData.url}
                            onChangeText={(text) => setFormData({ ...formData, url: text })}
                        />

                        <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.justifyBetween, commonStyles.mb4]}>
                            <Text style={[commonStyles.textSm, commonStyles.fontMedium, { color: colors.neutral[700] }]}>Active</Text>
                            <TouchableOpacity
                                onPress={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                style={{
                                    width: 50,
                                    height: 30,
                                    borderRadius: 15,
                                    backgroundColor: formData.is_active ? colors.success[500] : colors.neutral[300],
                                    justifyContent: 'center',
                                    paddingHorizontal: 2,
                                }}
                            >
                                <View
                                    style={{
                                        width: 26,
                                        height: 26,
                                        borderRadius: 13,
                                        backgroundColor: 'white',
                                        alignSelf: formData.is_active ? 'flex-end' : 'flex-start',
                                    }}
                                />
                            </TouchableOpacity>
                        </View>

                        <Button
                            title={submitting ? 'Saving...' : 'Save'}
                            onPress={onSubmit}
                            loading={submitting}
                            variant="primary"
                        />
                        <View style={{ height: 20 }} />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={[commonStyles.flex1, commonStyles.bgNeutral50]}>
            <View style={[commonStyles.flex1]}>
                {/* Header */}
                <View style={[commonStyles.itemsCenter, commonStyles.mb6, { paddingHorizontal: 24, paddingTop: 16 }]}>
                    <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 72, height: 72, backgroundColor: colors.secondary[100], borderRadius: 36 }, commonStyles.mb3]}>
                        <Ionicons name="newspaper" size={36} color={colors.secondary[500]} />
                    </View>
                    <Text style={[commonStyles.text2xl, commonStyles.fontBold, commonStyles.textPrimary, commonStyles.textCenter]}>
                        News Management
                    </Text>
                    <Text style={[commonStyles.textSm, commonStyles.textSecondary, commonStyles.textCenter]}>
                        Create, edit, and manage news articles
                    </Text>
                </View>

                {/* Content */}
                {loading && !refreshing ? (
                    <View style={[commonStyles.flex1, commonStyles.itemsCenter, commonStyles.justifyCenter]}>
                        <ActivityIndicator size="large" color={colors.primary[500]} />
                    </View>
                ) : error ? (
                    <View style={{ paddingHorizontal: 24 }}>
                        <Card variant="outlined" padding="large">
                            <View style={{ alignItems: 'center' }}>
                                <Ionicons name="alert-circle" size={48} color={colors.danger[600]} style={commonStyles.mb3} />
                                <Text style={[commonStyles.textBase, commonStyles.textPrimary, commonStyles.mb2]}>{error}</Text>
                                <TouchableOpacity onPress={() => fetchNews()} style={{ marginTop: 8 }}>
                                    <View style={{ backgroundColor: colors.primary[500], paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}>
                                        <Text style={[commonStyles.textSm, commonStyles.textWhite]}>Retry</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </Card>
                    </View>
                ) : (
                    <FlatList
                        data={news}
                        keyExtractor={(item) => item.id}
                        renderItem={renderNewsItem}
                        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: TAB_BAR_HEIGHT + 80 }}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchNews(true)} colors={[colors.primary[500]]} tintColor={colors.primary[500]} />}
                        ListEmptyComponent={
                            <Card variant="outlined" padding="large">
                                <View style={[commonStyles.itemsCenter]}>
                                    <Ionicons name="newspaper-outline" size={64} color={colors.neutral[400]} style={commonStyles.mb4} />
                                    <Text style={[commonStyles.textLg, commonStyles.fontSemibold, { color: colors.neutral[700] }, commonStyles.mb2]}>
                                        No News Yet
                                    </Text>
                                    <Text style={[commonStyles.textBase, commonStyles.textSecondary, commonStyles.textCenter]}>
                                        Create your first news article to get started
                                    </Text>
                                </View>
                            </Card>
                        }
                    />
                )}

                {/* Floating Action Button */}
                <TouchableOpacity
                    onPress={openCreateModal}
                    style={{
                        position: 'absolute',
                        bottom: TAB_BAR_HEIGHT + 20,
                        right: 24,
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: colors.primary[600],
                        alignItems: 'center',
                        justifyContent: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 8,
                    }}
                >
                    <Ionicons name="add" size={32} color="white" />
                </TouchableOpacity>
            </View>

            {/* Create Modal */}
            {renderModal(createModalVisible, () => setCreateModalVisible(false), handleCreateNews, 'Create News')}

            {/* Edit Modal */}
            {renderModal(editModalVisible, () => setEditModalVisible(false), handleUpdateNews, 'Edit News')}
        </SafeAreaView>
    );
}
