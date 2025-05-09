# Specyfikacja modułu autentykacji

## 1. ARCHITEKTURA INTERFEJSU UŻYTKOWNIKA

### Strony Astro i layouty

1. `/register.astro` (public)

   - Astro page renderująca na serwerze formularz rejestracji.
   - Zawiera komponent React `RegisterForm` (client-side) z polami:
     - `email` (type=email)
     - `password` (type=password)
     - `confirmPassword` (type=password)
   - Po udanej rejestracji przekierowuje na `/login` z komunikatem sukcesu.

2. `/login.astro` (public)

   - Zagnieżdża komponent React `LoginForm` z polami:
     - `email`
     - `password`
   - Po pomyślnym logowaniu następuje redirect do chronionej trasy np. `/profile`.

3. `/reset-password.astro` (public)

   - Komponent React `ResetPasswordRequestForm` z polem `email`.
   - Wywołuje endpoint `POST /api/auth/reset-password`.
   - Pokazuje informację o wysłaniu e-maila z linkiem.

4. `/reset-password/[token].astro` (public)

   - Dynamiczna ścieżka z parametrem `token`.
   - Zawiera komponent React `ResetPasswordForm` z polami:
     - `newPassword`
     - `confirmPassword`
   - Walidacja tokena client- i server-side.
   - Po sukcesie przekierowuje do `/login`.

5. `MainLayout.astro` (global)
   - Nagłówek z warunkowym menu:
     - Gdy brak sesji: przyciski `Zaloguj się`, `Zarejestruj się`.
     - Gdy sesja istnieje: `Wyloguj się` + link do `/profile`.
   - Odczyt stanu sesji przez hook `useUser()` lub serwerowe `getSupabaseSession()`.

### Komponenty React (w `src/components/auth`)

- `RegisterForm.tsx`
- `LoginForm.tsx`
- `ResetPasswordRequestForm.tsx`
- `ResetPasswordForm.tsx`

Każdy formularz:

- Wykorzystuje Shadcn/ui (`Form`, `Input`, `Button`, `Alert`).
- Używa Zod do walidacji schematu.
- Obsługuje stany `loading`, `error`, `success`.
- Wyświetla komunikaty błędów inline pod polami.

### Walidacja i komunikaty błędów

1. Email: poprawny format RFC5322.
2. Hasło:
   - Min. 8 znaków.
   - Co najmniej jedna litera i jedna cyfra.
3. ConfirmPassword: musi zgadzać się z `password`.
4. Komunikaty:
   - „Nieprawidłowy format e-mail.”
   - „Hasło musi mieć min. 8 znaków, jedną literę i cyfrę.”
   - „Hasła nie pasują.”
   - „Użytkownik o podanym e-mail już istnieje.”
   - „Nieprawidłowy login lub hasło.”
   - „Token resetu nieprawidłowy lub wygasł.”

### Scenariusze użytkownika

- Rejestracja → walidacja → API → redirect na `/login`.
- Logowanie → API → ustawienie cookie → redirect do `/profile`.
- Żądanie resetu → API → informacja o wysłaniu e-maila.
- Reset hasła z tokenem → walidacja tokena → API → redirect do `/login`.
- Wylogowanie → API → usunięcie sesji → redirect do `/`.

## 2. LOGIKA BACKENDOWA

### Struktura endpointów (`src/pages/api/auth`)

- `register.ts`

  - POST body: `{ email, password }`.
  - Walidacja Zod.
  - `supabase.auth.signUp`.
  - Status 201 lub 400/409.

- `login.ts`

  - POST body: `{ email, password }`.
  - `supabase.auth.signInWithPassword`.
  - Status 200 + cookie lub 401.

- `logout.ts`

  - POST.
  - `supabase.auth.signOut`.
  - Status 200.

- `reset-password.ts`

  - POST body: `{ email }`.
  - `supabase.auth.resetPasswordForEmail`.
  - Status 200 (nie wycieka, czy email jest w bazie).

- `update-password.ts`

  - POST body: `{ token, newPassword }`.
  - Walidacja tokena resetu po stronie serwera.
  - Wywołanie serwerowego klienta Supabase: `supabase.auth.api.updateUser(token, { password: newPassword })`.
  - Status 200 lub 400/401 w przypadku nieprawidłowego lub wygasłego tokena.

### Walidacja i obsługa wyjątków

- Schematy Zod dla każdego endpointu.
- Early return dla błędnych danych.
- Mapowanie błędów Supabase na czytelne statusy HTTP i komunikaty.
- Logowanie błędów w `src/lib/logger.ts`.

### Middleware ochrony tras

- `src/middleware/index.ts`:
  - Parsowanie cookie z Access Token.
  - Ochrona stron klienta:
    - Redirect do `/login` przy próbie wejścia na `/profile/*`, `/dashboard` oraz inne chronione trasy.
  - Ochrona API:
    - Weryfikacja sesji dla wszystkich endpointów `/api/cards/*` oraz innych prywatnych API, zwracanie 401 jeśli brak autoryzacji.

### Konfiguracja Astro

- W `astro.config.mjs` dodanie integracji `@supabase/auth-helpers-astro`.
- Proxy dla `/api/*` (jeśli wymagane).

## 3. SYSTEM AUTENTYKACJI

### Konfiguracja Supabase

- `src/lib/supabaseClient.ts`:
  - Eksport klienta `supabaseBrowser` i `supabaseServer`.

### Operacje auth

- Rejestracja: `supabase.auth.signUp({ email, password })`.
- Logowanie: `supabase.auth.signInWithPassword({ email, password })`.
- Wylogowanie: `supabase.auth.signOut()`.
- Reset hasła: `supabase.auth.resetPasswordForEmail(email)`.
- Ustawianie nowego hasła: `supabase.auth.updateUser({ password }, { refreshToken: token })`.

### Przechowywanie stanu

- Client-side: `useUser()` z `@supabase/auth-helpers-react`.
- Server-side: `getSupabase(event)` w plikach Astro.

### Podsumowanie komponentów

- Strony Astro: `/register.astro`, `/login.astro`, `/reset-password.astro`, `/reset-password/[token].astro`.
- React: `src/components/auth/*Form.tsx`.
- API: `src/pages/api/auth/*.ts`.
- Middleware: `src/middleware/index.ts`.
- Klient: `src/lib/supabaseClient.ts`.
