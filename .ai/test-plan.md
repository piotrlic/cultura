# Plan Testów Projektu "Cultura"

## 1. Wprowadzenie i Cele Testowania

### 1.1. Wprowadzenie

Niniejszy dokument przedstawia plan testów dla aplikacji "Cultura", której celem jest umożliwienie użytkownikom tworzenia, edycji i udostępniania kart profilowych prezentujących ich zainteresowania kulturowe. Aplikacja wykorzystuje predefiniowany szablon z określonymi motywami i kolorami. Wersja MVP ma na celu weryfikację, czy użytkownicy regularnie aktualizują swoje karty i udostępniają je na platformach zewnętrznych.

### 1.2. Cele Testowania

Główne cele testowania projektu "Cultura" to:

- Weryfikacja, czy wszystkie funkcjonalności MVP działają zgodnie ze specyfikacją.
- Zapewnienie wysokiej jakości i stabilności aplikacji przed wdrożeniem.
- Identyfikacja i zaraportowanie defektów.
- Sprawdzenie, czy aplikacja jest intuicyjna i łatwa w obsłudze dla użytkownika końcowego.
- Weryfikacja bezpieczeństwa danych użytkowników oraz poprawności działania mechanizmów autentykacji.
- Ocena wydajności kluczowych operacji, takich jak ładowanie stron, zapis danych.
- Zapewnienie poprawnego wyświetlania i działania aplikacji na różnych przeglądarkach i urządzeniach (responsywność).
- Potwierdzenie, że proces tworzenia, edycji i udostępniania kart jest płynny i bezproblemowy.

## 2. Zakres Testów

### 2.1. Funkcjonalności objęte testami:

- **Moduł Użytkownika:**
  - Rejestracja nowego użytkownika.
  - Logowanie istniejącego użytkownika.
  - Wylogowywanie.
  - (Opcjonalnie, jeśli zaimplementowane) Przypomnienie/reset hasła.
- **Moduł Karty Profilowej:**
  - Tworzenie nowej karty profilowej (z wykorzystaniem predefiniowanego szablonu).
  - Edycja istniejącej karty profilowej (zmiana treści w ramach dostępnych pól).
  - Zapisywanie zmian na karcie profilowej.
  - Podgląd karty profilowej przez jej właściciela.
- **Moduł Udostępniania:**
  - Generowanie unikalnego linku do karty profilowej.
  - Wyświetlanie publicznie dostępnej karty profilowej za pomocą unikalnego linku (bez konieczności logowania).
- **Interfejs Użytkownika (UI) i Doświadczenie Użytkownika (UX):**
  - Nawigacja po aplikacji.
  - Poprawność wyświetlania elementów interfejsu.
  - Responsywność na różnych rozmiarach ekranu (desktop, tablet, mobile).
  - Czytelność i estetyka (zgodność z predefiniowanym szablonem i motywami).
- **Bezpieczeństwo:**
  - Ochrona dostępu do danych użytkownika (tylko zalogowany użytkownik może edytować swoją kartę).
  - Poprawność działania mechanizmów autentykacji i autoryzacji.
- **API i Integracje:**
  - Komunikacja frontend-backend (Astro/React z Supabase).
  - Poprawność operacji CRUD na danych kart profilowych.
- **Middleware:**
  - Ochrona tras wymagających autentykacji.
  - Poprawne przekierowania.

### 2.2. Funkcjonalności nieobjęte testami (w ramach MVP, chyba że zostaną dodane):

- Zaawansowana personalizacja wyglądu karty (poza predefiniowanymi motywami).
- Integracja z zewnętrznymi platformami społecznościowymi (automatyczne udostępnianie).
- Funkcjonalności oparte o AI (np. sugestie treści), chyba że zostaną dodane do MVP.
- Panel administracyjny.
- Testy obciążeniowe na dużą skalę (poza podstawowymi testami wydajności).

## 3. Typy Testów do Przeprowadzenia

- **Testy Jednostkowe (Unit Tests):**
  - _Cel:_ Weryfikacja poprawności działania małych, izolowanych fragmentów kodu (np. funkcje pomocnicze w `src/lib`, logika komponentów React, funkcje API w `src/pages/api`).
  - _Narzędzia:_ Vitest, React Testing Library (dla komponentów React).
