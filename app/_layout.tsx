import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AudioPlayerBar, Text } from '../src/components';
import { ThemeProvider } from '../src/hooks/useTheme';
import { initI18n } from '../src/i18n';
import { databaseService } from '../src/services/databaseService';

// Keep the splash screen visible while we initialize
SplashScreen.preventAutoHideAsync().catch(() => {
  // In case splash screen is not available (Expo Go)
});

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize i18n
        await initI18n();
        
        // Initialize database
        await databaseService.initialize();
        
        // Optionally load fonts, data, etc.
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync().catch(() => {
        // In case splash screen is not available (Expo Go)
      });
    }
  }, [appIsReady]);

  if (!appIsReady) {
    // Show custom splash screen while initializing (for Expo Go)
    return (
      <ThemeProvider>
        <LinearGradient
          colors={['#1B4965', '#62B6CB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.splashContainer}
        >
          <View style={styles.splashContent}>
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
              & Tafsir
            </Text>
            
            <ActivityIndicator 
              size="large" 
              color="#FFFFFF" 
              style={styles.loader}
            />
          </View>
        </LinearGradient>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <View style={styles.container}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <AudioPlayerBar />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 24,
    padding: 20,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 24,
    marginBottom: 40,
    opacity: 0.95,
  },
  loader: {
    marginTop: 20,
  },
});

