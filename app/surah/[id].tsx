import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Animated,
    Clipboard,
    Pressable,
    ScrollView,
    Share,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { Card, Text } from '../../src/components';
import { SURAHS_METADATA } from '../../src/constants/surahs';
import quranData from '../../src/data/quran_tafsir.json';
import { useBookmarks } from '../../src/hooks/useDatabase';
import { useTheme } from '../../src/hooks/useTheme';
import { audioPlayerService } from '../../src/services/audioPlayerService';

type FontSize = 'small' | 'medium' | 'large';

export default function SurahReadingScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { theme } = useTheme();
    const { t, i18n } = useTranslation();
    
    const [showTranslation, setShowTranslation] = useState(true);
    const [showTafsir, setShowTafsir] = useState(false);
    const [fontSize, setFontSize] = useState<FontSize>('medium');
    const [bookmarkedAyahs, setBookmarkedAyahs] = useState<Set<number>>(new Set());
    
    const scrollViewRef = useRef<ScrollView>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    
    const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();

    // Get surah metadata
    const surahNumber = parseInt(id as string);
    const surahMeta = SURAHS_METADATA.find(s => s.number === surahNumber);
    const surahData = quranData.surahs.find(s => s.number === surahNumber);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    // Load bookmarks from database
    useEffect(() => {
        const loadBookmarks = async () => {
            if (!surahData) return;
            const bookmarked = new Set<number>();
            for (const ayah of surahData.ayahs) {
                const isMarked = await isBookmarked(surahNumber, ayah.ayahNumber);
                if (isMarked) {
                    bookmarked.add(ayah.ayahNumber);
                }
            }
            setBookmarkedAyahs(bookmarked);
        };
        loadBookmarks();
    }, [surahNumber, surahData, isBookmarked]);

    if (!surahMeta || !surahData) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color={theme.colors.error} />
                    <Text variant="h4" style={{ color: theme.colors.text, marginTop: 16 }}>
                        {t('errors.surahNotFound')}
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={[styles.backButton, { backgroundColor: theme.colors.primary }]}
                    >
                        <Text variant="body" color="#FFFFFF">
                            {t('common.goBack')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const fontSizes = {
        small: { arabic: 28, text: 14, tafsir: 13 },
        medium: { arabic: 34, text: 16, tafsir: 14 },
        large: { arabic: 42, text: 18, tafsir: 16 },
    };

    const currentFontSize = fontSizes[fontSize];

    const toggleBookmark = async (ayahNumber: number) => {
        const isCurrentlyBookmarked = bookmarkedAyahs.has(ayahNumber);
        
        if (isCurrentlyBookmarked) {
            const success = await removeBookmark(surahNumber, ayahNumber);
            if (success) {
                setBookmarkedAyahs(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(ayahNumber);
                    return newSet;
                });
                Alert.alert(t('bookmarks.removed'), t('bookmarks.bookmarkRemoved'));
            }
        } else {
            const success = await addBookmark(surahNumber, ayahNumber);
            if (success) {
                setBookmarkedAyahs(prev => {
                    const newSet = new Set(prev);
                    newSet.add(ayahNumber);
                    return newSet;
                });
                Alert.alert(t('bookmarks.added'), t('bookmarks.bookmarkAdded'));
            }
        }
    };

    const shareAyah = async (ayah: typeof surahData.ayahs[0]) => {
        try {
            await Share.share({
                message: `${surahMeta.englishName} (${ayah.ayahNumber}:${surahData.number})\n\n${ayah.textArabic}\n\n${i18n.language === 'bn' ? ayah.translationBangla : ayah.translationEnglish}\n\n- Shared from Al-Quran App`,
            });
        } catch (error) {
            console.error('Share error:', error);
        }
    };

    const copyAyah = (ayah: typeof surahData.ayahs[0]) => {
        const text = `${ayah.textArabic}\n\n${i18n.language === 'bn' ? ayah.translationBangla : ayah.translationEnglish}`;
        Clipboard.setString(text);
        Alert.alert(t('common.copied'), t('common.copiedToClipboard'));
    };

    const renderAyah = (ayah: typeof surahData.ayahs[0], index: number) => {
        const isBookmarked = bookmarkedAyahs.has(ayah.ayahNumber);
        
        return (
            <Animated.View
                key={ayah.ayahNumber}
                style={[
                    styles.ayahContainer,
                    { opacity: fadeAnim },
                ]}
            >
                <Card variant="elevated" style={styles.ayahCard}>
                    {/* Ayah Header */}
                    <View style={styles.ayahHeader}>
                        <LinearGradient
                            colors={[theme.colors.primary, theme.colors.secondary]}
                            style={styles.ayahNumberBadge}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Text variant="body" color="#FFFFFF" weight="bold">
                                {ayah.ayahNumber}
                            </Text>
                        </LinearGradient>
                        
                        <View style={styles.ayahActions}>
                            {/* Audio Button */}
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => {
                                    // Build queue of all ayahs in this surah for continuous playback
                                    const queue = surahData.ayahs.map(a => ({
                                        surahNumber,
                                        ayahNumber: a.ayahNumber,
                                        reciter: 'Abdul Basit',
                                        url: `https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/${String(surahNumber).padStart(3, '0')}${String(a.ayahNumber).padStart(3, '0')}.mp3`,
                                        duration: 0,
                                    }));
                                    
                                    // Find the index of the current ayah
                                    const startIndex = surahData.ayahs.findIndex(a => a.ayahNumber === ayah.ayahNumber);
                                    
                                    // Set queue and load the track
                                    audioPlayerService.setQueue(queue, startIndex);
                                    audioPlayerService.loadTrack(queue[startIndex], true);
                                }}
                            >
                                <Ionicons name="play-circle-outline" size={24} color={theme.colors.secondary} />
                            </TouchableOpacity>

                            {/* Bookmark Button */}
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => toggleBookmark(ayah.ayahNumber)}
                            >
                                <Ionicons 
                                    name={isBookmarked ? 'bookmark' : 'bookmark-outline'} 
                                    size={24} 
                                    color={isBookmarked ? theme.colors.accent : theme.colors.textSecondary} 
                                />
                            </TouchableOpacity>

                            {/* Share Button */}
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => shareAyah(ayah)}
                            >
                                <Ionicons name="share-social-outline" size={24} color={theme.colors.textSecondary} />
                            </TouchableOpacity>

                            {/* Copy Button */}
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => copyAyah(ayah)}
                            >
                                <Ionicons name="copy-outline" size={24} color={theme.colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Arabic Text */}
                    <View style={styles.arabicTextContainer}>
                        <Text 
                            variant="arabic" 
                            style={[
                                styles.arabicText, 
                                { 
                                    fontSize: currentFontSize.arabic,
                                    color: theme.colors.text,
                                    lineHeight: currentFontSize.arabic * 1.8,
                                }
                            ]}
                        >
                            {ayah.textArabic}
                        </Text>
                    </View>

                    {/* Translation */}
                    {showTranslation && (
                        <View style={[styles.translationContainer, { backgroundColor: theme.colors.surface }]}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="language-outline" size={16} color={theme.colors.primary} />
                                <Text variant="caption" style={{ color: theme.colors.primary, marginLeft: 4 }}>
                                    {t('reading.translation')}
                                </Text>
                            </View>
                            <Text 
                                variant="body" 
                                style={[
                                    styles.translationText,
                                    { 
                                        fontSize: currentFontSize.text,
                                        color: theme.colors.text,
                                        lineHeight: currentFontSize.text * 1.6,
                                    }
                                ]}
                            >
                                {i18n.language === 'bn' ? ayah.translationBangla : ayah.translationEnglish}
                            </Text>
                        </View>
                    )}

                    {/* Tafsir */}
                    {showTafsir && (
                        <View style={[styles.tafsirContainer, { backgroundColor: theme.colors.primaryLight + '20' }]}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="book-outline" size={16} color={theme.colors.accent} />
                                <Text variant="caption" style={{ color: theme.colors.accent, marginLeft: 4 }}>
                                    {t('reading.tafsir')}
                                </Text>
                            </View>
                            <Text 
                                variant="body" 
                                style={[
                                    styles.tafsirText,
                                    { 
                                        fontSize: currentFontSize.tafsir,
                                        color: theme.colors.textSecondary,
                                        lineHeight: currentFontSize.tafsir * 1.7,
                                    }
                                ]}
                            >
                                {i18n.language === 'bn' ? ayah.tafsirBangla : ayah.tafsirEnglish}
                            </Text>
                        </View>
                    )}

                    {/* Metadata */}
                    <View style={styles.metadata}>
                        <View style={[styles.metaBadge, { backgroundColor: theme.colors.surface }]}>
                            <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                                {t('quran.juz')} {ayah.juz}
                            </Text>
                        </View>
                        <View style={[styles.metaBadge, { backgroundColor: theme.colors.surface }]}>
                            <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                                Ruku {ayah.ruku}
                            </Text>
                        </View>
                    </View>
                </Card>
            </Animated.View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Header */}
            <LinearGradient
                colors={[theme.colors.primary, theme.colors.secondary]}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text variant="h3" color="#FFFFFF">
                            {i18n.language === 'bn' ? surahMeta.banglaName : surahMeta.englishName}
                        </Text>
                        <Text variant="caption" color="#FFFFFF" style={{ opacity: 0.9 }}>
                            {i18n.language === 'bn' ? surahMeta.banglaTranslation : surahMeta.englishTranslation}
                        </Text>
                    </View>
                    <Text variant="arabic" style={styles.headerArabic}>
                        {surahMeta.name}
                    </Text>
                </View>

                {/* Surah Info */}
                <View style={styles.surahInfo}>
                    <View style={styles.infoItem}>
                        <Ionicons name={surahMeta.revelationType === 'Meccan' ? 'moon' : 'sunny'} size={16} color="#FFFFFF" />
                        <Text variant="caption" color="#FFFFFF" style={{ marginLeft: 4 }}>
                            {t(`quran.${surahMeta.revelationType.toLowerCase()}`)}
                        </Text>
                    </View>
                    <View style={styles.infoDivider} />
                    <View style={styles.infoItem}>
                        <Ionicons name="book-outline" size={16} color="#FFFFFF" />
                        <Text variant="caption" color="#FFFFFF" style={{ marginLeft: 4 }}>
                            {surahMeta.verses} {t('quran.verses')}
                        </Text>
                    </View>
                </View>
            </LinearGradient>

            {/* Control Bar */}
            <View style={[styles.controlBar, { backgroundColor: theme.colors.surface }]}>
                {/* Font Size Control */}
                <View style={styles.controlGroup}>
                    <Text variant="caption" style={{ color: theme.colors.textSecondary, marginRight: 8 }}>
                        {t('reading.fontSize')}
                    </Text>
                    {(['small', 'medium', 'large'] as FontSize[]).map((size) => (
                        <Pressable
                            key={size}
                            onPress={() => setFontSize(size)}
                            style={[
                                styles.fontButton,
                                {
                                    backgroundColor: fontSize === size ? theme.colors.primary : 'transparent',
                                    borderColor: theme.colors.primary,
                                }
                            ]}
                        >
                            <Text
                                variant="caption"
                                style={{
                                    color: fontSize === size ? '#FFFFFF' : theme.colors.textSecondary,
                                    fontSize: size === 'small' ? 10 : size === 'large' ? 14 : 12,
                                }}
                            >
                                A
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {/* Toggle Controls */}
                <View style={styles.toggleGroup}>
                    <TouchableOpacity
                        onPress={() => setShowTranslation(!showTranslation)}
                        style={[
                            styles.toggleButton,
                            {
                                backgroundColor: showTranslation ? theme.colors.primary : 'transparent',
                                borderColor: theme.colors.primary,
                            }
                        ]}
                    >
                        <Ionicons 
                            name="language-outline" 
                            size={16} 
                            color={showTranslation ? '#FFFFFF' : theme.colors.textSecondary} 
                        />
                        <Text
                            variant="caption"
                            style={{
                                color: showTranslation ? '#FFFFFF' : theme.colors.textSecondary,
                                marginLeft: 4,
                            }}
                        >
                            {t('reading.translation')}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setShowTafsir(!showTafsir)}
                        style={[
                            styles.toggleButton,
                            {
                                backgroundColor: showTafsir ? theme.colors.accent : 'transparent',
                                borderColor: theme.colors.accent,
                            }
                        ]}
                    >
                        <Ionicons 
                            name="book-outline" 
                            size={16} 
                            color={showTafsir ? '#FFFFFF' : theme.colors.textSecondary} 
                        />
                        <Text
                            variant="caption"
                            style={{
                                color: showTafsir ? '#FFFFFF' : theme.colors.textSecondary,
                                marginLeft: 4,
                            }}
                        >
                            {t('reading.tafsir')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Ayahs List */}
            <ScrollView
                ref={scrollViewRef}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {surahData.ayahs.map((ayah, index) => renderAyah(ayah, index))}

                {/* Completion Message */}
                <View style={styles.completionContainer}>
                    <LinearGradient
                        colors={[theme.colors.primary + '20', theme.colors.secondary + '20']}
                        style={styles.completionCard}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Ionicons name="checkmark-circle" size={48} color={theme.colors.primary} />
                        <Text variant="h4" style={{ color: theme.colors.text, marginTop: 12 }}>
                            {t('reading.surahCompleted')}
                        </Text>
                        <Text variant="body" style={{ color: theme.colors.textSecondary, marginTop: 8, textAlign: 'center' }}>
                            {t('reading.completionMessage')}
                        </Text>
                        
                        {/* Next Surah Button */}
                        {surahNumber < 114 && (
                            <TouchableOpacity
                                onPress={() => router.replace(`/surah/${surahNumber + 1}` as any)}
                                style={[styles.nextButton, { backgroundColor: theme.colors.primary }]}
                            >
                                <Text variant="body" color="#FFFFFF" weight="bold">
                                    {t('reading.nextSurah')}
                                </Text>
                                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                        )}
                    </LinearGradient>
                </View>
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
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    backBtn: {
        marginRight: 12,
    },
    headerCenter: {
        flex: 1,
    },
    headerArabic: {
        fontSize: 28,
        color: '#FFFFFF',
        marginLeft: 12,
    },
    surahInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoDivider: {
        width: 1,
        height: 16,
        backgroundColor: '#FFFFFF',
        opacity: 0.3,
        marginHorizontal: 16,
    },
    controlBar: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    controlGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    fontButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    toggleGroup: {
        flexDirection: 'row',
        gap: 8,
    },
    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    ayahContainer: {
        marginBottom: 16,
    },
    ayahCard: {
        padding: 16,
    },
    ayahHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    ayahNumberBadge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ayahActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        padding: 4,
    },
    arabicTextContainer: {
        paddingVertical: 12,
    },
    arabicText: {
        textAlign: 'right',
        writingDirection: 'rtl',
    },
    translationContainer: {
        marginTop: 12,
        padding: 12,
        borderRadius: 8,
    },
    tafsirContainer: {
        marginTop: 12,
        padding: 12,
        borderRadius: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    translationText: {},
    tafsirText: {},
    metadata: {
        flexDirection: 'row',
        marginTop: 12,
        gap: 8,
    },
    metaBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    backButton: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    completionContainer: {
        marginTop: 20,
        marginBottom: 40,
    },
    completionCard: {
        padding: 32,
        borderRadius: 16,
        alignItems: 'center',
    },
    nextButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        gap: 8,
    },
});