- **Testy Integracyjne (Integration Tests):**
  - _Cel:_ Weryfikacja współpracy pomiędzy różnymi modułami/komponentami systemu (np. integracja komponentów React z usługami Supabase, działanie middleware z logiką stron).
  - _Narzędzia:_ Vitest, React Testing Library, mockowanie Supabase SDK.
- **Testy End-to-End (E2E Tests):**
  - _Cel:_ Symulacja rzeczywistych scenariuszy użytkownika, testowanie aplikacji jako całości z perspektywy użytkownika (np. proces od rejestracji, przez stworzenie karty, po jej udostępnienie).
  - _Narzędzia:_ Playwright lub Cypress.
- **Testy Akceptacyjne Użytkownika (UAT - User Acceptance Tests):**
  - _Cel:_ Potwierdzenie przez interesariuszy lub grupę docelową, że aplikacja spełnia ich wymagania i jest gotowa do wdrożenia.
  - _Metoda:_ Testy manualne przeprowadzane przez wyznaczone osoby.
- **Testy UI/UX (Manualne i Automatyczne):**
  - _Cel:_ Weryfikacja wyglądu, responsywności, intuicyjności i ogólnego doświadczenia użytkownika.
  - _Metoda:_ Testy manualne, testy wizualnej regresji (np. z użyciem Playwright/Cypress lub dedykowanych narzędzi).
- **Testy Bezpieczeństwa (Podstawowe):**
  - _Cel:_ Identyfikacja podstawowych luk bezpieczeństwa.
  - _Metoda:_ Manualne testy penetracyjne (np. sprawdzanie ochrony tras, walidacji danych wejściowych), przegląd konfiguracji Supabase (Row Level Security).
- **Testy Wydajności (Podstawowe):**
  - _Cel:_ Ocena szybkości ładowania stron i responsywności aplikacji pod typowym obciążeniem.
  - _Narzędzia:_ Narzędzia deweloperskie przeglądarki (Lighthouse), ewentualnie proste skrypty testujące czas odpowiedzi.
- **Testy Kompatybilności (Cross-Browser/Cross-Device):**
  - _Cel:_ Zapewnienie poprawnego działania i wyglądu na różnych przeglądarkach (Chrome, Firefox, Safari, Edge) i typach urządzeń (desktop, tablet, mobile).
  - _Metoda:_ Testy manualne i automatyczne (E2E na różnych konfiguracjach).

## 4. Scenariusze Testowe dla Kluczowych Funkcjonalności

(Przykładowe scenariusze, lista będzie rozwijana)

### 4.1. Rejestracja Użytkownika

| ID Scenariusza | Opis                                                        | Kroki Testowe                                                                                                                                                 | Oczekiwany Rezultat                                                                                            | Priorytet |
| :------------- | :---------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------- | :-------- |
| TC_REG_001     | Pomyślna rejestracja nowego użytkownika z poprawnymi danymi | 1. Przejdź na stronę rejestracji. 2. Wypełnij formularz poprawnymi danymi (email, hasło). 3. Zaakceptuj regulamin (jeśli jest). 4. Kliknij "Zarejestruj się". | Użytkownik zostaje zarejestrowany, przekierowany na stronę logowania lub panelu głównego i może się zalogować. | Wysoki    |
| TC_REG_002     | Próba rejestracji z już istniejącym adresem email           | 1. Przejdź na stronę rejestracji. 2. Wprowadź email, który już istnieje w systemie. 3. Wprowadź hasło. 4. Kliknij "Zarejestruj się".                          | Wyświetlany jest komunikat błędu informujący, że email jest już zajęty. Użytkownik nie zostaje zarejestrowany. | Wysoki    |
| TC_REG_003     | Próba rejestracji z niepoprawnym formatem email             | 1. Przejdź na stronę rejestracji. 2. Wprowadź email w niepoprawnym formacie (np. "test@test", "test"). 3. Wprowadź hasło. 4. Kliknij "Zarejestruj się".       | Wyświetlany jest komunikat błędu dotyczący niepoprawnego formatu email. Użytkownik nie zostaje zarejestrowany. | Wysoki    |
| TC_REG_004     | Próba rejestracji ze zbyt krótkim/słabym hasłem             | 1. Przejdź na stronę rejestracji. 2. Wprowadź poprawny email. 3. Wprowadź zbyt krótkie/słabe hasło (np. "123"). 4. Kliknij "Zarejestruj się".                 | Wyświetlany jest komunikat błędu dotyczący wymagań hasła. Użytkownik nie zostaje zarejestrowany.               | Wysoki    |
| TC_REG_005     | Próba rejestracji z pustymi polami obowiązkowymi            | 1. Przejdź na stronę rejestracji. 2. Pozostaw pole email i/lub hasło puste. 3. Kliknij "Zarejestruj się".                                                     | Wyświetlane są komunikaty błędów przy odpowiednich polach. Użytkownik nie zostaje zarejestrowany.              | Wysoki    |

