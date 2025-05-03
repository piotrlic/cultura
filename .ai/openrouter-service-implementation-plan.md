# Przewodnik implementacji usługi OpenRouter

## 1. Opis usługi

OpenRouter to moduł integracyjny, którego zadaniem jest komunikacja z interfejsem API OpenRouter w celu rozszerzenia funkcjonalności czatów opartych na LLM. Usługa umożliwia:

1. Łączenie komunikatów systemowych i użytkownika, co pozwala na precyzyjne określenie kontekstu rozmowy.
2. Wysyłanie zapytań do API z dobrze zdefiniowanym formatem odpowiedzi, wykorzystując schemat JSON (response_format) dla strukturalnych odpowiedzi.
3. Konfigurację modelu, w tym wybór nazwy (np. "gpt-3.5-turbo") oraz parametrów (np. { temperature: 0.7, max_tokens: 150 }).

## 2. Opis konstruktora

Konstruktor usługi powinien inicjalizować główne parametry oraz dane autoryzacyjne. Powinien przyjmować następujące parametry:

1. `systemMessage` – domyślny komunikat systemowy (np. "You are a helpful assistant.").
2. `userMessage` – początkowy komunikat użytkownika.
3. `responseFormat` – obiekt konfigurujący format odpowiedzi, np.
   ```json
   {
     "type": "json_schema",
     "json_schema": { "name": "ChatResponse", "strict": true, "schema": { "answer": "string", "context": "string" } }
   }
   ```
4. `modelName` – nazwa modelu (np. "gpt-3.5-turbo").
5. `modelParams` – obiekt parametrów modelu (np. { temperature: 0.7, max_tokens: 150 }).
6. `apiKey` oraz `endpoint` – dane uwierzytelniające i adres API.

## 3. Publiczne metody i pola

Publiczne interfejsy klasy mogą obejmować:

1. **sendMessage(input: string): Promise<Response>**
   - Wysyła komunikat użytkownika do API i zwraca odpowiedź modelu.
2. **configure(options: ConfigOptions): void**
   - Aktualizuje bieżącą konfigurację serwisu.
3. Publiczne pole, np. `config`, przechowujące aktualne ustawienia API i modelu.

## 4. Prywatne metody i pola

Wewnętrzna logika serwisu powinna być inkapsulowana przy użyciu prywatnych metod i właściwości:

1. **\_prepareRequestBody(input: string): RequestBody**
   - Łączy `systemMessage`, `userMessage` oraz inne dane w jeden obiekt żądania.
2. **\_handleResponse(response: any): ParsedResponse**
   - Parsuje i waliduje odpowiedź API zgodnie z zadanym `responseFormat`.
3. **\_logError(error: Error): void**
   - Rejestruje błędy oraz ułatwia diagnozę problemów.
4. Prywatne pola, takie jak: `_apiKey`, `_endpoint`, które przechowują wrażliwe dane dostępowe.

## 5. Obsługa błędów

Potencjalne scenariusze błędów oraz sposoby ich rozwiązania:

1. **Błąd autentykacji:**
   - Wyzwanie: Niepoprawny lub wygasły `apiKey`.
   - Rozwiązanie: Mechanizm ponownych prób (retry) po odświeżeniu klucza oraz wyraźne logowanie błędu.
2. **Błąd komunikacji (timeout, sieć):**
   - Wyzwanie: Utrata połączenia lub długi czas oczekiwania na odpowiedź.
   - Rozwiązanie: Ustalenie limitu czasu żądania oraz stosowanie mechanizmów retry.
3. **Nieprawidłowy format lub błąd parsowania odpowiedzi:**
   - Wyzwanie: Otrzymanie odpowiedzi niezgodnej ze schematem `responseFormat`.
   - Rozwiązanie: Walidacja odpowiedzi i użycie domyślnych wartości przy błędach parsowania.
4. **Błędy danych wejściowych:**
   - Wyzwanie: Przekazanie niepoprawnych danych przez użytkownika.
   - Rozwiązanie: Wstępna walidacja danych przed wysłaniem żądania i informacja o błędzie dla użytkownika.

## 6. Kwestie bezpieczeństwa

Aby zapewnić bezpieczeństwo usługi, należy:

1. Przechowywać `apiKey` i inne dane uwierzytelniające jako zmienne środowiskowe.
2. Ograniczyć logowanie danych wrażliwych.
3. Monitorować dostęp oraz logować nieautoryzowane próby.

## 7. Plan wdrożenia krok po kroku

1. **Przygotowanie środowiska:**

   - Skonfigurować zmienne środowiskowe (`API_KEY`, `API_ENDPOINT`).
   - Zainstalować wymagane biblioteki do obsługi żądań HTTP (np. axios lub fetch).

2. **Implementacja modułu usługi:**

   - Utworzyć nowy moduł (np. w katalogu `/src/lib`) zawierający klasę `OpenRouterService`.
   - Zaimplementować konstruktor z wyżej wymienionymi parametrami.
   - Utworzyć publiczne metody: `sendMessage` oraz `configure`.

3. **Implementacja metod prywatnych:**

   - Napisać metodę `_prepareRequestBody`, integrującą wszystkie komunikaty i ustawienia.
   - Utworzyć metodę `_handleResponse` do walidacji odpowiedzi zgodnie z `responseFormat`.
   - Zaimplementować `_logError` do rejestrowania błędów.

4. **Integracja z OpenRouter API:**

   - Skonfigurować żądania HTTP (uwierzytelnianie, nagłówki, HTTPS).
   - Testować komunikację z API, używając przykładowych danych:
     - Komunikat systemowy: "You are a helpful assistant."
     - Komunikat użytkownika: "Jaki jest stan mojego profilu?"
     - `responseFormat`: { type: 'json_schema', json_schema: { name: 'ChatResponse', strict: true, schema: { answer: 'string', context: 'string' } } }
     - Nazwa modelu: "gpt-3.5-turbo"
     - Parametry modelu: { temperature: 0.7, max_tokens: 150 }
