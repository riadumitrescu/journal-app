import React, { useMemo, useState } from 'react';
import { type Entry, type Album, supabase } from '@/lib/supabase';
import Book from './Book';
import AlbumBook from './AlbumBook';
import CreateAlbumModal from './CreateAlbumModal';
import { Plus } from '@phosphor-icons/react';

interface ShelfProps {
  entries: Entry[];
}

// Pre-compute month labels to avoid repeated calculations
const MONTH_LABELS = {
  0: 'Jan', 1: 'Feb', 2: 'Mar', 3: 'Apr', 4: 'May', 5: 'Jun',
  6: 'Jul', 7: 'Aug', 8: 'Sep', 9: 'Oct', 10: 'Nov', 11: 'Dec'
};

// Pre-define the type to avoid repeated type creation
type MonthlyData = {
  wordCount: number;
  color: string;
  label: string;
  colorCounts: Record<string, number>;
  entryCount: number;
};

export default function Shelf({ entries }: ShelfProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([]);

  const monthlyBooks = useMemo(() => {
    // Use Map for better performance with frequent lookups
    const monthlyData = new Map<string, MonthlyData>();

    // Process entries in chunks to avoid blocking the main thread
    const chunkSize = 100;
    for (let i = 0; i < entries.length; i += chunkSize) {
      const chunk = entries.slice(i, i + chunkSize);
      
      for (const entry of chunk) {
        const date = new Date(entry.created_at);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        
        let monthData = monthlyData.get(monthKey);
        if (!monthData) {
          monthData = {
            wordCount: 0,
            color: entry.mood_color || '#8B5E3C',
            label: MONTH_LABELS[date.getMonth() as keyof typeof MONTH_LABELS],
            colorCounts: {},
            entryCount: 0
          };
          monthlyData.set(monthKey, monthData);
        }
        
        // Fast word count using indexOf
        let wordCount = 0;
        let pos = 0;
        const content = entry.content.trim();
        while ((pos = content.indexOf(' ', pos)) !== -1) {
          wordCount++;
          pos++;
        }
        if (content.length > 0) wordCount++;
        
        monthData.wordCount += wordCount;
        monthData.entryCount++;
        
        if (entry.mood_color) {
          const count = (monthData.colorCounts[entry.mood_color] || 0) + 1;
          monthData.colorCounts[entry.mood_color] = count;
          
          if (count > (monthData.colorCounts[monthData.color] || 0)) {
            monthData.color = entry.mood_color;
          }
        }
      }
    }

    // Convert to array and sort
    return Array.from(monthlyData.entries())
      .map(([key, data]) => ({ key, ...data }))
      .sort((a, b) => b.key.localeCompare(a.key));
  }, [entries]);

  const handleAlbumCreated = () => {
    // Refresh albums list
    fetchAlbums();
  };

  const fetchAlbums = async () => {
    try {
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlbums(data || []);
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };

  React.useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <div className="relative">
      {/* New Album Button */}
      <div className="absolute -top-16 right-0">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg
                   border border-[#2C1D0E]/20 text-[#2C1D0E]
                   hover:bg-[#2C1D0E]/5 transition-colors
                   font-['EB_Garamond']"
        >
          <Plus size={20} weight="bold" />
          New Album
        </button>
      </div>
      
      {/* Shelf Surface */}
      <div className="relative">
        {/* Albums */}
        <div className="flex gap-4 items-end mb-8 px-4">
          {albums.map((album) => (
            <AlbumBook key={album.id} album={album} />
          ))}
        </div>

        {/* Monthly Books */}
        <div className="flex gap-4 items-end mb-2 px-4">
          {monthlyBooks.map((book) => (
            <Book
              key={book.key}
              wordCount={book.wordCount}
              color={book.color}
              label={book.label}
              entryCount={book.entryCount}
              monthKey={book.key}
            />
          ))}
        </div>
        
        {/* Shelf Board */}
        <div 
          className="h-2 bg-[#5A3F26] rounded-sm shadow-md"
          style={{
            backgroundImage: `
              linear-gradient(
                90deg,
                rgba(255,255,255,0.1) 0%,
                rgba(255,255,255,0.05) 25%,
                rgba(0,0,0,0.2) 100%
              )
            `
          }}
        />
      </div>

      {/* Create Album Modal */}
      <CreateAlbumModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAlbumCreated={handleAlbumCreated}
      />
    </div>
  );
} 