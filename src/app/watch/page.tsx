'use client';

import { useState, useEffect } from 'react';
import { getFlagEmoji } from '@/lib/flags';

interface Rating {
  stars: number;
}

interface Song {
  id: number;
  country: string;
  countryCode: string;
  artist: string;
  title: string;
  year: number;
  youtubeVideoId: string | null;
  ratings: Rating[];
}

type SortMode = 'top-rated' | 'year-2026' | 'year-2025' | 'year-2024' | 'country';

export default function WatchPartyPage() {
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [autoplay, setAutoplay] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('top-rated');

  useEffect(() => {
    fetch('/api/songs')
      .then((r) => r.json())
      .then((data: Song[]) => {
        setAllSongs(data.filter((s) => s.youtubeVideoId));
      });
  }, []);

  // Sort and filter based on mode
  useEffect(() => {
    let filtered = [...allSongs];

    if (sortMode === 'top-rated') {
      // All years, sorted by highest average rating
      filtered.sort((a, b) => {
        const avgA = a.ratings.length ? a.ratings.reduce((s, r) => s + r.stars, 0) / a.ratings.length : 0;
        const avgB = b.ratings.length ? b.ratings.reduce((s, r) => s + r.stars, 0) / b.ratings.length : 0;
        return avgB - avgA;
      });
    } else if (sortMode.startsWith('year-')) {
      const year = parseInt(sortMode.split('-')[1]);
      filtered = filtered.filter((s) => s.year === year);
      filtered.sort((a, b) => {
        const avgA = a.ratings.length ? a.ratings.reduce((s, r) => s + r.stars, 0) / a.ratings.length : 0;
        const avgB = b.ratings.length ? b.ratings.reduce((s, r) => s + r.stars, 0) / b.ratings.length : 0;
        return avgB - avgA || a.country.localeCompare(b.country);
      });
    } else {
      filtered.sort((a, b) => a.country.localeCompare(b.country));
    }

    setSongs(filtered);
    if (filtered.length > 0 && (!currentSong || !filtered.find((s) => s.id === currentSong.id))) {
      setCurrentSong(filtered[0]);
    }
  }, [allSongs, sortMode, currentSong]);

  const currentIndex = currentSong ? songs.findIndex((s) => s.id === currentSong.id) : -1;

  const goNext = () => {
    if (currentIndex < songs.length - 1) setCurrentSong(songs[currentIndex + 1]);
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentSong(songs[currentIndex - 1]);
  };

  const getAvg = (s: Song) => s.ratings.length ? s.ratings.reduce((sum, r) => sum + r.stars, 0) / s.ratings.length : 0;

  return (
    <div className="space-y-6 pt-6">
      <div className="text-center py-4">
        <h1 className="text-4xl font-bold neon-text">📺 Watch Party</h1>
        <p className="text-white/50 mt-1">Watch the best entries — ranked by family favorites</p>
      </div>

      {/* Sort mode selector */}
      <div className="flex justify-center gap-2 flex-wrap">
        {([
          { key: 'top-rated' as SortMode, label: '⭐ Top Rated (All Time)', color: '#FFD700' },
          { key: 'year-2026' as SortMode, label: '2026', color: '#E91E8C' },
          { key: 'year-2025' as SortMode, label: '2025', color: '#7B2FBE' },
          { key: 'year-2024' as SortMode, label: '2024', color: '#1B8FE3' },
          { key: 'country' as SortMode, label: 'A-Z', color: '#6B7280' },
        ]).map((m) => (
          <button key={m.key} onClick={() => setSortMode(m.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              sortMode === m.key ? 'text-white scale-105' : 'bg-white/5 text-white/40 hover:text-white'
            }`}
            style={sortMode === m.key ? { background: `${m.color}30`, border: `1px solid ${m.color}50` } : {}}>
            {m.label}
          </button>
        ))}
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
                    <span className="text-white/30 text-sm ml-2">{currentSong.year}</span>
                  </h2>
                  <p className="text-white/60">
                    {currentSong.artist} — &ldquo;{currentSong.title}&rdquo;
                  </p>
                  {getAvg(currentSong) > 0 && (
                    <p className="text-eurovision-gold text-sm mt-1">⭐ {getAvg(currentSong).toFixed(1)} average rating</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
                    <input type="checkbox" checked={autoplay} onChange={(e) => setAutoplay(e.target.checked)} className="rounded" />
                    Autoplay
                  </label>
                  <button onClick={goPrev} disabled={currentIndex <= 0}
                    className="px-4 py-2 rounded-lg bg-white/10 text-white disabled:opacity-30 hover:bg-white/20 transition-all">
                    ← Prev
                  </button>
                  <span className="text-white/40 text-sm">{currentIndex + 1} / {songs.length}</span>
                  <button onClick={goNext} disabled={currentIndex >= songs.length - 1}
                    className="px-4 py-2 rounded-lg bg-white/10 text-white disabled:opacity-30 hover:bg-white/20 transition-all">
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
              {sortMode === 'top-rated' ? '⭐ Best of All Time' : sortMode.startsWith('year-') ? `${sortMode.split('-')[1]} Playlist` : 'All Songs'}
              <span className="text-white/30 ml-1">({songs.length})</span>
            </h3>
          </div>
          <div className="overflow-y-auto max-h-[600px] divide-y divide-white/5">
            {songs.map((song, idx) => {
              const avg = getAvg(song);
              return (
                <button
                  key={song.id}
                  onClick={() => { setCurrentSong(song); setAutoplay(true); }}
                  className={`w-full text-left p-3 flex items-center gap-3 hover:bg-white/5 transition-colors ${
                    currentSong?.id === song.id ? 'bg-white/10 border-l-2 border-eurovision-pink' : ''
                  }`}
                >
                  <span className="text-white/20 text-xs w-5 text-right">{idx + 1}</span>
                  <span className="text-lg">{getFlagEmoji(song.countryCode)}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm truncate">{song.country}</div>
                    <div className="text-white/40 text-xs truncate">{song.artist}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {avg > 0 && <div className="text-eurovision-gold text-xs font-bold">{avg.toFixed(1)}★</div>}
                    <div className="text-white/15 text-[10px]">{song.year}</div>
                  </div>
                  {currentSong?.id === song.id && (
                    <span className="text-eurovision-pink animate-pulse">♪</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
