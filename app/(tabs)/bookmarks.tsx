import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, FlatList, Modal, Pressable, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Card } from '../../src/components/Card';
import { Text } from '../../src/components/Text';
import { SURAHS_METADATA } from '../../src/constants/surahs';
import { useBookmarks } from '../../src/hooks/useDatabase';
import { useTheme } from '../../src/hooks/useTheme';

export default function BookmarksScreen() {
    const { theme } = useTheme();
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const { bookmarks, loading, removeBookmark, updateBookmark, refresh } = useBookmarks();
    
    const [selectedBookmark, setSelectedBookmark] = useState<typeof bookmarks[0] | null>(null);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [noteText, setNoteText] = useState('');

    const handleDeleteBookmark = (surahNumber: number, ayahNumber: number) => {
        Alert.alert(
            t('bookmarks.deleteBookmark'),
            t('bookmarks.confirmDelete'),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('common.delete'),
                    style: 'destructive',
                    onPress: async () => {
                        await removeBookmark(surahNumber, ayahNumber);
                        refresh();
                    },
                },
            ]
        );
    };

    const handleEditNote = (bookmark: typeof bookmarks[0]) => {
        setSelectedBookmark(bookmark);
        setNoteText(bookmark.note || '');
        setShowNoteModal(true);
    };

    const handleSaveNote = async () => {
        if (selectedBookmark?.id) {
            await updateBookmark(selectedBookmark.id, { note: noteText });
            setShowNoteModal(false);
            setSelectedBookmark(null);
            setNoteText('');
            refresh();
        }
    };

    const getSurahName = (surahNumber: number) => {
        const surah = SURAHS_METADATA.find(s => s.number === surahNumber);
        return i18n.language === 'bn' ? surah?.banglaName : surah?.englishName;
    };

    const goToAyah = (surahNumber: number, ayahNumber: number) => {
        router.push(`/surah/${surahNumber}?ayah=${ayahNumber}`);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <LinearGradient
                colors={[theme.colors.primary, theme.colors.secondary]}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Text variant="h3" color="#FFFFFF">
                    {t('bookmarks.title')}
                </Text>
                <Text variant="body" color="#FFFFFF" style={{ opacity: 0.9, marginTop: 4 }}>
                    {bookmarks.length} {bookmarks.length === 1 ? 'bookmark' : 'bookmarks'}
                </Text>
            </LinearGradient>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : bookmarks.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons
                        name="bookmark-outline"
                        size={80}
                        color={theme.colors.textTertiary}
                    />
                    <Text variant="h4" color={theme.colors.textSecondary} style={styles.emptyTitle}>
                        {t('bookmarks.empty')}
                    </Text>
                    <Text variant="body" color={theme.colors.textTertiary} align="center">
                        {t('bookmarks.emptyDesc')}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={bookmarks}
                    renderItem={({ item }) => (
                        <Pressable onPress={() => goToAyah(item.surahNumber, item.ayahNumber)}>
                            <Card variant="elevated" padding="lg" style={styles.bookmarkCard}>
                                <View style={styles.bookmarkHeader}>
                                    <View style={styles.headerLeft}>
                                        <LinearGradient
                                            colors={[theme.colors.primary, theme.colors.secondary]}
                                            style={styles.badge}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                        >
                                            <Ionicons name="bookmark" size={16} color="#FFFFFF" />
                                        </LinearGradient>
                                        <View>
                                            <Text variant="h5" color={theme.colors.text}>
                                                {getSurahName(item.surahNumber)}
                                            </Text>
                                            <Text variant="caption" color={theme.colors.textSecondary}>
                                                {t('quran.verses').replace('{{count}}', '')} {item.ayahNumber}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.actions}>
                                        <TouchableOpacity
                                            onPress={() => handleEditNote(item)}
                                            style={styles.actionButton}
                                        >
                                            <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => handleDeleteBookmark(item.surahNumber, item.ayahNumber)}
                                            style={styles.actionButton}
                                        >
                                            <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {item.note && (
                                    <View style={[styles.noteContainer, { backgroundColor: theme.colors.surface }]}>
                                        <Ionicons name="document-text-outline" size={14} color={theme.colors.primary} />
                                        <Text variant="body" color={theme.colors.textSecondary} style={styles.noteText}>
                                            {item.note}
                                        </Text>
                                    </View>
                                )}
                                <View style={styles.footer}>
                                    <Text variant="caption" color={theme.colors.textTertiary}>
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </Text>
                                </View>
                            </Card>
                        </Pressable>
                    )}
                    keyExtractor={(item) => `${item.surahNumber}-${item.ayahNumber}`}
                    contentContainerStyle={styles.listContent}
                />
            )}

            {/* Note Edit Modal */}
            <Modal
                visible={showNoteModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowNoteModal(false)}
            >
                <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setShowNoteModal(false)}>
                            <Ionicons name="close" size={28} color={theme.colors.text} />
                        </TouchableOpacity>
                        <Text variant="h4" color={theme.colors.text}>
                            {t('bookmarks.editNote')}
                        </Text>
                        <TouchableOpacity onPress={handleSaveNote}>
                            <Text variant="body" color={theme.colors.primary} weight="bold">
                                {t('common.save')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={[
                            styles.noteInput,
                            {
                                backgroundColor: theme.colors.surface,
                                color: theme.colors.text,
                                borderColor: theme.colors.border,
                            },
                        ]}
                        value={noteText}
                        onChangeText={setNoteText}
                        placeholder={t('bookmarks.addNote')}
                        placeholderTextColor={theme.colors.textTertiary}
                        multiline
                        numberOfLines={8}
                        textAlignVertical="top"
                    />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 24,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyTitle: {
        marginTop: 16,
        marginBottom: 8,
    },
    listContent: {
        padding: 20,
        paddingBottom: 100,
    },
    bookmarkCard: {
        marginBottom: 12,
    },
    bookmarkHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    badge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        padding: 4,
    },
    noteContainer: {
        flexDirection: 'row',
        gap: 8,
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    noteText: {
        flex: 1,
    },
    footer: {
        marginTop: 4,
    },
    modalContainer: {
        flex: 1,
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    noteInput: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        minHeight: 200,
    },
});
