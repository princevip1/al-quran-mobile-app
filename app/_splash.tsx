import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native';
import { Text } from '../src/components/Text';
import { useTheme } from '../src/hooks/useTheme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    // Navigate to main app after 2 seconds
    const timer = setTimeout(() => {
      router.replace('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="book" size={120} color="#FFFFFF" />
          </View>

          <Text
            variant="h1"
            color="#FFFFFF"
            align="center"
            style={styles.title}
          >
            Al-Quran
          </Text>

          <Text
            variant="bodyLarge"
            color="rgba(255,255,255,0.9)"
            align="center"
            style={styles.subtitle}
          >
            القرآن الكريم
          </Text>

          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>

          <Text
            variant="caption"
            color="rgba(255,255,255,0.7)"
            align="center"
            style={styles.version}
          >
            Version 1.0.0
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    width,
    height,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    marginBottom: 60,
    fontSize: 32,
    fontWeight: '300',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  loader: {
    marginTop: 40,
  },
  version: {
    position: 'absolute',
    bottom: 40,
  },
});
