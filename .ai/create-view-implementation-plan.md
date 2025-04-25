# Plan implementacji widoku Create Card

## 1. Przegląd

Widok `/card/create` umożliwia użytkownikowi utworzenie nowej wizytówki Cultura na podstawie predefiniowanego szablonu. Użytkownik może wprowadzić informacje o swoich zainteresowaniach kulturalnych (filmy, seriale, muzyka, książki) poprzez formularz, zatwierdzić dane przyciskiem Submit oraz skorzystać z dodatkowego przycisku Generate, który wywołuje endpoint `/api/cards/generate` dla wygenerowania rozbudowanej wersji wizytówki. Widok kładzie nacisk na przejrzystość, walidację danych, dostępność (ARIA) oraz bezpieczeństwo (ochrona przed XSS).

## 2. Routing widoku

- Widok będzie dostępny pod ścieżką: `/card/create`

## 3. Struktura komponentów

- **Page Layout**: Ogólny układ strony.
- **CreateCardForm**: Główny komponent zawierający formularz do tworzenia wizytówki.
  - Pola tekstowe: `movies`, `series`, `music`, `books`
  - Przycisk Submit: wysyła dane do endpointu `/api/cards`
  - Przycisk Generate: wywołuje endpoint `/api/cards/generate`
- **Notification**: Komponent do wyświetlania komunikatów o sukcesie lub błędach.

## 4. Szczegóły komponentów

### CreateCardForm

- Opis: Komponent odpowiedzialny za renderowanie formularza do tworzenia wizytówki. Zawiera pola wejściowe, walidację, przyciski oraz logikę wywołań API.
- Główne elementy:
  - Formularz `<form>` z czterema polami tekstowymi (filmy, seriale, muzyka, książki)
  - Przycisk Submit, który wywołuje funkcję przesyłającą dane do endpointu `/api/cards`
  - Przycisk Generate, wywołujący funkcję integrującą się z endpointem `/api/cards/generate`
- Obsługiwane interakcje:
  - OnChange dla pól formularza (aktualizacja stanu)
  - OnSubmit formularza (walidacja i wysłanie danych do API)
  - OnClick dla przycisku Generate (wywołanie API generującego rozbudowaną wizytówkę)
- Warunki walidacji:
  - Wszystkie pola powinny zawierać tekst (zgodnie z typem `string`)
  - Weryfikacja niepustości pól (jeśli wymagane przez API)
  - Sanitizacja danych wejściowych dla ochrony przed XSS
- Typy:
  - `CreateCardCommand` (z pola `card_data` typu `CardData` zdefiniowanego w `src/types.ts`)
  - Opcjonalnie lokalny typ `CreateCardViewModel` do zarządzania stanem formularza
- Propsy:
  - Zwykle brak; cała logika jest umieszczona wewnątrz komponentu

### Notification

- Opis: Komponent służący do prezentacji komunikatów o sukcesie lub błędach wynikających z operacji API.
- Główne elementy:
  - Wyświetlanie tekstu z informacją o sukcesie lub błędzie
  - Przycisk do zamknięcia powiadomienia (opcjonalnie)
- Obsługiwane interakcje:
  - Renderowanie komunikatu na podstawie przekazanej wartości
- Warunki walidacji:
  - Komunikat powinien być wyświetlony tylko, gdy nie jest pusty
- Typy:
  - Prosty typ `string` dla komunikatu
- Propsy:
  - `message: string`
  - `type: 'success' | 'error'`

## 5. Typy

- `CardData`: Obiekt zawierający pola `movies`, `series`, `music`, `books` (wszystkie typu `string`)
- `CreateCardCommand`: Obiekt zawierający pole `card_data` typu `CardData`
- (Opcjonalnie) `CreateCardViewModel`: Interfejs definiujący lokalny stan formularza, np.:
  ```ts
  interface CreateCardViewModel {
    movies: string;
    series: string;
    music: string;
    books: string;
    loading: boolean;
    error: string | null;
  }
  ```

