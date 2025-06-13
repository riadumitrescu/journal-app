import React from 'react';
import Link from 'next/link';

interface BookProps {
  wordCount: number;
  color: string;
  label: string;
  entryCount: number;
  monthKey: string;
}

export default function Book({ wordCount, color, label, entryCount, monthKey }: BookProps) {
  // Calculate dimensions based on word count with adjusted scaling
  const width = Math.min(Math.max(16, wordCount / 50), 32); // Minimum 16px, scales up to 32px
  const height = Math.min(Math.max(120, wordCount / 8), 300); // Taller books: min 120px, max 300px

  return (
    <Link
      href={`/journal/month/${monthKey}`}
      className="group relative"
    >
      <div
        className="rounded-sm shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300
                   flex items-center justify-center relative cursor-pointer"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          background: `linear-gradient(to right, ${color}, ${color} 70%, rgba(0,0,0,0.1))`,
        }}
      >
        {/* Book spine details */}
        <div className="absolute inset-y-0 left-0 w-[1px] bg-white/10" />
        <div className="absolute inset-y-0 right-0 w-[1px] bg-black/10" />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-white/10" />
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-black/10" />
      </div>

      {/* Tooltip */}
      <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200
                    bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#2C1D0E] text-[#F5F0E5]
                    text-sm rounded-lg whitespace-nowrap shadow-xl z-10">
        <div className="font-['EB_Garamond']">
          {label} • {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2
                      w-2 h-2 bg-[#2C1D0E] rotate-45" />
      </div>
    </Link>
  );
} 