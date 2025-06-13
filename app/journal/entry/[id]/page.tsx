'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
  tags?: string[];
  ai_insight?: string | null;
}

export default function EntryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useUser();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    async function fetchEntry() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('entries')
          .select('*')
          .eq('id', params.id)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Entry not found');
        
        setEntry(data);
      } catch (err) {
        console.error('Error fetching entry:', err);
        setError('Could not load the journal entry. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchEntry();
  }, [params.id, user, router]);

  // Don't render anything until after mounting to prevent hydration issues
  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#2C1D0E] pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-[#F5F0E5] rounded-2xl p-8 shadow-xl">
            <p className="text-leather-600 text-center">Loading your journal entry...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="min-h-screen bg-[#2C1D0E] pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-[#F5F0E5] rounded-2xl p-8 shadow-xl text-center">
            <p className="text-red-600 mb-4">{error || 'Entry not found'}</p>
            <Link 
              href="/journal"
              className="text-forest-600 hover:text-forest-700 underline"
            >
              Return to Journal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Format the date in a consistent way
  const formattedDate = format(new Date(entry.created_at), 'EEEE, MMMM d, yyyy');

  return (
    <div className="min-h-screen bg-[#2C1D0E] pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/journal"
          className="inline-flex items-center text-cream-50 mb-6 hover:text-cream-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Journal
        </Link>

        {/* Main Content */}
        <div 
          className="bg-[#F5F0E5] rounded-2xl p-12 shadow-xl relative overflow-hidden"
          style={{
            backgroundImage: "url('/assets/paper-texture.png')",
            backgroundSize: "cover",
            backgroundRepeat: "repeat",
          }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 -mr-16 -mt-16 opacity-10">
            <Image
              src="/assets/lamp.png"
              alt="Decorative lamp"
              width={256}
              height={256}
              className="object-contain"
            />
          </div>
          <div className="absolute bottom-0 left-0 w-48 h-48 -ml-8 -mb-8 opacity-10">
            <Image
              src="/assets/plant.png"
              alt="Decorative plant"
              width={192}
              height={192}
              className="object-contain"
            />
          </div>

          {/* Content */}
          <div className="relative max-w-2xl mx-auto">
            {/* Date and Mood */}
            <div className="text-center mb-12">
              <time className="block text-2xl font-['Crimson_Text'] text-leather-600 italic mb-4">
                {formattedDate}
              </time>
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ backgroundColor: `${entry.mood_color}30` }}
              >
                <span 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.mood_color }}
                />
                <span className="text-leather-700">{entry.mood}</span>
              </div>
            </div>

            {/* Main Content */}
            <div className="mb-12">
              <div className="prose prose-leather max-w-none">
                <div className="font-['Kalam'] text-xl leading-relaxed whitespace-pre-wrap">
                  {entry.content}
                </div>
              </div>
            </div>

            {/* Tags */}
            {entry.tags && entry.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-leather-600 mb-3 font-['Crimson_Text']">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-forest-50 text-forest-700 text-sm border border-forest-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* AI Insight */}
            {entry.ai_insight && (
              <div className="mt-12 p-6 rounded-xl bg-forest-50/50 border border-forest-100">
                <h3 className="text-forest-700 mb-3 font-['Crimson_Text']">AI Insight</h3>
                <p className="text-forest-600 font-['Crimson_Text'] italic">
                  {entry.ai_insight}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 