## 6. Zarządzanie stanem

- Użycie hooków `useState` i `useEffect` wewnątrz komponentu `CreateCardForm` do:
  - Przechowywania wartości pól formularza
  - Zarządzania stanem ładowania (loading)
  - Przechowywania komunikatów o błędach lub sukcesie
- Rozważenie stworzenia niestandardowego hooka, np. `useCreateCard`, dla centralizacji logiki API i zarządzania stanem formularza

## 7. Integracja API

- **POST /api/cards**: Służy do przesyłania danych formularza (obiekt `CreateCardCommand`). Oczekiwana odpowiedź to obiekt `CardDTO`, potwierdzający utworzenie wizytówki.
- **POST /api/cards/generate**: Wywoływany przez przycisk Generate w celu wygenerowania rozbudowanej wizytówki. Odpowiedź powinna zostać odpowiednio obsłużona (np. wyświetlenie dodatkowych informacji lub przekierowanie).
- Walidacja odpowiedzi:
  - Sprawdzenie statusu odpowiedzi (np. 201 dla sukcesu) oraz obsługa ewentualnych błędów (400, 401, 500).
- Bezpieczeństwo:
  - Obsługa błędów, w tym błędów sieciowych oraz nieprawidłowych odpowiedzi API.

## 8. Interakcje użytkownika

- Użytkownik wpisuje dane w pola formularza.
- Kliknięcie przycisku Submit:
  - Uruchamia weryfikację i walidację pól
  - Dane są wysyłane do API
  - W przypadku sukcesu wyświetlany jest komunikat i ewentualne przekierowanie do widoku wizytówki
  - W przypadku błędu, użytkownik otrzymuje odpowiedni komunikat
- Kliknięcie przycisku Generate:
  - Wywołanie endpointu `/api/cards/generate`
  - Prezentacja wyniku działania (np. dodatkowe informacje o wizytówce lub przekierowanie)

## 9. Warunki i walidacja

- Walidacja pól formularza:
  - Upewnienie się, że każde pole zawiera wartość tekstową (zgodnie z oczekiwanym typem)
  - Sanitizacja danych wejściowych przed wysyłką do API
- Atrybuty ARIA:
  - Dodanie odpowiednich atrybutów (np. `aria-label`) dla elementów formularza i przycisków, aby zapewnić dostępność

## 10. Obsługa błędów

- Obsługa odpowiedzi API:
  - Błędy walidacji (400 Bad Request)
  - Błędy autoryzacji (401 Unauthorized)
  - Błędy serwera (500 Internal Server Error)
- Wyświetlanie komunikatów przez komponent `Notification`
- Obsługa błędów sieciowych (np. timeout, brak połączenia)
- Resetowanie stanu formularza lub pokazanie użytkownikowi sugestii naprawy błędów

## 11. Kroki implementacji

1. Utworzenie nowego widoku `/card/create` (plik Astro lub komponent React w `src/pages/card/create`)
2. Zaimplementowanie komponentu `CreateCardForm` wraz z formularzem i logiką zarządzania stanem
3. Dodanie pól wejściowych do formularza oraz przycisków (Submit i Generate)
4. Integracja hooków `useState`/`useEffect` do zarządzania stanem formularza
5. Zaimportowanie typów `CreateCardCommand` oraz `CardData` z `src/types.ts`
6. Implementacja walidacji pól i sanitizacji danych wejściowych
7. Wywołanie API do `/api/cards` przy przesyłaniu formularza oraz obsługa odpowiedzi (sukces lub błąd)
8. Implementacja logiki przycisku Generate, wywołującego endpoint `/api/cards/generate`
9. Dodanie komponentu `Notification` do wyświetlania komunikatów
10. Testowanie widoku pod kątem responsywności, dostępności (ARIA) oraz poprawności walidacji
11. Dokumentacja i przegląd kodu (peer review) przed wdrożeniem
