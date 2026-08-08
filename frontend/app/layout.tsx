import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AIChat } from '@/components/ui/AIChat';

export const metadata: Metadata = {
  title: 'MusafirX — Discover India. Plan Smarter. Travel Better.',
  description: 'AI-powered travel platform for discovering India, creating personalized itineraries, managing budgets, and sharing travel stories.',
  openGraph: {
    title: 'MusafirX — Your Journey. Your Way.',
    description: 'Discover India, plan smarter, and turn every trip into a story.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <AIChat />
          </div>
        </Providers>
      </body>
    </html>
  );
}
