# PostgreSQL Database Schema for Cultura

## 1. Tables and Columns

### users (This table is managed by Supabase Auth)
- **id**: UUID, PRIMARY KEY
- **email**: VARCHAR(255), UNIQUE, NOT NULL
- **username**: VARCHAR(50), NOT NULL
- **encrypted_password**: VARCHAR(255), NOT NULL
- **created_at**: TIMESTAMPTZ, DEFAULT NOW(), NOT NULL
- **status**: VARCHAR(20) NOT NULL  -- opcjonalny status konta

### cards
- **id**: UUID, PRIMARY KEY
- **user_id**: UUID, UNIQUE, NOT NULL, REFERENCES auth.users(id) ON DELETE CASCADE
- **card_data**: JSONB, NOT NULL  -- JSON obejmujący pola: Movies, Series, Music, Books
- **sharing_token**: VARCHAR(255), UNIQUE, NOT NULL
- **created_at**: TIMESTAMPTZ, DEFAULT NOW(), NOT NULL
- **modified_at**: TIMESTAMPTZ, DEFAULT NOW(), NOT NULL

### card_edits
- **id**: UUID, PRIMARY KEY
- **card_id**: UUID, NOT NULL, REFERENCES cards(id) ON DELETE CASCADE
- **created_at**: TIMESTAMPTZ, DEFAULT NOW(), NOT NULL
- **editor_id**: UUID, NOT NULL, REFERENCES auth.users(id)

## 2. Relationships

- **users -> cards**: Jeden-do-jednego (każdy użytkownik posiada jedną wizytówkę dzięki unikalnemu constraint na cards.user_id).
- **cards -> card_edits**: Jeden-do-wielu (każda wizytówka może mieć wiele wpisów w historii edycji).
- **card_edits.editor_id** odnosi się do **users.id**, co umożliwia rejestrowanie, który użytkownik dokonał edycji.

## 3. Indeksy

- Unikalny indeks na `users.email`.
- Unikalny indeks na `cards.user_id` (wymuszający relację jeden-do-jednego).
- Unikalny indeks na `cards.sharing_token`.
- Indeks na `card_edits.card_id` dla optymalizacji zapytań historii edycji.
- Indeks na `card_edits.editor_id` dla optymalizacji zapytań dotyczących edytorów.

## 4. Row Level Security (RLS) Policies

- **Tabela cards**: Polityki RLS powinny zapewniać, że tylko właściciel wizytówki (odpowiadający wartości `user_id`) lub uprawnione role mogą modyfikować dane w tabeli.
- **Tabela card_edits**: Polityki RLS powinny umożliwiać dostęp do wpisów historii edycji jedynie właścicielowi wizytówki (poprzez powiązanie z `cards.user_id`) lub uprawnionym edytorom.

## 5. Dodatkowe Uwagi

- Schemat jest zaprojektowany zgodnie z zasadami normalizacji (3NF), przy czym `card_data` jako JSONB umożliwia elastyczność w przyszłych modyfikacjach schematu danych.
- Integralność danych jest zapewniona przez klucze główne, unikalne ograniczenia oraz powiązania za pomocą kluczy obcych z akcjami ON DELETE CASCADE.
- Indeksy zostały dodane, aby zoptymalizować wydajność zapytań, szczególnie przy wyszukiwaniu po unikalnych polach i relacjach między tabelami. 