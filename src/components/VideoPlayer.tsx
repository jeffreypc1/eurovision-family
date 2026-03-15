'use client';

import { useState } from 'react';

interface VideoPlayerProps {
  videoId: string;
  songTitle: string;
  country: string;
  onClose: () => void;
  onRate?: (stars: number) => void;
  currentRating?: number;
}

export default function VideoPlayer({ videoId, songTitle, country, onClose, onRate, currentRating }: VideoPlayerProps) {
  const [hovered, setHovered] = useState(0);
  const [rated, setRated] = useState(false);

  const handleRate = (stars: number) => {
    if (onRate) {
      onRate(stars);
      setRated(true);
      setTimeout(() => setRated(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold">{songTitle}</h2>
            <p className="text-white/60 text-sm">{country}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            ✕
          </button>
        </div>

        {/* Video iframe */}
        <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Rating bar */}
        {onRate && (
          <div className="flex items-center justify-center gap-4 mt-4 p-3 bg-white/5 rounded-xl">
            <span className="text-white/40 text-sm">Rate:</span>
            <div className="flex gap-1" onMouseLeave={() => setHovered(0)}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHovered(star)}
                  onClick={() => handleRate(star)}
                  className="text-2xl transition-transform hover:scale-125 select-none"
                >
                  {star <= (hovered || currentRating || 0) ? '⭐' : '☆'}
                </button>
              ))}
            </div>
            {currentRating ? (
              <span className="text-white/30 text-xs">Your rating: {currentRating}★</span>
            ) : null}
            {rated && (
              <span className="text-green-400 text-sm animate-pulse">✓ Rated!</span>
            )}
          </div>
        )}

        <p className="text-center text-white/30 text-sm mt-3">
          Press Escape or click ✕ to close
        </p>
      </div>
    </div>
  );
}
