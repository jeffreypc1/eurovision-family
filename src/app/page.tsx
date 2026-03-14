'use client';

import { useState, useEffect, useCallback } from 'react';
import SongCard from '@/components/SongCard';
import MemberSelector from '@/components/MemberSelector';
import FilterBar from '@/components/FilterBar';
import VideoPlayer from '@/components/VideoPlayer';
import confetti from 'canvas-confetti';

interface FamilyMember {
  id: number;
  name: string;
  emoji: string;
  color: string;
}

interface Rating {
  id: number;
  stars: number;
  comment: string | null;
  createdAt: string;
  familyMember: FamilyMember;
}

interface Song {
  id: number;
  country: string;
  countryCode: string;
  artist: string;
  title: string;
  youtubeVideoId: string | null;
  ratings: Rating[];
}

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [memberFilter, setMemberFilter] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'country' | 'rating' | 'recent'>('country');
  const [watchVideo, setWatchVideo] = useState<{ videoId: string; title: string; country: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSongs = useCallback(async () => {
    const params = new URLSearchParams();
    if (dateFrom) params.set('dateFrom', dateFrom);
    if (dateTo) params.set('dateTo', dateTo);
    if (memberFilter !== 'all') params.set('memberId', String(memberFilter));
    const res = await fetch(`/api/songs?${params}`);
    const data = await res.json();
    setSongs(data);
    setLoading(false);
  }, [dateFrom, dateTo, memberFilter]);

  const fetchMembers = async () => {
    const res = await fetch('/api/members');
    const data = await res.json();
    setMembers(data);
  };

  useEffect(() => {
    fetchMembers();
    fetchSongs();
  }, [fetchSongs]);

  const handleRate = async (songId: number, stars: number, comment: string) => {
    if (!selectedMemberId) return;

    await fetch('/api/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ songId, familyMemberId: selectedMemberId, stars, comment }),
    });

    // Confetti for 5-star ratings!
    if (stars === 5) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E91E8C', '#7B2FBE', '#FFD700', '#1B3F8B', '#2ECC71'],
      });
    }

    fetchSongs();
  };

  const handleAddMember = async (name: string, emoji: string, color: string) => {
    const res = await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, emoji, color }),
    });
    const newMember = await res.json();
    setMembers((prev) => [...prev, newMember]);
    setSelectedMemberId(newMember.id);
  };

  const sortedSongs = [...songs].sort((a, b) => {
    if (sortBy === 'country') return a.country.localeCompare(b.country);
    if (sortBy === 'rating') {
      const avgA = a.ratings.length ? a.ratings.reduce((s, r) => s + r.stars, 0) / a.ratings.length : 0;
      const avgB = b.ratings.length ? b.ratings.reduce((s, r) => s + r.stars, 0) / b.ratings.length : 0;
      return avgB - avgA;
    }
    if (sortBy === 'recent') {
      const latestA = a.ratings.length ? new Date(a.ratings[a.ratings.length - 1].createdAt).getTime() : 0;
      const latestB = b.ratings.length ? new Date(b.ratings[b.ratings.length - 1].createdAt).getTime() : 0;
      return latestB - latestA;
    }
    return 0;
  });

  return (
    <div className="space-y-6 pt-6">
      {/* Hero */}
      <div className="text-center py-8">
        <h1 className="text-5xl font-bold neon-text mb-2">
          Eurovision 2026
        </h1>
        <p className="text-white/50 text-lg">Basel, Switzerland</p>
        <div className="flex justify-center gap-2 mt-3 text-2xl animate-float">
          <span>🇨🇭</span>
          <span>✨</span>
          <span>🎤</span>
          <span>✨</span>
          <span>🇨🇭</span>
        </div>
      </div>

      {/* Member selector */}
      <MemberSelector
        members={members}
        selectedId={selectedMemberId}
        onSelect={setSelectedMemberId}
        onAddMember={handleAddMember}
      />

      {/* Filters */}
      <FilterBar
        dateFrom={dateFrom}
        dateTo={dateTo}
        memberFilter={memberFilter}
        sortBy={sortBy}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onMemberFilterChange={setMemberFilter}
        onSortByChange={setSortBy}
        members={members}
      />

      {/* Song grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="text-4xl animate-spin">🎵</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedSongs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              selectedMemberId={selectedMemberId}
              onRate={handleRate}
              onWatch={(videoId, title, country) =>
                setWatchVideo({ videoId, title, country })
              }
            />
          ))}
        </div>
      )}

      {/* Stats bar */}
      {!loading && (
        <div className="glass-card p-4 flex flex-wrap gap-6 justify-center text-sm text-white/60">
          <span><strong className="text-white">{songs.length}</strong> songs</span>
          <span><strong className="text-white">{songs.reduce((s, song) => s + song.ratings.length, 0)}</strong> total ratings</span>
          <span><strong className="text-white">{members.length}</strong> family members</span>
          {songs.length > 0 && (
            <span>
              <strong className="text-eurovision-gold">
                {(() => {
                  const rated = songs.filter(s => s.ratings.length > 0)
                    .map(s => ({
                      country: s.country,
                      avg: s.ratings.reduce((sum, r) => sum + r.stars, 0) / s.ratings.length,
                    }))
                    .sort((a, b) => b.avg - a.avg);
                  return rated.length ? `${rated[0].country} (${rated[0].avg.toFixed(1)}★)` : 'No ratings yet';
                })()}
              </strong> leading
            </span>
          )}
        </div>
      )}

      {/* Video player modal */}
      {watchVideo && (
        <VideoPlayer
          videoId={watchVideo.videoId}
          songTitle={watchVideo.title}
          country={watchVideo.country}
          onClose={() => setWatchVideo(null)}
        />
      )}
    </div>
  );
}
