/**
 * Reusable Button Component
 */
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSize, BorderRadius, Spacing } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const sizeStyles = {
    sm: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, fontSize: FontSize.sm },
    md: { paddingVertical: Spacing.md + 2, paddingHorizontal: Spacing.xl, fontSize: FontSize.base },
    lg: { paddingVertical: Spacing.lg, paddingHorizontal: Spacing['2xl'], fontSize: FontSize.md },
  };

  const content = (
    <>
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? Colors.primary : '#FFF'} />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            style={[
              styles.text,
              { fontSize: sizeStyles[size].fontSize },
              variant === 'outline' && styles.textOutline,
              variant === 'ghost' && styles.textGhost,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </>
  );

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || isLoading}
        activeOpacity={0.8}
        style={[{ borderRadius: BorderRadius.lg, overflow: 'hidden', opacity: disabled ? 0.5 : 1 }, style]}
      >
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientMid, Colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.button,
            {
              paddingVertical: sizeStyles[size].paddingVertical,
              paddingHorizontal: sizeStyles[size].paddingHorizontal,
            },
          ]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          paddingVertical: sizeStyles[size].paddingVertical,
          paddingHorizontal: sizeStyles[size].paddingHorizontal,
          borderRadius: BorderRadius.lg,
          opacity: disabled ? 0.5 : 1,
        },
        variant === 'secondary' && styles.secondary,
        variant === 'outline' && styles.outline,
        variant === 'ghost' && styles.ghost,
        style,
      ]}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  secondary: {
    backgroundColor: Colors.surfaceElevated,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  text: {
    color: Colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
  textOutline: {
    color: Colors.primary,
  },
  textGhost: {
    color: Colors.primary,
  },
});
