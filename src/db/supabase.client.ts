import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Re-export the SupabaseClient type with our database type
export type SupabaseClient = ReturnType<typeof createClient<Database>>;

// Create and export the Supabase client instance
const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey); 