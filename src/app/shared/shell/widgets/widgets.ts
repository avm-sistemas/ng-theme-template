import { Component, inject, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemePickerComponent } from '../../components/theme-picker/theme-picker';
import { LayoutService } from '../../../core/services/layout.service';
import { RouterModule } from '@angular/router';

// ── Logo ─────────────────────────────────────────────────────────────────────
@Component({
  selector: 'w-logo',
  standalone: true,
  template: `
    <a class="brand" routerLink="/dashboard">
      <span class="brand-mark">◈</span>
      @if (!compact) { <span class="brand-name">AppTemplate</span> }
    </a>`,
  styles: [`
    .brand { display:flex; align-items:center; gap:8px; text-decoration:none; }
    .brand-mark { font-size:1.3rem; color:var(--color-primary); }
    .brand-name { font-weight:700; font-size:1rem; color:var(--color-text); letter-spacing:-0.02em; }
  `],
  imports: [RouterLink],
})
export class LogoWidget {
  @Input() compact = false;
}

// ── Nav Links ────────────────────────────────────────────────────────────────
@Component({
  selector: 'w-nav-links',
  standalone: true,
  template: `
    @if (!vertical) {
      <nav class="nav-h">
        <a routerLink="/dashboard" routerLinkActive="active">
          <span class="nav-icon">⊞</span>
          @if (!compact) { <span>Dashboard</span> }
        </a>
        <a routerLink="/settings" routerLinkActive="active">
          <span class="nav-icon">⚙</span>
          @if (!compact) { <span>Configurações</span> }
        </a>
      </nav>
    } @else {
      <nav class="nav-v">
        <a routerLink="/dashboard" routerLinkActive="active">
          <span class="nav-icon">⊞</span>
          @if (!compact) { <span>Dashboard</span> }
        </a>
        <a routerLink="/settings" routerLinkActive="active">
          <span class="nav-icon">⚙</span>
          @if (!compact) { <span>Configurações</span> }
        </a>
      </nav>
    }`,
  styles: [`
    a { display:flex; align-items:center; gap:8px; padding:8px 12px; border-radius:8px;
        font-size:.875rem; font-weight:500; color:var(--color-text-muted); text-decoration:none;
        transition:color .15s, background .15s; white-space:nowrap; }
    a:hover { color:var(--color-text); background:var(--color-surface-alt); }
    a.active { color:var(--color-primary); background:var(--color-surface-alt); }
    .nav-icon { font-size:1rem; flex-shrink:0; }
    .nav-h { display:flex; gap:4px; align-items:center; }
    .nav-v { display:flex; flex-direction:column; gap:2px; padding:8px; }
  `],
  imports: [RouterLink, RouterLinkActive],
})
export class NavLinksWidget {
  @Input() vertical = false;
  @Input() compact  = false;
}

// ── User Menu ────────────────────────────────────────────────────────────────
@Component({
  selector: 'w-user-menu',
  standalone: true,
  template: `
    <div class="user-menu">
      @if (!compact) { <span class="user-name">{{ auth.user()?.name }}</span> }
      <span class="avatar" [title]="auth.user()?.name ?? ''">
        {{ auth.user()?.avatarInitials }}
      </span>
      <button class="logout-btn" (click)="auth.logout()" title="Sair">
        <svg viewBox="0 0 20 20" fill="none">
          <path d="M7 3H4a1 1 0 00-1 1v12a1 1 0 001 1h3M13 7l3 3-3 3M16 10H8"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>`,
  styles: [`
    .user-menu { display:flex; align-items:center; gap:8px; }
    .user-name { font-size:.875rem; font-weight:500; color:var(--color-text); }
    .avatar { width:32px; height:32px; border-radius:50%; background:var(--color-primary);
              color:#fff; font-size:.75rem; font-weight:700; display:flex; align-items:center;
              justify-content:center; flex-shrink:0; cursor:default; }
    .logout-btn { background:none; border:none; cursor:pointer; color:var(--color-text-muted);
                  padding:4px; border-radius:6px; display:flex; align-items:center;
                  transition:color .15s, background .15s; }
    .logout-btn svg { width:18px; height:18px; }
    .logout-btn:hover { color:var(--color-error); background:var(--color-surface-alt); }
  `],
})
export class UserMenuWidget {
  readonly auth = inject(AuthService);
  @Input() compact = false;
}

// ── Spacer ───────────────────────────────────────────────────────────────────
@Component({
  selector: 'w-spacer',
  standalone: true,
  template: `<span class="spacer"></span>`,
  styles: [`.spacer { flex:1; }`],
})
export class SpacerWidget {}

// ── Layout Picker (quick-switch) ─────────────────────────────────────────────
@Component({
  selector: 'w-layout-picker',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a class="layout-btn" routerLink="/settings/layout" title="Configurar layout">
      <svg viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="7" height="16" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
        <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
        <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
      </svg>
    </a>`,
  styles: [`
    .layout-btn { display:flex; align-items:center; padding:6px; border-radius:8px;
                  color:var(--color-text-muted); text-decoration:none;
                  transition:color .15s, background .15s; }
    .layout-btn:hover { color:var(--color-primary); background:var(--color-surface-alt); }
    svg { width:18px; height:18px; }
  `],
})
export class LayoutPickerWidget {}
