import React from 'react';
import Link from 'next/link';
import { Plus } from '@phosphor-icons/react';

export default function NewEntryBubble() {
  return (
    <Link
      href="/journal/new"
      className="w-16 h-16 rounded-full bg-[#F5F0E5] text-[#2C1D0E] flex items-center justify-center
                 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform-gpu
                 border-2 border-[#2C1D0E]/10 hover:border-[#2C1D0E]/20"
      style={{
        boxShadow: `
          0 4px 6px -1px rgba(44, 29, 14, 0.1),
          0 2px 4px -1px rgba(44, 29, 14, 0.06),
          inset 0 2px 4px rgba(255, 255, 255, 0.2)
        `
      }}
    >
      <Plus weight="bold" className="w-8 h-8" />
    </Link>
  );
} 