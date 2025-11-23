import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, Platform, RefreshControl, ScrollView, Switch, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { httpClient } from '../../src/services/http.client';
import { TAB_BAR_HEIGHT, colors, commonStyles } from '../../styles';

interface UserItem {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    avatar_url?: string;
    is_verified?: boolean;
    is_active: boolean;
    is_admin?: boolean;
    created_at: string;
    userType?: 'farmer' | 'expert'; // For local use
}

interface UserFormData {
    name: string;
    email: string;
    password?: string;
    confirm_password?: string;
    phone?: string;
    address?: string;
    user_type: 'farmer' | 'expert';
    is_active: boolean;
    is_verified?: boolean; // For experts
    is_admin?: boolean; // For users
}

const showToast = (msg: string) => {
    if (Platform.OS === 'android') {
        ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
        Alert.alert('', msg);
    }
};

// Helper to extract user-friendly error messages from API responses
const extractErrorMessage = (error: any): string => {
    if (error?.responseData?.message) {
        const messages = error.responseData.message;
        if (Array.isArray(messages)) return messages.join('\n');
        if (typeof messages === 'string') return messages;
    }
    if (error?.message) return error.message;
    return 'An error occurred';
};

import { useAuthStore } from '../../src/store/auth.store';

export default function AdminUserManagement() {
    const currentUser = useAuthStore((s) => s.user);
    const [activeTab, setActiveTab] = useState<'users' | 'experts'>('users');
    const [items, setItems] = useState<UserItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<UserItem | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState<UserFormData>({
        name: '',
        email: '',
        password: '',
        confirm_password: '',
        phone: '',
        address: '',
        user_type: 'farmer',
        is_active: true,
        is_verified: false,
        is_admin: false,
    });

    const fetchItems = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        setError(null);

        try {
            const endpoint = activeTab === 'users' ? '/users' : '/experts';
            const response = await httpClient.get<{ success: boolean; data: { items: UserItem[] } }>(endpoint);

            if (response.success && response.data?.items) {
                // Filter out current user if in users tab
                let items = response.data.items;
                if (activeTab === 'users' && currentUser?.id) {
                    items = items.filter(item => item.id !== currentUser.id);
                }

                // Sort by created_at descending
                const sorted = items.sort((a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );
                setItems(sorted);
            } else {
                setError(`Failed to load ${activeTab}`);
            }
        } catch (e: any) {
            setError(extractErrorMessage(e));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [activeTab, currentUser?.id]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleCreate = async () => {
        if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
            showToast('Name, Email and Password are required');
            return;
        }

        if (formData.password !== formData.confirm_password) {
            showToast('Passwords do not match');
            return;
        }

        setSubmitting(true);
        try {
            // Use auth/register endpoint to create new user
            const response = await httpClient.post<{ success: boolean }>('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                confirm_password: formData.confirm_password,
                user_type: formData.user_type,
            });

            if (response.success) {
                showToast(`${formData.user_type === 'farmer' ? 'User' : 'Expert'} created successfully`);
                setCreateModalVisible(false);
                resetForm();
                // If we created a user type different from current tab, switch tab? 
                // Or just refresh if same tab.
                if ((formData.user_type === 'farmer' && activeTab === 'users') ||
                    (formData.user_type === 'expert' && activeTab === 'experts')) {
                    fetchItems();
                } else {
                    // Switch tab to show the new item
                    setActiveTab(formData.user_type === 'farmer' ? 'users' : 'experts');
                }
            }
        } catch (e: any) {
            showToast(extractErrorMessage(e));
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = async () => {
        if (!selectedItem || !formData.name.trim() || !formData.email.trim()) {
            showToast('Name and Email are required');
            return;
        }

        setSubmitting(true);
        try {
            const endpoint = activeTab === 'users' ? `/user/${selectedItem.id}` : `/expert/${selectedItem.id}`;

            // Construct payload based on type
            const payload: any = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                is_active: formData.is_active,
            };

            if (activeTab === 'users') {
                payload.is_admin = formData.is_admin;
            } else {
                payload.is_verified = formData.is_verified;
            }

            const response = await httpClient.put<{ success: boolean }>(endpoint, payload);

            if (response.success) {
                showToast('Updated successfully');
                setEditModalVisible(false);
                setSelectedItem(null);
                resetForm();
                fetchItems();
            }
        } catch (e: any) {
            showToast(extractErrorMessage(e));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = (item: UserItem) => {
        Alert.alert(
            'Delete User',
            `Are you sure you want to delete ${item.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const endpoint = activeTab === 'users' ? `/user/${item.id}` : `/expert/${item.id}`;
                            await httpClient.delete(endpoint);
                            showToast('Deleted successfully');
                            fetchItems();
                        } catch (e: any) {
                            showToast(extractErrorMessage(e));
                        }
                    },
                },
            ]
        );
    };

    const openCreateModal = () => {
        resetForm();
        // Default user type based on active tab
        setFormData(prev => ({
            ...prev,
            user_type: activeTab === 'users' ? 'farmer' : 'expert'
        }));
        setCreateModalVisible(true);
    };

    const openEditModal = (item: UserItem) => {
        setSelectedItem(item);
        setFormData({
            name: item.name,
            email: item.email,
            password: '', // Password not editable here usually
            confirm_password: '',
            phone: item.phone || '',
            address: item.address || '',
            user_type: activeTab === 'users' ? 'farmer' : 'expert',
            is_active: item.is_active,
            is_verified: item.is_verified ?? false,
            is_admin: item.is_admin ?? false,
        });
        setEditModalVisible(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            confirm_password: '',
            phone: '',
            address: '',
            user_type: 'farmer',
            is_active: true,
            is_verified: false,
            is_admin: false,
        });
    };

    const renderItem = ({ item }: { item: UserItem }) => (
        <Card variant="default" padding="medium" style={commonStyles.mb4}>
            <View style={[commonStyles.flexRow, commonStyles.itemsCenter]}>
                <Avatar uri={item.avatar_url ?? null} name={item.name} size={50} />
                <View style={[commonStyles.flex1, commonStyles.ml3]}>
                    <Text style={[commonStyles.textBase, commonStyles.fontSemibold, { color: colors.neutral[900] }]}>
                        {item.name}
                    </Text>
                    <Text style={[commonStyles.textSm, { color: colors.neutral[500] }]}>
                        {item.email}
                    </Text>
                    <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.mt1, { gap: 6 }]}>
                        <View style={{
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            backgroundColor: item.is_active ? colors.success[50] : colors.neutral[100],
                            borderRadius: 4,
                            borderWidth: 1,
                            borderColor: item.is_active ? colors.success[200] : colors.neutral[200]
                        }}>
                            <Text style={[commonStyles.textXs, { color: item.is_active ? colors.success[700] : colors.neutral[600] }]}>
                                {item.is_active ? 'Active' : 'Inactive'}
                            </Text>
                        </View>

                        {activeTab === 'users' && item.is_admin && (
                            <View style={{
                                paddingHorizontal: 6,
                                paddingVertical: 2,
                                backgroundColor: colors.primary[50],
                                borderRadius: 4,
                                borderWidth: 1,
                                borderColor: colors.primary[200]
                            }}>
                                <Text style={[commonStyles.textXs, { color: colors.primary[700] }]}>Admin</Text>
                            </View>
                        )}

                        {activeTab === 'experts' && (
                            <View style={{
                                paddingHorizontal: 6,
                                paddingVertical: 2,
                                backgroundColor: item.is_verified ? colors.primary[50] : colors.warning[50],
                                borderRadius: 4,
                                borderWidth: 1,
                                borderColor: item.is_verified ? colors.primary[200] : colors.warning[200]
                            }}>
                                <Text style={[commonStyles.textXs, { color: item.is_verified ? colors.primary[700] : colors.warning[700] }]}>
                                    {item.is_verified ? 'Verified' : 'Pending'}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                <View style={[commonStyles.flexRow, { gap: 8 }]}>
                    <TouchableOpacity onPress={() => openEditModal(item)} style={{ padding: 8, backgroundColor: colors.primary[50], borderRadius: 8 }}>
                        <Ionicons name="create-outline" size={20} color={colors.primary[600]} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item)} style={{ padding: 8, backgroundColor: colors.danger[50], borderRadius: 8 }}>
                        <Ionicons name="trash-outline" size={20} color={colors.danger[600]} />
                    </TouchableOpacity>
                </View>
            </View>
        </Card>
    );

    const renderCreateModal = () => (
        <Modal visible={createModalVisible} transparent animationType="slide" onRequestClose={() => setCreateModalVisible(false)}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                <View style={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%' }}>
                    <View style={[commonStyles.flexRow, commonStyles.justifyBetween, commonStyles.itemsCenter, { padding: 20, borderBottomWidth: 1, borderBottomColor: colors.neutral[200] }]}>
                        <Text style={[commonStyles.textXl, commonStyles.fontBold, { color: colors.neutral[900] }]}>Add New {activeTab === 'users' ? 'User' : 'Expert'}</Text>
                        <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                            <Ionicons name="close" size={24} color={colors.neutral[600]} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={{ padding: 20 }} showsVerticalScrollIndicator={false}>
                        <Input
                            label="Full Name *"
                            placeholder="Enter full name"
                            value={formData.name}
                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                        />
                        <Input
                            label="Email *"
                            placeholder="Enter email address"
                            value={formData.email}
                            onChangeText={(text) => setFormData({ ...formData, email: text })}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <Input
                            label="Password *"
                            placeholder="Enter password"
                            value={formData.password}
                            onChangeText={(text) => setFormData({ ...formData, password: text })}
                            secureTextEntry
                        />
                        <Input
                            label="Confirm Password *"
                            placeholder="Confirm password"
                            value={formData.confirm_password}
                            onChangeText={(text) => setFormData({ ...formData, confirm_password: text })}
                            secureTextEntry
                        />

                        <View style={commonStyles.mb4}>
                            <Text style={[commonStyles.textSm, commonStyles.fontMedium, { color: colors.neutral[700] }, commonStyles.mb2]}>User Type</Text>
                            <View style={[commonStyles.flexRow, { gap: 12 }]}>
                                <TouchableOpacity
                                    style={[
                                        commonStyles.flex1,
                                        commonStyles.py2,
                                        commonStyles.itemsCenter,
                                        {
                                            backgroundColor: formData.user_type === 'farmer' ? colors.primary[100] : colors.neutral[100],
                                            borderRadius: 8,
                                            borderWidth: 1,
                                            borderColor: formData.user_type === 'farmer' ? colors.primary[300] : colors.neutral[200],
                                        },
                                    ]}
                                    onPress={() => setFormData({ ...formData, user_type: 'farmer' })}
                                >
                                    <Text style={{ color: formData.user_type === 'farmer' ? colors.primary[700] : colors.neutral[600], fontWeight: '600' }}>Farmer</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        commonStyles.flex1,
                                        commonStyles.py2,
                                        commonStyles.itemsCenter,
                                        {
                                            backgroundColor: formData.user_type === 'expert' ? colors.primary[100] : colors.neutral[100],
                                            borderRadius: 8,
                                            borderWidth: 1,
                                            borderColor: formData.user_type === 'expert' ? colors.primary[300] : colors.neutral[200],
                                        },
                                    ]}
                                    onPress={() => setFormData({ ...formData, user_type: 'expert' })}
                                >
                                    <Text style={{ color: formData.user_type === 'expert' ? colors.primary[700] : colors.neutral[600], fontWeight: '600' }}>Expert</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Button
                            title={submitting ? 'Creating...' : 'Create Account'}
                            onPress={handleCreate}
                            loading={submitting}
                            variant="primary"
                        />
                        <View style={{ height: 20 }} />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );

    const renderEditModal = () => (
        <Modal visible={editModalVisible} transparent animationType="slide" onRequestClose={() => setEditModalVisible(false)}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                <View style={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%' }}>
                    <View style={[commonStyles.flexRow, commonStyles.justifyBetween, commonStyles.itemsCenter, { padding: 20, borderBottomWidth: 1, borderBottomColor: colors.neutral[200] }]}>
                        <Text style={[commonStyles.textXl, commonStyles.fontBold, { color: colors.neutral[900] }]}>Edit {activeTab === 'users' ? 'User' : 'Expert'}</Text>
                        <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                            <Ionicons name="close" size={24} color={colors.neutral[600]} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={{ padding: 20 }} showsVerticalScrollIndicator={false}>
                        <Input
                            label="Full Name *"
                            value={formData.name}
                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                        />
                        <Input
                            label="Email *"
                            value={formData.email}
                            onChangeText={(text) => setFormData({ ...formData, email: text })}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <Input
                            label="Phone"
                            value={formData.phone}
                            onChangeText={(text) => setFormData({ ...formData, phone: text })}
                            keyboardType="phone-pad"
                        />
                        <Input
                            label="Address"
                            value={formData.address}
                            onChangeText={(text) => setFormData({ ...formData, address: text })}
                        />

                        <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.justifyBetween, commonStyles.mb4, commonStyles.mt2]}>
                            <View>
                                <Text style={[commonStyles.textBase, commonStyles.fontSemibold, { color: colors.neutral[800] }]}>Active Status</Text>
                                <Text style={[commonStyles.textSm, { color: colors.neutral[500] }]}>User can login</Text>
                            </View>
                            <Switch
                                value={formData.is_active}
                                onValueChange={(val) => setFormData({ ...formData, is_active: val })}
                                trackColor={{ false: colors.neutral[300], true: colors.success[300] }}
                                thumbColor={formData.is_active ? colors.success[600] : '#f4f3f4'}
                            />
                        </View>

                        {activeTab === 'users' && (
                            <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.justifyBetween, commonStyles.mb4]}>
                                <View>
                                    <Text style={[commonStyles.textBase, commonStyles.fontSemibold, { color: colors.neutral[800] }]}>Admin Privileges</Text>
                                    <Text style={[commonStyles.textSm, { color: colors.neutral[500] }]}>Full system access</Text>
                                </View>
                                <Switch
                                    value={formData.is_admin}
                                    onValueChange={(val) => setFormData({ ...formData, is_admin: val })}
                                    trackColor={{ false: colors.neutral[300], true: colors.primary[300] }}
                                    thumbColor={formData.is_admin ? colors.primary[600] : '#f4f3f4'}
                                />
                            </View>
                        )}

                        {activeTab === 'experts' && (
                            <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.justifyBetween, commonStyles.mb4]}>
                                <View>
                                    <Text style={[commonStyles.textBase, commonStyles.fontSemibold, { color: colors.neutral[800] }]}>Verified Expert</Text>
                                    <Text style={[commonStyles.textSm, { color: colors.neutral[500] }]}>Documents verified</Text>
                                </View>
                                <Switch
                                    value={formData.is_verified}
                                    onValueChange={(val) => setFormData({ ...formData, is_verified: val })}
                                    trackColor={{ false: colors.neutral[300], true: colors.primary[300] }}
                                    thumbColor={formData.is_verified ? colors.primary[600] : '#f4f3f4'}
                                />
                            </View>
                        )}

                        <Button
                            title={submitting ? 'Saving...' : 'Save Changes'}
                            onPress={handleUpdate}
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
                <View style={[commonStyles.itemsCenter, commonStyles.mb4, { paddingHorizontal: 24, paddingTop: 16 }]}>
                    <View style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 64, height: 64, backgroundColor: colors.primary[100], borderRadius: 32 }, commonStyles.mb3]}>
                        <Ionicons name="people" size={32} color={colors.primary[600]} />
                    </View>
                    <Text style={[commonStyles.text2xl, commonStyles.fontBold, commonStyles.textPrimary, commonStyles.textCenter]}>
                        User Management
                    </Text>
                </View>

                {/* Tabs */}
                <View style={[commonStyles.flexRow, { paddingHorizontal: 24, marginBottom: 16 }]}>
                    <TouchableOpacity
                        style={[
                            commonStyles.flex1,
                            commonStyles.py3,
                            commonStyles.itemsCenter,
                            {
                                borderBottomWidth: 2,
                                borderBottomColor: activeTab === 'users' ? colors.primary[500] : 'transparent'
                            }
                        ]}
                        onPress={() => setActiveTab('users')}
                    >
                        <Text style={[
                            commonStyles.textBase,
                            commonStyles.fontSemibold,
                            { color: activeTab === 'users' ? colors.primary[600] : colors.neutral[500] }
                        ]}>Users</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            commonStyles.flex1,
                            commonStyles.py3,
                            commonStyles.itemsCenter,
                            {
                                borderBottomWidth: 2,
                                borderBottomColor: activeTab === 'experts' ? colors.primary[500] : 'transparent'
                            }
                        ]}
                        onPress={() => setActiveTab('experts')}
                    >
                        <Text style={[
                            commonStyles.textBase,
                            commonStyles.fontSemibold,
                            { color: activeTab === 'experts' ? colors.primary[600] : colors.neutral[500] }
                        ]}>Experts</Text>
                    </TouchableOpacity>
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
                                <TouchableOpacity onPress={() => fetchItems()} style={{ marginTop: 8 }}>
                                    <View style={{ backgroundColor: colors.primary[500], paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}>
                                        <Text style={[commonStyles.textSm, commonStyles.textWhite]}>Retry</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </Card>
                    </View>
                ) : (
                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: TAB_BAR_HEIGHT + 80 }}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchItems(true)} colors={[colors.primary[500]]} tintColor={colors.primary[500]} />}
                        ListEmptyComponent={
                            <Card variant="outlined" padding="large">
                                <View style={[commonStyles.itemsCenter]}>
                                    <Ionicons name="people-outline" size={64} color={colors.neutral[400]} style={commonStyles.mb4} />
                                    <Text style={[commonStyles.textLg, commonStyles.fontSemibold, { color: colors.neutral[700] }, commonStyles.mb2]}>
                                        No {activeTab === 'users' ? 'Users' : 'Experts'} Found
                                    </Text>
                                    <Text style={[commonStyles.textBase, commonStyles.textSecondary, commonStyles.textCenter]}>
                                        Create your first {activeTab === 'users' ? 'user' : 'expert'} to get started
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

            {renderCreateModal()}
            {renderEditModal()}
        </SafeAreaView>
    );
}
