/**
 * EduLearn Brand Theme Constants
 * Colors and typography matching the global design system
 */

export const BRAND_COLORS = {
  // Primary Brand Color
  primary: '#00FF80', // Lime green - signature brand color
  primaryForeground: '#000000',

  // Dark Theme Backgrounds
  background: '#0D0D0D', // Almost black
  card: '#131313', // Dark gray cards
  cardBorder: '#2E3033', // Subtle borders
  accent: '#1A1A1A', // Darker accents
  muted: '#1A1A1A',

  // Text Colors
  text: '#FFFFFF', // White text
  textMuted: '#B3B3B3', // Secondary gray
  textSecondary: '#61728C',

  // Semantic Colors
  success: '#40B869',
  error: '#DD524D',
  warning: '#F5B546',
  info: '#4A85E4',
} as const;

export const BRAND_FONTS = {
  family: 'Satoshi, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  weights: {
    regular: 400,
    bold: 700,
  },
  sizes: {
    hero: 48,
    title: 32,
    body: 18,
    caption: 14,
    small: 12,
  },
  lineHeights: {
    tight: 1.1,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const ANIMATION_CONFIG = {
  // Spring animation configurations
  spring: {
    default: {
      damping: 12,
      mass: 0.8,
      stiffness: 120,
    },
    bouncy: {
      damping: 10,
      mass: 1.2,
      stiffness: 100,
    },
    smooth: {
      damping: 20,
      mass: 0.5,
      stiffness: 150,
    },
  },
  // Timing
  fps: 30,
  duration: {
    scene1: 90, // 3s
    scene2: 150, // 5s
    scene3: 60, // 2s
    total: 300, // 10s
  },
} as const;

export const VIDEO_CONFIG = {
  width: 1080,
  height: 1080,
  fps: 30,
  durationInFrames: 300, // 10 seconds
} as const;
