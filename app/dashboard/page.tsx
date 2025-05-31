'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://tlisradyhpaqlzxbblhm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsaXNyYWR5aHBhcWx6eGJibGhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MDE1MTcsImV4cCI6MjA2NDI3NzUxN30._zKeuPATi2W-AlEpi8VP_1ExgeSf2YSDwa0bxje5yH4'
);

type Entry = {
  id: number;
  created_at: string;
  content: string;
  mood: string;
  tags: string[];
};

export default function DashboardPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }
      fetchEntries(user.id);
    };

    checkUser();
  }, [router]);

  const fetchEntries = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (err) {
      setError('Failed to fetch entries');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-sage-50 to-cream-100 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-serif text-forest-600">
            Your Journal
          </h1>
          <Link
            href="/entry"
            className="px-6 py-2.5 bg-forest-500 text-cream-50 rounded-xl
                     font-medium shadow-soft
                     transition-all duration-300 hover:bg-forest-600
                     focus:outline-none focus:ring-2 focus:ring-forest-400 focus:ring-opacity-50"
          >
            New Entry
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-sage-600">
            Loading your entries...
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            {error}
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-sage-600">
              Your journal is empty. Start writing your first entry!
            </p>
            <Link
              href="/entry"
              className="inline-block px-6 py-2.5 bg-forest-500 text-cream-50 rounded-xl
                       font-medium shadow-soft
                       transition-all duration-300 hover:bg-forest-600
                       focus:outline-none focus:ring-2 focus:ring-forest-400 focus:ring-opacity-50"
            >
              Begin Writing
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white/80 rounded-xl p-6 shadow-soft space-y-4
                         hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-sage-600 text-sm">
                      {formatDate(entry.created_at)}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-forest-100 text-forest-600 text-sm">
                        {entry.mood}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-brown-500 line-clamp-3">
                  {entry.content}
                </p>

                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded-full bg-sage-100 text-sage-600 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 