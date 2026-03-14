'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Songs', icon: '🎵' },
    { href: '/comments', label: 'Comments', icon: '💬' },
    { href: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
    { href: '/watch', label: 'Watch Party', icon: '📺' },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/eurovision-2026-logo.png"
              alt="Eurovision 2026"
              width={36}
              height={36}
              className="drop-shadow-[0_0_10px_rgba(233,30,140,0.4)]"
            />
            <div className="flex flex-col leading-none">
              <span className="text-lg font-fredoka font-semibold bg-gradient-to-r from-eurovision-pink via-eurovision-purple to-blue-400 bg-clip-text text-transparent">
                O&apos;Brien Family
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-outfit">
                Eurovision Ranker
              </span>
            </div>
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
            <a
              href="https://obrien-family-hub.vercel.app"
              className="px-4 py-2 rounded-lg text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-all ml-1"
            >
              <span className="mr-1.5">🏠</span>
              Hub
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
