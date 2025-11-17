import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    FlatList,
    Pressable,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Card } from '../../src/components/Card';
import { Text } from '../../src/components/Text';
import { SURAHS_METADATA } from '../../src/constants/surahs';
import { useTheme } from '../../src/hooks/useTheme';

type FilterType = 'all' | 'meccan' | 'medinan';

export default function QuranScreen() {
    const { theme } = useTheme();
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<FilterType>('all');

    // Filter and search surahs with memoization for performance
    const filteredSurahs = useMemo(() => {
        let result = SURAHS_METADATA;

        // Apply revelation type filter
        if (filter !== 'all') {
            result = result.filter(s => s.revelationType.toLowerCase() === filter);
        }

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(s => 
                s.name.includes(searchQuery) ||
                s.englishName.toLowerCase().includes(query) ||
                s.banglaName.includes(searchQuery) ||
                s.englishTranslation.toLowerCase().includes(query) ||
                s.banglaTranslation.includes(searchQuery) ||
                s.number.toString().includes(query)
            );
        }

        return result;
    }, [searchQuery, filter]);


    const renderSurahItem = ({ item }: { item: typeof SURAHS_METADATA[0] }) => (
        <TouchableOpacity
            onPress={() => router.push(`/surah/${item.number}` as any)}
            activeOpacity={0.7}
        >
            <Card
                variant="elevated"
                padding="lg"
                style={styles.surahCard}
            >
                <View style={styles.surahHeader}>
                    {/* Number Badge with Gradient */}
                    <LinearGradient
                        colors={[theme.colors.primary, theme.colors.secondary]}
                        style={styles.surahNumber}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text variant="body" color="#FFFFFF" weight="bold">
                            {item.number}
                        </Text>
                    </LinearGradient>

                    {/* Surah Info */}
                    <View style={styles.surahInfo}>
                        <Text variant="h5" style={{ color: theme.colors.text }}>
                            {i18n.language === 'bn' ? item.banglaName : item.englishName}
                        </Text>
                        <Text variant="caption" color={theme.colors.textSecondary}>
                            {i18n.language === 'bn' ? item.banglaTranslation : item.englishTranslation} • {item.verses} {t('quran.verses')}
                        </Text>
                        <View style={styles.metaRow}>
                            <View style={[styles.tag, { backgroundColor: theme.colors.surface }]}>
                                <Ionicons 
                                    name={item.revelationType === 'Meccan' ? 'moon' : 'sunny'} 
                                    size={12} 
                                    color={theme.colors.accent} 
                                />
                                <Text 
                                    variant="caption" 
                                    style={{ color: theme.colors.textSecondary, marginLeft: 4 }}
                                >
                                    {t(`quran.${item.revelationType.toLowerCase()}`)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Arabic Name */}
                    <View style={styles.surahMeta}>
                        <Text variant="arabic" style={[styles.arabicName, { color: theme.colors.primary }]}>
                            {item.name}
                        </Text>
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );


    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Header with Gradient */}
            <LinearGradient
                colors={[theme.colors.primary, theme.colors.secondary]}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Text variant="h2" color="#FFFFFF">
                    {t('nav.quran')}
                </Text>
                <Text variant="body" color="#FFFFFF" style={{ opacity: 0.9, marginTop: 4 }}>
                    {t('quran.allSurahs', { count: 114 })}
                </Text>
            </LinearGradient>

            {/* Search Bar */}
            <View style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}>
                <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
                <TextInput
                    style={[styles.searchInput, { color: theme.colors.text }]}
                    placeholder={t('quran.searchPlaceholder')}
                    placeholderTextColor={theme.colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Filter Buttons */}
            <View style={styles.filterContainer}>
                {(['all', 'meccan', 'medinan'] as FilterType[]).map((filterType) => (
                    <Pressable
                        key={filterType}
                        onPress={() => setFilter(filterType)}
                        style={[
                            styles.filterButton,
                            { 
                                backgroundColor: filter === filterType 
                                    ? theme.colors.primary 
                                    : theme.colors.surface 
                            }
                        ]}
                    >
                        <Text 
                            variant="caption"
                            style={{ 
                                color: filter === filterType 
                                    ? '#FFFFFF' 
                                    : theme.colors.textSecondary,
                                fontWeight: filter === filterType ? '600' : '400'
                            }}
                        >
                            {t(`quran.filter.${filterType}`)}
                        </Text>
                    </Pressable>
                ))}
            </View>

            {/* Surah List */}
            <FlatList
                data={filteredSurahs}
                renderItem={renderSurahItem}
                keyExtractor={(item) => item.number.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="search-outline" size={64} color={theme.colors.textSecondary} />
                        <Text variant="h4" style={{ color: theme.colors.textSecondary, marginTop: 16 }}>
                            {t('search.noResults')}
                        </Text>
                        <Text variant="body" style={{ color: theme.colors.textSecondary, marginTop: 8 }}>
                            {t('search.tryDifferentQuery')}
                        </Text>
                    </View>
                }
            />
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
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: -20,
        marginBottom: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 16,
        gap: 8,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    surahCard: {
        marginBottom: 12,
    },
    surahHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    surahNumber: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    surahInfo: {
        flex: 1,
        gap: 4,
    },
    metaRow: {
        flexDirection: 'row',
        marginTop: 4,
        gap: 8,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    surahMeta: {
        alignItems: 'flex-end',
        gap: 4,
    },
    arabicName: {
        fontSize: 24,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
});

