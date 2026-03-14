import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Eurovision Family Ranker',
  description: 'Rate and rank Eurovision songs with your family!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-eurovision-gradient min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 pb-12">
          {children}
        </main>
      </body>
    </html>
  );
}
