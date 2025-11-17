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
        colors={[theme.colors.primary, theme.colors.secondary]}
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
            {t('welcome.title')}
          </Text>
          <Text
            variant="bodyLarge"
            color="rgba(255,255,255,0.9)"
            align="center"
            style={styles.subtitle}
          >
            {t('welcome.greeting')}
          </Text>
          <Text
            variant="body"
            color="rgba(255,255,255,0.8)"
            align="center"
            style={styles.description}
          >
            {t('welcome.description')}
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
            {t('welcome.feature1Title')}
          </Text>
          <Text variant="body" color={theme.colors.textSecondary}>
            {t('welcome.feature1Desc')}
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
            {t('welcome.feature2Title')}
          </Text>
          <Text variant="body" color={theme.colors.textSecondary}>
            {t('welcome.feature2Desc')}
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
            {t('welcome.feature3Title')}
          </Text>
          <Text variant="body" color={theme.colors.textSecondary}>
            {t('welcome.feature3Desc')}
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
            {t('welcome.feature4Title')}
          </Text>
          <Text variant="body" color={theme.colors.textSecondary}>
            {t('welcome.feature4Desc')}
          </Text>
        </Card>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          gradient
          onPress={() => router.push('/(tabs)/home')}
          style={styles.button}
        >
          {t('welcome.getStarted')}
        </Button>

        <Text
          variant="caption"
          align="center"
          style={styles.footer}
        >
          {t('welcome.footer')}
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

