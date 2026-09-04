export type ColorMode = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  border: string;
  error: string;
  success: string;
  warning: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  icon: string;
  light: ThemeColors;
  dark: ThemeColors;
}

export interface UserThemePreference {
  themeId: string;
  mode: ColorMode;
}
