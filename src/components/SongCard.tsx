'use client';

import Image from 'next/image';
import StarRating from './StarRating';
import { getFlagEmoji } from '@/lib/flags';

interface Rating {
  id: number;
  stars: number;
  createdAt: string;
  familyMember: { id: number; name: string; emoji: string; color: string };
}

interface SongCardProps {
  song: {
    id: number;
    country: string;
    countryCode: string;
    artist: string;
    title: string;
    youtubeVideoId: string | null;
    ratings: Rating[];
  };
  selectedMemberId: number | null;
  onRate: (songId: number, stars: number) => void;
  onWatch: (videoId: string, songTitle: string, country: string) => void;
}

export default function SongCard({ song, selectedMemberId, onRate, onWatch }: SongCardProps) {
  const avgRating = song.ratings.length
    ? song.ratings.reduce((sum, r) => sum + r.stars, 0) / song.ratings.length
    : 0;

  const totalRatings = song.ratings.length;

  const myRatings = song.ratings.filter(
    (r) => r.familyMember.id === selectedMemberId
  );
  const myLatestRating = myRatings.length ? myRatings[myRatings.length - 1] : null;

  const thumbnailUrl = song.youtubeVideoId
    ? `https://img.youtube.com/vi/${song.youtubeVideoId}/mqdefault.jpg`
    : null;

  return (
    <div className="song-card glass-card overflow-hidden group">
      {/* Thumbnail / Video section */}
      <div className="relative aspect-video bg-black/40 overflow-hidden">
        {thumbnailUrl ? (
          <>
            <Image
              src={thumbnailUrl}
              alt={`${song.artist} - ${song.title}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {song.youtubeVideoId && (
              <button
                onClick={() => onWatch(song.youtubeVideoId!, song.title, song.country)}
                className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-all"
              >
                <span className="text-5xl opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg">
                  ▶️
                </span>
              </button>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl">
            {getFlagEmoji(song.countryCode)}
          </div>
        )}

        {/* Country badge */}
        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5 text-sm">
          <span>{getFlagEmoji(song.countryCode)}</span>
          <span className="font-medium">{song.country}</span>
        </div>

        {/* Average rating badge */}
        {totalRatings > 0 && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 text-sm">
            <span>⭐</span>
            <span className="font-bold">{avgRating.toFixed(1)}</span>
            <span className="text-white/50">({totalRatings})</span>
          </div>
        )}
      </div>

      {/* Song info */}
      <div className="p-4">
        <h3 className="font-bold text-lg leading-tight">{song.title}</h3>
        <p className="text-white/60 text-sm mt-0.5">{song.artist}</p>

        {/* Rating area - instant click */}
        <div className="mt-3">
          {selectedMemberId ? (
            <div className="flex items-center justify-between">
              <StarRating
                rating={myLatestRating?.stars || 0}
                onRate={(stars) => onRate(song.id, stars)}
              />
              {myLatestRating && (
                <span className="text-xs text-white/40">
                  Your latest: {myLatestRating.stars}★
                </span>
              )}
            </div>
          ) : (
            <p className="text-white/30 text-sm italic mt-2">Select a family member to rate</p>
          )}
        </div>

        {/* Recent ratings preview - emoji only */}
        {song.ratings.length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex flex-wrap gap-1.5">
              {song.ratings.slice(-6).map((r) => (
                <div
                  key={r.id}
                  className="tooltip flex items-center gap-1 bg-white/5 rounded-full px-2 py-0.5 text-xs"
                  data-tip={`${r.familyMember.name}: ${r.stars}★`}
                >
                  <span>{r.familyMember.emoji}</span>
                  <span className="text-white/60">{'⭐'.repeat(r.stars)}</span>
                </div>
              ))}
              {song.ratings.length > 6 && (
                <span className="text-xs text-white/30 self-center">+{song.ratings.length - 6} more</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
