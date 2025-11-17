import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Modal, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { Card } from '../../src/components/Card';
import { Text } from '../../src/components/Text';
import { useTheme } from '../../src/hooks/useTheme';
import { changeLanguage } from '../../src/i18n';

export default function SettingsScreen() {
    const { theme, isDark, toggleTheme } = useTheme();
    const { t, i18n } = useTranslation();
    const [showLicensesModal, setShowLicensesModal] = useState(false);

    const handleLanguageChange = async (lang: string) => {
        await changeLanguage(lang);
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
                    {t('settings.title')}
                </Text>
                <Text variant="body" color="#FFFFFF" style={{ opacity: 0.9, marginTop: 4 }}>
                    {t('settings.subtitle')}
                </Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.content}>
                <Text variant="h5" style={styles.sectionTitle}>
                    {t('settings.appearance')}
                </Text>

                <Card variant="elevated" padding="lg" style={styles.settingCard}>
                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Ionicons
                                name={isDark ? 'moon' : 'sunny'}
                                size={24}
                                color={theme.colors.primary}
                                style={styles.settingIcon}
                            />
                            <View>
                                <Text variant="body" weight="medium">
                                    {t('settings.theme')}
                                </Text>
                                <Text variant="caption" color={theme.colors.textSecondary}>
                                    {isDark ? t('settings.dark') : t('settings.light')}
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={isDark}
                            onValueChange={toggleTheme}
                            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                </Card>

                <Card variant="elevated" padding="lg" style={styles.settingCard}>
                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Ionicons
                                name="language"
                                size={24}
                                color={theme.colors.secondary}
                                style={styles.settingIcon}
                            />
                            <View>
                                <Text variant="body" weight="medium">
                                    {t('settings.language')}
                                </Text>
                                <Text variant="caption" color={theme.colors.textSecondary}>
                                    {i18n.language === 'bn' ? 'বাংলা' : 'English'}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.languageButtons}>
                            <Card
                                variant={i18n.language === 'en' ? 'elevated' : 'outlined'}
                                padding="sm"
                                onPress={() => handleLanguageChange('en')}
                                style={styles.languageButton}
                            >
                                <Text variant="caption" weight="medium">
                                    EN
                                </Text>
                            </Card>
                            <Card
                                variant={i18n.language === 'bn' ? 'elevated' : 'outlined'}
                                padding="sm"
                                onPress={() => handleLanguageChange('bn')}
                                style={styles.languageButton}
                            >
                                <Text variant="caption" weight="medium">
                                    বাং
                                </Text>
                            </Card>
                        </View>
                    </View>
                </Card>

                <Text variant="h5" style={styles.sectionTitle}>
                    {t('settings.about')}
                </Text>

                <Card variant="elevated" padding="lg" style={styles.settingCard}>
                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Ionicons
                                name="information-circle"
                                size={24}
                                color={theme.colors.accent}
                                style={styles.settingIcon}
                            />
                            <View>
                                <Text variant="body" weight="medium">
                                    {t('settings.version')}
                                </Text>
                                <Text variant="caption" color={theme.colors.textSecondary}>
                                    1.0.0
                                </Text>
                            </View>
                        </View>
                    </View>
                </Card>

                <Card variant="elevated" padding="lg" style={styles.settingCard} onPress={() => setShowLicensesModal(true)}>
                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Ionicons
                                name="document-text"
                                size={24}
                                color={theme.colors.primary}
                                style={styles.settingIcon}
                            />
                            <Text variant="body" weight="medium">
                                {t('settings.dataLicenses')}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
                    </View>
                </Card>
            </ScrollView>

            {/* Data Sources & Licenses Modal */}
            <Modal
                visible={showLicensesModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowLicensesModal(false)}
            >
                <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
                    <LinearGradient
                        colors={[theme.colors.primary, theme.colors.secondary]}
                        style={styles.modalHeader}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.modalHeaderContent}>
                            <TouchableOpacity onPress={() => setShowLicensesModal(false)}>
                                <Ionicons name="close" size={28} color="#FFFFFF" />
                            </TouchableOpacity>
                            <Text variant="h4" color="#FFFFFF">
                                {t('settings.dataLicenses')}
                            </Text>
                            <View style={{ width: 28 }} />
                        </View>
                    </LinearGradient>

                    <ScrollView style={styles.modalContent} contentContainerStyle={styles.modalContentInner}>
                        {/* Quran Text */}
                        <Card variant="elevated" padding="lg" style={styles.licenseCard}>
                            <View style={styles.licenseHeader}>
                                <Ionicons name="book" size={24} color={theme.colors.primary} />
                                <Text variant="bodyLarge" weight="bold" style={styles.licenseTitle}>
                                    Quran Text (Arabic)
                                </Text>
                            </View>
                            <Text variant="body" color={theme.colors.textSecondary} style={styles.licenseText}>
                                Source: Al-Quran Cloud API
                            </Text>
                            <Text variant="caption" color={theme.colors.textTertiary} style={styles.licenseText}>
                                The Arabic Quran text is sourced from the Tanzil project, which provides verified Quranic text.
                            </Text>
                            <TouchableOpacity onPress={() => Linking.openURL('https://alquran.cloud')}>
                                <Text variant="caption" color={theme.colors.primary} style={styles.licenseLink}>
                                    https://alquran.cloud
                                </Text>
                            </TouchableOpacity>
                        </Card>

                        {/* English Translation */}
                        <Card variant="elevated" padding="lg" style={styles.licenseCard}>
                            <View style={styles.licenseHeader}>
                                <Ionicons name="language" size={24} color={theme.colors.secondary} />
                                <Text variant="bodyLarge" weight="bold" style={styles.licenseTitle}>
                                    English Translation
                                </Text>
                            </View>
                            <Text variant="body" color={theme.colors.textSecondary} style={styles.licenseText}>
                                Translator: Sahih International
                            </Text>
                            <Text variant="caption" color={theme.colors.textTertiary} style={styles.licenseText}>
                                The Sahih International translation is widely recognized for its clarity and accuracy. This translation is in the public domain.
                            </Text>
                            <Text variant="caption" color={theme.colors.textTertiary} style={styles.licenseText}>
                                License: Public Domain
                            </Text>
                        </Card>

                        {/* Bengali Translation */}
                        <Card variant="elevated" padding="lg" style={styles.licenseCard}>
                            <View style={styles.licenseHeader}>
                                <Ionicons name="language" size={24} color={theme.colors.accent} />
                                <Text variant="bodyLarge" weight="bold" style={styles.licenseTitle}>
                                    Bengali Translation
                                </Text>
                            </View>
                            <Text variant="body" color={theme.colors.textSecondary} style={styles.licenseText}>
                                Translator: মুহিউদ্দীন খান (Muhiuddin Khan)
                            </Text>
                            <Text variant="caption" color={theme.colors.textTertiary} style={styles.licenseText}>
                                Bengali translation provided through Al-Quran Cloud API, commonly used in Bangladesh and West Bengal.
                            </Text>
                            <Text variant="caption" color={theme.colors.textTertiary} style={styles.licenseText}>
                                License: Public Domain
                            </Text>
                        </Card>

                        {/* Tafsir */}
                        <Card variant="elevated" padding="lg" style={styles.licenseCard}>
                            <View style={styles.licenseHeader}>
                                <Ionicons name="book-outline" size={24} color={theme.colors.primary} />
                                <Text variant="bodyLarge" weight="bold" style={styles.licenseTitle}>
                                    Tafsir (Commentary)
                                </Text>
                            </View>
                            <Text variant="body" color={theme.colors.textSecondary} style={styles.licenseText}>
                                English: Ibn Kathir Tafsir
                            </Text>
                            <Text variant="caption" color={theme.colors.textTertiary} style={styles.licenseText}>
                                Tafsir Ibn Kathir is one of the most respected and accepted explanations of the Quran.
                            </Text>
                            <Text variant="body" color={theme.colors.textSecondary} style={[styles.licenseText, { marginTop: 8 }]}>
                                Bengali: তাফহীমুল কুরআন (Tafheem-ul-Quran)
                            </Text>
                            <Text variant="caption" color={theme.colors.textTertiary} style={styles.licenseText}>
                                A comprehensive commentary by Sayyid Abul Ala Maududi.
                            </Text>
                            <Text variant="caption" color={theme.colors.textTertiary} style={styles.licenseText}>
                                License: Public Domain
                            </Text>
                        </Card>

                        {/* Audio */}
                        <Card variant="elevated" padding="lg" style={styles.licenseCard}>
                            <View style={styles.licenseHeader}>
                                <Ionicons name="headset" size={24} color={theme.colors.secondary} />
                                <Text variant="bodyLarge" weight="bold" style={styles.licenseTitle}>
                                    Audio Recitations
                                </Text>
                            </View>
                            <Text variant="body" color={theme.colors.textSecondary} style={styles.licenseText}>
                                Source: EveryAyah.com
                            </Text>
                            <Text variant="caption" color={theme.colors.textTertiary} style={styles.licenseText}>
                                Audio files from various renowned reciters including Abdul Basit, Mishary Alafasy, and others. All audio files are provided under Creative Commons licensing.
                            </Text>
                            <TouchableOpacity onPress={() => Linking.openURL('https://everyayah.com')}>
                                <Text variant="caption" color={theme.colors.primary} style={styles.licenseLink}>
                                    https://everyayah.com
                                </Text>
                            </TouchableOpacity>
                            <Text variant="caption" color={theme.colors.textTertiary} style={styles.licenseText}>
                                License: Creative Commons
                            </Text>
                        </Card>

                        {/* App Information */}
                        <Card variant="elevated" padding="lg" style={styles.licenseCard}>
                            <View style={styles.licenseHeader}>
                                <Ionicons name="phone-portrait" size={24} color={theme.colors.accent} />
                                <Text variant="bodyLarge" weight="bold" style={styles.licenseTitle}>
                                    Application
                                </Text>
                            </View>
                            <Text variant="caption" color={theme.colors.textTertiary} style={styles.licenseText}>
                                This application is built with React Native and Expo, providing a modern and accessible way to read and listen to the Holy Quran.
                            </Text>
                            <Text variant="caption" color={theme.colors.textTertiary} style={styles.licenseText}>
                                Version: 1.0.0
                            </Text>
                        </Card>

                        {/* Disclaimer */}
                        <Card variant="outlined" padding="lg" style={styles.licenseCard}>
                            <View style={styles.licenseHeader}>
                                <Ionicons name="information-circle" size={24} color={theme.colors.textSecondary} />
                                <Text variant="bodyLarge" weight="bold" style={styles.licenseTitle}>
                                    Disclaimer
                                </Text>
                            </View>
                            <Text variant="caption" color={theme.colors.textTertiary} style={styles.licenseText}>
                                While we strive for accuracy, we recommend consulting with Islamic scholars for religious guidance. All translations and interpretations are provided for educational purposes.
                            </Text>
                        </Card>

                        <Text variant="caption" color={theme.colors.textTertiary} align="center" style={styles.footer}>
                            جزاك الله خيرا (JazakAllahu Khairan)
                        </Text>
                        <Text variant="caption" color={theme.colors.textTertiary} align="center" style={styles.footer}>
                            May Allah accept this effort and benefit the Ummah
                        </Text>
                    </ScrollView>
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
    sectionTitle: {
        marginTop: 8,
        marginBottom: 12,
    },
    settingCard: {
        marginBottom: 12,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingIcon: {
        marginRight: 12,
    },
    languageButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    languageButton: {
        minWidth: 50,
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
    },
    modalHeader: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    modalHeaderContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    modalContent: {
        flex: 1,
    },
    modalContentInner: {
        padding: 20,
        paddingBottom: 100,
    },
    licenseCard: {
        marginBottom: 16,
    },
    licenseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    licenseTitle: {
        marginLeft: 12,
        flex: 1,
    },
    licenseText: {
        marginTop: 4,
        lineHeight: 20,
    },
    licenseLink: {
        marginTop: 8,
        textDecorationLine: 'underline',
    },
    footer: {
        marginTop: 24,
        marginBottom: 8,
    },
});
