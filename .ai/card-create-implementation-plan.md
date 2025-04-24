# API Endpoint Implementation Plan: Create Card

## 1. Przegląd punktu końcowego
Endpoint służy do tworzenia nowej karty profilu kulturowego użytkownika z użyciem domyślnego szablonu. Umożliwia autoryzowanym użytkownikom zapisanie swoich preferencji kulturalnych oraz generuje unikalny token udostępniania.

## 2. Szczegóły żądania
- **Metoda HTTP:** POST
- **Struktura URL:** `/api/cards`
- **Parametry:**
  - Wymagane:
    - `card_data` (obiekt) zawierający pola:
      - `movies` (string)
      - `series` (string)
      - `music` (string)
      - `books` (string)
  - Opcjonalne: Brak

- **Body (przykład):**
```json
{
  "card_data": {
    "movies": "Przykładowy film",
    "series": "Przykładowa seria",
    "music": "Przykładowa muzyka",
    "books": "Przykładowa książka"
  }
}
```

## 3. Wykorzystywane typy
- `CreateCardCommand` - model komendy dla tworzenia karty. Zawiera:
  - `card_data: CardData`
- `CardData` - obiekt zawierający:
  - `movies`, `series`, `music`, `books` (wszystkie stringi)
- `CardDTO` - model reprezentujący pełną kartę, który zostanie zwrócony jako odpowiedź. Zawiera:
  - `id` (UUID)
  - `user_id` (UUID)
  - `card_data` (CardData)
  - `sharing_token` (string)
  - `created_at` (timestamp ISO8601)
  - `modified_at` (timestamp ISO8601)

## 4. Szczegóły odpowiedzi
- **Kod statusu:** 201 Created w przypadku sukcesu
- **Struktura odpowiedzi:**
```json
{
  "id": "UUID",
  "user_id": "UUID",
  "card_data": { ... },
  "sharing_token": "string",
  "created_at": "ISO8601 timestamp",
  "modified_at": "ISO8601 timestamp"
}
```
- Inne kody statusu:
  - 400 Bad Request - gdy dane wejściowe są niepoprawne lub niekompletne
  - 401 Unauthorized - gdy użytkownik nie jest autoryzowany
  - 500 Internal Server Error - błąd serwera

## 5. Przepływ danych
1. Użytkownik wysyła żądanie POST do `/api/cards` z danymi w polu `card_data`.
2. Na poziomie API:
   - Weryfikujemy autoryzację użytkownika (sprawdzamy sesję przy pomocy `supabase` z `context.locals`).
   - Walidujemy dane wejściowe za pomocą Zod, zabezpieczając, że wszystkie wymagane pola są obecne i mają typ string.
3. Wywołujemy warstwę serwisów, która:
   - Generuje unikalny `sharing_token`.
   - Przekazuje dane do bazy danych (tabela `cards`) wraz z `user_id` z kontekstu uwierzytelnienia, ustawia pola `created_at` i `modified_at`.
4. Po pomyślnym utworzeniu karty, zwracamy pełny obiekt `CardDTO`.

## 6. Względy bezpieczeństwa
- Autoryzacja: Użycie Supabase do uwierzytelniania, weryfikacja sesji użytkownika.
- Walidacja danych: Stosowanie Zod do walidacji danych wejściowych.
- Ograniczanie pól: Akceptowanie i zapisywanie wyłącznie oczekiwanych pól (zapobieganie dodaniu niepożądanych właściwości).
- Bezpieczeństwo bazy danych: Korzystanie z referencji (klucz obcy na `user_id`) oraz unikalnych ograniczeń dla `sharing_token`.
- Obsługa wyjątków: Zapisywanie błędów oraz alertowanie w przypadku nieoczekiwanych wyjątków.

## 7. Obsługa błędów
- **400 Bad Request:** W przypadku niekompletnych lub nieprawidłowych danych wejściowych. 
  - Mechanizm: Zod walidacja → zwrócenie komunikatu o błędzie.
- **401 Unauthorized:** Gdy użytkownik nie jest zalogowany.
- **500 Internal Server Error:**
  - Błąd przy zapisie do bazy, problem z generowaniem tokenu lub nieoczekiwany wyjątek.
  - Mechanizm: Logowanie błędu do systemu monitorowania oraz zwrócenie komunikatu błędu.

## 8. Rozważania dotyczące wydajności
- Indeksowanie kluczowych kolumn bazy danych (`id`, `user_id`).
- Minimalizowanie narzutu walidacji dzięki Zod.
- Asynchroniczne operacje bazy danych: wykorzystanie funkcji asynchronicznych dla optymalizacji przepływu.
- Składanie pojedynczej operacji zapisu zamiast wielu transakcji.

## 9. Etapy wdrożenia
1. Utworzenie walidacji wejściowych za pomocą Zod i stworzenie odpowiedniego schematu dla `CreateCardCommand`.
2. Implementacja funkcji serwisowej `createCard`, która:
   - Generuje `sharing_token`.
   - Interfejsuje z bazą danych w celu stworzenia karty.
3. Implementacja API endpointu:
   - Utworzenie pliku `src/pages/api/cards.ts` lub odpowiedniej lokalizacji wg przyjętego podejścia.
   - Integracja z warstwą autoryzacji przy użyciu `supabase` z `context.locals`.
4. Obsługa odpowiedzi:
   - W przypadku sukcesu, zwrócenie kodu 201 oraz obiektu `CardDTO`.
   - W przypadku błędów, odpowiednie zwrócenie kodu 400, 401 lub 500.
5. Dodanie logowania i monitorowania błędów.
7. Dokumentacja i peer review:
   - Przegląd kodu przez zespół.
   - Dokładna dokumentacja implementacji oraz sposobu używania endpointu. 