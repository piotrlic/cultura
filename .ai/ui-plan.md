# Architektura UI dla Cultura

## 1. Przegląd struktury UI

Interfejs użytkownika został zaprojektowany z wykorzystaniem podejścia Mobile First, reagując na potrzeby responsywności i dostępności. Główna struktura opiera się na podziale na kilka kluczowych widoków dedykowanych rejestracji, logowaniu, tworzeniu, edycji oraz publicznym podglądzie wizytówki. Centralny dashboard integruje dynamiczne informacje o wizytówce oraz historią edycji. Nawigacja została zaprojektowana tak, aby umożliwiać łatwą orientację pomiędzy widokami, przy czym wszystkie widoki chronione zabezpieczeniami (JWT, uwierzytelnienie) są dostępne tylko dla autoryzowanych użytkowników. Całość interfejsu korzysta z responsywnego designu Tailwind i gotowych komponentów z biblioteki Shadcn/ui, zachowując spójną estetykę czarno-żółtą oraz mechanizmy dostępności (ARIA, semantyczny HTML) oraz system zarządzania stanem wykorzystującym React Context i hooki React

## 2. Lista widoków

- **Rejestracja**

  - Ścieżka widoku: `/register`
  - Główny cel: Umożliwić nowym użytkownikom założenie konta.
  - Kluczowe informacje do wyświetlenia: Formularz rejestracyjny (email, hasło, nazwa użytkownika) oraz komunikaty o błędach.
  - Kluczowe komponenty widoku: Formularz, przyciski, komunikaty walidacyjne.
  - UX, dostępność i względy bezpieczeństwa: Użycie ARIA dla elementów formularza, walidacja pól po stronie klienta.

- **Logowanie**

  - Ścieżka widoku: `/login`
  - Główny cel: Umożliwić użytkownikom logowanie przy użyciu istniejących danych.
  - Kluczowe informacje do wyświetlenia: Formularz logowania (email, hasło), opcjonalne komunikaty o błędach oraz wskazówki dla użytkowników.
  - Kluczowe komponenty widoku: Formularz, przyciski, powiadomienia o nieprawidłowych danych.
  - UX, dostępność i względy bezpieczeństwa: Zabezpieczenie komunikacji, mechanizm JWT dla sesji, responsywny design, wsparcie dla ARIA.

- **Widok wizytówki**

  - Ścieżka widoku: `/card`
  - Główny cel: Interfejs startowy po zalogowaniu, umożliwiający podgląd oraz edycje i usuwanie wizytówki.
  - Kluczowe informacje do wyświetlenia: Podsumowanie wizytówki (jeśli już istnieje), przyciski do utworzenia lub edycji wizytówki
  - Kluczowe komponenty widoku: Karta wizytówki, przyciski akcji, nagłówek, pasek nawigacji.
  - UX, dostępność i względy bezpieczeństwa: Jasna informacja o stanie wizytówki, intuicyjne przyciski, zabezpieczenia JWT, dostępność poprzez odpowiednie atrybuty ARIA.

- **Tworzenie wizytówki**

  - Ścieżka widoku: `/card/create`
  - Główny cel: Pozwolić użytkownikowi na stworzenie nowej wizytówki z wykorzystaniem predefiniowanego szablonu.
  - Kluczowe informacje do wyświetlenia: Formularz z czterema polami tekstowymi (filmy, seriale, muzyka, książki) oraz przycisk zatwierdzający tworzenie.
  - dodaj przycisk Generate który wygeneruje rozbudowaną wizytówkę uzywajac endpointu /api/cards/generate
  - Kluczowe komponenty widoku: Formularz, pola tekstowe, przycisk submit, powiadomienia o poprawności danych.
  - UX, dostępność i względy bezpieczeństwa: Przejrzysty układ formularza, wsparcie dla walidacji pól, mechanizmy ochrony przed atakami (np. XSS), responsywność, ARIA.

