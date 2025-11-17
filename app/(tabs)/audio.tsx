import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Text } from '../../src/components';
import { SURAHS_METADATA } from '../../src/constants/surahs';
import { useAudioPlayer } from '../../src/hooks/useAudioPlayer';
import { useTheme } from '../../src/hooks/useTheme';
import { audioPlayerService, AudioTrack } from '../../src/services/audioPlayerService';

// Popular Quran reciters
const RECITERS = [
    { id: 'abdul_basit', name: 'Abdul Basit', nameArabic: 'عبد الباسط عبد الصمد', quality: '192kbps', folder: 'Abdul_Basit_Murattal_192kbps' },
    { id: 'mishary', name: 'Mishary Rashid Alafasy', nameArabic: 'مشاري بن راشد العفاسي', quality: '128kbps', folder: 'Alafasy_128kbps' },
    { id: 'sudais', name: 'Abdurrahman As-Sudais', nameArabic: 'عبد الرحمن السديس', quality: '64kbps', folder: 'Abdurrahmaan_As-Sudais_64kbps' },
    { id: 'hudhaifi', name: 'Ali Al-Hudhaifi', nameArabic: 'علي الحذيفي', quality: '64kbps', folder: 'Hudhaify_64kbps' },
    { id: 'minshawi', name: 'Mohamed Siddiq Al-Minshawi', nameArabic: 'محمد صديق المنشاوي', quality: '128kbps', folder: 'Minshawy_Murattal_128kbps' },
    { id: 'ghamadi', name: 'Saad Al-Ghamadi', nameArabic: 'سعد الغامدي', quality: '40kbps', folder: 'Ghamadi_40kbps' },
];