### 4.2. Logowanie Użytkownika

| ID Scenariusza | Opis                                                       | Kroki Testowe                                                                                                                                  | Oczekiwany Rezultat                                                                                               | Priorytet |
| :------------- | :--------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------- | :-------- |
| TC_LOG_001     | Pomyślne logowanie z poprawnymi danymi uwierzytelniającymi | 1. Przejdź na stronę logowania. 2. Wprowadź poprawny email zarejestrowanego użytkownika. 3. Wprowadź poprawne hasło. 4. Kliknij "Zaloguj się". | Użytkownik zostaje zalogowany i przekierowany do panelu głównego lub na stronę, z której próbował uzyskać dostęp. | Wysoki    |
| TC_LOG_002     | Próba logowania z niepoprawnym hasłem                      | 1. Przejdź na stronę logowania. 2. Wprowadź poprawny email. 3. Wprowadź niepoprawne hasło. 4. Kliknij "Zaloguj się".                           | Wyświetlany jest komunikat o błędnych danych logowania. Użytkownik nie zostaje zalogowany.                        | Wysoki    |
| TC_LOG_003     | Próba logowania z nieistniejącym adresem email             | 1. Przejdź na stronę logowania. 2. Wprowadź email, który nie jest zarejestrowany. 3. Wprowadź dowolne hasło. 4. Kliknij "Zaloguj się".         | Wyświetlany jest komunikat o błędnych danych logowania. Użytkownik nie zostaje zalogowany.                        | Wysoki    |
| TC_LOG_004     | Próba logowania z pustymi polami                           | 1. Przejdź na stronę logowania. 2. Pozostaw pola email i/lub hasło puste. 3. Kliknij "Zaloguj się".                                            | Wyświetlane są komunikaty błędów przy odpowiednich polach. Użytkownik nie zostaje zalogowany.                     | Wysoki    |

### 4.3. Tworzenie i Edycja Karty Profilowej

