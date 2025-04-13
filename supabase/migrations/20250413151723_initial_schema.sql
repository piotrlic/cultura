-- Migration: Initial Schema Creation
-- Description: Creates the initial database schema for Cultura application
-- Tables: cards, card_edits
-- Author: Cultura Team
-- Date: 2024-04-13

-- Enable necessary extensions
-- Note: This might show a notice if the extension already exists, which is fine
create extension if not exists "uuid-ossp";

-- Create function to update modified_at timestamp (needs to exist before table creation)
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.modified_at = now();
    return new;
end;
$$ language plpgsql security definer;

-- Create cards table
create table public.cards (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid unique not null references auth.users(id) on delete cascade,
    card_data jsonb not null,
    sharing_token varchar(255) unique not null,
    created_at timestamptz not null default now(),
    modified_at timestamptz not null default now()
);

-- Create card_edits table for tracking edit history
create table public.card_edits (
    id uuid primary key default uuid_generate_v4(),
    card_id uuid not null references public.cards(id) on delete cascade,
    created_at timestamptz not null default now(),
    editor_id uuid not null references auth.users(id)
);

-- Create indexes for performance optimization
create index idx_card_edits_card_id on public.card_edits(card_id);
create index idx_card_edits_editor_id on public.card_edits(editor_id);

-- Create trigger to automatically update modified_at
create trigger set_modified_at
    before update on public.cards
    for each row
    execute function public.handle_updated_at();

-- Enable Row Level Security
alter table public.cards enable row level security;
alter table public.card_edits enable row level security;

-- Grant appropriate permissions (before creating policies)
grant usage on schema public to anon, authenticated;
grant all on public.cards to anon, authenticated;
grant all on public.card_edits to anon, authenticated;

-- RLS Policies for cards table

-- Allow authenticated users to view their own cards
create policy "Users can view own cards"
    on public.cards
    for select
    to authenticated
    using (auth.uid() = user_id);

-- Allow anonymous users to view cards via sharing token
create policy "Anyone can view shared cards"
    on public.cards
    for select
    to anon
    using (true);

-- Allow authenticated users to insert their own cards
create policy "Users can insert own cards"
    on public.cards
    for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Allow authenticated users to update their own cards
create policy "Users can update own cards"
    on public.cards
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Allow authenticated users to delete their own cards
create policy "Users can delete own cards"
    on public.cards
    for delete
    to authenticated
    using (auth.uid() = user_id);

-- RLS Policies for card_edits table

-- Allow authenticated users to view edit history of their cards
create policy "Users can view edit history of own cards"
    on public.card_edits
    for select
    to authenticated
    using (exists (
        select 1 from public.cards
        where cards.id = card_edits.card_id
        and cards.user_id = auth.uid()
    ));

-- Allow authenticated users to insert edit records for their cards
create policy "Users can insert edit records"
    on public.card_edits
    for insert
    to authenticated
    with check (
        auth.uid() = editor_id
        and exists (
            select 1 from public.cards
            where cards.id = card_edits.card_id
            and cards.user_id = auth.uid()
        )
    ); 