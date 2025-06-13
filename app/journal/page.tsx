'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { supabase, type Entry } from '@/lib/supabase';
import RecentEntries from '@/app/components/RecentEntries';
import Shelf from '@/app/components/Shelf';
import NewEntryBubble from '@/app/components/NewEntryBubble';

export default function JournalPage() {
  const { user } = useUser();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a full year of days
  const today = new Date();
  const allDays = Array.from({ length: 365 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    return {
      date: date.toISOString().split('T')[0], // YYYY-MM-DD format
      hasEntry: false,
      mood: null as Entry['mood'] | null,
      mood_color: null as string | null
    };
  });

  // Map entries to days
  const daysWithEntries = allDays.map(day => {
    const entry = entries.find(e => e.created_at.split('T')[0] === day.date);
    return {
      ...day,
      hasEntry: !!entry,
      mood: entry?.mood || null,
      mood_color: entry?.mood_color || null
    };
  });

  // Get unique moods for legend
  const uniqueMoods = new Map<string, string>();
  entries.forEach(entry => {
    if (entry.mood && entry.mood_color) {
      uniqueMoods.set(entry.mood, entry.mood_color);
    }
  });

  return (
    <div 
      className="min-h-screen bg-[#2C1D0E] pt-20 pb-12 relative overflow-hidden"
    >
      {/* Warm Light Effect from Lamp */}
      <div 
        className="absolute top-0 right-0 w-[1200px] h-[1200px] opacity-30"
        style={{
          background: 'radial-gradient(circle at 80% 0%, rgba(255, 210, 150, 0.4) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Decorative Lamp with its own glow */}
      <div className="absolute -top-20 -right-20 w-[600px] h-[600px]">
        <div className="relative w-full h-full">
          {/* Lamp's warm glow */}
          <div 
            className="absolute top-1/2 left-1/2 w-48 h-48 -translate-x-1/2 -translate-y-1/2"
            style={{
              background: 'radial-gradient(circle at center, rgba(255, 220, 180, 0.3) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />
          {/* Lamp image */}
          <Image
            src="/assets/lamp.png"
            alt="Decorative lamp"
            width={600}
            height={600}
            className="object-contain opacity-20"
          />
        </div>
      </div>

      {/* Plant in bottom left */}
      <div className="absolute -bottom-10 -left-10 w-[400px] h-[400px]">
        <Image
          src="/assets/plant.png"
          alt="Decorative plant"
          width={400}
          height={400}
          className="object-contain opacity-15"
          style={{
            filter: 'brightness(0.7) sepia(0.3)',
          }}
        />
      </div>

      {/* Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div className="relative">
            <h1 className="text-4xl font-['EB_Garamond'] text-[#F5F0E5]">Your Journal</h1>
            <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#F5F0E5]/30 to-transparent" />
          </div>
          <Link
            href="/journal/new"
            className="bg-[#F5F0E5] text-[#2C1D0E] px-6 py-3 rounded-lg 
                     transition-all duration-300 shadow-lg hover:shadow-xl
                     border border-[#2C1D0E]/10 font-['EB_Garamond']
                     hover:bg-[#E6D5C1] hover:scale-105"
          >
            New Entry
          </Link>
        </div>

        {/* Year Grid Section */}
        <div 
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
          {/* Calendar Grid */}
          <div>
            <h2 className="text-2xl font-['EB_Garamond'] text-[#2C1D0E] mb-6 relative inline-block">
              Your Year in Entries
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#2C1D0E]/0 via-[#2C1D0E]/20 to-[#2C1D0E]/0" />
            </h2>
            <div className="flex flex-wrap gap-1 max-w-4xl mx-auto justify-start">
              {daysWithEntries.map((day, index) => (
                <Link 
                  href={day.hasEntry ? `/journal/entry/${day.date}` : '#'} 
                  key={day.date}
                  className={`relative group ${!day.hasEntry ? 'cursor-default' : 'cursor-pointer'}`}
                  onClick={(e) => !day.hasEntry && e.preventDefault()}
                >
                  <div 
                    className={`w-4 h-4 rounded-sm transition-all duration-300 ${
                      day.hasEntry ? 'group-hover:scale-125 group-hover:shadow-lg' : ''
                    }`}
                    style={{ 
                      backgroundColor: day.hasEntry && day.mood_color ? day.mood_color : '#4A3F35',
                      opacity: day.hasEntry ? 0.95 : 0.1
                    }}
                  />
                  <div className="absolute hidden group-hover:block bg-[#2C1D0E] text-[#F5F0E5] text-xs 
                                rounded-lg px-3 py-2 -top-12 left-1/2 transform -translate-x-1/2 
                                whitespace-nowrap shadow-xl z-10 border border-[#F5F0E5]/10">
                    {new Date(day.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                    {!day.hasEntry && ' - No entry'}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2
                                  w-2 h-2 bg-[#2C1D0E] rotate-45 border-r border-b border-[#F5F0E5]/10" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm text-[#2C1D0E]/80">
            {Array.from(uniqueMoods.entries()).map(([mood, color]) => (
              <div key={mood} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#2C1D0E]/5">
                <div
                  className="w-3 h-3 rounded-sm shadow-sm"
                  style={{ backgroundColor: color }}
                />
                <span className="font-['EB_Garamond']">{mood}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#2C1D0E]/5">
              <div className="w-3 h-3 rounded-sm bg-[#4A3F35] opacity-10" />
              <span className="font-['EB_Garamond']">No Entry</span>
            </div>
          </div>
        </div>

        {/* New Entry Button - Now directly below the Year Grid Section */}
        <div className="flex justify-center -mt-4 mb-8">
          <NewEntryBubble />
        </div>

        {/* Bookshelf Section */}
        <div 
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
          <h2 className="text-2xl font-['EB_Garamond'] text-[#2C1D0E] mb-8 relative inline-block">
            Your Writing Journey
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#2C1D0E]/0 via-[#2C1D0E]/20 to-[#2C1D0E]/0" />
          </h2>
          <Shelf entries={entries} />
        </div>

        {/* Recent Entries Section */}
        <div 
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
          <RecentEntries />
        </div>
      </div>
    </div>
  );
} 