# Dokument wymagań produktu (PRD) - Cultura

## 1. Przegląd produktu

Projekt Cultura (MVP) to aplikacja umożliwiająca tworzenie, edycję i udostępnianie wizytówek przedstawiających zainteresowania kulturalne użytkowników. Aplikacja korzysta z jednego, predefiniowanego szablonu z określonymi motywami i kolorami, co ułatwia szybkie tworzenie wizytówki bez potrzeby dodatkowej personalizacji. Użytkownicy mogą się rejestrować, logować i modyfikować swoje wizytówki, a następnie udostępniać je poprzez unikalny link. Wersja MVP ma na celu sprawdzenie, czy użytkownicy regularnie aktualizują swoje wizytówki oraz czy dzielą się nimi na zewnętrznych platformach.

## 2. Problem użytkownika

Użytkownicy często dzielą się swoimi zainteresowaniami kulturalnymi rozproszonymi na różnych platformach, co utrudnia stworzenie spójnego wizerunku. Brakuje dedykowanej przestrzeni, gdzie mogliby w łatwy sposób podsumować swoje ulubione filmy, książki, sztuki teatralne czy cytaty. Problemy obejmują:

- Niezbędność prowadzenia kilku profili w celu zaprezentowania różnych aspektów życia kulturalnego.
- Trudność w aktualizacji oraz zarządzaniu informacjami w rozproszonej formie.
- Brak spójności wizualnej, która ułatwia identyfikację twórczości oraz zainteresowań.

## 3. Wymagania funkcjonalne

Projekt Cultura musi spełniać następujące wymagania funkcjonalne:

- Rejestracja i logowanie:
  - Umożliwienie tworzenia konta użytkownika przy użyciu standardowego mechanizmu loginu i hasła.
  - Zapewnienie bezpiecznego procesu autoryzacji.
- Tworzenie wizytówki:
  - Użytkownik może utworzyć wizytówkę wykorzystując jeden, predefiniowany szablon.
  - Możliwość wprowadzania podstawowego tekstu za pomocą prostego edytora treści.
- Edycja wizytówki:
  - Umożliwienie użytkownikowi aktualizacji zawartości wizytówki.
  - System rejestracji historii zmian (bez możliwości przywracania starszych wersji).
- Udostępnianie wizytówki:
  - Automatyczne generowanie unikalnego linku do wizytówki.
  - Możliwość wyświetlenia wizytówki przez osoby posiadające link.
- Monitorowanie aktywności:
  - Rejestrowanie liczby modyfikacji wizytówki.
  - Rejestracja liczby wejść na wizytówkę jako wskaźnik jej udostępniania.

## 4. Granice produktu

Projekt Cultura (MVP) nie obejmuje następujących funkcjonalności:

- Customizacja wizytówki – aplikacja korzysta z jednego, ustalonego szablonu bez możliwości wyboru alternatywnych layoutów.
- Ładowanie multimediów – użytkownicy mogą jedynie wprowadzać tekst, bez dodawania zdjęć czy filmów.
- Integracji z zewnętrznymi serwisami – brak bezpośrednich powiązań z serwisami takimi jak IMDB, Filmweb, Spotify czy Apple Music.
- Możliwości przywracania poprzednich wersji wizytówki – system jedynie rejestruje historię modyfikacji.

## 5. Historyjki użytkowników

US-001
Tytuł: Rejestracja i logowanie użytkownika
Opis: Jako nowy użytkownik chcę utworzyć konto i zalogować się do systemu, aby mieć możliwość zarządzania moją wizytówką.
Kryteria akceptacji:

- Użytkownik może utworzyć konto, podając wymagane dane (email, hasło, nazwę użytkownika).
- Proces logowania weryfikuje poprawność danych.
- System zapewnia bezpieczny dostęp do konta.

US-002
Tytuł: Utworzenie wizytówki Cultura
Opis: Jako zalogowany użytkownik chcę stworzyć wizytówkę prezentującą moje zainteresowania kulturalne, aby przedstawić je innym.
Kryteria akceptacji:

- Użytkownik może wybrać predefiniowany szablon wizytówki.
- Użytkownik może wprowadzić podstawowy tekst opisujący jego zainteresowania, podzielony na kategorie filmy, seriale, muzyka, książki
- Wizytówka zostaje zapisana i dostępna pod unikalnym linkiem powiązanym z kontem

US-003
Tytuł: Edycja wizytówki Cultura
Opis: Jako użytkownik chcę móc modyfikować już utworzoną wizytówkę, aby na bieżąco aktualizować informacje o moich zainteresowaniach.
Kryteria akceptacji:

- Użytkownik ma dostęp do prostego edytora treści.
- Wszystkie wprowadzone zmiany są zapisywane i widoczne po odświeżeniu strony.
- System rejestruje historię modyfikacji wizytówki.

US-004
Tytuł: Udostępnianie wizytówki przez unikalny link
Opis: Jako użytkownik chcę udostępnić moją wizytówkę poprzez unikalny link, aby inni mogli łatwo ją przeglądać.
Kryteria akceptacji:

- System generuje unikalny link dla każdej wizytówki.
- Po wejściu pod link wizytówka jest poprawnie wyświetlana.
- Link umożliwia przeglądanie wizytówki bez konieczności logowania.

US-005
Tytuł: Bezpieczny dostęp i autoryzacja użytkownika
Opis: Jako użytkownik chcę mieć pewność, że dostęp do mojego konta jest chroniony i tylko autoryzowane osoby mogą wprowadzać zmiany w wizytówce.
Kryteria akceptacji:

- Dostęp do edycji wizytówki wymaga logowania.
- Dane użytkownika są przechowywane w sposób bezpieczny.
- System autoryzacji skutecznie chroni dostęp do konta.

US-006
Tytuł: Widok wizytówki Cultura
Opis: Jako użytkownik chcę móc obejrzeć już utworzoną wizytówkę oraz przejść do edycji, aby na bieżąco aktualizować informacje o moich zainteresowaniach.
Kryteria akceptacji:

- Użytkownik ma dostęp widoku wygenerowanej wizytówki
- Użytkownik może przejść do ekranów edycji albo usunąć wizytówkę by utworzyć nową

## 6. Metryki sukcesu

Osiągnięcie sukcesu produktu będzie mierzone poprzez następujące wskaźniki:

- 90% użytkowników dokonuje aktualizacji wizytówki przynajmniej raz w miesiącu.
- 50% użytkowników udostępnia swój profil na zewnętrznych serwisach społecznościowych.
- Liczba modyfikacji wizytówek oraz liczba wejść na widoczne wizytówki.
