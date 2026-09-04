import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SettingsThemeComponent } from './theme-picker/settings-theme';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [RouterLink, SettingsThemeComponent],
  template: `
    <div class="settings-page">
      <header class="page-header">
        <h1 class="page-title">Configurações</h1>
        <p class="page-subtitle">Personalize sua experiência</p>
      </header>

      <div class="settings-card">
        <app-settings-theme />
      </div>

      <a routerLink="/settings/layout" class="layout-card">
        <div class="layout-card-icon">⊟</div>
        <div>
          <p class="layout-card-title">Configurar layout</p>
          <p class="layout-card-desc">Monte a estrutura da interface: regiões, widgets e comportamentos</p>
        </div>
        <span class="layout-card-arrow">→</span>
      </a>
    </div>
  `,
  styles: [`
    .settings-page { display: flex; flex-direction: column; gap: 24px; }
    .page-title {
      font-size: 1.6rem; font-weight: 700; color: var(--color-text);
      margin: 0 0 4px; letter-spacing: -0.03em;
    }
    .page-subtitle { font-size: 0.875rem; color: var(--color-text-muted); margin: 0; }
    .settings-card {
      background: var(--color-surface); border: 1px solid var(--color-border);
      border-radius: 16px; padding: 28px; display: flex; flex-direction: column; gap: 36px;
    }
    .layout-card {
      display: flex; align-items: center; gap: 16px;
      background: var(--color-surface); border: 1px solid var(--color-border);
      border-radius: 16px; padding: 20px 24px; text-decoration: none;
      transition: border-color .15s, background .15s;

      &:hover { border-color: var(--color-primary); background: var(--color-surface-alt); }
    }
    .layout-card-icon { font-size: 1.5rem; color: var(--color-primary); }
    .layout-card-title { font-size: 0.95rem; font-weight: 600; color: var(--color-text); margin: 0 0 2px; }
    .layout-card-desc  { font-size: 0.8rem; color: var(--color-text-muted); margin: 0; }
    .layout-card-arrow { margin-left: auto; color: var(--color-text-muted); font-size: 1.1rem; }
  `],
})
export class SettingsComponent {}
