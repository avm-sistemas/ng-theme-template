import { Injectable, signal, computed, effect, inject, DOCUMENT } from '@angular/core';
import { ColorMode, Theme, UserThemePreference } from '../models/theme.model';
import { THEMES, DEFAULT_THEME_ID, DEFAULT_COLOR_MODE } from '../models/themes.catalog';

const STORAGE_KEY = 'app_theme_preference';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  readonly themes = THEMES;

  private readonly _themeId = signal<string>(this.loadPreference().themeId);
  private readonly _mode = signal<ColorMode>(this.loadPreference().mode);

  readonly themeId = this._themeId.asReadonly();
  readonly mode = this._mode.asReadonly();

  readonly currentTheme = computed<Theme>(
    () => this.themes.find(t => t.id === this._themeId()) ?? this.themes[0]
  );

  readonly isDark = computed(() => this._mode() === 'dark');

  constructor() {
    effect(() => {
      this.applyTheme(this.currentTheme(), this._mode());
      this.savePreference({ themeId: this._themeId(), mode: this._mode() });
    });
  }

  setTheme(id: string): void {
    if (this.themes.find(t => t.id === id)) {
      this._themeId.set(id);
    }
  }

  setMode(mode: ColorMode): void {
    this._mode.set(mode);
  }

  toggleMode(): void {
    this._mode.update(m => (m === 'light' ? 'dark' : 'light'));
  }

  applyUserPreference(pref: UserThemePreference): void {
    this._themeId.set(pref.themeId);
    this._mode.set(pref.mode);
  }

  getPreference(): UserThemePreference {
    return { themeId: this._themeId(), mode: this._mode() };
  }

  private applyTheme(theme: Theme, mode: ColorMode): void {
    const colors = mode === 'dark' ? theme.dark : theme.light;
    const root = this.document.documentElement;

    root.setAttribute('data-theme', theme.id);
    root.setAttribute('data-mode', mode);

    const vars: Record<string, string> = {
      '--color-primary':       colors.primary,
      '--color-primary-light': colors.primaryLight,
      '--color-primary-dark':  colors.primaryDark,
      '--color-secondary':     colors.secondary,
      '--color-accent':        colors.accent,
      '--color-bg':            colors.background,
      '--color-surface':       colors.surface,
      '--color-surface-alt':   colors.surfaceAlt,
      '--color-text':          colors.text,
      '--color-text-muted':    colors.textMuted,
      '--color-border':        colors.border,
      '--color-error':         colors.error,
      '--color-success':       colors.success,
      '--color-warning':       colors.warning,
    };

    for (const [prop, value] of Object.entries(vars)) {
      root.style.setProperty(prop, value);
    }
  }

  private loadPreference(): UserThemePreference {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UserThemePreference;
        if (THEMES.find(t => t.id === parsed.themeId)) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return { themeId: DEFAULT_THEME_ID, mode: DEFAULT_COLOR_MODE };
  }

  private savePreference(pref: UserThemePreference): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pref));
    } catch {
      // ignore
    }
  }
}
