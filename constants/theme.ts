/**
 * LappJ - Paleta de cores para modo claro e escuro
 * Identidade Visual seguindo o CONTEXTO.md
 */

import { Platform } from 'react-native';

// Cores da identidade visual LappJ
const LAPPJ_COLORS = {
  light: {
    background: '#F0F2F8',
    surface: '#FFFFFF',
    surfaceSecondary: '#F5F6FA',
    primary: '#1A237E',
    accent: '#F5A623',
    textPrimary: '#1A237E',
    textSecondary: '#5C6BC0',
    textMuted: '#9E9E9E',
    inputBackground: '#EEEEEE',
    border: '#E8EAF6',
    // Status
    statusTransit: '#F5A623',
    statusPending: '#9E9E9E',
    statusDelivered: '#3949AB',
  },
  dark: {
    background: '#0A0E1A',
    surface: '#141828',
    surfaceSecondary: '#1C2235',
    primary: '#5C7CFA',
    accent: '#F5A623',
    textPrimary: '#FFFFFF',
    textSecondary: '#8899CC',
    textMuted: '#556688',
    inputBackground: '#1C2235',
    border: '#1E2A45',
    // Status
    statusTransit: '#F5A623',
    statusPending: '#556688',
    statusDelivered: '#5C7CFA',
  },
};

export const Colors = {
  light: LAPPJ_COLORS.light,
  dark: LAPPJ_COLORS.dark,
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
