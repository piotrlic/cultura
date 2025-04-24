# REST API Plan

## 1. Resources

- **Users** (Managed by Supabase Auth):
  - Fields: `id`, `email`, `username`, `encrypted_password`, `created_at`, `status`
  - Note: User management (registration/login) is handled by Supabase Auth.

- **Cards**:
  - Fields: `id`, `user_id`, `card_data` (includes movies, series, music, books), `sharing_token`, `created_at`, `modified_at`
  - Represents a cultural profile card for each user.

- **Card Edits**:
  - Fields: `id`, `card_id`, `editor_id`, `created_at`
  - Represents the history log of modifications made to a card.

## 2. Endpoints

### Authentication and User Management

- **Authentication** is managed by Supabase Auth. The API will rely on JWT tokens for authentication in protected endpoints. Endpoints for registration and login are provided externally by Supabase.

### Cards

1. **Create Card**
   - **Method:** POST
   - **URL:** `/api/cards`
   - **Description:** Creates a new cultural profile card using a default template.
   - **Request Payload:**
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
   - **Response Payload:**
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
   - **Success:** 201 Created
   - **Errors:** 400 Bad Request, 401 Unauthorized, 500 Internal Server Error

2. **Retrieve Card (Authenticated)**
   - **Method:** GET
   - **URL:** `/api/cards/{id}`
   - **Description:** Retrieves a specific card by its ID. Only the owner can access this endpoint.
   - **Response Payload:** Same as the card response above.
   - **Success:** 200 OK
   - **Errors:** 401 Unauthorized, 404 Not Found

3. **Retrieve Shared Card (Public)**
   - **Method:** GET
   - **URL:** `/api/cards/shared/{sharing_token}`
   - **Description:** Retrieves a card using its unique sharing token without requiring authentication.
   - **Response Payload:** Similar to the card response, with sensitive user data omitted.
   - **Success:** 200 OK
   - **Errors:** 404 Not Found

4. **Update Card (Authenticated)**
   - **Method:** PUT or PATCH
   - **URL:** `/api/cards/{id}`
   - **Description:** Updates the content of an existing card. Only the card owner can update it.
   - **Request Payload:**
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
   - **Response Payload:** Updated card JSON.
   - **Success:** 200 OK
   - **Errors:** 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error

5. **Delete Card (Authenticated)**
   - **Method:** DELETE
   - **URL:** `/api/cards/{id}`
   - **Description:** Deletes a card. Only accessible by the owner.
   - **Response Payload:**
     ```json
     { "message": "Card deleted successfully" }
     ```
   - **Success:** 200 OK or 204 No Content
   - **Errors:** 401 Unauthorized, 404 Not Found


### Additional Endpoints and Features

- **Rate Limiting:**
  - Apply middleware to sensitive endpoints (e.g., login and card update) to prevent abuse.

- **Error Handling:**
  - Implement consistent error messages and HTTP status codes across all endpoints.

## 3. Authentication and Authorization

- **Authentication:**
  - JWT tokens issued by Supabase Auth are required for accessing protected endpoints.
  - Clients must include the header: `Authorization: Bearer <token>`.

- **Authorization:**
  - Only a card owner can update, delete, or view sensitive data (e.g., edit history) for that card.
  - Card edits are permitted only for the card owner or authorized collaborators.
  - Database-level Row Level Security (RLS) policies provide an additional layer of protection.

## 4. Validation and Business Logic

- **Validations:**
  - Ensure required fields (e.g., for `card_data`: movies, series, music, books) are present and correctly formatted in create and update operations.
  - Enforce uniqueness and integrity of `sharing_token` values.
  - Validate data types and required constraints per the database schema.

- **Business Logic:**
  - Automatically generate a unique `sharing_token` during card creation.
  - Record each card update as a new entry in the Card Edits resource.
  - The public endpoint for shared cards omits sensitive user details.
  - Support pagination, filtering, and sorting on list endpoints.
  - Implement global error handling and logging for audit trails. 