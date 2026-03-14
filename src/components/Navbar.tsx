'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Songs', icon: '🎵' },
    { href: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
    { href: '/watch', label: 'Watch Party', icon: '📺' },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl animate-float">✨</span>
            <span className="text-xl font-bold bg-gradient-to-r from-eurovision-pink via-eurovision-purple to-blue-400 bg-clip-text text-transparent">
              Eurovision Family Ranker
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === link.href
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="mr-1.5">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
