'use client';

import { useState, useEffect } from 'react';
import { getFlagEmoji } from '@/lib/flags';

interface Song {
  id: number;
  country: string;
  countryCode: string;
  artist: string;
  title: string;
  youtubeVideoId: string | null;
}

export default function WatchPartyPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [autoplay, setAutoplay] = useState(false);

  useEffect(() => {
    fetch('/api/songs')
      .then((r) => r.json())
      .then((data) => {
        const withVideo = data.filter((s: Song) => s.youtubeVideoId);
        setSongs(withVideo);
        if (withVideo.length > 0) setCurrentSong(withVideo[0]);
      });
  }, []);

  const currentIndex = currentSong ? songs.findIndex((s) => s.id === currentSong.id) : -1;

  const goNext = () => {
    if (currentIndex < songs.length - 1) {
      setCurrentSong(songs[currentIndex + 1]);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentSong(songs[currentIndex - 1]);
    }
  };

  return (
    <div className="space-y-6 pt-6">
      <div className="text-center py-4">
        <h1 className="text-4xl font-bold neon-text">📺 Watch Party</h1>
        <p className="text-white/50 mt-1">Watch all the entries together</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Video player */}
        <div className="lg:col-span-3">
          {currentSong?.youtubeVideoId ? (
            <div>
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <iframe
                  key={currentSong.youtubeVideoId}
                  src={`https://www.youtube.com/embed/${currentSong.youtubeVideoId}?autoplay=${autoplay ? 1 : 0}&rel=0`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    {getFlagEmoji(currentSong.countryCode)} {currentSong.country}
                  </h2>
                  <p className="text-white/60">
                    {currentSong.artist} — &ldquo;{currentSong.title}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoplay}
                      onChange={(e) => setAutoplay(e.target.checked)}
                      className="rounded"
                    />
                    Autoplay
                  </label>
                  <button
                    onClick={goPrev}
                    disabled={currentIndex <= 0}
                    className="px-4 py-2 rounded-lg bg-white/10 text-white disabled:opacity-30 hover:bg-white/20 transition-all"
                  >
                    ← Prev
                  </button>
                  <span className="text-white/40 text-sm">
                    {currentIndex + 1} / {songs.length}
                  </span>
                  <button
                    onClick={goNext}
                    disabled={currentIndex >= songs.length - 1}
                    className="px-4 py-2 rounded-lg bg-white/10 text-white disabled:opacity-30 hover:bg-white/20 transition-all"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="aspect-video rounded-xl bg-white/5 flex items-center justify-center">
              <p className="text-white/30 text-lg">Select a song to watch</p>
            </div>
          )}
        </div>

        {/* Playlist sidebar */}
        <div className="glass-card overflow-hidden">
          <div className="p-3 border-b border-white/10">
            <h3 className="font-medium text-sm text-white/60 uppercase tracking-wider">
              Playlist ({songs.length} songs)
            </h3>
          </div>
          <div className="overflow-y-auto max-h-[600px] divide-y divide-white/5">
            {songs.map((song, idx) => (
              <button
                key={song.id}
                onClick={() => { setCurrentSong(song); setAutoplay(true); }}
                className={`w-full text-left p-3 flex items-center gap-3 hover:bg-white/5 transition-colors ${
                  currentSong?.id === song.id ? 'bg-white/10 border-l-2 border-eurovision-pink' : ''
                }`}
              >
                <span className="text-white/30 text-xs w-5">{idx + 1}</span>
                <span className="text-lg">{getFlagEmoji(song.countryCode)}</span>
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate">{song.country}</div>
                  <div className="text-white/40 text-xs truncate">{song.artist}</div>
                </div>
                {currentSong?.id === song.id && (
                  <span className="ml-auto text-eurovision-pink animate-pulse">♪</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
