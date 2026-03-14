import type { Metadata } from 'next';
import { Fredoka, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-fredoka',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "O'Brien Family Eurovision Ranker",
  description: "The O'Brien family rates Eurovision 2026!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fredoka.variable} ${outfit.variable}`}>
      <body className="bg-eurovision-gradient min-h-screen font-outfit">
        <Navbar />
        <main className="container mx-auto px-4 pb-12">
          {children}
        </main>
      </body>
    </html>
  );
}
