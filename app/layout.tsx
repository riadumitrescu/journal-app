import { ClerkProvider } from '@clerk/nextjs';
import { Playfair_Display, Crimson_Text } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

const crimson = Crimson_Text({
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-crimson',
});

export const metadata = {
  title: 'Your Inner Library - A Mindful Journaling Experience',
  description: 'A beautiful space for your daily reflections, emotions, and personal growth.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${playfair.variable} ${crimson.variable}`}>
        <body suppressHydrationWarning className="antialiased">
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
} 