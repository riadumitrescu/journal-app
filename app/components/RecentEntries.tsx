import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useUser } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tlisradyhpaqlzxbblhm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsaXNyYWR5aHBhcWx6eGJibGhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MDE1MTcsImV4cCI6MjA2NDI3NzUxN30._zKeuPATi2W-AlEpi8VP_1ExgeSf2YSDwa0bxje5yH4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface Entry {
  id: string;
  created_at: string;
  content: string;
  mood: string;
  mood_color: string;
  summary?: string;
}

export default function RecentEntries() {
  const { user } = useUser();
  const [entries, setEntries] = React.useState<Entry[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchRecentEntries() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('entries')
          .select('id, created_at, content, mood, mood_color, summary')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        setEntries(data || []);
      } catch (error) {
        console.error('Error fetching recent entries:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecentEntries();
  }, [user]);

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-['Playfair_Display'] text-forest-700 mb-6">Recent Entries</h2>
        <div className="text-leather-600">Loading recent entries...</div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-['Playfair_Display'] text-forest-700 mb-6">Recent Entries</h2>
        <div className="text-leather-600">No entries yet. Start writing your journey!</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-['Playfair_Display'] text-forest-700 mb-6">Recent Entries</h2>
      <div className="space-y-6">
        {entries.map((entry) => (
          <Link
            key={entry.id}
            href={`/journal/entry/${entry.id}`}
            className="block p-6 rounded-xl bg-white/70 border border-leather-200 
                     hover:shadow-md transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <time className="text-leather-600 font-['Crimson_Text'] italic">
                {format(new Date(entry.created_at), 'MMMM d, yyyy')}
              </time>
              <div className="flex items-center gap-2">
                <span 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.mood_color }}
                />
                <span className="text-sm text-leather-700">{entry.mood}</span>
              </div>
            </div>
            <p className="text-leather-800 line-clamp-2 font-['Kalam']">
              {entry.summary || entry.content}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
} 