import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useUser } from '@clerk/nextjs';
import { supabase, type Entry } from '@/lib/supabase';
import { BookBookmark } from '@phosphor-icons/react';
import AddToAlbumModal from './AddToAlbumModal';

export default function RecentEntries() {
  const { user } = useUser();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isAddToAlbumModalOpen, setIsAddToAlbumModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToAlbum = (entry: Entry) => {
    setSelectedEntry(entry);
    setIsAddToAlbumModalOpen(true);
  };

  return (
    <div>
      <h2 className="text-2xl font-['EB_Garamond'] text-[#2C1D0E] mb-6 relative inline-block">
        Recent Entries
        <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#2C1D0E]/0 via-[#2C1D0E]/20 to-[#2C1D0E]/0" />
      </h2>
      <div className="space-y-6">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bg-white/70 rounded-xl border border-[#2C1D0E]/10 overflow-hidden
                     hover:shadow-md transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <time className="text-[#2C1D0E]/60 font-['EB_Garamond'] italic">
                  {format(new Date(entry.created_at), 'MMMM d, yyyy')}
                </time>
                <div className="flex items-center gap-2">
                  <span 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.mood_color }}
                  />
                  <span className="text-sm text-[#2C1D0E]">{entry.mood}</span>
                </div>
              </div>
              <Link href={`/journal/entry/${entry.id}`}>
                <p className="text-[#2C1D0E] line-clamp-2 font-['EB_Garamond'] mb-4 hover:text-[#2C1D0E]/80 transition-colors">
                  {entry.summary || entry.content}
                </p>
              </Link>
              <div className="flex justify-end">
                <button
                  onClick={() => handleAddToAlbum(entry)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg
                           bg-[#2C1D0E]/5 text-[#2C1D0E] hover:bg-[#2C1D0E]/10
                           transition-colors text-sm"
                >
                  <BookBookmark size={16} weight="bold" />
                  Add to Album
                </button>
              </div>
            </div>
          </div>
        ))}

        {entries.length === 0 && !isLoading && (
          <div className="text-center py-8 text-[#2C1D0E]/60">
            No entries yet. Start writing your first entry!
          </div>
        )}
      </div>

      {/* Add to Album Modal */}
      {selectedEntry && (
        <AddToAlbumModal
          isOpen={isAddToAlbumModalOpen}
          onClose={() => {
            setIsAddToAlbumModalOpen(false);
            setSelectedEntry(null);
          }}
          entry={selectedEntry}
        />
      )}
    </div>
  );
} 