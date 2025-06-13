import React from 'react';
import Link from 'next/link';
import { type Album } from '@/lib/supabase';

interface AlbumBookProps {
  album: Album;
}

export default function AlbumBook({ album }: AlbumBookProps) {
  return (
    <Link
      href={`/journal/album/${album.id}`}
      className="group relative"
    >
      <div
        className="rounded-sm shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300
                   flex items-center justify-center relative cursor-pointer"
        style={{
          width: '24px',
          height: '200px',
          background: `linear-gradient(to right, ${album.color}, ${album.color} 70%, rgba(0,0,0,0.1))`,
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
          {album.title}
        </div>
        {album.description && (
          <div className="text-xs text-[#F5F0E5]/80 mt-1 max-w-[200px]">
            {album.description}
          </div>
        )}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2
                      w-2 h-2 bg-[#2C1D0E] rotate-45" />
      </div>
    </Link>
  );
} 