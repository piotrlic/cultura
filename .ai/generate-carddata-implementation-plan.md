/_ API Endpoint Implementation Plan: Generate Card Data (Authenticated) _/

# API Endpoint Implementation Plan: Generate Card Data (Authenticated)

## 1. Przegląd punktu końcowego

Celem tego endpointu jest wygenerowanie szczegółowych informacji dotyczących karty użytkownika, na podstawie podanych przez użytkownika tytułów filmów (oraz potencjalnie innych kategorii kulturowych: seriale, muzyka, książki). Endpoint komunikuje się z modelem AI, który generuje rozbudowany opis filmów, włącznie z podsumowaniami i linkami do IMDb. W odpowiedzi zwracany jest obiekt `card_data` zawierający te informacje. Endpoint wymaga autentykacji użytkownika.

## 2. Szczegóły żądania

- **Metoda HTTP:** POST
- **Struktura URL:** `/api/cards/generate`
- **Parametry:**
  - **Wymagane:**
    - `card_data`: obiekt zawierający:
      - `movies` (string): Nazwy filmów, na podstawie których model AI wygeneruje opis.
      - `series` (string): Nazwy seriali.
      - `music` (string): Nazwy utworów/muzyki.
      - `books` (string): Nazwy książek.
  - **Opcjonalne:** Brak
- **Request Body:**
  ```json
  {
    "card_data": {
      "movies": "string",
      "series": "string",
      "music": "string",
      "books": "string"
    }
  }
  ```

## 3. Wykorzystywane typy

- **DTO i Command Modele:**
  - `CardData` (zawiera pola: movies, series, music, books)
  - `CardDTO` (mapuje rekord karty w bazie, choć w tym endpoint nie dokonujemy zapisu do bazy)
  - Możliwe użycie dodatkowego command modelu lub walidatora dla danych wejściowych (np. z użyciem Zod) w obrębie implementacji endpointu.

## 4. Szczegóły odpowiedzi

- **Response Body:**
  ```json
  {
    "card_data": {
      "movies": "string",
      "series": "string",
      "music": "string",
      "books": "string"
    }
  }
  ```
- **Kody statusu:**
  - `200 OK` – powodzenie generowania i zwrócenia danych.
  - `400 Bad Request` – niepoprawne dane wejściowe lub walidacja nie powiodła się.
  - `401 Unauthorized` – brak autentykacji lub niewłaściwe dane uwierzytelniające.
  - `500 Internal Server Error` – błąd po stronie serwera, np. niepowodzenie integracji z AI modelem.

## 5. Przepływ danych

1. Użytkownik wysyła żądanie POST do `/api/cards/generate`, zawierające obiekt `card_data`.
2. Middleware autoryzacyjny (np. korzystający z Supabase) sprawdza, czy użytkownik jest autoryzowany.
3. Dane wejściowe są walidowane przy użyciu schematu Zod lub innej biblioteki walidacyjnej.
4. Po pomyślnej walidacji, logika endpointu przekazuje dane do warstwy serwisowej odpowiedzialnej za komunikację z modelem AI.
5. Serwis wywołuje model AI, przekazując listę filmów, a model zwraca rozbudowany opis, w tym podsumowanie i linki do IMDb. Lecz narazie tego nie implementujemy. Zwracamy mockowe dane.
6. Wynik generowany przez AI jest ostatecznie zwracany w strukturze `card_data` w odpowiedzi z kodem `201 Created`.

## 6. Względy bezpieczeństwa

- Sprawdzenie autentykacji użytkownika przy każdym żądaniu (użycie Supabase Auth z `context.locals`).
- Walidacja struktury i treści danych wejściowych, aby uniknąć ataków typu injection lub nadmiarowych danych.
- Ograniczenie liczby wywołań do modelu AI, aby zapobiegać ewentualnemu przeciążeniu systemu.

## 7. Obsługa błędów

- **Błąd 400 (Bad Request):** Zwracany, gdy walidacja wejścia nie powiedzie się. Należy poinformować użytkownika o nieprawidłowej strukturze lub brakujących polach.
- **Błąd 401 (Unauthorized):** Zwracany, gdy użytkownik nie jest autoryzowany.
- **Błąd 500 (Internal Server Error):** Zwracany w przypadku nieoczekiwanych błędów podczas przetwarzania żądania lub integracji z modelem AI. Błędy te powinny być logowane dla dalszej analizy.

## 8. Rozważania dotyczące wydajności

- Asynchroniczne wywołanie modelu AI, aby nie blokować głównego wątku przetwarzania.
- Możliwość implementacji cache dla powtarzalnych zapytań w celu optymalizacji wydajności.
- Monitorowanie opóźnień w odpowiedziach modelu AI i skalowanie zasobów według potrzeb.

## 9. Etapy wdrożenia

1. **Utworzenie walidatora:**

   - Zdefiniować schemat walidacyjny dla obiektu `card_data` przy użyciu Zod (np. w `/src/lib/validators/generateCardValidator.ts`).

2. **Implementacja endpointu:**

   - Utworzyć plik endpointu: `/src/pages/api/cards/generate.ts`.
   - Obsłużyć jedynie metodę POST i sprawdzić poprawność metody.
   - Używać `context.locals` do uzyskania instancji SupabaseClient dla autentykacji.

3. **Integracja z serwisem AI:**

   - Wyodrębnić logikę wywołania modelu AI do dedykowanego serwisu (np. `/src/lib/services/generateCardService.ts`).
   - Zapewnić obsługę asynchroniczną i timeouty dla wywołań AI.

4. **Obsługa błędów i logowanie:**

   - Zaimplementować mechanizmy logowania błędów i stosować odpowiednie kody statusu HTTP.

5. **Testowanie:**

   - Przetestować endpoint z poprawnymi i niepoprawnymi danymi.
   - Zaimplementować testy jednostkowe i/lub integracyjne.

6. **Dokumentacja:**

   - Uaktualnić dokumentację API, aby zawierała nowy endpoint oraz przykłady żądań i odpowiedzi.

7. **Przegląd i wdrożenie:**
   - Dokonać przeglądu kodu przez zespół.
   - Wdrożyć endpoint na środowisku testowym, a następnie na produkcyjnym.
