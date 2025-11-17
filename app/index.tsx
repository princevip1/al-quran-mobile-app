import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { Button } from '../src/components/Button';
import { Card } from '../src/components/Card';
import { Text } from '../src/components/Text';
import { useTheme } from '../src/hooks/useTheme';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={theme.colors.gradientPrimary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Ionicons
            name="book"
            size={80}
            color="#FFFFFF"
            style={styles.icon}
          />
          <Text
            variant="h1"
            color="#FFFFFF"
            align="center"
            style={styles.title}
          >
            {t('home.title')}
          </Text>
          <Text
            variant="bodyLarge"
            color="rgba(255,255,255,0.9)"
            align="center"
            style={styles.subtitle}
          >
            {t('home.greeting')}
          </Text>
          <Text
            variant="body"
            color="rgba(255,255,255,0.8)"
            align="center"
            style={styles.description}
          >
            Complete Quran with Tafsir in Bangla & English{'\n'}
            High-quality audio recitations{'\n'}
            Beautiful reading experience
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Card
          variant="elevated"
          padding="lg"
          style={[styles.featureCard, { marginBottom: theme.spacing.lg }]}
        >
          <View style={styles.featureIcon}>
            <Ionicons
              name="book-outline"
              size={32}
              color={theme.colors.primary}
            />
          </View>
          <Text variant="h4" style={styles.featureTitle}>
            Full Quran Text
          </Text>
          <Text variant="body" color={theme.colors.textSecondary}>
            Complete Arabic text with translations in English and Bangla
          </Text>
        </Card>

        <Card
          variant="elevated"
          padding="lg"
          style={[styles.featureCard, { marginBottom: theme.spacing.lg }]}
        >
          <View style={styles.featureIcon}>
            <Ionicons
              name="newspaper-outline"
              size={32}
              color={theme.colors.secondary}
            />
          </View>
          <Text variant="h4" style={styles.featureTitle}>
            Detailed Tafsir
          </Text>
          <Text variant="body" color={theme.colors.textSecondary}>
            In-depth explanations from Ibn Kathir and Tafheem-ul-Quran
          </Text>
        </Card>

        <Card
          variant="elevated"
          padding="lg"
          style={[styles.featureCard, { marginBottom: theme.spacing.lg }]}
        >
          <View style={styles.featureIcon}>
            <Ionicons
              name="musical-notes-outline"
              size={32}
              color={theme.colors.accent}
            />
          </View>
          <Text variant="h4" style={styles.featureTitle}>
            Audio Recitations
          </Text>
          <Text variant="body" color={theme.colors.textSecondary}>
            High-quality tilawat with offline playback support
          </Text>
        </Card>

        <Card
          variant="elevated"
          padding="lg"
          style={[styles.featureCard, { marginBottom: theme.spacing['2xl'] }]}
        >
          <View style={styles.featureIcon}>
            <Ionicons
              name="cloud-offline-outline"
              size={32}
              color={theme.colors.success}
            />
          </View>
          <Text variant="h4" style={styles.featureTitle}>
            Offline First
          </Text>
          <Text variant="body" color={theme.colors.textSecondary}>
            Access your data anytime, anywhere without internet
          </Text>
        </Card>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          gradient
          onPress={() => router.push('/(tabs)/audio')}
          style={styles.button}
        >
          Get Started
        </Button>

        <Text
          variant="caption"
          align="center"
          style={styles.footer}
        >
          No ads • Privacy-first • Open Source
        </Text>
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
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 16,
  },
  description: {
    marginTop: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  featureCard: {
    alignItems: 'center',
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(27, 73, 101, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    marginBottom: 8,
  },
  button: {
    marginBottom: 16,
  },
  footer: {
    marginTop: 8,
    marginBottom: 32,
  },
});

