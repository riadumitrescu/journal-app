'use client';

import { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { 
  Smiley,
  SmileyWink,
  SmileyMeh,
  SmileySad,
  SmileyNervous,
  SmileyAngry,
  Heart,
  Sun,
  Cloud,
  CloudRain,
  Lightning,
  Star
} from "@phosphor-icons/react";

const moods = [
  { word: 'Joyful', icon: <SmileyWink weight="fill" className="w-5 h-5" />, color: '#FFD700' },
  { word: 'Happy', icon: <Smiley weight="fill" className="w-5 h-5" />, color: '#FFA500' },
  { word: 'Peaceful', icon: <Sun weight="fill" className="w-5 h-5" />, color: '#98FB98' },
  { word: 'Loved', icon: <Heart weight="fill" className="w-5 h-5" />, color: '#FF69B4' },
  { word: 'Hopeful', icon: <Star weight="fill" className="w-5 h-5" />, color: '#87CEEB' },
  { word: 'Neutral', icon: <SmileyMeh weight="fill" className="w-5 h-5" />, color: '#B8B8B8' },
  { word: 'Anxious', icon: <SmileyNervous weight="fill" className="w-5 h-5" />, color: '#DDA0DD' },
  { word: 'Sad', icon: <SmileySad weight="fill" className="w-5 h-5" />, color: '#6495ED' },
  { word: 'Angry', icon: <SmileyAngry weight="fill" className="w-5 h-5" />, color: '#DC143C' },
  { word: 'Stressed', icon: <Lightning weight="fill" className="w-5 h-5" />, color: '#FF4500' },
  { word: 'Tired', icon: <Cloud weight="fill" className="w-5 h-5" />, color: '#778899' },
  { word: 'Overwhelmed', icon: <CloudRain weight="fill" className="w-5 h-5" />, color: '#4682B4' }
];

interface MoodInputProps {
  onMoodChange: (mood: { word: string; color: string }) => void;
}

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

export default function MoodInput({ onMoodChange }: MoodInputProps) {
  const { user } = useUser();
  const [hue, setHue] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [moodWord, setMoodWord] = useState<string>('');
  const sliderRef = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState(hslToHex(0, 70, 70));
  const [previousMoods, setPreviousMoods] = useState<Array<{ word: string; color: string }>>([]);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [recentMoods, setRecentMoods] = useState<string[]>([]);

  // Fetch previous moods when component mounts
  useEffect(() => {
    const fetchPreviousMoods = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('entries')
          .select('mood, mood_color')
          .eq('user_id', user.id);

        if (error) throw error;

        // Create unique mood-color pairs
        const uniqueMoods = new Map<string, string>();
        data?.forEach(entry => {
          if (entry.mood && entry.mood_color) {
            uniqueMoods.set(entry.mood, entry.mood_color);
          }
        });

        // Convert Map to array
        setPreviousMoods(Array.from(uniqueMoods.entries()).map(([word, color]) => ({ word, color })));
      } catch (error) {
        console.error('Error fetching previous moods:', error);
      }
    };

    fetchPreviousMoods();
  }, [user]);

  useEffect(() => {
    const storedMoods = localStorage.getItem('recentMoods');
    if (storedMoods) {
      setRecentMoods(JSON.parse(storedMoods));
    }
  }, []);

  const updateColor = (e: React.MouseEvent | MouseEvent) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newHue = Math.round((x / rect.width) * 360);
      const clampedHue = Math.max(0, Math.min(360, newHue));
      setHue(clampedHue);
      const newColor = hslToHex(clampedHue, 70, 70);
      setSelectedColor(newColor);
      onMoodChange({ color: newColor, word: moodWord });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateColor(e);
  };

  const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
    if (isDragging) {
      updateColor(e);
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

  const handleWordChange = (word: string) => {
    setMoodWord(word);
    onMoodChange({ color: selectedColor, word });
  };

  const selectPreviousMood = (mood: { word: string; color: string }) => {
    setMoodWord(mood.word);
    setSelectedColor(mood.color);
    onMoodChange({ color: mood.color, word: mood.word });
  };

  const handleMoodSelect = (mood: { word: string; color: string }) => {
    setSelectedMood(mood.word);
    onMoodChange(mood);

    // Update recent moods
    const updatedRecentMoods = [
      mood.word,
      ...recentMoods.filter(m => m !== mood.word)
    ].slice(0, 3);
    setRecentMoods(updatedRecentMoods);
    localStorage.setItem('recentMoods', JSON.stringify(updatedRecentMoods));
  };

  return (
    <div className="space-y-6">
      {/* Previous Moods */}
      {previousMoods.length > 0 && (
        <div>
          <label className="block font-['EB_Garamond'] text-[#2C1D0E] text-lg mb-4">
            Previously used moods
          </label>
          <div className="flex flex-wrap gap-3">
            {previousMoods.map((mood, index) => (
              <button
                key={index}
                onClick={() => selectPreviousMood(mood)}
                className={`px-4 py-2 rounded-2xl transition-all duration-300 
                          hover:scale-105 flex items-center gap-2.5 group
                          ${mood.word === moodWord 
                            ? 'border-2 border-[#2C1D0E] shadow-md' 
                            : 'border border-[#2C1D0E]/10 hover:border-[#2C1D0E]/30 hover:shadow-md'}`}
                style={{
                  backgroundColor: `${mood.color}15`,
                }}
              >
                <div
                  className="w-4 h-4 rounded-full shadow-sm transition-transform duration-300 group-hover:scale-110"
                  style={{ 
                    backgroundColor: mood.color,
                    boxShadow: `0 2px 4px ${mood.color}40`
                  }}
                />
                <span className="text-[#2C1D0E] font-['EB_Garamond'] text-lg">
                  {mood.word}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color Slider */}
      <div>
        <label className="block font-['EB_Garamond'] text-[#2C1D0E] text-lg mb-4">
          {previousMoods.length > 0 ? 'Or pick a new color' : 'Move the slider to match your mood'}
        </label>
        <div className="relative">
          {/* Color Slider Track */}
          <div 
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            className="h-12 rounded-xl shadow-inner cursor-pointer overflow-hidden"
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
              className="absolute top-0 w-6 h-12 transform translate-x-[-50%] 
                       border-2 border-white rounded-full shadow-lg transition-shadow
                       hover:shadow-xl active:shadow-2xl"
              style={{
                left: `${(hue / 360) * 100}%`,
                backgroundColor: selectedColor
              }}
            />
          </div>
        </div>
      </div>

      {/* Word Input */}
      <div>
        <label className="block font-['EB_Garamond'] text-[#2C1D0E] text-lg mb-4">
          How are you feeling?
        </label>
        <input
          type="text"
          value={moodWord}
          onChange={(e) => handleWordChange(e.target.value)}
          placeholder="One word for today..."
          className="w-full px-4 py-2 rounded-lg bg-white/80 border-2 border-[#2C1D0E]/10 
                   focus:border-[#2C1D0E] focus:ring-0 transition-colors
                   font-['Inter'] text-[#2C1D0E] placeholder-[#2C1D0E]/40"
          maxLength={20}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {moods.map((mood) => {
          const isSelected = selectedMood === mood.word;
          const isRecent = recentMoods.includes(mood.word);

          return (
            <button
              key={mood.word}
              onClick={() => handleMoodSelect(mood)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300
                ${isSelected 
                  ? 'bg-[#2C1D0E] text-[#F8F5F0] shadow-lg scale-105' 
                  : 'bg-white hover:bg-[#2C1D0E] hover:text-[#F8F5F0] text-[#2C1D0E]'}
                ${isRecent && !isSelected ? 'border-2 border-[#2C1D0E]/20' : 'border border-[#E0D5C7]'}
                group relative
              `}
            >
              <span className="relative z-10 flex items-center gap-2">
                {mood.icon}
                <span className="font-['EB_Garamond']">{mood.word}</span>
              </span>
              <div 
                className={`
                  absolute inset-0 rounded-full opacity-10 transition-opacity duration-300
                  ${isSelected ? 'opacity-20' : 'group-hover:opacity-20'}
                `}
                style={{ backgroundColor: mood.color }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
} 