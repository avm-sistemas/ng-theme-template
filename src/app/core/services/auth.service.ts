import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '../models/user.model';
import { ThemeService } from './theme.service';

const AUTH_KEY = 'app_auth_token';
const USER_KEY = 'app_auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);
  private readonly themeService = inject(ThemeService);

  private readonly _user = signal<User | null>(this.loadUser());
  private readonly _token = signal<string | null>(this.loadToken());

  readonly user = this._user.asReadonly();
  readonly token = this._token.asReadonly();
  readonly isAuthenticated = computed(() => this._token() !== null && this._user() !== null);

  /** Simulates an API login — replace with HttpClient calls */
  async login(credentials: LoginCredentials): Promise<void> {
    await this.fakeDelay();

    // Fake validation — swap for real API
    if (credentials.password.length < 6) {
      throw new Error('Credenciais inválidas');
    }

    const response = this.buildFakeAuthResponse(credentials.email);
    this.setSession(response);

    if (response.user.themePreference) {
      this.themeService.applyUserPreference(response.user.themePreference);
    }

    this.router.navigate(['/dashboard']);
  }

  /** Simulates an API register — replace with HttpClient calls */
  async register(credentials: RegisterCredentials): Promise<void> {
    await this.fakeDelay();

    if (credentials.password !== credentials.confirmPassword) {
      throw new Error('As senhas não conferem');
    }
    if (credentials.password.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres');
    }

    const response = this.buildFakeAuthResponse(credentials.email, credentials.name);
    this.setSession(response);
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this._user.set(null);
    this._token.set(null);
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
    this.router.navigate(['/auth/login']);
  }

  updateUserThemePreference(): void {
    const user = this._user();
    if (!user) return;
    const pref = this.themeService.getPreference();
    const updated = { ...user, themePreference: pref };
    this._user.set(updated);
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
  }

  private setSession(response: AuthResponse): void {
    this._user.set(response.user);
    this._token.set(response.token);
    localStorage.setItem(AUTH_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
  }

  private loadUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }

  private loadToken(): string | null {
    return localStorage.getItem(AUTH_KEY);
  }

  private buildFakeAuthResponse(email: string, name?: string): AuthResponse {
    const userName = name ?? email.split('@')[0];
    const initials = userName
      .split(' ')
      .slice(0, 2)
      .map(n => n[0].toUpperCase())
      .join('');

    const user: User = {
      id: crypto.randomUUID(),
      name: userName,
      email,
      avatarInitials: initials,
      themePreference: {
        themeId: this.themeService.themeId(),
        mode: this.themeService.mode(),
      },
    };

    return { user, token: `fake-jwt-${crypto.randomUUID()}` };
  }

  private fakeDelay(ms = 600): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
