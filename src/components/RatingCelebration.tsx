'use client';

import { useEffect, useState } from 'react';

interface CelebrationConfig {
  emoji: string;
  message: string;
  bg: string;
  animation: string;
}

// Pools of reactions for each star level
const CELEBRATIONS: Record<number, CelebrationConfig[]> = {
  1: [
    { emoji: '👻', message: 'Spooky bad...', bg: 'from-gray-900 to-purple-950', animation: 'animate-float' },
    { emoji: '💀', message: 'Dead on arrival', bg: 'from-gray-900 to-gray-800', animation: 'animate-spin-slow' },
    { emoji: '🙀', message: 'THE HORROR', bg: 'from-orange-950 to-red-950', animation: 'animate-shake' },
    { emoji: '😱', message: 'Make it stop!', bg: 'from-blue-950 to-purple-950', animation: 'animate-shake' },
    { emoji: '👹', message: 'Cursed content', bg: 'from-red-950 to-orange-950', animation: 'animate-pulse-grow' },
    { emoji: '🧟', message: 'This song is undead', bg: 'from-green-950 to-gray-900', animation: 'animate-wobble' },
    { emoji: '🕷️', message: 'Creepy crawly...', bg: 'from-gray-900 to-gray-950', animation: 'animate-drop-in' },
    { emoji: '🦇', message: 'Into the abyss', bg: 'from-purple-950 to-gray-950', animation: 'animate-float' },
    { emoji: '🪦', message: 'Rest in peace', bg: 'from-gray-800 to-gray-950', animation: 'animate-rise-up' },
    { emoji: '🌋', message: 'CATASTROPHIC', bg: 'from-red-950 to-orange-950', animation: 'animate-shake' },
    { emoji: '👁️', message: 'I have seen things...', bg: 'from-indigo-950 to-gray-950', animation: 'animate-pulse-grow' },
    { emoji: '🫥', message: 'I feel nothing', bg: 'from-gray-800 to-gray-900', animation: 'animate-fade-pulse' },
  ],
  2: [
    { emoji: '🤡', message: 'Clown energy', bg: 'from-yellow-900 to-red-950', animation: 'animate-wobble' },
    { emoji: '👽', message: 'Not of this world', bg: 'from-green-950 to-cyan-950', animation: 'animate-float' },
    { emoji: '🫠', message: 'Melting...', bg: 'from-yellow-900 to-orange-950', animation: 'animate-melt' },
    { emoji: '🧌', message: 'Troll level', bg: 'from-green-950 to-stone-900', animation: 'animate-shake' },
    { emoji: '🦑', message: 'From the deep...', bg: 'from-blue-950 to-purple-950', animation: 'animate-wobble' },
    { emoji: '🍄', message: 'Questionable vibes', bg: 'from-red-950 to-purple-950', animation: 'animate-pulse-grow' },
    { emoji: '🌚', message: 'Dark side energy', bg: 'from-gray-900 to-yellow-950', animation: 'animate-spin-slow' },
    { emoji: '🤪', message: 'Unhinged', bg: 'from-pink-950 to-yellow-900', animation: 'animate-wobble' },
    { emoji: '🐙', message: 'Chaotic tentacles', bg: 'from-purple-950 to-pink-950', animation: 'animate-float' },
    { emoji: '🧿', message: 'Evil eye protection needed', bg: 'from-blue-950 to-cyan-950', animation: 'animate-spin-slow' },
    { emoji: '🪱', message: 'Earworm... bad kind', bg: 'from-amber-950 to-stone-900', animation: 'animate-wobble' },
    { emoji: '🫎', message: 'Moose energy??', bg: 'from-amber-900 to-stone-900', animation: 'animate-shake' },
  ],
  3: [
    { emoji: '🤷', message: 'It\'s... fine?', bg: 'from-slate-800 to-slate-900', animation: 'animate-wobble' },
    { emoji: '🐸', message: 'It is what it is', bg: 'from-green-900 to-emerald-950', animation: 'animate-float' },
    { emoji: '🧐', message: 'Hmm, interesting...', bg: 'from-amber-900 to-yellow-950', animation: 'animate-pulse-grow' },
    { emoji: '🦆', message: 'Quack. Just quack.', bg: 'from-yellow-900 to-amber-950', animation: 'animate-wobble' },
    { emoji: '🤔', message: 'Let me think about it', bg: 'from-blue-900 to-indigo-950', animation: 'animate-float' },
    { emoji: '🎭', message: 'Comedy? Tragedy? Both?', bg: 'from-purple-900 to-pink-950', animation: 'animate-spin-slow' },
    { emoji: '🥴', message: 'Woozy vibes', bg: 'from-green-900 to-teal-950', animation: 'animate-wobble' },
    { emoji: '🫤', message: 'Meh with a side of meh', bg: 'from-stone-800 to-stone-900', animation: 'animate-shake' },
    { emoji: '🦥', message: 'Slow clap', bg: 'from-amber-900 to-green-950', animation: 'animate-float' },
    { emoji: '🪺', message: 'It\'s... nested feelings', bg: 'from-sky-900 to-cyan-950', animation: 'animate-drop-in' },
    { emoji: '🧊', message: 'Cool. Literally just cool.', bg: 'from-cyan-900 to-blue-950', animation: 'animate-pulse-grow' },
    { emoji: '🌀', message: 'Hypnotically average', bg: 'from-indigo-900 to-violet-950', animation: 'animate-spin-slow' },
  ],
  4: [
    { emoji: '🕺', message: 'Getting groovy!', bg: 'from-pink-900 to-purple-950', animation: 'animate-wobble' },
    { emoji: '💃', message: 'Oh we\'re dancing!', bg: 'from-red-900 to-pink-950', animation: 'animate-wobble' },
    { emoji: '🦄', message: 'Almost magical!', bg: 'from-purple-900 to-pink-950', animation: 'animate-float' },
    { emoji: '🪩', message: 'Disco mode!', bg: 'from-violet-900 to-fuchsia-950', animation: 'animate-spin-slow' },
    { emoji: '🎸', message: 'That ROCKED', bg: 'from-red-900 to-orange-950', animation: 'animate-shake' },
    { emoji: '🥳', message: 'Party vibes!', bg: 'from-yellow-800 to-pink-950', animation: 'animate-pulse-grow' },
    { emoji: '🔥', message: 'Fuego!', bg: 'from-orange-900 to-red-950', animation: 'animate-pulse-grow' },
    { emoji: '🫶', message: 'So much love', bg: 'from-pink-900 to-rose-950', animation: 'animate-float' },
    { emoji: '🌈', message: 'Rainbow energy!', bg: 'from-violet-900 to-cyan-950', animation: 'animate-rise-up' },
    { emoji: '⚡', message: 'Electric!', bg: 'from-yellow-800 to-amber-950', animation: 'animate-shake' },
    { emoji: '🎪', message: 'What a show!', bg: 'from-red-900 to-yellow-950', animation: 'animate-wobble' },
    { emoji: '🦩', message: 'Flamingo fabulous', bg: 'from-pink-800 to-fuchsia-950', animation: 'animate-float' },
  ],
  5: [
    { emoji: '🤩', message: 'PERFECTION!', bg: 'from-yellow-600 to-pink-900', animation: 'animate-pulse-grow' },
    { emoji: '👑', message: 'CROWNED!', bg: 'from-yellow-600 to-amber-900', animation: 'animate-drop-in' },
    { emoji: '🏆', message: 'WINNER WINNER!', bg: 'from-yellow-600 to-orange-900', animation: 'animate-rise-up' },
    { emoji: '💎', message: 'FLAWLESS!', bg: 'from-cyan-600 to-blue-900', animation: 'animate-spin-slow' },
    { emoji: '🚀', message: 'TO THE MOON!', bg: 'from-indigo-700 to-purple-950', animation: 'animate-rise-up' },
    { emoji: '✨', message: 'ICONIC!', bg: 'from-yellow-600 to-pink-900', animation: 'animate-pulse-grow' },
    { emoji: '🌟', message: 'SUPERSTAR!', bg: 'from-amber-600 to-yellow-900', animation: 'animate-float' },
    { emoji: '🎆', message: 'SPECTACULAR!', bg: 'from-violet-700 to-fuchsia-950', animation: 'animate-shake' },
    { emoji: '💫', message: 'OUT OF THIS WORLD!', bg: 'from-indigo-600 to-violet-950', animation: 'animate-spin-slow' },
    { emoji: '🫡', message: 'I SALUTE YOU!', bg: 'from-green-700 to-emerald-950', animation: 'animate-wobble' },
    { emoji: '🎯', message: 'BULLSEYE!', bg: 'from-red-700 to-rose-950', animation: 'animate-pulse-grow' },
    { emoji: '🦅', message: 'SOARING!', bg: 'from-sky-700 to-blue-950', animation: 'animate-float' },
  ],
};

