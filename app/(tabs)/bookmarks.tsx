import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card } from '../../src/components/Card';
import { Text } from '../../src/components/Text';
import { useTheme } from '../../src/hooks/useTheme';

export default function BookmarksScreen() {
    const { theme } = useTheme();
    const { t } = useTranslation();

    // Sample bookmark data
    const bookmarks = [
        {
            id: '1',
            surahName: 'Al-Fatiha',
            ayahNumber: 1,
            note: 'Beautiful opening of the Quran',
        },
    ];

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
                <Text variant="h3" color="#FFFFFF">
                    {t('bookmarks.title')}
                </Text>
            </View>

            {bookmarks.length === 0 ? (
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
                        <Card variant="elevated" padding="lg" style={styles.bookmarkCard}>
                            <View style={styles.bookmarkHeader}>
                                <Text variant="h5">{item.surahName}</Text>
                                <Text variant="caption">Verse {item.ayahNumber}</Text>
                            </View>
                            {item.note && (
                                <Text variant="body" color={theme.colors.textSecondary}>
                                    {item.note}
                                </Text>
                            )}
                        </Card>
                    )}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                />
            )}
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
        marginBottom: 8,
    },
});
