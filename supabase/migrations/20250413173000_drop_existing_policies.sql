-- Migration: Drop Existing Policies
-- Description: Removes all existing RLS policies from cards and card_edits tables
-- Author: Cultura Team
-- Date: 2024-04-13

-- Drop all policies for cards table
drop policy if exists "Users can view own cards" on public.cards;
drop policy if exists "Anyone can view shared cards" on public.cards;
drop policy if exists "Users can insert own cards" on public.cards;
drop policy if exists "Users can update own cards" on public.cards;
drop policy if exists "Users can delete own cards" on public.cards;

-- Drop all policies for card_edits table
drop policy if exists "Users can view edit history of own cards" on public.card_edits;
drop policy if exists "Users can insert edit records" on public.card_edits; 