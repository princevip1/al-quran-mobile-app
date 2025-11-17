import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import { Card } from '../../src/components/Card';
import { Text } from '../../src/components/Text';
import { useTheme } from '../../src/hooks/useTheme';
import { changeLanguage } from '../../src/i18n';

export default function SettingsScreen() {
    const { theme, isDark, toggleTheme, colorScheme } = useTheme();
    const { t, i18n } = useTranslation();

    const handleLanguageChange = async (lang: string) => {
        await changeLanguage(lang);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
                <Text variant="h3" color="#FFFFFF">
                    {t('settings.title')}
                </Text>
            </View>

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

                <Card variant="elevated" padding="lg" style={styles.settingCard} onPress={() => { }}>
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
});
