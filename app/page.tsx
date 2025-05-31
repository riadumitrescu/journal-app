'use client';

import React from 'react';
import Link from 'next/link';

const StepCard = ({ number, title, description }: { number: string; title: string; description: string }) => (
  <div className="flex gap-6 items-start p-8 rounded-xl bg-sage-50/80 shadow-soft border border-sage-200/50">
    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-forest-500 text-cream-50 font-serif text-xl shadow-soft">
      {number}
    </div>
    <div>
      <h3 className="font-serif text-xl mb-2 text-forest-600">{title}</h3>
      <p className="text-brown-400 leading-relaxed">{description}</p>
    </div>
  </div>
);

const FeatureCard = ({ title, description }: { title: string; description: string }) => (
  <div className="p-8 rounded-xl bg-cream-50/80 shadow-soft border border-sage-100 
                  hover:border-sage-200 transition-all duration-300 hover:shadow-lg">
    <h3 className="font-serif text-xl mb-3 text-forest-600">{title}</h3>
    <p className="text-brown-400 leading-relaxed">{description}</p>
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-sage-50 to-cream-100">
      {/* Hero Section */}
      <section className="px-6 pt-24 pb-32 max-w-4xl mx-auto">
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-serif tracking-wide text-forest-600">
            Your Inner Library
          </h1>
          <p className="text-xl md:text-2xl text-sage-500 font-light">
            A gentle space to think, feel, and write—with AI that listens deeply.
          </p>
          <p className="text-lg text-brown-400 max-w-2xl mx-auto">
            Not just a journaling app. A private world where your thoughts become stories, 
            your stories become patterns, and those patterns become self-discovery.
          </p>
          <div className="pt-10">
            <Link
              href="/auth"
              className="inline-block px-8 py-3.5 bg-forest-500 text-cream-50 rounded-xl
                       font-serif text-lg shadow-soft
                       transition-all duration-300 ease-in-out
                       hover:shadow-lg hover:bg-forest-600 hover:scale-[1.02]
                       focus:outline-none focus:ring-2 focus:ring-forest-400 focus:ring-opacity-50"
            >
              Begin Your Story
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="px-6 py-24 bg-gradient-to-b from-sage-100/30 to-sage-50/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif text-center mb-16 text-forest-600">How it Works</h2>
          <div className="space-y-8">
            <StepCard 
              number="1"
              title="Get Prompted" 
              description="Receive thoughtful prompts tailored to your journey and mood."
            />
            <StepCard 
              number="2"
              title="Journal" 
              description="Write freely in a beautiful, distraction-free space."
            />
            <StepCard 
              number="3"
              title="Grow Your Library" 
              description="Watch your collection of thoughts and insights expand over time."
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24 bg-gradient-to-b from-cream-50/50 to-sage-50/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-serif text-center mb-16 text-forest-600">Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              title="Visual Storytelling" 
              description="See your entries come to life with beautiful visualizations and patterns."
            />
            <FeatureCard 
              title="AI That Listens" 
              description="Experience companionship that understands and responds thoughtfully."
            />
            <FeatureCard 
              title="Mood & Value Tracking" 
              description="Discover patterns in your emotional journey and personal growth."
            />
            <FeatureCard 
              title="Full Privacy" 
              description="Your thoughts are yours alone. Bank-level encryption keeps them safe."
            />
            <FeatureCard 
              title="Designed for Presence" 
              description="A space for being, not doing. No pressure, no productivity metrics."
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-6 py-24 bg-gradient-to-b from-sage-100/30 to-sage-50/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-serif mb-8 text-forest-600">
            You don't need to explain yourself. Just start.
          </h2>
          <Link
            href="/auth"
            className="inline-block px-8 py-3.5 bg-forest-500 text-cream-50 rounded-xl
                     font-serif text-lg shadow-soft
                     transition-all duration-300 ease-in-out
                     hover:shadow-lg hover:bg-forest-600 hover:scale-[1.02]
                     focus:outline-none focus:ring-2 focus:ring-forest-400 focus:ring-opacity-50"
          >
            Begin Your Story
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-sage-400 border-t border-sage-200">
        <nav className="space-x-8 text-sm">
          <a href="#" className="hover:text-forest-500 transition-colors">About</a>
          <a href="#" className="hover:text-forest-500 transition-colors">Privacy</a>
          <a href="#" className="hover:text-forest-500 transition-colors">Contact</a>
          <a href="#" className="hover:text-forest-500 transition-colors">Terms</a>
        </nav>
      </footer>
    </div>
  );
} 