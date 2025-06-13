'use client';

import React from 'react';
import Image from 'next/image';

interface FeatherMascotProps {
  className?: string;
  size?: number;
}

export default function FeatherMascot({ className = "", size = 200 }: FeatherMascotProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Base layer - Open eyes */}
      <div className="absolute inset-0 animate-mascot-blink">
        <Image
          src="/assets/feather_character/feather_character_open_eyes.PNG"
          alt="Feather character"
          width={size}
          height={size}
          className="object-contain"
          priority
        />
      </div>
      {/* Overlay layer - Closed eyes */}
      <div className="absolute inset-0 opacity-0 animate-mascot-blink-reverse">
        <Image
          src="/assets/feather_character/feather_character_closed_eyes.PNG"
          alt="Feather character blinking"
          width={size}
          height={size}
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
} 