export default function AudioScreen() {
    const { theme } = useTheme();
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const { currentTrack, isPlaying, queue } = useAudioPlayer();

    const [selectedReciter, setSelectedReciter] = useState(RECITERS[0]);
    const [showReciterModal, setShowReciterModal] = useState(false);
    const [showSurahModal, setShowSurahModal] = useState(false);

    // Initialize reciter in audio service
    React.useEffect(() => {
        audioPlayerService.setReciter(selectedReciter.name, selectedReciter.folder);
    }, []);

    const handlePlaySurah = (surahNumber: number) => {
        const surah = SURAHS_METADATA.find(s => s.number === surahNumber);
        if (!surah) return;

        // Create queue for entire surah
        const tracks: AudioTrack[] = [];
        for (let i = 1; i <= surah.verses; i++) {
            tracks.push({
                surahNumber,
                ayahNumber: i,
                reciter: selectedReciter.name,
                url: `https://everyayah.com/data/${selectedReciter.folder}/${String(surahNumber).padStart(3, '0')}${String(i).padStart(3, '0')}.mp3`,
            });
        }

        // Navigate to surah and start playing
        router.push(`/surah/${surahNumber}`);
        setShowSurahModal(false);
    };

    const getSurahName = (surahNumber: number) => {
        const surah = SURAHS_METADATA.find(s => s.number === surahNumber);
        return i18n.language === 'bn' ? surah?.banglaName : surah?.englishName;
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
                    {t('audio.title')}
                </Text>
                <Text variant="body" color="#FFFFFF" style={{ opacity: 0.9, marginTop: 4 }}>
                    {t('audio.selectReciter')}
                </Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Current Playing Section */}
                {currentTrack && (
                    <Card variant="elevated" padding="lg" style={styles.nowPlayingCard}>
                        <View style={styles.nowPlayingHeader}>
                            <Ionicons name="radio-outline" size={20} color={theme.colors.primary} />
                            <Text variant="h5" color={theme.colors.primary}>
                                {t('audio.nowPlaying')}
                            </Text>
                        </View>
                        <View style={styles.nowPlayingContent}>
                            <LinearGradient
                                colors={[theme.colors.accent + '30', theme.colors.secondary + '30']}
                                style={styles.nowPlayingIcon}
                            >
                                <Ionicons name="musical-notes" size={32} color={theme.colors.primary} />
                            </LinearGradient>
                            <View style={styles.nowPlayingInfo}>
                                <Text variant="h5" color={theme.colors.text}>
                                    {getSurahName(currentTrack.surahNumber)}
                                </Text>
                                <Text variant="body" color={theme.colors.textSecondary}>
                                    {t('audio.ayah')} {currentTrack.ayahNumber} • {currentTrack.reciter}
                                </Text>
                                <View style={styles.playingBadge}>
                                    <View style={[styles.playingDot, isPlaying && styles.playingDotActive]} />
                                    <Text variant="caption" color={theme.colors.textSecondary}>
                                        {isPlaying ? t('audio.playing') : t('audio.paused')}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </Card>
                )}

                {/* Selected Reciter Section */}
                <View style={styles.section}>
                    <Text variant="h5" style={styles.sectionTitle}>
                        {t('audio.selectReciter')}
                    </Text>
                    <Pressable onPress={() => setShowReciterModal(true)}>
                        <Card variant="elevated" padding="lg" style={styles.reciterCard}>
                            <View style={styles.reciterContent}>
                                <View style={styles.reciterInfo}>
                                    <LinearGradient
                                        colors={[theme.colors.primary, theme.colors.secondary]}
                                        style={styles.reciterIcon}
                                    >
                                        <Ionicons name="person" size={28} color="#FFFFFF" />
                                    </LinearGradient>
                                    <View>
                                        <Text variant="h5" color={theme.colors.text}>
                                            {selectedReciter.name}
                                        </Text>
                                        <Text variant="body" color={theme.colors.textSecondary} style={styles.arabicName}>
                                            {selectedReciter.nameArabic}
                                        </Text>
                                        <Text variant="caption" color={theme.colors.textTertiary}>
                                            {t('audio.quality')}: {selectedReciter.quality}
                                        </Text>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
                            </View>
                        </Card>
                    </Pressable>
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text variant="h5" style={styles.sectionTitle}>
                        {t('audio.quickActions')}
                    </Text>
                    <View style={styles.actionGrid}>
                        <Pressable onPress={() => setShowSurahModal(true)} style={{ flex: 1 }}>
                            <Card variant="elevated" padding="md" style={styles.actionCard}>
                                <LinearGradient
                                    colors={[theme.colors.primary + '20', theme.colors.secondary + '20']}
                                    style={styles.actionIcon}
                                >
                                    <Ionicons name="play-circle" size={32} color={theme.colors.primary} />
                                </LinearGradient>
                                <Text variant="body" align="center" color={theme.colors.text}>
                                    {t('audio.playSurah')}
                                </Text>
                            </Card>
                        </Pressable>

                        <Pressable onPress={() => router.push('/quran')} style={{ flex: 1 }}>
                            <Card variant="elevated" padding="md" style={styles.actionCard}>
                                <LinearGradient
                                    colors={[theme.colors.secondary + '20', theme.colors.accent + '20']}
                                    style={styles.actionIcon}
                                >
                                    <Ionicons name="book" size={32} color={theme.colors.secondary} />
                                </LinearGradient>
                                <Text variant="body" align="center" color={theme.colors.text}>
                                    {t('audio.browseQuran')}
                                </Text>
                            </Card>
                        </Pressable>
                    </View>
                </View>

                {/* Queue Section */}
                {queue.length > 0 && (
                    <View style={styles.section}>
                        <Text variant="h5" style={styles.sectionTitle}>
                            {t('audio.queue')} ({queue.length} {t('audio.ayahs')})
                        </Text>
                        <Card variant="elevated" padding="md">
                            {queue.slice(0, 5).map((track, index) => {
                                // Get surah name based on current language
                                const currentLanguage = t('languageCode');
                                const surahMetadata = SURAHS_METADATA.find(s => s.number === track.surahNumber);
                                const surahName = currentLanguage === 'bn' 
                                    ? surahMetadata?.banglaName || `${t('audio.surah')} ${track.surahNumber}`
                                    : surahMetadata?.englishName || `${t('audio.surah')} ${track.surahNumber}`;
                                
                                return (
                                    <View key={`${track.surahNumber}-${track.ayahNumber}`} style={styles.queueItem}>
                                        <View style={styles.queueNumber}>
                                            <Text variant="caption" color={theme.colors.textSecondary}>
                                                {index + 1}
                                            </Text>
                                        </View>
                                        <Text variant="body" color={theme.colors.text} style={{ flex: 1 }}>
                                            {surahName}, {t('audio.ayah')} {track.ayahNumber}
                                        </Text>
                                        {index === 0 && isPlaying && (
                                            <Ionicons name="volume-high" size={16} color={theme.colors.primary} />
                                        )}
                                    </View>
                                );
                            })}
                            {queue.length > 5 && (
                                <Text variant="caption" color={theme.colors.textTertiary} align="center" style={{ marginTop: 8 }}>
                                    +{queue.length - 5} {t('audio.moreInQueue')}
                                </Text>
                            )}
                        </Card>
                    </View>
                )}

                {/* Features Info */}
                <View style={styles.section}>
                    <Text variant="h5" style={styles.sectionTitle}>
                        {t('audio.features')}
                    </Text>
                    <Card variant="elevated" padding="lg">
                        <View style={styles.featureItem}>
                            <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                            <Text variant="body" color={theme.colors.text}>
                                {t('audio.feature1')}
                            </Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                            <Text variant="body" color={theme.colors.text}>
                                {t('audio.feature2')}
                            </Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                            <Text variant="body" color={theme.colors.text}>
                                {t('audio.feature3')}
                            </Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                            <Text variant="body" color={theme.colors.text}>
                                {t('audio.feature4')}
                            </Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                            <Text variant="body" color={theme.colors.text}>
                                {t('audio.feature5')}
                            </Text>
                        </View>
                    </Card>
                </View>
            </ScrollView>

            {/* Reciter Selection Modal */}
            <Modal
                visible={showReciterModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowReciterModal(false)}
            >
                <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setShowReciterModal(false)}>
                            <Ionicons name="close" size={28} color={theme.colors.text} />
                        </TouchableOpacity>
                        <Text variant="h4" color={theme.colors.text}>
                            {t('audio.selectReciter')}
                        </Text>
                        <View style={{ width: 28 }} />
                    </View>

                    <ScrollView contentContainerStyle={styles.modalContent}>
                        {RECITERS.map((reciter) => (
                            <Pressable
                                key={reciter.id}
                                onPress={() => {
                                    setSelectedReciter(reciter);
                                    audioPlayerService.setReciter(reciter.name, reciter.folder);
                                    setShowReciterModal(false);
                                }}
                            >
                                <Card
                                    variant="elevated"
                                    padding="lg"
                                    style={[
                                        styles.reciterModalCard,
                                        selectedReciter.id === reciter.id && {
                                            borderWidth: 2,
                                            borderColor: theme.colors.primary,
                                        },
                                    ]}
                                >
                                    <View style={styles.reciterModalContent}>
                                        <LinearGradient
                                            colors={
                                                selectedReciter.id === reciter.id
                                                    ? [theme.colors.primary, theme.colors.secondary]
                                                    : [theme.colors.surface, theme.colors.surface]
                                            }
                                            style={styles.reciterModalIcon}
                                        >
                                            <Ionicons
                                                name="person"
                                                size={24}
                                                color={selectedReciter.id === reciter.id ? '#FFFFFF' : theme.colors.textSecondary}
                                            />
                                        </LinearGradient>
                                        <View style={{ flex: 1 }}>
                                            <Text variant="h5" color={theme.colors.text}>
                                                {reciter.name}
                                            </Text>
                                            <Text variant="body" color={theme.colors.textSecondary} style={styles.arabicName}>
                                                {reciter.nameArabic}
                                            </Text>
                                            <Text variant="caption" color={theme.colors.textTertiary}>
                                                {t('audio.quality')}: {reciter.quality}
                                            </Text>
                                        </View>
                                        {selectedReciter.id === reciter.id && (
                                            <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                                        )}
                                    </View>
                                </Card>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
            </Modal>

            {/* Surah Selection Modal */}
            <Modal
                visible={showSurahModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowSurahModal(false)}
            >
                <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setShowSurahModal(false)}>
                            <Ionicons name="close" size={28} color={theme.colors.text} />
                        </TouchableOpacity>
                        <Text variant="h4" color={theme.colors.text}>
                            {t('audio.selectSurah')}
                        </Text>
                        <View style={{ width: 28 }} />
                    </View>

                    <FlatList
                        data={SURAHS_METADATA}
                        keyExtractor={(item) => item.number.toString()}
                        contentContainerStyle={styles.modalContent}
                        renderItem={({ item }) => (
                            <Pressable onPress={() => handlePlaySurah(item.number)}>
                                <Card variant="elevated" padding="md" style={styles.surahModalCard}>
                                    <View style={styles.surahModalContent}>
                                        <LinearGradient
                                            colors={[theme.colors.primary, theme.colors.secondary]}
                                            style={styles.surahNumber}
                                        >
                                            <Text variant="body" color="#FFFFFF" weight="bold">
                                                {item.number}
                                            </Text>
                                        </LinearGradient>
                                        <View style={{ flex: 1 }}>
                                            <Text variant="h5" color={theme.colors.text}>
                                                {i18n.language === 'bn' ? item.banglaName : item.englishName}
                                            </Text>
                                            <Text variant="caption" color={theme.colors.textSecondary}>
                                                {item.verses} {t('quran.verses')} • {item.revelationType === 'Meccan' ? t('quran.meccan') : t('quran.medinan')}
                                            </Text>
                                        </View>
                                        <Ionicons name="play-circle" size={28} color={theme.colors.primary} />
                                    </View>
                                </Card>
                            </Pressable>
                        )}
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
    content: {
        padding: 20,
        paddingBottom: 100,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        marginBottom: 12,
    },
    nowPlayingCard: {
        marginBottom: 24,
    },
    nowPlayingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    nowPlayingContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    nowPlayingIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nowPlayingInfo: {
        flex: 1,
    },
    playingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },
    playingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ccc',
    },
    playingDotActive: {
        backgroundColor: '#4CAF50',
    },
    reciterCard: {
        marginBottom: 8,
    },
    reciterContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    reciterInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        flex: 1,
    },
    reciterIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    arabicName: {
        fontFamily: 'System',
        marginTop: 2,
    },
    actionGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    actionCard: {
        alignItems: 'center',
        gap: 12,
    },
    actionIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    queueItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 8,
    },
    queueNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    modalContainer: {
        flex: 1,
        paddingTop: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    modalContent: {
        padding: 20,
        paddingBottom: 40,
    },
    reciterModalCard: {
        marginBottom: 12,
    },
    reciterModalContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    reciterModalIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    surahModalCard: {
        marginBottom: 8,
    },
    surahModalContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    surahNumber: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playerCard: {
        marginBottom: 24,
    },
    playerInfo: {
        alignItems: 'center',
        gap: 12,
    },
    playerTitle: {
        marginTop: 8,
    },
});
