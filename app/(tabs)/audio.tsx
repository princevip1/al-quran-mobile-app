import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card } from '../../src/components/Card';
import { Text } from '../../src/components/Text';
import { useTheme } from '../../src/hooks/useTheme';

export default function AudioScreen() {
    const { theme } = useTheme();
    const { t } = useTranslation();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
                <Text variant="h3" color="#FFFFFF">
                    {t('audio.title')}
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Card variant="elevated" padding="lg" style={styles.playerCard}>
                    <View style={styles.playerInfo}>
                        <Ionicons name="musical-notes" size={48} color={theme.colors.primary} />
                        <Text variant="h4" style={styles.playerTitle}>
                            Audio Player
                        </Text>
                        <Text variant="body" color={theme.colors.textSecondary} align="center">
                            Select a surah to start listening
                        </Text>
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
