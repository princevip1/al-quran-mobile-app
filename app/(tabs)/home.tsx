import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card } from '../../src/components/Card';
import { Text } from '../../src/components/Text';
import { useBookmarks, useReadingProgress, useStatistics } from '../../src/hooks/useDatabase';
import { useTheme } from '../../src/hooks/useTheme';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const router = useRouter();
    const { bookmarks } = useBookmarks();
    const { lastRead } = useReadingProgress();
    const { stats } = useStatistics();

    const formatReadingTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <LinearGradient
                colors={theme.colors.gradientPrimary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <Text variant="h3" color="#FFFFFF">
                        {t('home.greeting')}
                    </Text>
                    <Text variant="body" color="rgba(255,255,255,0.9)">
                        Continue your spiritual journey
                    </Text>
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <Text variant="h4" style={styles.sectionTitle}>
                    {t('home.lastRead')}
                </Text>
                {lastRead ? (
                    <TouchableOpacity onPress={() => router.push(`/surah/${lastRead.surahNumber}`)}>
                        <Card
                            variant="elevated"
                            padding="lg"
                            style={styles.lastReadCard}
                        >
                            <View style={styles.lastReadHeader}>
                                <View>
                                    <Text variant="h5">Surah {lastRead.surahNumber}</Text>
                                    <Text variant="caption">Verse {lastRead.ayahNumber}</Text>
                                </View>
                                <View style={[styles.progressCircle, { borderColor: theme.colors.primary }]}>
                                    <Text variant="body" color={theme.colors.primary}>
                                        {Math.round(lastRead.completionPercentage)}%
                                    </Text>
                                </View>
                            </View>
                            <View style={[styles.progressBar, { backgroundColor: theme.colors.borderLight }]}>
                                <View
                                    style={[
                                        styles.progressFill,
                                        { backgroundColor: theme.colors.primary, width: `${lastRead.completionPercentage}%` },
                                    ]}
                                />
                            </View>
                        </Card>
                    </TouchableOpacity>
                ) : (
                    <Card
                        variant="elevated"
                        padding="lg"
                        onPress={() => router.push('/quran')}
                        style={styles.lastReadCard}
                    >
                        <Text variant="body" color={theme.colors.textSecondary} align="center">
                            Start reading the Quran
                        </Text>
                    </Card>
                )}

                <Text variant="h4" style={styles.sectionTitle}>
                    {t('home.dailyVerse')}
                </Text>
                <Card
                    variant="gradient"
                    padding="lg"
                    gradient={theme.colors.gradientSecondary}
                    style={styles.dailyVerseCard}
                >
                    <Text variant="arabic" color="#FFFFFF" align="center" style={styles.arabicText}>
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </Text>
                    <Text variant="bodyLarge" color="#FFFFFF" align="center" style={styles.translation}>
                        In the name of Allah, the Entirely Merciful, the Especially Merciful.
                    </Text>
                    <Text variant="caption" color="rgba(255,255,255,0.8)" align="center">
                        Surah Al-Fatiha, Verse 1
                    </Text>
                </Card>

                <Text variant="h4" style={styles.sectionTitle}>
                    {t('home.quickAccess')}
                </Text>
                <View style={styles.quickAccessGrid}>
                    <Card
                        variant="elevated"
                        padding="lg"
                        onPress={() => router.push('/bookmarks')}
                        style={styles.quickAccessCard}
                    >
                        <Ionicons
                            name="bookmark"
                            size={32}
                            color={theme.colors.primary}
                            style={styles.quickAccessIcon}
                        />
                        <Text variant="body" align="center">
                            {t('nav.bookmarks')}
                        </Text>
                        <Text variant="caption" align="center" color={theme.colors.textTertiary}>
                            {bookmarks.length} saved
                        </Text>
                    </Card>

                    <Card
                        variant="elevated"
                        padding="lg"
                        onPress={() => { }}
                        style={styles.quickAccessCard}
                    >
                        <Ionicons
                            name="search"
                            size={32}
                            color={theme.colors.secondary}
                            style={styles.quickAccessIcon}
                        />
                        <Text variant="body" align="center">
                            Search
                        </Text>
                        <Text variant="caption" align="center" color={theme.colors.textTertiary}>
                            Find verses
                        </Text>
                    </Card>
                </View>

                <Text variant="h4" style={styles.sectionTitle}>
                    {t('home.statistics')}
                </Text>
                <Card variant="elevated" padding="lg" style={styles.statsCard}>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text variant="h3" color={theme.colors.primary}>
                                {stats.completedSurahs}
                            </Text>
                            <Text variant="caption" color={theme.colors.textSecondary}>
                                {t('home.completedSurahs')}
                            </Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
                        <View style={styles.statItem}>
                            <Text variant="h3" color={theme.colors.secondary}>
                                {formatReadingTime(stats.totalReadingTime)}
                            </Text>
                            <Text variant="caption" color={theme.colors.textSecondary}>
                                {t('home.totalReadingTime')}
                            </Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
                        <View style={styles.statItem}>
                            <Text variant="h3" color={theme.colors.accent}>
                                {stats.currentStreak}
                            </Text>
                            <Text variant="caption" color={theme.colors.textSecondary}>
                                {t('home.daysStreak')}
                            </Text>
                        </View>
                    </View>
                </Card>
            </ScrollView>
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
    headerContent: {
        gap: 4,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 100,
    },
    sectionTitle: {
        marginTop: 8,
        marginBottom: 16,
    },
    lastReadCard: {
        marginBottom: 24,
    },
    lastReadHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    progressCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressBar: {
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    dailyVerseCard: {
        marginBottom: 24,
    },
    arabicText: {
        marginBottom: 16,
    },
    translation: {
        marginBottom: 12,
    },
    quickAccessGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    quickAccessCard: {
        flex: 1,
        alignItems: 'center',
    },
    quickAccessIcon: {
        marginBottom: 8,
    },
    statsCard: {
        marginBottom: 24,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    statDivider: {
        width: 1,
        height: 40,
    },
});
