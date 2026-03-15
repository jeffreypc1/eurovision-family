'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getFlagEmoji } from '@/lib/flags';

interface Rating { stars: number; }
interface Song {
  id: number; country: string; countryCode: string; artist: string;
  title: string; year: number; youtubeVideoId: string | null; ratings: Rating[];
}

type SortMode = 'top-rated' | 'year-2026' | 'year-2025' | 'year-2024' | 'country';

export default function WatchPartyPage() {
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('top-rated');
  const [topN, setTopN] = useState(0); // 0 = all
  const [countdownMode, setCountdownMode] = useState(false); // true = reverse order, #1 is finale
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/songs').then((r) => r.json()).then((data: Song[]) => {
      setAllSongs(data.filter((s) => s.youtubeVideoId));
    });
  }, []);

  const getAvg = useCallback((s: Song) => s.ratings.length ? s.ratings.reduce((sum, r) => sum + r.stars, 0) / s.ratings.length : 0, []);

  // Sort, filter, and optionally reverse
  useEffect(() => {
    let filtered = [...allSongs];

    if (sortMode === 'top-rated') {
      filtered.sort((a, b) => getAvg(b) - getAvg(a));
    } else if (sortMode.startsWith('year-')) {
      const year = parseInt(sortMode.split('-')[1]);
      filtered = filtered.filter((s) => s.year === year);
      filtered.sort((a, b) => getAvg(b) - getAvg(a) || a.country.localeCompare(b.country));
    } else {
      filtered.sort((a, b) => a.country.localeCompare(b.country));
    }

    // Apply Top N
    if (topN > 0 && topN < filtered.length) {
      filtered = filtered.slice(0, topN);
    }

    // Countdown mode: reverse so #1 plays last (finale)
    if (countdownMode && filtered.length > 1) {
      filtered = [...filtered].reverse();
    }

    setSongs(filtered);
    if (filtered.length > 0 && (!currentSong || !filtered.find((s) => s.id === currentSong.id))) {
      setCurrentSong(filtered[0]);
    }
  }, [allSongs, sortMode, topN, countdownMode, getAvg, currentSong]);

  const currentIndex = currentSong ? songs.findIndex((s) => s.id === currentSong.id) : -1;

  // Countdown position: if countdown mode, show what place this is
  const getCountdownLabel = (idx: number) => {
    if (!countdownMode) return `#${idx + 1}`;
    return `#${songs.length - idx}`;
  };

  const goNext = useCallback(() => {
    if (currentIndex < songs.length - 1) setCurrentSong(songs[currentIndex + 1]);
  }, [currentIndex, songs]);

  const goPrev = () => {
    if (currentIndex > 0) setCurrentSong(songs[currentIndex - 1]);
  };

  // YouTube IFrame API for auto-advance
  useEffect(() => {
    if (!currentSong?.youtubeVideoId) return;

    const loadAPI = () => new Promise<void>((resolve) => {
      if (window.YT?.Player) { resolve(); return; }
      const existing = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
      if (!existing) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }
      const check = setInterval(() => { if (window.YT?.Player) { clearInterval(check); resolve(); } }, 100);
    });

    loadAPI().then(() => {
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch {}
      }
      playerRef.current = new window.YT.Player('yt-watch-player', {
        videoId: currentSong.youtubeVideoId!,
        playerVars: { rel: 0, autoplay: 1 },
        events: {
          onReady: () => setPlayerReady(true),
          onStateChange: (e: YT.OnStateChangeEvent) => {
            // Video ended (state 0)
            if (e.data === 0 && autoAdvance) {
              goNext();
            }
          },
        },
      });
    });

    return () => {
      if (playerRef.current) { try { playerRef.current.destroy(); } catch {} playerRef.current = null; }
    };
  }, [currentSong?.youtubeVideoId, currentSong?.id]);  // eslint-disable-line react-hooks/exhaustive-deps

  const isFinale = countdownMode && currentIndex === songs.length - 1;

  return (
    <div className="space-y-6 pt-6">
      <div className="text-center py-4">
        <h1 className="text-4xl font-bold neon-text">📺 Watch Party</h1>
        <p className="text-white/50 mt-1">Watch the best entries — ranked by family favorites</p>
      </div>

      {/* Controls bar */}
      <div className="flex justify-center gap-2 flex-wrap items-center">
        {([
          { key: 'top-rated' as SortMode, label: '⭐ Top Rated', color: '#FFD700' },
          { key: 'year-2026' as SortMode, label: '2026', color: '#E91E8C' },
          { key: 'year-2025' as SortMode, label: '2025', color: '#7B2FBE' },
          { key: 'year-2024' as SortMode, label: '2024', color: '#1B8FE3' },
          { key: 'country' as SortMode, label: 'A-Z', color: '#6B7280' },
        ]).map((m) => (
          <button key={m.key} onClick={() => setSortMode(m.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              sortMode === m.key ? 'text-white scale-105' : 'bg-white/5 text-white/40 hover:text-white'}`}
            style={sortMode === m.key ? { background: `${m.color}30`, border: `1px solid ${m.color}50` } : {}}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Top N + Countdown controls */}
      <div className="flex justify-center gap-4 items-center flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-white/40 text-sm">Top</span>
          <input type="number" min="0" max={allSongs.length} value={topN || ''} placeholder="All"
            onChange={(e) => setTopN(parseInt(e.target.value) || 0)}
            className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white text-center focus:outline-none focus:border-eurovision-pink" />
          <span className="text-white/25 text-sm">songs</span>
        </div>

        <button onClick={() => setCountdownMode(!countdownMode)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            countdownMode ? 'bg-eurovision-pink/20 text-eurovision-pink border border-eurovision-pink/30' : 'bg-white/5 text-white/40'}`}>
          {countdownMode ? '🔥 Countdown Mode ON' : '🔢 Countdown Mode'}
        </button>

        <label className="flex items-center gap-2 text-sm text-white/40 cursor-pointer">
          <input type="checkbox" checked={autoAdvance} onChange={(e) => setAutoAdvance(e.target.checked)} className="rounded" />
          Auto-advance
        </label>
      </div>

      {/* Countdown mode explanation */}
      {countdownMode && topN > 0 && (
        <div className="text-center">
          <p className="text-eurovision-pink/60 text-sm">
            🔥 Playing Top {topN} in reverse — #{topN} first, building up to the #1 finale!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Video player */}
        <div className="lg:col-span-3">
          {currentSong?.youtubeVideoId ? (
            <div>
              {/* Finale banner */}
              {isFinale && (
                <div className="text-center mb-4 py-3 px-6 bg-gradient-to-r from-eurovision-pink/20 via-eurovision-purple/20 to-eurovision-pink/20 rounded-xl border border-eurovision-pink/30 animate-pulse">
                  <span className="text-2xl mr-2">🏆</span>
                  <span className="text-eurovision-gold font-bold text-lg">THE #1 FINALE!</span>
                  <span className="text-2xl ml-2">🏆</span>
                </div>
              )}

              <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <div id="yt-watch-player" className="absolute inset-0 w-full h-full" />
              </div>

              <div className="flex items-center justify-between mt-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                      isFinale ? 'bg-eurovision-gold/20 text-eurovision-gold' : 'bg-white/10 text-white/50'}`}>
                      {getCountdownLabel(currentIndex)}
                    </span>
                    <h2 className="text-2xl font-bold">
                      {getFlagEmoji(currentSong.countryCode)} {currentSong.country}
                      <span className="text-white/30 text-sm ml-2">{currentSong.year}</span>
                    </h2>
                  </div>
                  <p className="text-white/60 mt-1">
                    {currentSong.artist} — &ldquo;{currentSong.title}&rdquo;
                  </p>
                  {getAvg(currentSong) > 0 && (
                    <p className="text-eurovision-gold text-sm mt-1">⭐ {getAvg(currentSong).toFixed(1)} average</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={goPrev} disabled={currentIndex <= 0}
                    className="px-4 py-2 rounded-lg bg-white/10 text-white disabled:opacity-30 hover:bg-white/20 transition-all">← Prev</button>
                  <span className="text-white/40 text-sm">{currentIndex + 1} / {songs.length}</span>
                  <button onClick={goNext} disabled={currentIndex >= songs.length - 1}
                    className="px-4 py-2 rounded-lg bg-white/10 text-white disabled:opacity-30 hover:bg-white/20 transition-all">Next →</button>
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
        <div className="glass-card overflow-hidden" ref={containerRef}>
          <div className="p-3 border-b border-white/10">
            <h3 className="font-medium text-sm text-white/60 uppercase tracking-wider">
              {countdownMode ? '🔥 Countdown' : '⭐ Playlist'}
              <span className="text-white/30 ml-1">({songs.length})</span>
            </h3>
          </div>
          <div className="overflow-y-auto max-h-[600px] divide-y divide-white/5">
            {songs.map((song, idx) => {
              const avg = getAvg(song);
              const isActive = currentSong?.id === song.id;
              const isFinaleSong = countdownMode && idx === songs.length - 1;

              return (
                <button key={song.id}
                  onClick={() => setCurrentSong(song)}
                  className={`w-full text-left p-3 flex items-center gap-3 hover:bg-white/5 transition-colors ${
                    isActive ? 'bg-white/10 border-l-2 border-eurovision-pink' : ''
                  } ${isFinaleSong ? 'bg-eurovision-gold/5' : ''}`}>
                  <span className={`text-xs w-6 text-right font-bold ${
                    isFinaleSong ? 'text-eurovision-gold' : 'text-white/20'}`}>
                    {getCountdownLabel(idx)}
                  </span>
                  <span className="text-lg">{getFlagEmoji(song.countryCode)}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm truncate">
                      {song.country}
                      {isFinaleSong && <span className="ml-1 text-eurovision-gold">🏆</span>}
                    </div>
                    <div className="text-white/40 text-xs truncate">{song.artist}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {avg > 0 && <div className="text-eurovision-gold text-xs font-bold">{avg.toFixed(1)}★</div>}
                    <div className="text-white/15 text-[10px]">{song.year}</div>
                  </div>
                  {isActive && <span className="text-eurovision-pink animate-pulse">♪</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
