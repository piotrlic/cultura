# Plan implementacji widoku stworzonej wizytówki

## 1. Przegląd

Widok stanowi główny interfejs po zalogowaniu, umożliwiający użytkownikowi szybki podgląd aktualnie posiadanej wizytówki. Widok prezentuje podsumowanie wizytówki, a także umożliwia przejście do edycji lub usunięcia wizytówki, a w przypadku jej braku – utworzenie nowej. Interfejs jest intuicyjny, dostępny (w tym uwzględnienie atrybutów ARIA) oraz zabezpieczony przy użyciu mechanizmów autoryzacji JWT.

## 2. Routing widoku

Widok będzie dostępny pod ścieżką: `/card`.

## 3. Struktura komponentów

- **CardView** – główny komponent widoku, odpowiedzialny za pobranie danych wizytówki z API oraz zarządzanie stanem widoku.
  - **NavigationBar** – pasek nawigacji, wspólny dla aplikacji, zapewniający dostęp do innych widoków.
  - **Header** – nagłówek widoku z tytułem (np. "Moja Wizytówka").
  - **CardPreview** – komponent prezentujący podsumowanie wizytówki (dane z `CardDTO`).
  - **ActionButtons** – zestaw przycisków akcji: "Utwórz wizytówkę", "Edytuj wizytówkę", "Usuń wizytówkę".
  - **Loading/Error Display** – komponent wyświetlający stan ładowania lub komunikaty błędów.

## 4. Szczegóły komponentów

### CardView

- Opis: Kontener widoku, odpowiada za inicjalizację pobierania danych wizytówki, zarządzanie stanem (ładowanie, dane, błąd) oraz przekazywanie danych do komponentów potomnych.
- Główne elementy HTML: kontener div z sekcjami dla nagłówka, podglądu karty oraz przycisków akcji.
- Obsługiwane interakcje: Inicjacja pobierania danych przy montażu, przejście do podstron edycji lub utworzenia nowej wizytówki.
- Walidacja: Weryfikacja, czy odpowiedź API jest poprawna (kod 200) lub czy wystąpił błąd (np. 401 – przekierowanie do logowania).
- Typy: Wykorzystuje typ `CardDTO` zdefiniowany w `src/types.ts`.
- Propsy: Brak, zarządzany wewnętrznie.

### CardPreview

- Opis: Wyświetla dane wizytówki (filmy, seriale, muzyka, książki) w czytelnym formacie.
- Główne elementy: Komponent karty (np. z biblioteki Shadcn/ui), listy lub sekcje prezentujące poszczególne kategorie.
- Obsługiwane interakcje: Możliwość odświeżenia danych poprzez kliknięcie przycisku (jeśli zaimplementowane).
- Walidacja: Sprawdzenie obecności wszystkich wymaganych danych. W przypadku braków – wyświetlenie komunikatu o błędzie lub propozycji utworzenia nowej wizytówki.
- Typy: Przyjmuje właściwości typu `CardDTO` lub ewentualnie dedykowany `CardViewModel` (alias dla `CardDTO`).
- Propsy: Obiekt wizytówki (np. `card: CardDTO`).

### ActionButtons

- Opis: Zestaw przycisków umożliwiających akcje na wizytówce.
- Główne elementy: Przyciski z opisami "Utwórz wizytówkę", "Edytuj wizytówkę" i "Usuń wizytówkę".
- Obsługiwane interakcje: Po kliknięciu przycisku – odpowiednie akcje:
  - "Utwórz wizytówkę" – przekierowanie do widoku kreatora wizytówki
  - "Edytuj wizytówkę" – przekierowanie do edycji istniejącej wizytówki
  - "Usuń wizytówkę" – wywołanie funkcji usuwania (z potwierdzeniem akcji)
- Walidacja: Przycisk edycji/usuwania aktywny tylko, jeśli wizytówka istnieje; przycisk stworzenia jest widoczny w przeciwnym przypadku.
- Typy: Prosty interfejs przyjmuje status istnienia wizytówki (boolean) oraz ewentualną metodę callback do obsługi kliknięć.
- Propsy: np. `hasCard: boolean`, `onEdit: () => void`, `onDelete: () => void`, `onCreate: () => void`.

### NavigationBar oraz Header

