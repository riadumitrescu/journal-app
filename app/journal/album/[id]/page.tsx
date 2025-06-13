'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase, type Entry, type Album } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react';

interface AlbumPageProps {
  params: {
    id: string;
  };
}

export default function AlbumPage({ params }: AlbumPageProps) {
  const { user } = useUser();
  const [album, setAlbum] = useState<Album | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAlbumAndEntries();
    }
  }, [user, params.id]);

  const fetchAlbumAndEntries = async () => {
    try {
      // Fetch album details
      const { data: albumData, error: albumError } = await supabase
        .from('albums')
        .select('*')
        .eq('id', params.id)
        .single();

      if (albumError) throw albumError;
      setAlbum(albumData);

      // Fetch entries in this album
      const { data: entriesData, error: entriesError } = await supabase
        .from('album_entries')
        .select(`
          entry_id,
          entries:entries (
            id,
            user_id,
            content,
            mood,
            mood_color,
            created_at,
            summary
          )
        `)
        .eq('album_id', params.id)
        .order('created_at', { ascending: false });

      if (entriesError) throw entriesError;
      setEntries(entriesData.map(e => e.entries as unknown as Entry));
    } catch (error) {
      console.error('Error fetching album data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A1107] pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-[#F5F0E5]">Loading album...</div>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="min-h-screen bg-[#1A1107] pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-[#F5F0E5]">Album not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1107] pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/journal"
            className="inline-flex items-center gap-2 text-[#F5F0E5] hover:text-[#F5F0E5]/80 transition-colors mb-6"
          >
            <ArrowLeft size={20} weight="bold" />
            Back to Journal
          </Link>
          <h1 
            className="text-4xl font-['EB_Garamond'] text-[#F5F0E5] mb-4"
            style={{ color: album.color }}
          >
            {album.title}
          </h1>
          {album.description && (
            <p className="text-[#F5F0E5]/80 font-['EB_Garamond'] text-lg">
              {album.description}
            </p>
          )}
        </div>

        {/* Entries */}
        <div className="space-y-8">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-[#F5F0E5] rounded-2xl p-8 shadow-xl relative overflow-hidden
                       border border-[#2C1D0E]/10 backdrop-blur-sm"
              style={{
                backgroundImage: "url('/assets/paper-texture.png')",
                backgroundSize: "cover",
                backgroundRepeat: "repeat",
                boxShadow: `
                  0 20px 25px -5px rgba(44, 29, 14, 0.2),
                  0 8px 10px -6px rgba(44, 29, 14, 0.1),
                  inset 0 0 40px rgba(44, 29, 14, 0.1)
                `,
              }}
            >
              {/* Date */}
              <div className="text-[#2C1D0E]/60 font-['EB_Garamond'] mb-4">
                {new Date(entry.created_at).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>

              {/* Mood */}
              <div className="flex items-center gap-2 mb-6">
                <div
                  className="w-4 h-4 rounded-sm"
                  style={{ backgroundColor: entry.mood_color }}
                />
                <span className="font-['EB_Garamond'] text-[#2C1D0E]">
                  {entry.mood}
                </span>
              </div>

              {/* Content */}
              <div className="prose prose-lg max-w-none font-['EB_Garamond'] text-[#2C1D0E]">
                {entry.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}

          {entries.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#F5F0E5]/80 font-['EB_Garamond'] text-lg">
                No entries in this album yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 