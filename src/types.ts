/*
 * DTO and Command Model definitions for the Cultura application.
 * These types are derived from the database models (src/db/database.types.ts) and
 * the API plan (.ai/api-plan.md).
 */

/**
 * Represents the cultural interests data for a card.
 */
export interface CardData {
  movies: string
  series: string
  music: string
  books: string
}

export interface GeneratedCardData {
  card_data: CardData
}

/**
 * DTO representing a complete card entity from the database.
 * Maps to the 'cards' table in the database.
 */
export interface CardDTO {
  id: string
  user_id: string
  card_data: CardData
  generated_card_data: CardData
  sharing_token: string
  created_at: string // ISO8601 timestamp
  modified_at: string // ISO8601 timestamp
}

/**
 * DTO for a card when accessed via a public shared link.
 * Sensitive data (e.g., user_id) is omitted.
 */
export type SharedCardDTO = Omit<CardDTO, "user_id">

/**
 * Command model for creating a new card.
 * This payload is used in the POST /api/cards endpoint.
 */
export interface CreateCardCommand {
  card_data: CardData
  generated_card_data?: CardData
}

/**
 * Command model for updating an existing card.
 * This payload is used in the PUT/PATCH /api/cards/{id} endpoint.
 * Although updates may be partial, the API plan expects a complete card_data object.
 */
export interface UpdateCardCommand {
  card_data: CardData
  generated_card_data?: CardData
}

/**
 * DTO representing a card edit history record.
 * Maps to the 'card_edits' table in the database.
 */
export interface CardEditDTO {
  id: string
  card_id: string
  editor_id: string
  created_at: string // ISO8601 timestamp
}
