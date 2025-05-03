-- Migration: Add 'generated_card_data' column to 'cards' table
-- Description: Adds JSONB column for extended card information
-- Date: 2025-05-03

ALTER TABLE public.cards
ADD COLUMN IF NOT EXISTS generated_card_data JSONB;

COMMENT ON COLUMN public.cards.generated_card_data IS 'JSON wygenerowany na podstawie card_data zawierający rozszerzone informacje'; 