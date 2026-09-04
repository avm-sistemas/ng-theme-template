import { Component, inject, signal } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { Theme } from '../../../core/models/theme.model';

@Component({
  selector: 'app-theme-picker',
  standalone: true,
  imports: [],
  templateUrl: './theme-picker.html',
  styleUrl: './theme-picker.scss',
})
export class ThemePickerComponent {
  readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);

  readonly isOpen = signal(false);

  get themes(): Theme[] {
    return this.themeService.themes;
  }

  toggle(): void {
    this.isOpen.update(v => !v);
  }

  close(): void {
    this.isOpen.set(false);
  }

  selectTheme(id: string): void {
    this.themeService.setTheme(id);
    this.authService.updateUserThemePreference();
  }

  toggleMode(): void {
    this.themeService.toggleMode();
    this.authService.updateUserThemePreference();
  }

  getThemePreviewColors(theme: Theme): string[] {
    const colors = this.themeService.isDark() ? theme.dark : theme.light;
    return [colors.primary, colors.accent, colors.background, colors.surface];
  }
}
