import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    ViewProps
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient';
  padding?: keyof typeof import('../constants/theme').Spacing;
  onPress?: () => void;
  gradient?: [string, string];
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'base',
  onPress,
  gradient,
  style,
  ...props
}) => {
  const { theme } = useTheme();

  const variantStyles = {
    default: {
      backgroundColor: theme.colors.surface,
      ...theme.shadows.sm,
    },
    elevated: {
      backgroundColor: theme.colors.surfaceElevated,
      ...theme.shadows.lg,
    },
    outlined: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    gradient: {
      backgroundColor: 'transparent',
      ...theme.shadows.md,
    },
  };

  const cardStyles = [
    styles.base,
    {
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[padding],
    },
    variantStyles[variant],
    style,
  ];

  const content = (
    <View style={cardStyles} {...props}>
      {children}
    </View>
  );

  if (variant === 'gradient' && gradient) {
    const gradientContent = (
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[cardStyles, { padding: 0 }]}
      >
        <View style={{ padding: theme.spacing[padding] }}>
          {children}
        </View>
      </LinearGradient>
    );

    if (onPress) {
      return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
          {gradientContent}
        </TouchableOpacity>
      );
    }
    return gradientContent;
  }

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={cardStyles} activeOpacity={0.8} {...props}>
        {children}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