- **Edycja wizytówki**

  - Ścieżka widoku: `/card/edit`
  - Główny cel: Umożliwić użytkownikowi modyfikację istniejącej wizytówki.
  - Kluczowe informacje do wyświetlenia: Obecne dane wizytówki w formie edytowalnych pól, opcja zapisu zmian, przycisk anulowania.
  - Kluczowe komponenty widoku: Formularz, pola tekstowe, przyciski (zapisz, anuluj), komunikaty walidacyjne.
  - UX, dostępność i względy bezpieczeństwa: Natychmiastowa walidacja danych, jasne komunikaty o błędach, ochrona operacji za pomocą JWT, ARIA dla pól formularza.

- **Widok publiczny wizytówki**
  - Ścieżka widoku: `/card/shared/:sharing_token`
  - Główny cel: Umożliwić wyświetlanie wizytówki dla osób korzystających z unikalnego linku bez potrzeby logowania.
  - Kluczowe informacje do wyświetlenia: Treść wizytówki (filmy, seriale, muzyka, książki), ewentualne ograniczone dane użytkownika.
  - Kluczowe komponenty widoku: Statyczna karta wizytówki, przyciski udostępniania.
  - UX, dostępność i względy bezpieczeństwa: Minimalistyczny i czytelny design, wyraźna separacja elementów, ochrona danych wrażliwych (pominięcie prywatnych informacji).

## 3. Mapa podróży użytkownika

- Użytkownik trafia na stronę główną i wybiera opcję rejestracji lub logowania.
- Po rejestracji/logowaniu użytkownik jest przekierowywany na dashboard:
  - Jeśli to pierwsze logowanie, dashboard wyświetla przycisk umożliwiający stworzenie wizytówki.
  - Po utworzeniu wizytówki, dashboard prezentuje wizytówkę wraz z historią edycji.
  - Użytkownik może wybrać opcję edycji lub usunięcia wizytówki.
- Przechodząc do widoku edycji, użytkownik modyfikuje treść wizytówki.
- Użytkownik potwierdza zmiany, które następnie są zapisywane i odzwierciedlone na dashboardzie.
- Osoby odwiedzające unikalny link (widok publiczny) mogą wyświetlić wizytówkę bez logowania.
- W każdej fazie komunikaty o błędach lub sukcesie są wyświetlane, a interfejs jest responsywny oraz dostosowany do urządzeń mobilnych.

## 4. Układ i struktura nawigacji

- Główna nawigacja (header) będzie widoczna na wszystkich widokach dla zalogowanych użytkowników, zawierająca linki do:
  - Dashboardu
  - Tworzenia/Edycji wizytówki
  - Wylogowania
- Na stronach rejestracji i logowania nawigacja może być uproszczona, z linkiem do zmiany widoku (np. „Masz już konto? Zaloguj się”).
- Dla widoku publicznego wizytówki nawigacja jest ograniczona, skupiając się na prezentacji treści.
- Nawigacja będzie wspierana przez mechanizmy React Context, aby dynamicznie reagować na stan uwierzytelnienia użytkownika.

## 5. Kluczowe komponenty

- **Nagłówek i Pasek Nawigacji:** Standardowy komponent wyświetlający logo, przyciski linków oraz informacje o stanie użytkownika (np. avatar, przycisk wylogowania).
- **Formularze:** Komponenty do rejestracji, logowania oraz edycji/tworzenia wizytówki, zawierające pola tekstowe, przyciski oraz komunikaty walidacyjne.
- **Karta Wizytówki:** Komponent prezentujący wizytówkę w dashboardzie oraz widoku publicznym, integrujący dane o zainteresowaniach.
- **Lista Historii Edycji:** Komponent wyświetlający historię modyfikacji wizytówki, umożliwiający szybki podgląd zmian.
- **Powiadomienia i Komunikaty:** Komponenty do wyświetlania informacji o sukcesach, błędach oraz ważnych powiadomieniach, zapewniające jasną komunikację z użytkownikiem.
- **Mechanizmy zabezpieczeń:** Komponenty i usługi obsługujące autoryzację (JWT), zabezpieczające widoki dla zalogowanych użytkowników oraz zapewniające ochronę przed typowymi zagrożeniami.
