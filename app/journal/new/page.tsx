'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import MoodInput from '@/app/components/MoodInput';
import FeatherMascot from '@/app/components/FeatherMascot';
import Link from 'next/link';
import { getTimeOfDay, getPrompt, loadPromptHistory, savePromptToHistory } from '@/app/utils/getPrompt';
import { 
  NotePencil, 
  ArrowLeft,
  Sparkle,
  ArrowClockwise,
  XCircle
} from "@phosphor-icons/react";

export default function NewEntryPage() {
  const router = useRouter();
  const { user } = useUser();
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<{ color: string; word: string }>({
    color: '#FAD2CF',
    word: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBlinking, setIsBlinking] = useState(false);
  const [prompt, setPrompt] = useState<{ id: string; text: string } | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  const getNewPrompt = useCallback(() => {
    const timeOfDay = getTimeOfDay();
    const history = loadPromptHistory();
    const selectedPrompt = getPrompt(timeOfDay, history);
    setPrompt(selectedPrompt);
    savePromptToHistory(selectedPrompt.id);
  }, []);

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(prev => !prev);
    }, 4000);

    return () => clearInterval(blinkInterval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood.word || !content || !user) return;

    setIsSubmitting(true);
    setError(null);
    
    try {
      const { error: supabaseError } = await supabase
        .from('entries')
        .insert([{
          user_id: user.id,
          content,
          mood: mood.word,
          mood_color: mood.color,
          created_at: new Date().toISOString()
        }]);

      if (supabaseError) throw supabaseError;
      router.push('/journal');
    } catch (err) {
      console.error('Error saving entry:', err);
      setError('Failed to save entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1107] relative overflow-hidden">
      {/* 3-Point Lighting System */}
      {/* Key Light - Main lamp light from top right */}
      <div 
        className="absolute top-0 right-0 w-[1000px] h-[1000px] opacity-40"
        style={{
          background: 'radial-gradient(circle at 70% 30%, rgba(255, 200, 120, 0.6) 0%, rgba(255, 220, 160, 0.3) 30%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      
      {/* Fill Light - Soft ambient from left */}
      <div 
        className="absolute top-0 left-0 w-[800px] h-[800px] opacity-20"
        style={{
          background: 'radial-gradient(circle at 30% 40%, rgba(255, 230, 180, 0.4) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />
      
      {/* Rim Light - Back lighting for depth */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[400px] opacity-15"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255, 240, 200, 0.3) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Desk/Table Surface with realistic perspective */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[90%]"
        style={{
          background: `
            linear-gradient(to bottom, 
              #8B5E3C 0%, 
              #7A5232 20%, 
              #6E4C30 50%, 
              #5A3F26 100%
            )
          `,
          transform: 'perspective(800px) rotateX(8deg)',
          transformOrigin: 'bottom center',
          boxShadow: `
            inset 0 0 100px rgba(0, 0, 0, 0.3),
            inset 0 2px 10px rgba(255, 255, 255, 0.1),
            0 -10px 30px rgba(0, 0, 0, 0.2)
          `,
        }}
      >
        {/* Wood grain texture */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                90deg,
                transparent,
                rgba(0, 0, 0, 0.02) 1px,
                transparent 3px
              )
            `,
          }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto relative">
          
          {/* Large Desk Lamp - Increased size */}
          <div className="absolute top-[-15%] right-[-10%] w-[400px] h-[500px] md:w-[500px] md:h-[600px] lg:w-[600px] lg:h-[700px] z-0">
            {/* Lamp's focused light cone */}
            <div 
              className="absolute top-[65%] left-[35%] w-[250px] h-[250px] md:w-[350px] md:h-[350px] lg:w-[450px] lg:h-[450px] opacity-100"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255, 220, 160, 0.6) 0%, rgba(255, 200, 120, 0.3) 40%, transparent 80%)',
                filter: 'blur(30px)',
                animation: 'pulse 4s ease-in-out infinite',
              }}
            />
            <Image
              src="/assets/lamp.png"
              alt="Desk lamp"
              width={600}
              height={700}
              className="object-contain relative z-0 w-full h-full"
              style={{
                filter: 'brightness(1.1) contrast(1.1)',
              }}
            />
          </div>

          {/* Large Plant - Increased size */}
          <div className="absolute top-[-10%] left-[-15%] w-[300px] h-[400px] md:w-[400px] md:h-[500px] lg:w-[500px] lg:h-[600px] z-0">
            {/* Plant Shadow */}
            <div 
              className="absolute bottom-0 left-[20%] w-[200px] h-[150px] md:w-[300px] md:h-[200px] lg:w-[400px] lg:h-[250px] opacity-30"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.3) 0%, transparent 70%)',
                filter: 'blur(30px)',
                transform: 'perspective(800px) rotateX(60deg)',
              }}
            />
            <Image
              src="/assets/plant.png"
              alt="Desk plant"
              width={500}
              height={600}
              className="object-contain relative z-0 w-full h-full"
              style={{
                filter: 'brightness(1) contrast(1.1)',
              }}
            />
          </div>

          {/* Content Container - Adjusted to allow decorative elements to be more visible */}
          <div className="w-full max-w-3xl mx-auto bg-[#F8F5F0]/95 rounded-2xl p-6 md:p-8 lg:p-12 shadow-xl relative z-20 mt-20 mb-20">
            {/* Back to Journal Button */}
            <Link
              href="/journal"
              className="absolute -top-12 left-0 flex items-center gap-2 text-[#F8F5F0] hover:text-[#E6D5C1] transition-colors group"
            >
              <ArrowLeft 
                className="w-5 h-5 transform transition-transform group-hover:-translate-x-1"
                weight="bold"
              />
              <span className="font-['EB_Garamond'] text-lg">Back to Journal</span>
            </Link>

            {/* Title section with Feather character */}
            <div className="relative flex justify-center items-center mb-6">
              <h1 className="text-3xl font-['EB_Garamond'] text-[#2C1D0E] text-center">New Journal Entry</h1>
              {/* Feather Character - Now larger and positioned absolutely */}
              <div className="absolute -top-12 right-0">
                <FeatherMascot size={120} />
              </div>
            </div>
            
                {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                <XCircle className="w-5 h-5 flex-shrink-0" weight="bold" />
                <span>{error}</span>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Date Display */}
              <div className="text-center mb-6">
                <div className="font-['EB_Garamond'] text-lg text-[#5A4A3A]">
                      {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>

              {/* Mood Input */}
              <MoodInput onMoodChange={setMood} />

              {/* Writing Area */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {!showPrompt ? (
                      <button
                        onClick={() => {
                          getNewPrompt();
                          setShowPrompt(true);
                        }}
                        className="text-[#2C1D0E] hover:text-[#8B5E3C] transition-colors flex items-center gap-2 group"
                      >
                        <span className="font-['EB_Garamond'] text-lg">Your thoughts</span>
                        <NotePencil 
                          className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity"
                          weight="duotone"
                        />
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 text-[#2C1D0E] text-lg font-['EB_Garamond']">
                          <Sparkle 
                            className="w-5 h-5 text-[#8B5E3C]" 
                            weight="fill"
                          />
                          {prompt?.text || 'Your thoughts'}
                        </label>
                        <button
                          onClick={getNewPrompt}
                          className="text-[#2C1D0E] hover:text-[#8B5E3C] transition-colors p-1.5 rounded-full hover:bg-[#2C1D0E]/5"
                          title="Get another prompt"
                        >
                          <ArrowClockwise 
                            className="w-5 h-5"
                            weight="bold"
                          />
                        </button>
                    </div>
                    )}
                  </div>
                </div>
                    <div className="relative">
                      <textarea
                        value={content}
                    onChange={(e) => {
                      setContent(e.target.value);
                      // Auto-adjust height
                      e.target.style.height = 'auto';
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    className="w-full min-h-[12rem] p-5 rounded-xl bg-white/90 border border-[#E0D5C7] 
                             focus:border-[#8B5E3C] focus:ring-0 transition-all duration-200
                             font-['EB_Garamond'] text-lg leading-relaxed overflow-hidden"
                        placeholder="Write your thoughts here..."
                    style={{
                      backgroundImage: 'linear-gradient(transparent, transparent 27px, #E8DDD0 27px)',
                      backgroundSize: '100% 28px',
                      lineHeight: '28px',
                      paddingTop: '28px',
                      backgroundAttachment: 'local',
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
                      resize: 'none',
                    }}
                  />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => router.push('/journal')}
                  className="px-6 py-2.5 text-[#5A4A3A] hover:text-[#2C1D0E] transition-colors 
                           font-['EB_Garamond'] text-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                  disabled={!mood.word || !content || isSubmitting}
                  className="px-8 py-2.5 bg-[#8B5E3C] text-[#F8F5F0] rounded-lg 
                           hover:bg-[#7A5232] transition-all duration-300 
                           disabled:opacity-50 disabled:cursor-not-allowed 
                           font-['EB_Garamond'] text-lg shadow-lg hover:shadow-xl
                           hover:scale-105 active:scale-100"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Entry'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
} 