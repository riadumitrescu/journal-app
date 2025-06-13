import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tlisradyhpaqlzxbblhm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsaXNyYWR5aHBhcWx6eGJibGhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MDE1MTcsImV4cCI6MjA2NDI3NzUxN30._zKeuPATi2W-AlEpi8VP_1ExgeSf2YSDwa0bxje5yH4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface Entry {
  id: string;
  created_at: string;
  content: string;
  mood: string;
  mood_color: string;
  summary?: string;
  tags?: string[];
  ai_insight?: string | null;
  user_id: string;
} 