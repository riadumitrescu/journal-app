import FeatherMascot from "./components/FeatherMascot";
import FeatureCard from "./components/FeatureCard";
import MoodCalendar from "./components/MoodCalendar";
import { SignUpButton } from "@clerk/nextjs";
import AuthenticatedContent from "./components/AuthenticatedContent";

export default function Home() {
  return (
    <div className="min-h-screen bg-leather-800 bg-leather-texture">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20 relative bg-[url('/background_books.png')] bg-repeat">
        <div className="absolute inset-0 bg-[#2C1D0E]/80 backdrop-blur-[2px]"></div>
        <div className="relative max-w-4xl mx-auto">
          {/* Paper-like card */}
          <div className="bg-gradient-paper rounded-2xl p-12 text-center shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/assets/papertexture.png')] bg-repeat opacity-60"></div>
            <div className="absolute inset-0 bg-[url('/assets/papertexture.png')] bg-repeat opacity-40 rotate-180"></div>
            <div className="relative">
              <div className="mb-8">
                <FeatherMascot className="mx-auto" size={180} />
              </div>
              <h1 className="text-6xl font-serif text-[#2C1D0E] mb-6">Your thoughts. Beautifully kept.</h1>
              <p className="text-2xl text-forest-600 mb-12 font-crimson italic">
                A minimalist journaling experience that lets you track your mood, capture your days, and reflect visually.
              </p>
              <AuthenticatedContent className="flex gap-4 justify-center" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-[#2C1D0E] relative">
        <div className="max-w-6xl mx-auto relative">
          <h2 className="text-4xl font-serif text-white text-center mb-16">What makes us different</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon="✍️"
              title="Write daily entries"
              description="Capture your thoughts in a clean, distraction-free environment designed for mindful reflection."
            />
            <FeatureCard
              icon="🎨"
              title="Pick a color for your mood"
              description="Express your feelings through a beautiful color palette, creating a visual journey of your emotional landscape."
            />
            <FeatureCard
              icon="📊"
              title="See your year in colors"
              description="Watch your emotional journey unfold through elegant visualizations and meaningful patterns."
            />
            <FeatureCard
              icon="🔒"
              title="Simple. Private. Meaningful."
              description="Your thoughts are yours alone. We ensure your journal stays private and secure."
            />
          </div>
        </div>
      </section>

      {/* Mood Calendar Preview */}
      <section className="py-20 px-4 relative bg-[#2C1D0E]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-serif text-white mb-6">Your year in colors</h2>
          <p className="text-xl text-cream-100/90 mb-12 font-crimson">
            Watch your emotional journey unfold through a beautiful visualization
          </p>
          <div className="bg-[#F5F0E5] rounded-2xl p-8 shadow-xl">
            <div className="flex flex-wrap gap-1 max-w-4xl mx-auto justify-center">
              {[
                // Spring awakening - peace with moments of joy
                ...Array(20).fill('#8BAF7A'),  // Peace - sage with gray undertone
                ...Array(3).fill('#E6B34D'),   // Joy - warm honey
                ...Array(10).fill('#8BAF7A'),  // Peace
                ...Array(2).fill('#E6B34D'),   // Joy moments
                
                // Early summer - focus and growth period
                ...Array(15).fill('#7AA0C6'),  // Focus - dusty blue
                ...Array(5).fill('#8BAF7A'),   // Peaceful moments
                ...Array(20).fill('#9B8AC0'),  // Growth - muted purple
                ...Array(3).fill('#7AA0C6'),   // Focus moments
                
                // Mid summer - joy and love flourish
                ...Array(15).fill('#E6B34D'),  // Joy
                ...Array(10).fill('#D68C7B'),  // Love - terracotta rose
                ...Array(5).fill('#E6B34D'),   // Joy
                ...Array(8).fill('#D68C7B'),   // Love
                
                // Late summer - growth and focus
                ...Array(15).fill('#9B8AC0'),  // Growth
                ...Array(10).fill('#7AA0C6'),  // Focus
                ...Array(3).fill('#9B8AC0'),   // Growth moments
                
                // Autumn - peace returns with moments of joy
                ...Array(20).fill('#8BAF7A'),  // Peace
                ...Array(4).fill('#E6B34D'),   // Joy moments
                ...Array(12).fill('#8BAF7A'),  // Peace
                
                // Winter - contemplative mix
                ...Array(10).fill('#7AA0C6'),  // Focus
                ...Array(8).fill('#9B8AC0'),   // Growth
                ...Array(5).fill('#D68C7B'),   // Love
                ...Array(12).fill('#8BAF7A'),  // Peace
                
                ...Array(135).fill('white')    // Empty squares
              ].map((color, i) => (
                <div 
                  key={i} 
                  className={`w-4 h-4 rounded-sm ${
                    color === 'white' 
                      ? 'bg-[#4A3F35]/5' 
                      : ''
                  }`}
                  style={{
                    backgroundColor: color !== 'white' ? color : undefined,
                    opacity: color !== 'white' ? 0.95 : undefined
                  }}
                ></div>
              ))}
            </div>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#E6B34D' }}></div>
                <span className="text-[#2C1D0E]">Joy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#8BAF7A' }}></div>
                <span className="text-[#2C1D0E]">Peace</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#7AA0C6' }}></div>
                <span className="text-[#2C1D0E]">Focus</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#9B8AC0' }}></div>
                <span className="text-[#2C1D0E]">Growth</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#D68C7B' }}></div>
                <span className="text-[#2C1D0E]">Love</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design Philosophy */}
      <section id="design" className="py-20 px-4 bg-forest-900/30 backdrop-blur-sm relative">
        <div className="absolute inset-0 bg-[url('/assets/papertexture.png')] bg-repeat opacity-10"></div>
        <div className="max-w-4xl mx-auto relative">
          <div className="bg-gradient-paper rounded-lg shadow-book p-12 hover:animate-page-curl overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('/assets/papertexture.png')] bg-repeat opacity-60"></div>
            <div className="absolute inset-0 bg-[url('/assets/papertexture.png')] bg-repeat opacity-40 rotate-180"></div>
            <div className="relative text-center">
              <div className="mb-8">
                <FeatherMascot className="mx-auto" size={120} />
              </div>
              <h2 className="text-4xl font-serif text-forest-800 mb-6">Crafted with intention</h2>
              <p className="text-xl text-forest-600 mb-8 font-crimson">
                Inspired by the timeless elegance of paper journals, we've created a digital space that feels 
                both familiar and magical. Every detail — from the soft paper textures to the carefully chosen 
                serif fonts — is designed to make your writing experience peaceful and meaningful.
              </p>
              <blockquote className="text-2xl font-serif text-forest-700 italic mb-12 px-8 py-6 border-l-4 border-forest-200 bg-cream-100/50">
                "This journal feels like a real object I come back to."
              </blockquote>
              <div className="flex flex-col gap-4 items-center">
                <p className="text-xl text-forest-600 font-crimson mb-4">
                  Ready to begin your reflection journey?
                </p>
                <SignUpButton mode="modal">
                  <button className="bg-forest-700 text-cream-50 px-12 py-4 rounded-lg hover:bg-forest-600 transition-colors font-medium text-lg border border-forest-900/10 shadow-lg hover:shadow-xl">
                    Start Now
                  </button>
                </SignUpButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-leather-900 relative">
        <div className="absolute inset-0 bg-[url('/assets/papertexture.png')] bg-repeat opacity-5"></div>
        <div className="max-w-4xl mx-auto text-center relative">
          <p className="text-cream-200/60 font-crimson">
            © 2025 Your Inner Library. A space for mindful reflection.
          </p>
        </div>
      </footer>
    </div>
  );
} 