- Opis: Standardowe komponenty aplikacji, zapewniające nawigację i informację o aktualnym widoku.
- Elementy: Linki nawigacyjne, tytuł widoku.
- Interakcje: Nawigacja do innych widoków.
- Propsy: Zależne od implementacji globalnej nawigacji.

## 5. Typy

- `CardDTO` (z `src/types.ts`): Zawiera informacje niezbędne do wyświetlenia wizytówki.
- (Opcjonalnie) `CardViewModel`: Alias lub rozbudowany typ oparty na `CardDTO`, zawierający dodatkowe pola pomocnicze używane tylko na froncie (np. flagi ładowania czy stanu błędu).
- Typy dla stanu: np. `CardState = { loading: boolean; error: string | null; data: CardDTO | null }`.

## 6. Zarządzanie stanem

- Użycie hooka `useState` do przechowywania stanu wizytówki (ładowanie, dane, błąd).
- Użycie hooka `useEffect` do wywołania API (GET `/api/cards`) przy montażu komponentu.
- (Opcjonalnie) Utworzenie niestandardowego hooka `useCard`, który enkapsuluje logikę pobierania danych oraz obsługę błędów.

## 7. Integracja API

- Wywołanie endpointu GET `/api/cards` podczas inicjalizacji widoku.
- Oczekiwany typ odpowiedzi: `CardDTO`.
- Obsługa kodów odpowiedzi:
  - 200 OK – wykonanie aktualizacji stanu z danymi wizytówki.
  - 401 Unauthorized – przekierowanie do logowania.
  - 404 Not Found – wyświetlenie interfejsu umożliwiającego utworzenie nowej wizytówki.
  - 500 Internal Server Error – wyświetlenie komunikatu o błędzie.

## 8. Interakcje użytkownika

- Automatyczne ładowanie danych wizytówki przy wejściu na widok.
- Jeśli wizytówka istnieje:
  - Wyświetlenie podsumowania wizytówki w komponencie `CardPreview`.
  - Umożliwienie przejścia do edycji lub usunięcia wizytówki poprzez `ActionButtons`.
- Jeśli wizytówka nie istnieje:
  - Wyświetlenie przycisku "Utwórz wizytówkę", który przenosi użytkownika do kreatora wizytówki.
- Reakcja na błędy: Pojawienie się komunikatu o błędzie oraz sugestia kolejnych działań (np. ponowna próba lub utworzenie wizytówki).

## 9. Warunki i walidacja

- Weryfikacja stanu autoryzacji użytkownika przed wykonaniem żądania do API.
- Walidacja kompletności danych wizytówki przed wyświetleniem:
  - Sprawdzenie, czy wszystkie wymagane pola (movies, series, music, books) są dostępne w odpowiedzi.
- Warunki dla przycisków: Aktywacja przycisków edycji i usunięcia tylko, gdy wizytówka istnieje.

## 10. Obsługa błędów

- Przekierowanie do logowania w przypadku błędu 401.
- Wyświetlenie komunikatu o błędzie przy odpowiedziach 500 lub innych nieoczekiwanych błędach.
- W przypadku braku wizytówki (404) – prezentacja interfejsu umożliwiającego utworzenie nowej wizytówki.

## 11. Kroki implementacji

1. Utworzenie nowego widoku w Astro pod ścieżką `/card` (plik np. `src/pages/card.astro`).
2. Stworzenie głównego komponentu `CardView` w React, który będzie odpowiadał za logikę pobierania danych i zarządzanie stanem.
3. Implementacja niestandardowego hooka (np. `useCard`) do integracji z endpointem GET `/api/cards`.
4. Zaimplementowanie komponentu `CardPreview` do prezentacji danych wizytówki, wykorzystując typ `CardDTO`.
5. Utworzenie komponentu `ActionButtons` z przyciskami do edycji, usuwania lub tworzenia wizytówki, z odpowiednimi callbackami i walidacją stanu istnienia wizytówki.
6. Integracja komponentów `NavigationBar` oraz `Header`, aby zachować spójność z resztą aplikacji.
7. Implementacja obsługi stanów ładowania oraz błędów, pokazanie spinnera lub komunikatów błędów.
8. Testowanie widoku – manualne (ręczne sprawdzenie) oraz jednostkowe, weryfikacja poprawności wywołań API i zmian stanu.
9. Code review i integracja widoku z resztą aplikacji.
10. Deployment wdrożenia na środowisko testowe oraz produkcyjne po pozytywnej weryfikacji.
