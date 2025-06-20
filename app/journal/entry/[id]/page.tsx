'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { useUser } from '@clerk/nextjs';
import { supabase, type Entry } from '@/lib/supabase';
import { ArrowLeft, BookBookmark } from '@phosphor-icons/react';
import AddToAlbumModal from '@/app/components/AddToAlbumModal';

export default function EntryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useUser();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isAddToAlbumModalOpen, setIsAddToAlbumModalOpen] = useState(false);

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
        {/* Navigation and Actions */}
        <div className="flex justify-between items-center mb-6">
          <Link
            href="/journal"
            className="inline-flex items-center text-cream-50 hover:text-cream-100 transition-colors"
          >
            <ArrowLeft size={20} weight="bold" className="mr-2" />
            Back to Journal
          </Link>

          <button
            onClick={() => setIsAddToAlbumModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                     bg-[#F5F0E5] text-[#2C1D0E] hover:bg-[#E6D5C1]
                     transition-all duration-300 shadow-lg hover:shadow-xl
                     border border-[#2C1D0E]/10"
          >
            <BookBookmark size={20} weight="bold" />
            Add to Album
          </button>
        </div>

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

      {/* Add to Album Modal */}
      {entry && (
        <AddToAlbumModal
          isOpen={isAddToAlbumModalOpen}
          onClose={() => setIsAddToAlbumModalOpen(false)}
          entry={entry}
        />
      )}
    </div>
  );
} 