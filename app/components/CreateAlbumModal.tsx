import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { X } from '@phosphor-icons/react';

interface CreateAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAlbumCreated: () => void;
}

function hslToHex(h: number, s: number, l: number) {
  l /= 100;
  s /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const color = l - a * Math.max(Math.min(k(n) - 3, 9 - k(n), 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function ModalContent({ isOpen, onClose, onAlbumCreated }: CreateAlbumModalProps) {
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hue, setHue] = useState(30); // default brownish
  const [color, setColor] = useState(hslToHex(30, 70, 70));
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setColor(hslToHex(hue, 70, 70));
  }, [hue]);

  const updateColor = (e: React.MouseEvent | MouseEvent) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newHue = Math.round((x / rect.width) * 360);
      const clampedHue = Math.max(0, Math.min(360, newHue));
      setHue(clampedHue);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateColor(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updateColor(e as unknown as React.MouseEvent);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { error: supabaseError } = await supabase
        .from('albums')
        .insert([{
          user_id: user.id,
          title,
          description,
          color
        }]);

      if (supabaseError) throw supabaseError;
      setTitle('');
      setDescription('');
      setHue(30);
      setColor(hslToHex(30, 70, 70));
      onAlbumCreated();
      onClose();
    } catch (err) {
      console.error('Error creating album:', err);
      setError('Failed to create album. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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

        <h2 className="text-2xl font-['EB_Garamond'] text-[#2C1D0E] mb-6">Create New Album</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-[#2C1D0E] mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-[#2C1D0E]/20 bg-white/50
                       focus:outline-none focus:ring-2 focus:ring-[#2C1D0E]/20
                       font-['EB_Garamond'] text-[#2C1D0E]"
              placeholder="e.g., Morning Pages, Dream Log"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[#2C1D0E] mb-2">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-[#2C1D0E]/20 bg-white/50
                       focus:outline-none focus:ring-2 focus:ring-[#2C1D0E]/20
                       font-['EB_Garamond'] text-[#2C1D0E] resize-none"
              placeholder="What's this album about?"
              rows={3}
            />
          </div>

          {/* Color Slider */}
          <div>
            <label className="block text-sm font-medium text-[#2C1D0E] mb-2">
              Cover Color
            </label>
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-lg border border-[#2C1D0E]/20 shadow"
                style={{ backgroundColor: color }}
              />
              <div className="flex-1">
                <div
                  ref={sliderRef}
                  onMouseDown={handleMouseDown}
                  className="h-8 rounded-xl shadow-inner cursor-pointer overflow-hidden relative"
                  style={{
                    background: `linear-gradient(to right, 
                      hsl(0, 70%, 70%),
                      hsl(60, 70%, 70%),
                      hsl(120, 70%, 70%),
                      hsl(180, 70%, 70%),
                      hsl(240, 70%, 70%),
                      hsl(300, 70%, 70%),
                      hsl(360, 70%, 70%))`
                  }}
                >
                  {/* Slider Handle */}
                  <div
                    className="absolute top-0 w-6 h-8 transform translate-x-[-50%] 
                               border-2 border-white rounded-full shadow-lg transition-shadow
                               hover:shadow-xl active:shadow-2xl"
                    style={{
                      left: `${(hue / 360) * 100}%`,
                      backgroundColor: color
                    }}
                  />
                </div>
                <div className="mt-2 text-xs font-mono text-[#2C1D0E]/70 select-all">
                  {color}
                </div>
              </div>
            </div>
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
              {isSubmitting ? 'Creating...' : 'Create Album'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CreateAlbumModal(props: CreateAlbumModalProps) {
  if (typeof window === 'undefined') return null;
  return ReactDOM.createPortal(
    <ModalContent {...props} />,
    document.body
  );
} 