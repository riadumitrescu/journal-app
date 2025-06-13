import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Entry = {
  id: string;
  user_id: string;
  content: string;
  mood: string;
  mood_color: string;
  created_at: string;
  summary?: string;
};

export type Album = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  color: string;
  created_at: string;
  updated_at: string;
}; 