| ID Scenariusza | Opis                                                         | Kroki Testowe                                                                                                                                                                                           | Oczekiwany Rezultat                                                                                            | Priorytet |
| :------------- | :----------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------- | :-------- |
| TC_CARD_001    | Pomyślne stworzenie nowej karty profilowej                   | 1. Zaloguj się. 2. Przejdź do sekcji tworzenia/edycji karty. 3. Wypełnij pola karty (zgodnie z szablonem). 4. Zapisz kartę.                                                                             | Karta zostaje pomyślnie zapisana. Dane są widoczne na podglądzie karty. Użytkownik widzi potwierdzenie zapisu. | Wysoki    |
| TC_CARD_002    | Pomyślna edycja istniejącej karty profilowej                 | 1. Zaloguj się. 2. Przejdź do edycji swojej karty. 3. Zmodyfikuj treść w wybranych polach. 4. Zapisz zmiany.                                                                                            | Zmiany zostają pomyślnie zapisane. Zaktualizowane dane są widoczne na podglądzie karty.                        | Wysoki    |
| TC_CARD_003    | Próba zapisu karty z pustymi polami obowiązkowymi (jeśli są) | 1. Zaloguj się. 2. Przejdź do tworzenia/edycji karty. 3. Pozostaw obowiązkowe pola puste. 4. Spróbuj zapisać kartę.                                                                                     | Wyświetlane są komunikaty błędów przy obowiązkowych polach. Karta nie zostaje zapisana.                        | Średni    |
| TC_CARD_004    | Sprawdzenie limitu znaków w polach (jeśli zdefiniowano)      | 1. Zaloguj się. 2. Przejdź do edycji karty. 3. Wprowadź tekst przekraczający limit znaków w danym polu. 4. Spróbuj zapisać. / Sprawdź, czy niemożliwe jest wpisanie większej liczby znaków.             | Aplikacja uniemożliwia wpisanie zbyt długiego tekstu lub wyświetla błąd przy próbie zapisu.                    | Średni    |
| TC_CARD_005    | Anulowanie edycji karty                                      | 1. Zaloguj się. 2. Przejdź do edycji karty. 3. Wprowadź zmiany. 4. Kliknij przycisk "Anuluj" lub opuść stronę bez zapisywania (jeśli jest ostrzeżenie o niezapisanych zmianach, potwierdź opuszczenie). | Zmiany nie zostają zapisane. Po ponownym otwarciu karty widoczne są dane sprzed edycji.                        | Średni    |

### 4.4. Udostępnianie i Wyświetlanie Karty

| ID Scenariusza | Opis                                                               | Kroki Testowe                                                                                                                                                                         | Oczekiwany Rezultat                                                                                                             | Priorytet |
| :------------- | :----------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------ | :-------- |
| TC_SHARE_001   | Generowanie i dostęp do publicznej karty przez unikalny link       | 1. Zaloguj się. 2. Stwórz/edytuj kartę i zapisz ją. 3. Uzyskaj unikalny link do udostępniania karty. 4. Otwórz link w nowej przeglądarce/trybie incognito (niezalogowany użytkownik). | Karta profilowa jest poprawnie wyświetlana z wszystkimi zapisanymi informacjami. Elementy edycyjne nie są dostępne.             | Wysoki    |
| TC_SHARE_002   | Sprawdzenie, czy link do karty jest unikalny                       | 1. Stwórz dwie różne karty przez dwóch różnych użytkowników. 2. Uzyskaj linki do obu kart.                                                                                            | Linki są różne. Każdy link prowadzi do poprawnej, odpowiadającej mu karty.                                                      | Wysoki    |
| TC_SHARE_003   | Dostęp do nieistniejącej/błędnej karty przez link                  | 1. Spróbuj otworzyć link do karty, która nie istnieje (np. zmodyfikowany poprawny link).                                                                                              | Wyświetlana jest odpowiednia strona błędu (np. 404 - Nie znaleziono) lub komunikat informujący, że karta nie istnieje.          | Średni    |
| TC_SHARE_004   | Wygląd udostępnionej karty na różnych urządzeniach (responsywność) | 1. Uzyskaj link do publicznej karty. 2. Otwórz link na różnych urządzeniach (desktop, tablet, smartfon) lub użyj narzędzi deweloperskich do symulacji.                                | Karta jest poprawnie i czytelnie wyświetlana na wszystkich testowanych urządzeniach. Layout dostosowuje się do rozmiaru ekranu. | Wysoki    |

## 5. Środowisko Testowe

- **Środowisko Deweloperskie (Lokalne):**
  - Maszyny deweloperów z uruchomioną aplikacją (Astro dev server).
  - Lokalna instancja Supabase (jeśli używana) lub połączenie z deweloperskim projektem Supabase.
- **Środowisko Testowe/Staging:**
  - Oddzielna instancja aplikacji wdrożona na platformie zbliżonej do produkcyjnej (np. Digital Ocean).
  - Oddzielny projekt Supabase dedykowany do testów (z danymi testowymi, odizolowany od danych produkcyjnych).
  - Dostęp do tego środowiska dla testerów i zautomatyzowanych testów E2E.
- **Środowisko Produkcyjne:**
  - Testy dymne (smoke tests) po każdym wdrożeniu na produkcję w celu weryfikacji kluczowych funkcjonalności.
