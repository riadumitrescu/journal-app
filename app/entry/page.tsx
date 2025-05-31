'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  'https://tlisradyhpaqlzxbblhm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsaXNyYWR5aHBhcWx6eGJibGhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MDE1MTcsImV4cCI6MjA2NDI3NzUxN30._zKeuPATi2W-AlEpi8VP_1ExgeSf2YSDwa0bxje5yH4'
);

const MOODS = ['Happy', 'Sad', 'Calm', 'Anxious', 'Angry'];

export default function EntryPage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  const saveEntry = async () => {
    try {
      setIsLoading(true);
      setStatus({ type: '', message: '' });

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setStatus({ type: 'error', message: 'Please log in to save your entry.' });
        return;
      }

      const { error } = await supabase
        .from('entries')
        .insert([
          {
            user_id: user.id,
            content,
            mood,
            tags,
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) throw error;

      setStatus({ type: 'success', message: 'Entry saved successfully!' });
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to save entry. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-sage-50 to-cream-100 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-serif text-forest-600 mb-2">
            Write Today's Entry
          </h1>
          <p className="text-sage-600 italic">
            What did you discover about yourself today?
          </p>
        </div>

        {/* Journal Content */}
        <div className="space-y-6">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Begin your story here..."
            className="w-full min-h-[200px] p-6 rounded-xl bg-white/80 shadow-inner-soft
                     border border-sage-200 focus:border-forest-400 focus:ring-1 focus:ring-forest-400
                     text-brown-500 placeholder-sage-400 resize-none transition-all duration-200"
          />

          {/* Mood Selection */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <label className="text-forest-600 font-medium min-w-[80px]">Mood:</label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/80 border border-sage-200
                       text-brown-500 focus:border-forest-400 focus:ring-1 focus:ring-forest-400"
            >
              <option value="">Select a mood</option>
              {MOODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Tags Input */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <label className="text-forest-600 font-medium min-w-[80px]">Tags:</label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInput}
                placeholder="Type and press Enter"
                className="px-4 py-2 rounded-lg bg-white/80 border border-sage-200
                         text-brown-500 focus:border-forest-400 focus:ring-1 focus:ring-forest-400
                         placeholder-sage-400 w-full sm:w-auto"
              />
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pl-0 sm:pl-[100px]">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-forest-100 text-forest-600 text-sm
                             flex items-center gap-2 group hover:bg-forest-200 transition-colors"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-forest-400 hover:text-forest-600 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="pt-6 text-center">
            <button
              onClick={saveEntry}
              disabled={isLoading || !content.trim() || !mood}
              className="px-8 py-3 bg-forest-500 text-white rounded-xl font-medium
                       transition-all duration-300 hover:bg-forest-600
                       disabled:opacity-50 disabled:cursor-not-allowed
                       focus:outline-none focus:ring-2 focus:ring-forest-400 focus:ring-offset-2"
            >
              {isLoading ? 'Saving...' : 'Save Entry'}
            </button>

            {status.message && (
              <p className={`mt-4 text-sm ${
                status.type === 'success' ? 'text-forest-600' : 'text-red-500'
              }`}>
                {status.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 