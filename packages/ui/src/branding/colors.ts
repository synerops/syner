/**
 * Syner brand colors - Dark elegant palette
 *
 * Designed for dark mode with black backgrounds and high contrast text.
 * Based on neutral tones for a sophisticated, minimal aesthetic.
 */

export const colors = {
  /** Pure black - primary background */
  black: '#000000',

  /** Pure white - primary text on dark */
  white: '#ffffff',

  /**
   * Neutral scale - elegant grays
   * Use for backgrounds, borders, and muted text
   */
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },

  /**
   * Semantic colors for UI states
   */
  semantic: {
    /** Foreground on dark background */
    foreground: '#fafafa',
    /** Muted foreground for secondary text */
    mutedForeground: '#a3a3a3',
    /** Background */
    background: '#000000',
    /** Slightly elevated background */
    card: '#0a0a0a',
    /** Borders */
    border: '#262626',
    /** Input backgrounds */
    input: '#171717',
    /** Accent color - can be customized */
    accent: '#262626',
    /** Accent foreground */
    accentForeground: '#fafafa',
  },
} as const;

export type Colors = typeof colors;
