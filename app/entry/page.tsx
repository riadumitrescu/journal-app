'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { useUser } from '@clerk/nextjs';

const SUPABASE_URL = 'https://tlisradyhpaqlzxbblhm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsaXNyYWR5aHBhcWx6eGJibGhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MDE1MTcsImV4cCI6MjA2NDI3NzUxN30._zKeuPATi2W-AlEpi8VP_1ExgeSf2YSDwa0bxje5yH4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Predefined mood names
const MOODS = ['Joyful', 'Peaceful', 'Melancholic', 'Energetic', 'Contemplative'];

const AI_PROMPT = "What did you discover about yourself today?";

// Convert HSL to Hex
const hslToHex = (h: number, s: number, l: number) => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export default function EntryPage() {
  const router = useRouter();
  const { user } = useUser();
  const [content, setContent] = useState('');
  const [moodText, setMoodText] = useState(MOODS[0]);
  const [moodColor, setMoodColor] = useState('#FFB5A7');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hue, setHue] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [date] = useState(new Date().toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));

  // Handle color picker interactions
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateColor(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      updateColor(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateColor = (e: React.MouseEvent) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newHue = Math.round((x / rect.width) * 360);
      setHue(Math.max(0, Math.min(360, newHue)));
      setMoodColor(hslToHex(newHue, 70, 70));
    }
  };

  useEffect(() => {
    // Add window event listeners for drag handling
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove as any);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove as any);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    if (!user) {
      router.push('/sign-in');
    }
  }, [user, router]);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!content.trim()) {
      setError('Please write something in your journal entry.');
      return;
    }

    if (!user) {
      setError('You must be signed in to save an entry.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting to save entry with Clerk user ID:', user.id);

      // Generate a brief summary from the first few words
      const summary = content.split(' ').slice(0, 10).join(' ') + '...';

      const entry = {
        user_id: user.id,
        content,
        mood: moodText,
        mood_color: moodColor,
        tags,
        summary,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        title: summary.split(' ').slice(0, 3).join(' '), // Using first 3 words as title for now
        ai_insight: null // We'll handle AI insights later
      };

      console.log('Entry data to be saved:', entry);

      const { error: insertError, data } = await supabase
        .from('entries')
        .insert([entry])
        .select();

      if (insertError) {
        console.error('Insert error details:', insertError);
        throw new Error(insertError.message);
      }

      console.log('Successfully saved entry:', data);
      router.push('/dashboard');
    } catch (err) {
      console.error('Save error:', err);
      setError(err instanceof Error ? err.message : 'Failed to save entry. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/paper-texture.png')] bg-repeat py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-leather-300">
          {/* Date and Prompt */}
          <div className="text-center mb-10">
            <p className="font-['Crimson_Text'] text-leather-600 italic mb-4">{date}</p>
            <h1 className="text-2xl font-['Playfair_Display'] text-forest-700 mb-3">{AI_PROMPT}</h1>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-forest-200 to-transparent mx-auto"></div>
          </div>

          {/* Journal Entry */}
          <div className="mb-10">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Begin your entry here..."
              className="w-full h-72 p-6 rounded-xl bg-cream-50/70 border-2 border-leather-300/50
                       text-leather-700 placeholder-leather-400
                       focus:border-leather-400 focus:ring-0
                       resize-none font-['Kalam'] text-lg leading-relaxed
                       transition-all duration-300
                       bg-[linear-gradient(transparent,transparent_27px,#d1c4b7_27px)] bg-[0_-1px]
                       [background-size:100%_28px] [line-height:28px] [padding-top:28px]
                       shadow-inner"
              style={{
                backgroundAttachment: 'local'
              }}
            />
          </div>

          {/* Mood Selection */}
          <div className="mb-10">
            <label className="block font-['Playfair_Display'] text-forest-700 text-lg mb-4">
              How are you feeling today?
            </label>
            
            {/* Color Picker */}
            <div className="mb-6">
              <div 
                ref={sliderRef}
                onMouseDown={handleMouseDown}
                className="h-8 rounded-lg shadow-inner cursor-pointer overflow-hidden"
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
                <div 
                  className="w-4 h-8 transform translate-x-[-50%] border-2 border-white rounded-full shadow-lg"
                  style={{
                    position: 'relative',
                    left: `${(hue / 360) * 100}%`,
                    backgroundColor: moodColor
                  }}
                />
              </div>
            </div>

            {/* Mood Text Selection */}
            <div className="flex flex-wrap gap-3 justify-center">
              {MOODS.map((mood) => (
                <button
                  key={mood}
                  onClick={() => setMoodText(mood)}
                  className={`px-6 py-2 rounded-xl border-2 transition-all duration-300
                            ${moodText === mood 
                              ? 'scale-105 shadow-lg border-opacity-100' 
                              : 'hover:scale-102 shadow-md border-opacity-50 bg-opacity-40'}
                            focus:outline-none`}
                  style={{
                    backgroundColor: moodColor,
                    borderColor: moodColor,
                    color: '#4A4A4A'
                  }}
                >
                  <span className="block font-['Kalam']">{mood}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags Input */}
          <div className="mb-10">
            <label className="block font-['Playfair_Display'] text-forest-700 text-lg mb-4">
              Add Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 rounded-full bg-gradient-to-r from-forest-50 to-sage-50 
                           text-forest-700 text-sm border border-forest-100
                           flex items-center gap-1 shadow-sm font-['Kalam']"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-forest-900 ml-1 opacity-60 hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Type and press Enter to add tags..."
              className="w-full px-5 py-3 rounded-xl bg-cream-50/70 border-2 border-leather-300/50
                       text-leather-700 placeholder-leather-400 font-['Kalam']
                       focus:border-leather-400 focus:ring-0
                       shadow-inner transition-all duration-300"
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 mb-6 text-center font-['Kalam']">{error}</p>
          )}

          {/* Save Button */}
          <div className="text-center">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-10 py-3 bg-gradient-to-r from-forest-500 to-forest-600 text-white rounded-xl
                       font-['Playfair_Display'] text-lg transition-all duration-300 
                       hover:from-forest-600 hover:to-forest-700
                       disabled:opacity-50 disabled:cursor-not-allowed
                       focus:outline-none shadow-lg hover:shadow-xl
                       hover:-translate-y-0.5"
            >
              {isLoading ? 'Saving...' : 'Save Entry'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 