import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Color Palette - Beautiful Islamic-inspired colors
export const Colors = {
  light: {
    primary: '#1B4965',      // Deep Ocean Blue
    primaryLight: '#2C6B8F',
    primaryDark: '#0F2C3F',
    secondary: '#62B6CB',    // Turquoise
    secondaryLight: '#7DCDE0',
    accent: '#C1986A',       // Gold/Bronze
    accentLight: '#D4B38D',
    
    background: '#FFFFFF',
    backgroundSecondary: '#F8FAFB',
    backgroundTertiary: '#EEF4F7',
    
    surface: '#FFFFFF',
    surfaceElevated: '#F5F9FC',
    
    text: '#1A2226',
    textSecondary: '#6B7780',
    textTertiary: '#9CA3AF',
    
    border: '#E5E8EB',
    borderLight: '#F0F2F4',
    
    success: '#059669',
    warning: '#F59E0B',
    error: '#DC2626',
    info: '#3B82F6',
    
    // Arabic text specific
    arabic: '#1B4965',
    arabicHighlight: '#2C6B8F',
    
    // Translucent colors for overlays
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
    
    // Gradients
    gradientPrimary: ['#1B4965', '#2C6B8F'],
    gradientSecondary: ['#62B6CB', '#7DCDE0'],
    gradientAccent: ['#C1986A', '#D4B38D'],
    gradientBackground: ['#FFFFFF', '#F8FAFB'],
  },
  
  dark: {
    primary: '#62B6CB',      // Lighter blue for dark mode
    primaryLight: '#7DCDE0',
    primaryDark: '#4A9AB3',
    secondary: '#2C6B8F',
    secondaryLight: '#3D7FA8',
    accent: '#D4B38D',
    accentLight: '#E0C5A6',
    
    background: '#0F1419',
    backgroundSecondary: '#1A2226',
    backgroundTertiary: '#252D32',
    
    surface: '#1A2226',
    surfaceElevated: '#252D32',
    
    text: '#E8EAED',
    textSecondary: '#9CA3AF',
    textTertiary: '#6B7780',
    
    border: '#2D3640',
    borderLight: '#252D32',
    
    success: '#10B981',
    warning: '#FBBF24',
    error: '#EF4444',
    info: '#60A5FA',
    
    arabic: '#E8EAED',
    arabicHighlight: '#62B6CB',
    
    overlay: 'rgba(0, 0, 0, 0.7)',
    overlayLight: 'rgba(0, 0, 0, 0.5)',
    
    gradientPrimary: ['#2C6B8F', '#62B6CB'],
    gradientSecondary: ['#1B4965', '#2C6B8F'],
    gradientAccent: ['#C1986A', '#D4B38D'],
    gradientBackground: ['#0F1419', '#1A2226'],
  },
};

// Typography
export const Typography = {
  // Font Families
  fonts: {
    regular: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    medium: Platform.select({
      ios: 'System',
      android: 'Roboto-Medium',
      default: 'System',
    }),
    bold: Platform.select({
      ios: 'System',
      android: 'Roboto-Bold',
      default: 'System',
    }),
    arabic: Platform.select({
      ios: 'Traditional Arabic',
      android: 'sans-serif',
      default: 'serif',
    }),
  },
  
  // Font Sizes
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
    '6xl': 42,
    '7xl': 48,
  },
  
  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  
  // Font Weights
  weights: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
};

// Spacing scale
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
  '6xl': 80,
};

// Border Radius
export const BorderRadius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

// Shadows
export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 16,
  },
};

// Layout
export const Layout = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  isMediumDevice: width >= 375 && width < 414,
  isLargeDevice: width >= 414,
  
  // Safe area insets (can be overridden by actual safe area values)
  safeArea: {
    top: Platform.OS === 'ios' ? 44 : 0,
    bottom: Platform.OS === 'ios' ? 34 : 0,
  },
  
  // Common dimensions
  headerHeight: 56,
  tabBarHeight: 60,
  bottomSheetHeaderHeight: 48,
};

// Animation timings
export const Animation = {
  duration: {
    fastest: 100,
    fast: 200,
    normal: 300,
    slow: 400,
    slowest: 500,
  },
  
  easing: {
    linear: 'linear' as const,
    easeIn: 'ease-in' as const,
    easeOut: 'ease-out' as const,
    easeInOut: 'ease-in-out' as const,
  },
};

// Z-Index layers
export const ZIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
};

// Icon sizes
export const IconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
};

// Button sizes
export const ButtonSizes = {
  sm: {
    height: 32,
    paddingHorizontal: Spacing.md,
    fontSize: Typography.sizes.sm,
  },
  md: {
    height: 40,
    paddingHorizontal: Spacing.base,
    fontSize: Typography.sizes.base,
  },
  lg: {
    height: 48,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.sizes.md,
  },
  xl: {
    height: 56,
    paddingHorizontal: Spacing.xl,
    fontSize: Typography.sizes.lg,
  },
};

// Export a theme object that can be used with context
export const createTheme = (colorScheme: 'light' | 'dark') => ({
  colors: Colors[colorScheme],
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  layout: Layout,
  animation: Animation,
  zIndex: ZIndex,
  iconSizes: IconSizes,
  buttonSizes: ButtonSizes,
});

export type Theme = ReturnType<typeof createTheme>;
