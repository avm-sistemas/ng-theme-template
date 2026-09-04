import { Component, inject } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { Theme } from '../../../core/models/theme.model';

@Component({
  selector: 'app-settings-theme',
  standalone: true,
  imports: [],
  templateUrl: './settings-theme.html',
  styleUrl: './settings-theme.scss',
})
export class SettingsThemeComponent {
  readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);

  selectTheme(id: string): void {
    this.themeService.setTheme(id);
    this.authService.updateUserThemePreference();
  }

  setMode(mode: 'light' | 'dark'): void {
    this.themeService.setMode(mode);
    this.authService.updateUserThemePreference();
  }

  getColor(theme: Theme, key: string, dark: boolean): string {
    const colors = dark ? theme.dark : theme.light;
    return (colors as unknown as Record<string, string>)[key] ?? colors.primary;
  }
}
