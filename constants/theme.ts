/**
 * Troomie Design System
 * Premium dark theme with coral-to-purple gradient accents
 */

export const Colors = {
  // Core backgrounds
  background: '#0A0A0F',
  surface: '#13131A',
  surfaceElevated: '#1A1A24',
  surfaceLight: '#22222E',

  // Primary gradient (coral → hot pink → purple)
  primary: '#FF6B6B',
  primaryLight: '#FF8E8E',
  primaryDark: '#E04545',
  secondary: '#FF3CAC',
  accent: '#784BA0',
  accentLight: '#9B6DC6',

  // Gradient stops
  gradientStart: '#FF6B6B',
  gradientMid: '#FF3CAC',
  gradientEnd: '#784BA0',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0B8',
  textTertiary: '#6B6B80',
  textInverse: '#0A0A0F',

  // Status
  success: '#4ADE80',
  warning: '#FBBF24',
  error: '#EF4444',
  info: '#38BDF8',

  // Swipe
  swipeRight: '#4ADE80',
  swipeLeft: '#EF4444',

  // Borders
  border: '#2A2A38',
  borderLight: '#3A3A4A',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.6)',
  glass: 'rgba(19, 19, 26, 0.85)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  '2xl': 28,
  '3xl': 34,
  '4xl': 40,
} as const;

export const FontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;