- **Przeglądarki:**
  - Najnowsze wersje Chrome, Firefox, Safari, Edge.
- **Urządzenia:**
  - Desktop (Windows, macOS).
  - Urządzenia mobilne (Android, iOS) – rzeczywiste urządzenia lub emulatory/symulatory.

## 6. Narzędzia do Testowania

- **Zarządzanie Testami i Błędami:**
  - Jira, TestRail, Xray (jeśli dostępne) lub prostsze narzędzia jak Google Sheets/Trello na początkowym etapie.
  - System zgłaszania błędów zintegrowany z repozytorium kodu (np. GitHub Issues).
- **Automatyzacja Testów:**
  - **Testy Jednostkowe/Integracyjne:**
    - Vitest (framework do testowania JavaScript/TypeScript).
    - React Testing Library (do testowania komponentów React).
  - **Testy E2E:**
    - Playwright
- **Testy Wydajności:**
  - Narzędzia deweloperskie przeglądarek (Lighthouse, Performance tab).
- **Testy Wizualnej Regresji:**
  - Integracje z Playwright/Cypress (np. Percy, Applitools) lub wbudowane funkcje porównywania zrzutów ekranu.
- **CI/CD:**
  - GitHub Actions (do automatycznego uruchamiania testów w pipeline).
- **Inne:**
  - Narzędzia deweloperskie przeglądarek (do inspekcji elementów, debugowania).
  - Postman lub podobne (do testowania API, jeśli Astro API endpoints będą rozbudowane).

## 7. Harmonogram Testów

(Przykładowy harmonogram, wymaga dostosowania do sprintów/cyklu wydawniczego projektu)

- **Faza Planowania Testów:** [Data rozpoczęcia] - [Data zakończenia]
  - Analiza wymagań, tworzenie planu testów, definiowanie scenariuszy.
- **Faza Przygotowania Środowiska i Danych Testowych:** [Data rozpoczęcia] - [Data zakończenia] (równolegle z dewelopmentem)
- **Testy Jednostkowe i Integracyjne:** Ciągle, w trakcie dewelopmentu poszczególnych modułów.
- **Cykl Testów Funkcjonalnych (E2E, UI/UX, Bezpieczeństwo, Wydajność):**
  - Cykl 1: [Data rozpoczęcia] - [Data zakończenia] (po zaimplementowaniu kluczowych funkcjonalności MVP)
  - Cykl 2 (Regresja): [Data rozpoczęcia] - [Data zakończenia] (po poprawkach błędów)
- **Testy Akceptacyjne Użytkownika (UAT):** [Data rozpoczęcia] - [Data zakończenia] (przed planowanym wdrożeniem)
- **Testy Dymne (Smoke Tests):** Po każdym wdrożeniu na środowisko testowe/produkcyjne.

## 8. Kryteria Akceptacji Testów

### 8.1. Kryteria Wejścia (Rozpoczęcia Testów):

- Dostępny jest plan testów i scenariusze testowe.
- Środowisko testowe jest przygotowane i stabilne.
- Wymagane funkcjonalności są zaimplementowane i wdrożone na środowisku testowym.
- Dostępna jest dokumentacja techniczna i użytkownika (jeśli dotyczy).
- Kluczowe testy jednostkowe i integracyjne przechodzą pomyślnie.

### 8.2. Kryteria Wyjścia (Zakończenia Testów i Gotowości do Wdrożenia):

- Wszystkie scenariusze testowe o priorytecie "Wysoki" zostały wykonane i zakończyły się sukcesem.
- Minimum 95% scenariuszy testowych o priorytecie "Średni" zostało wykonanych i zakończyło się sukcesem.
- Brak otwartych błędów krytycznych (blokujących) i wysokich.
- Liczba otwartych błędów średnich i niskich jest na akceptowalnym poziomie (do ustalenia z zespołem/interesariuszami).
- Pokrycie testami (jeśli mierzone) osiągnęło zdefiniowany próg.
- Testy regresji zostały przeprowadzone i zakończyły się sukcesem.
- Wyniki UAT są pozytywne.
- Dokumentacja testowa (raporty z testów, lista błędów) jest kompletna i zaktualizowana.

