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
  summary?: string;
  tags?: string[];
  ai_insight?: string | null;
  created_at: string;
  updated_at?: string;
  title?: string;
  album_id?: string | null;
}; 