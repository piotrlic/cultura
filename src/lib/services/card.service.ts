import { nanoid } from "nanoid";
import type { SupabaseClient } from "../../db/supabase.client";
import type { CardDTO, CreateCardCommand } from "../../types";
import { CardCreationError, DatabaseError, CardError } from "../errors/card.errors";

export class CardService {
  constructor(private readonly supabase: SupabaseClient) {}

  async createCard(userId: string, command: CreateCardCommand): Promise<CardDTO> {
    try {
      const now = new Date().toISOString();
      const sharingToken = nanoid(12); // Generate a 12-character unique token

      const { data, error } = await this.supabase
        .from("cards")
        .insert({
          user_id: userId,
          card_data: command.card_data,
          sharing_token: sharingToken,
          created_at: now,
          modified_at: now,
        })
        .select()
        .single();

      if (error) {
        throw new DatabaseError("Failed to create card in database", error);
      }

      if (!data) {
        throw new CardCreationError("Card was created but no data was returned");
      }

      return data as CardDTO;
    } catch (error) {
      if (error instanceof CardError) {
        throw error;
      }
      throw new CardCreationError("Failed to create card", error);
    }
  }

  async getCardByUserId(userId: string): Promise<CardDTO | null> {
    const { data, error } = await this.supabase.from("cards").select("*").eq("user_id", userId).single();
    if (error) {
      throw new DatabaseError("Failed to get card from database", error);
    }
    return data;
  }
}
