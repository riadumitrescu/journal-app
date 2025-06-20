import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useUser } from '@clerk/nextjs';
import { supabase, type Album, type Entry } from '@/lib/supabase';
import { X } from '@phosphor-icons/react';

interface AddToAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: Entry;
}

function ModalContent({ isOpen, onClose, entry }: AddToAlbumModalProps) {
  const { user } = useUser();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbumIds, setSelectedAlbumIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && isOpen) {
      fetchAlbums();
      fetchExistingAlbums();
    }
  }, [user, isOpen, entry.id]);

  const fetchAlbums = async () => {
    try {
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlbums(data || []);
    } catch (error) {
      console.error('Error fetching albums:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExistingAlbums = async () => {
    try {
      const { data, error } = await supabase
        .from('album_entries')
        .select('album_id')
        .eq('entry_id', entry.id);

      if (error) throw error;
      setSelectedAlbumIds(data.map(item => item.album_id));
    } catch (error) {
      console.error('Error fetching existing albums:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Get current album entries
      const { data: currentEntries } = await supabase
        .from('album_entries')
        .select('album_id')
        .eq('entry_id', entry.id);

      const currentAlbumIds = new Set(currentEntries?.map(e => e.album_id) || []);
      const selectedAlbumIdsSet = new Set(selectedAlbumIds);

      // Albums to add the entry to
      const albumsToAdd = selectedAlbumIds.filter(id => !currentAlbumIds.has(id));

      // Albums to remove the entry from
      const albumsToRemove = Array.from(currentAlbumIds).filter(id => !selectedAlbumIdsSet.has(id));

      // Add entry to new albums
      if (albumsToAdd.length > 0) {
        const { error: addError } = await supabase
          .from('album_entries')
          .insert(
            albumsToAdd.map(albumId => ({
              album_id: albumId,
              entry_id: entry.id
            }))
          );

        if (addError) throw addError;
      }

      // Remove entry from unselected albums
      if (albumsToRemove.length > 0) {
        const { error: removeError } = await supabase
          .from('album_entries')
          .delete()
          .eq('entry_id', entry.id)
          .in('album_id', albumsToRemove);

        if (removeError) throw removeError;
      }

      onClose();
    } catch (err) {
      console.error('Error updating albums:', err);
      setError('Failed to update albums. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAlbum = (albumId: string) => {
    setSelectedAlbumIds(prev =>
      prev.includes(albumId)
        ? prev.filter(id => id !== albumId)
        : [...prev, albumId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#F5F0E5] rounded-2xl p-8 w-full max-w-md relative shadow-xl border border-[#2C1D0E]/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#2C1D0E] hover:text-[#4A3F35] transition-colors"
        >
          <X size={24} weight="bold" />
        </button>

        <h2 className="text-2xl font-['EB_Garamond'] text-[#2C1D0E] mb-6">Add to Albums</h2>

        {isLoading ? (
          <div className="text-center py-8">Loading albums...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {albums.map((album) => (
                <label
                  key={album.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-[#2C1D0E]/10
                           hover:bg-[#2C1D0E]/5 transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedAlbumIds.includes(album.id)}
                    onChange={() => toggleAlbum(album.id)}
                    className="w-5 h-5 rounded border-[#2C1D0E]/20 text-[#2C1D0E]
                             focus:ring-[#2C1D0E]/20 focus:ring-offset-0"
                  />
                  <div>
                    <div className="font-['EB_Garamond'] text-[#2C1D0E]">{album.title}</div>
                    {album.description && (
                      <div className="text-sm text-[#2C1D0E]/60">{album.description}</div>
                    )}
                  </div>
                  <div
                    className="ml-auto w-4 h-4 rounded-sm"
                    style={{ backgroundColor: album.color }}
                  />
                </label>
              ))}
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-lg border border-[#2C1D0E]/20
                         text-[#2C1D0E] hover:bg-[#2C1D0E]/5 transition-colors
                         font-['EB_Garamond']"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-lg bg-[#2C1D0E] text-[#F5F0E5]
                         hover:bg-[#4A3F35] transition-colors disabled:opacity-50
                         font-['EB_Garamond']"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function AddToAlbumModal(props: AddToAlbumModalProps) {
  if (typeof window === 'undefined') return null;
  return ReactDOM.createPortal(
    <ModalContent {...props} />,
    document.body
  );
} 