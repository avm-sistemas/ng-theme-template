[![Docker Image CI](https://github.com/avm-sistemas/ng-theme-template/actions/workflows/docker-image.yml/badge.svg)](https://github.com/avm-sistemas/ng-theme-template/actions/workflows/docker-image.yml)


# ng-theme-template

Template Angular 20 com sistema de autenticação e gerência de temas por usuário.

## Stack

- **Angular 20** — standalone components, signals, `@if`/`@for` control flow
- **Roteamento lazy** com `loadComponent`
- **Autenticação** simulada (troque por HttpClient real)
- **5 temas** × **2 modos** (claro/escuro) via CSS custom properties
- Preferência persistida no `localStorage` e associada ao usuário

## Temas disponíveis

| ID | Nome | Descrição |
|----|------|-----------|
| `slate` | Slate | Neutro e profissional |
| `ocean` | Ocean | Azul profundo e sereno |
| `forest` | Forest | Verde natural e calmo |
| `sunset` | Sunset | Quente e acolhedor |
| `violet` | Violet | Elegante e criativo |

## Estrutura

```
src/app/
├── core/
│   ├── guards/         auth.guard, guest.guard
│   ├── interceptors/   auth.interceptor (Bearer token)
│   ├── models/         user.model, theme.model, themes.catalog
│   └── services/       auth.service, theme.service
├── features/
│   ├── auth/           login/, register/
│   ├── dashboard/
│   └── settings/theme-picker/
└── shared/components/
    ├── layout/         topbar + router-outlet
    └── theme-picker/   seletor compacto no header
```

## Como rodar

```bash
npm install
npm start        # http://localhost:4200
npm run build    # build de produção
```

## Integrando com API real

**AuthService** (`core/services/auth.service.ts`): substituir `buildFakeAuthResponse` e `fakeDelay` por chamadas `HttpClient`:

```typescript
// Exemplo — login real
login(credentials: LoginCredentials): Observable<void> {
  return this.http.post<AuthResponse>('/api/auth/login', credentials).pipe(
    tap(response => this.setSession(response)),
    map(() => void 0),
  );
}
```

**Salvar preferência de tema no backend**: `AuthService.updateUserThemePreference()` já coleta o estado atual — adicione um `PATCH /api/users/me` ali.

## Adicionando um novo tema

Em `core/models/themes.catalog.ts`, adicione um objeto ao array `THEMES`:

```typescript
{
  id: 'meu-tema',
  name: 'Meu Tema',
  description: 'Descrição curta',
  icon: '🎯',
  light: { primary: '#...', /* ... */ },
  dark:  { primary: '#...', /* ... */ },
}
```

O `ThemeService` pega automaticamente; nenhum outro arquivo precisa mudar.
