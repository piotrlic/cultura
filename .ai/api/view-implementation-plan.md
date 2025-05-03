# API Endpoint Implementation Plan: Retrieve Card (Authenticated)

## 1. Przegląd punktu końcowego

Endpoint ten służy do pobrania danych karty użytkownika. Dostęp do niego mają wyłącznie właściciele kart, co zapewnia, że każdy użytkownik widzi tylko swoje dane karty.

## 2. Szczegóły żądania

- **Metoda HTTP:** GET
- **Struktura URL:** `/api/cards`
- **Parametry:**
  - **Wymagane:**
    - Autentykacja: Użytkownik musi być uwierzytelniony (np. poprzez token sesji lub odpowiednie nagłówki).
  - **Opcjonalne:** Brak
- **Request Body:** Brak

## 3. Wykorzystywane typy

- **DTO:** `CardDTO` (zawiera: id, user_id, card_data, sharing_token, created_at, modified_at)
- **Inne typy:** `CardData` (zawiera informacje o filmach, serialach, muzyce oraz książkach)

## 4. Szczegóły odpowiedzi

- **Sukces:**
  - Kod HTTP: 200 OK
  - Payload: Obiekt zgodny z typem `CardDTO` zawierający pełne dane karty użytkownika.
- **Błędy:**
  - 401 Unauthorized: Jeśli użytkownik nie jest uwierzytelniony.
  - 404 Not Found: Jeśli karta nie zostanie znaleziona dla danego `user_id`.
  - 500 Internal Server Error: W przypadku wystąpienia nieoczekiwanych błędów serwerowych.

## 5. Przepływ danych

1. Użytkownik wysyła żądanie GET na `/api/cards`.
2. Middleware uwierzytelniania weryfikuje, czy użytkownik jest zalogowany, pobierając dane z `context.locals.supabase`.
3. Logika endpointa przekazuje identyfikator użytkownika do funkcji serwisowej, np. `getCardByUserId` znajdującej się w `src/lib/services/cardService.ts`.
4. Serwis wykonuje zapytanie do bazy danych, wyszukując rekord karty na podstawie `user_id`.
5. W przypadku pomyślnego odnalezienia karty, endpoint zwraca dane karty z kodem 200 OK. Jeśli karta nie zostanie znaleziona, zwracany jest kod 404.

## 6. Względy bezpieczeństwa

- Endpoint musi być zabezpieczony przez mechanizm autentykacji, aby wyłącznie zalogowani użytkownicy mogli uzyskać do niego dostęp.
- Zapytanie do bazy danych musi być oparte na identyfikatorze użytkownika pozyskanym z sesji, co zapobiega przypadkowemu lub celowemu odczytowi danych innego użytkownika.
- Należy upewnić się, że w odpowiedzi nie zostaną udostępnione żadne wrażliwe dane, oprócz informacji zawartych w pełnym obiekcie `CardDTO` dla autoryzowanego użytkownika.
- Walidacja braku dodatkowych danych wejściowych, które mogłyby wpłynąć na logikę endpointu.

## 7. Obsługa błędów

- **401 Unauthorized:** Brak poprawnego tokena uwierzytelniającego lub sesji użytkownika.
- **404 Not Found:** Brak rekordu karty dla danego `user_id`.
- **500 Internal Server Error:** Wystąpienie nieoczekiwanych błędów, takich jak problemy z połączeniem do bazy danych lub błędy logiki aplikacji.

## 8. Rozważania dotyczące wydajności

- Upewnienie się, że zapytanie do bazy danych wykorzystuje indeks na kolumnie `user_id` dla szybkiego wyszukiwania rekordu.
- Minimalizacja liczby danych przesyłanych pomiędzy bazą a aplikacją przez zwracanie tylko niezbędnych pól.
- W miarę potrzeb rozważenie cache'owania danych, jeśli operacja stanie się częstym zadaniem i odpowiada na to strategia aplikacji.

## 9. Etapy wdrożenia

1. Utworzenie nowego endpointa w pliku `./src/pages/api/cards.ts` z metodą GET.
2. Implementacja middleware autentykacji, która pobiera dane użytkownika z `context.locals.supabase`.
3. Stworzenie funkcji serwisowej (np. `getCardByUserId` w `src/lib/services/cardService.ts`) odpowiedzialnej za pobranie karty z bazy danych.
4. Zaimplementowanie walidacji oraz przetwarzania odpowiedzi - w przypadku braku danych zwrócenie 404 oraz odpowiednich komunikatów błędu.
5. Dodanie odpowiedniego logowania błędów i testów jednostkowych/integracyjnych dla endpointa.
6. Przeprowadzenie code review i testów manualnych w środowisku testowym.
7. Wdrożenie na środowisko produkcyjne po pozytywnej weryfikacji i testach.
