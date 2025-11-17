import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    TextStyle,
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Text } from './Text';

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  gradient?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  gradient = false,
  style,
  disabled,
  ...props
}) => {
  const { theme } = useTheme();

  const getVariantStyles = (): { button: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'primary':
        return {
          button: {
            backgroundColor: theme.colors.primary,
          },
          text: {
            color: '#FFFFFF',
          },
        };
      case 'secondary':
        return {
          button: {
            backgroundColor: theme.colors.secondary,
          },
          text: {
            color: '#FFFFFF',
          },
        };
      case 'outline':
        return {
          button: {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: theme.colors.primary,
          },
          text: {
            color: theme.colors.primary,
          },
        };
      case 'ghost':
        return {
          button: {
            backgroundColor: 'transparent',
          },
          text: {
            color: theme.colors.primary,
          },
        };
      case 'accent':
        return {
          button: {
            backgroundColor: theme.colors.accent,
          },
          text: {
            color: '#FFFFFF',
          },
        };
      default:
        return {
          button: {},
          text: {},
        };
    }
  };

  const sizeStyles = theme.buttonSizes[size];
  const variantStyles = getVariantStyles();

  const buttonContent = (
    <>
      {loading ? (
        <ActivityIndicator color={variantStyles.text.color} />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text
            weight="semibold"
            style={[
              {
                fontSize: sizeStyles.fontSize,
                marginLeft: icon && iconPosition === 'left' ? theme.spacing.sm : 0,
                marginRight: icon && iconPosition === 'right' ? theme.spacing.sm : 0,
              },
              variantStyles.text,
            ]}
          >
            {children}
          </Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </>
  );

  const buttonStyles = [
    styles.base,
    {
      height: sizeStyles.height,
      paddingHorizontal: sizeStyles.paddingHorizontal,
      borderRadius: theme.borderRadius.md,
      opacity: disabled ? 0.5 : 1,
    },
    variantStyles.button,
    fullWidth && styles.fullWidth,
    style,
  ];

  if (gradient && (variant === 'primary' || variant === 'secondary' || variant === 'accent')) {
    const gradientColors = 
      variant === 'primary' ? theme.colors.gradientPrimary :
      variant === 'secondary' ? theme.colors.gradientSecondary :
      theme.colors.gradientAccent;

    return (
      <TouchableOpacity disabled={disabled || loading} {...props}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={buttonStyles}
        >
          {buttonContent}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={buttonStyles}
      disabled={disabled || loading}
      {...props}
    >
      {buttonContent}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
});
