'use client';

import { useAuth } from "@clerk/nextjs";
import FeatureCard from "./FeatureCard";
import MoodCalendar from "./MoodCalendar";
import FeatherMascot from "./FeatherMascot";
import { SignUpButton } from "@clerk/nextjs";

export default function MarketingContent() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return null;
  }

  return (
    <>
      {/* Main Heading */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-serif text-green-900 mb-6">Your thoughts. Beautifully kept.</h1>
        <p className="text-2xl text-green-800/80 mb-12 font-crimson italic">
          A mindful space for your daily reflections, emotions, and personal growth.
        </p>
      </div>

      {/* Features Section */}
      <section className="py-20 px-4 bg-parchment-100/60">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif text-green-900 text-center mb-16">What makes us different</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon="🎨"
              title="Track emotions with color"
              description="Express your feelings through a beautiful color palette, creating a visual journey of your emotional landscape."
            />
            <FeatureCard
              icon="✍️"
              title="Write freely"
              description="Capture your thoughts in a clean, distraction-free environment designed for mindful reflection."
            />
            <FeatureCard
              icon="📊"
              title="Visual insights"
              description="See your emotional journey unfold through elegant visualizations and meaningful patterns."
            />
            <FeatureCard
              icon="🔒"
              title="Private by design"
              description="Your thoughts are yours alone. We ensure your journal stays private and secure."
            />
          </div>
        </div>
      </section>

      {/* Mood Calendar Preview */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-paper-texture opacity-30"></div>
        <div className="max-w-6xl mx-auto text-center relative">
          <h2 className="text-4xl font-serif text-green-900 mb-6">Your year in colors</h2>
          <p className="text-xl text-green-800/80 mb-12 font-crimson">
            Watch your emotional journey unfold through a beautiful visualization
          </p>
          <MoodCalendar />
        </div>
      </section>

      {/* Design Philosophy */}
      <section className="py-20 px-4 bg-parchment-100/60">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <FeatherMascot />
          </div>
          <h2 className="text-4xl font-serif text-green-900 mb-6">Crafted with intention</h2>
          <p className="text-xl text-green-800/80 mb-8 font-crimson">
            Inspired by the timeless elegance of paper journals, we've created a digital space that feels 
            both familiar and magical. Every detail is designed to make your writing experience peaceful and meaningful.
          </p>
          <blockquote className="text-2xl font-serif text-green-900/80 italic mb-12 px-8 py-6 border-l-4 border-green-800/20 bg-cream-50/50">
            "This journal feels like a real object I come back to."
          </blockquote>
          <div className="flex flex-col gap-4 items-center">
            <p className="text-xl text-green-800/80 font-crimson mb-4">
              Ready to start your journey?
            </p>
            <SignUpButton mode="modal">
              <button className="bg-green-800/90 text-cream-50 px-12 py-4 rounded-lg hover:bg-green-700 transition-colors font-medium text-lg border border-green-900/10">
                Create Your Journal
              </button>
            </SignUpButton>
          </div>
        </div>
      </section>
    </>
  );
} 