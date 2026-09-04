import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);

  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly showPassword = signal(false);

  async submit(): Promise<void> {
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.error.set('Preencha todos os campos');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      await this.authService.register({
        name: this.name,
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword,
      });
    } catch (err: any) {
      this.error.set(err?.message ?? 'Erro inesperado');
    } finally {
      this.loading.set(false);
    }
  }
}