## 9. Role i Odpowiedzialności w Procesie Testowania

- **Inżynier QA/Tester:**
  - Tworzenie i aktualizacja planu testów oraz scenariuszy testowych.
  - Przygotowanie danych testowych.
  - Wykonywanie testów manualnych i automatycznych.
  - Raportowanie i śledzenie błędów.
  - Współpraca z deweloperami w celu rozwiązywania problemów.
  - Przygotowywanie raportów z testów.
- **Deweloperzy:**
  - Pisanie testów jednostkowych i integracyjnych.
  - Poprawianie błędów zgłoszonych przez zespół QA.
  - Wsparcie w analizie przyczyn błędów.
  - Dbanie o jakość kodu zgodnie z wytycznymi.
- **Product Owner/Project Manager:**
  - Definiowanie wymagań i kryteriów akceptacji.
  - Priorytetyzacja funkcjonalności i błędów.
  - Udział w Testach Akceptacyjnych Użytkownika (UAT).
  - Podejmowanie decyzji o wdrożeniu na podstawie wyników testów.
- **(Opcjonalnie) Użytkownicy Końcowi/Interesariusze:**
  - Udział w UAT.
  - Dostarczanie informacji zwrotnej na temat użyteczności i funkcjonalności aplikacji.

## 10. Procedury Raportowania Błędów

- **Narzędzie do Śledzenia Błędów:** GitHub Issues (lub inne wybrane narzędzie).
- **Szablon Zgłoszenia Błędu:**
  - **ID Błędu:** (Automatycznie generowane przez system)
  - **Tytuł:** Zwięzły opis problemu.
  - **Środowisko:** (np. Dev, Staging, Produkcja; Wersja przeglądarki, System operacyjny)
  - **Kroki do Reprodukcji:** Szczegółowy opis kroków prowadzących do wystąpienia błędu.
  - **Obserwowany Rezultat:** Co faktycznie się stało.
  - **Oczekiwany Rezultat:** Jakie było oczekiwane zachowanie.
  - **Priorytet:** (np. Krytyczny, Wysoki, Średni, Niski)
    - _Krytyczny:_ Błąd blokujący dalsze testowanie kluczowych funkcjonalności lub uniemożliwiający korzystanie z aplikacji.
    - _Wysoki:_ Błąd powodujący niepoprawne działanie kluczowej funkcjonalności, ale istnieje obejście.
    - _Średni:_ Błąd powodujący niepoprawne działanie mniej istotnej funkcjonalności lub problem z UI/UX.
    - _Niski:_ Drobny błąd kosmetyczny, literówka, sugestia usprawnienia.
  - **Stopień Ważności (Severity):** (np. Krytyczny, Poważny, Umiarkowany, Drobny) - często powiązany z priorytetem.
  - **Zgłaszający:** Osoba, która znalazła błąd.
  - **Przypisany do:** Deweloper odpowiedzialny za naprawę.
  - **Status:** (np. Nowy, Otwarty, W Trakcie Naprawy, Do Retestu, Zamknięty, Odrzucony)
  - **Załączniki:** (np. zrzuty ekranu, logi, krótkie wideo).
- **Cykl Życia Błędu:**
  1.  **Nowy:** Błąd zgłoszony przez testera.
  2.  **Otwarty/Potwierdzony:** Błąd przeanalizowany i potwierdzony przez lidera QA lub dewelopera.
  3.  **Przypisany:** Błąd przypisany do dewelopera do naprawy.
  4.  **W Trakcie Naprawy:** Deweloper pracuje nad rozwiązaniem.
  5.  **Naprawiony/Do Retestu:** Deweloper oznaczył błąd jako naprawiony i gotowy do ponownego przetestowania.
  6.  **Zamknięty:** Tester potwierdził, że błąd został naprawiony.
  7.  **Odrzucony:** Błąd uznany za nieistotny, duplikat, lub "działa zgodnie z projektem".
  8.  **Ponownie Otwarty:** Jeśli retest wykazał, że błąd nie został naprawiony.
