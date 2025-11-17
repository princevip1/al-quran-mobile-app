import React from 'react';
import {
    Text as RNText,
    TextProps as RNTextProps,
    StyleProp,
    StyleSheet,
    TextStyle,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface TextProps extends RNTextProps {
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'body' | 'bodyLarge' | 'bodySmall' | 'caption' | 'label' | 'arabic';
    color?: string;
    weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';
    align?: 'left' | 'center' | 'right' | 'justify';
    children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
    variant = 'body',
    color,
    weight = 'regular',
    align = 'left',
    style,
    children,
    ...props
}) => {
    const { theme } = useTheme();

    const variantStyles: Record<string, StyleProp<TextStyle>> = {
        h1: {
            fontSize: theme.typography.sizes['4xl'],
            lineHeight: theme.typography.sizes['4xl'] * theme.typography.lineHeights.tight,
            fontWeight: theme.typography.weights.bold,
        },
        h2: {
            fontSize: theme.typography.sizes['3xl'],
            lineHeight: theme.typography.sizes['3xl'] * theme.typography.lineHeights.tight,
            fontWeight: theme.typography.weights.bold,
        },
        h3: {
            fontSize: theme.typography.sizes['2xl'],
            lineHeight: theme.typography.sizes['2xl'] * theme.typography.lineHeights.tight,
            fontWeight: theme.typography.weights.semibold,
        },
        h4: {
            fontSize: theme.typography.sizes.xl,
            lineHeight: theme.typography.sizes.xl * theme.typography.lineHeights.normal,
            fontWeight: theme.typography.weights.semibold,
        },
        h5: {
            fontSize: theme.typography.sizes.lg,
            lineHeight: theme.typography.sizes.lg * theme.typography.lineHeights.normal,
            fontWeight: theme.typography.weights.medium,
        },
        body: {
            fontSize: theme.typography.sizes.base,
            lineHeight: theme.typography.sizes.base * theme.typography.lineHeights.normal,
        },
        bodyLarge: {
            fontSize: theme.typography.sizes.md,
            lineHeight: theme.typography.sizes.md * theme.typography.lineHeights.relaxed,
        },
        bodySmall: {
            fontSize: theme.typography.sizes.sm,
            lineHeight: theme.typography.sizes.sm * theme.typography.lineHeights.normal,
        },
        caption: {
            fontSize: theme.typography.sizes.xs,
            lineHeight: theme.typography.sizes.xs * theme.typography.lineHeights.normal,
            color: theme.colors.textTertiary,
        },
        label: {
            fontSize: theme.typography.sizes.sm,
            lineHeight: theme.typography.sizes.sm * theme.typography.lineHeights.normal,
            fontWeight: theme.typography.weights.medium,
            color: theme.colors.textSecondary,
        },
        arabic: {
            fontSize: theme.typography.sizes['2xl'],
            lineHeight: theme.typography.sizes['2xl'] * theme.typography.lineHeights.loose,
            fontFamily: theme.typography.fonts.arabic,
            color: theme.colors.arabic,
        },
    };

    const weightStyles: Record<string, TextStyle> = {
        light: { fontWeight: theme.typography.weights.light },
        regular: { fontWeight: theme.typography.weights.regular },
        medium: { fontWeight: theme.typography.weights.medium },
        semibold: { fontWeight: theme.typography.weights.semibold },
        bold: { fontWeight: theme.typography.weights.bold },
        extrabold: { fontWeight: theme.typography.weights.extrabold },
    };

    return (
        <RNText
            style={[
                styles.base,
                { color: color || theme.colors.text },
                variantStyles[variant],
                weightStyles[weight],
                { textAlign: align },
                style,
            ]}
            {...props}
        >
            {children}
        </RNText>
    );
};

const styles = StyleSheet.create({
    base: {
        fontFamily: 'System',
    },
});