interface RatingCelebrationProps {
  stars: number;
  onComplete: () => void;
}

export default function RatingCelebration({ stars, onComplete }: RatingCelebrationProps) {
  const [celebration, setCelebration] = useState<CelebrationConfig | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const pool = CELEBRATIONS[stars] || CELEBRATIONS[3];
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setCelebration(pick);

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 300);
    }, 2200);

    return () => clearTimeout(timer);
  }, [stars, onComplete]);

  if (!celebration) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Background flash */}
      <div className={`absolute inset-0 bg-gradient-to-br ${celebration.bg} opacity-40 animate-pulse`} />

      {/* Main emoji */}
      <div className={`relative flex flex-col items-center gap-4 ${celebration.animation}`}>
        <span className="text-[120px] md:text-[160px] drop-shadow-2xl select-none">
          {celebration.emoji}
        </span>
        <div className="animate-fade-in">
          <p className="text-center text-white/50 text-2xl">
            {'⭐'.repeat(stars)}{'☆'.repeat(5 - stars)}
          </p>
        </div>
      </div>

      {/* Floating mini emojis for 4-5 stars */}
      {stars >= 4 && (
        <>
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="absolute text-3xl animate-scatter select-none"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1 + Math.random() * 1.5}s`,
              }}
            >
              {['✨', '🌟', '💫', '⭐', '🎵', '🎶', '💖', '🔥'][i]}
            </span>
          ))}
        </>
      )}

      {/* Creepy floating emojis for 1-2 stars */}
      {stars <= 2 && (
        <>
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="absolute text-2xl animate-drift select-none opacity-60"
              style={{
                left: `${5 + Math.random() * 90}%`,
                top: `${5 + Math.random() * 90}%`,
                animationDelay: `${Math.random() * 0.8}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {stars === 1
                ? ['👻', '💀', '🕷️', '🦇', '👁️', '🫥'][i]
                : ['🤡', '👽', '🧿', '🪱', '🌚', '🫠'][i]
              }
            </span>
          ))}
        </>
      )}
    </div>
  );
}
