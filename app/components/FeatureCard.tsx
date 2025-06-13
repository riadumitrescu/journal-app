import React from 'react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-[#F5F0E5] rounded-2xl p-8 shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/assets/papertexture.png')] bg-repeat opacity-60"></div>
      <div className="absolute inset-0 bg-[url('/assets/papertexture.png')] bg-repeat opacity-40 rotate-180"></div>
      <div className="relative">
        <div className="text-3xl mb-4">{icon}</div>
        <h3 className="text-xl font-serif text-[#2C1D0E] mb-3">{title}</h3>
        <p className="text-forest-600 font-crimson">{description}</p>
      </div>
    </div>
  );
} 