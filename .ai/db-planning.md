<conversation_summary>
<decisions>
1. Każdy użytkownik ma tylko jedną wizytówkę.
2. Tabela uzytkownikow bedzie obsługiwana przez Supabase
3. Tabela wizytówek będzie przechowywać dane jako JSON z sztywno określonymi polami: Movies, Series, Music, Books, z możliwością późniejszej zmiany schematu aplikacji.
4. Historia edycji będzie zapisywana w osobnej tabeli zawierającej datę edycji oraz identyfikator edytora.
5. Integralność danych zostanie zapewniona przez unikalność emaili w tabeli użytkowników oraz unikalność tokenu udostępnienia w tabeli wizytówek.
6. Relacje: jeden-do-jednego między użytkownikiem a wizytówką oraz jeden-do-wielu między wizytówką a historią edycji.
7. Indeksowanie będzie zastosowane wyłącznie na kluczach głównych oraz unikalnych pól.
8. Polityki RLS będą skonfigurowane tak, aby tylko właściciel wizytówki lub użytkownicy z odpowiednimi uprawnieniami mogli modyfikować dane, przy czym historia edycji będzie widoczna tylko dla właściciela wizytówki; publiczny dostęp do wizytówki będzie możliwy tylko przez unikalny token udostępnienia.
9. Obecnie nie planuje się wykorzystania wyzwalaczy ani partycjonowania.
</decisions>
<matched_recommendations>
1. Utworzenie tabeli users z kolumnami: id (UUID, klucz główny), email (unikalny), nazwa_uzytkownika, hash_hasla, data_rejestracji, status_konta.
2. Utworzenie tabeli cards z kolumnami: id (UUID, klucz główny), user_id (UUID, klucz obcy do users – relacja jeden-do-jednego), card_data (JSON zawierający pola: Movies, Series, Music, Books), sharing_token (unikalny), creation_date, modify_date.
3. Utworzenie tabeli card_edits z kolumnami: id (UUID, klucz główny), card_id (UUID, klucz obcy do cards – relacja jeden-do-wielu), modify_date, editor_id.
4. Zastosowanie ograniczeń integralności dla kluczy głównych oraz unikalnych pól (email i token_udostepnienia).
5. Indeksowanie wyłącznie głównych pól: klucze główne oraz unikalne kolumny, dodatkowo indeksy na card_id i editor_id w tabeli card_edits dla optymalizacji zapytań związanych z historią edycji.
6. Implementacja polityk RLS zapewniających modyfikację danych tylko przez właściciela lub uprawnione role oraz ograniczenie widoczności historii edycji tylko dla właściciela wizytówki.
</matched_recommendations>
<database_planning_summary>
Główne wymagania dotyczące schematu bazy danych obejmują trzy kluczowe encje: użytkowników (obsługiwana przez Supabase), wizytówki i historię edycji wizytówek. System ma wykorzystywać Supabase do obsługi autentykacji, co ogranicza potrzebę przechowywania dodatkowych danych autoryzacyjnych. Wizytówka każdego użytkownika jest przechowywana w tabeli cards jako rekord powiązany z użytkownikiem (relacja jeden-do-jednego), zawierający dane w formacie JSON z sztywno zdefiniowanymi polami: Movies, Series, Music, Books. Unikalny token udostępnienia umożliwia publiczny dostęp do wizytówki. Historia edycji, zarejestrowana w tabeli card_edits, zapisuje daty edycji oraz identyfikatory edytorów, tworząc relację jeden-do-wielu z wizytówkami. Integralność danych jest zapewniona przez unikalność krytycznych pól oraz odpowiednie klucze obce, a indeksowanie ogranicza się do kluczy głównych i unikalnych kolumn. Polityki RLS są kluczowym elementem bezpieczeństwa, umożliwiając modyfikację danych tylko przez właściciela i uprawnione role, a widoczność historii edycji ograniczona jest tylko do właściciela wizytówki.
</database_planning_summary>
</conversation_summary>
