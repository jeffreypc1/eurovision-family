'use client';

import { useState, useEffect, useCallback } from 'react';
import { getFlagEmoji } from '@/lib/flags';

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

export default function CommentsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [expandedSong, setExpandedSong] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    const [songsRes, membersRes] = await Promise.all([
      fetch('/api/songs'),
      fetch('/api/members'),
    ]);
    setSongs(await songsRes.json());
    setMembers(await membersRes.json());
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddComment = async (songId: number) => {
    if (!selectedMemberId || !newComment.trim()) return;
    setSubmitting(true);

    await fetch('/api/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        songId,
        familyMemberId: selectedMemberId,
        stars: 0,
        comment: newComment.trim(),
      }),
    });

    setNewComment('');
    setSubmitting(false);
    fetchData();
  };

  // Songs sorted by country, only show songs that have comments OR are expanded
  const songsWithComments = songs.filter(
    (s) => s.ratings.some((r) => r.comment) || s.id === expandedSong
  );

  const songsWithoutComments = songs.filter(
    (s) => !s.ratings.some((r) => r.comment) && s.id !== expandedSong
  );

  return (
    <div className="space-y-6 pt-6 max-w-4xl mx-auto">
      <div className="text-center py-4">
        <h1 className="text-4xl font-bold neon-text">💬 Comments</h1>
        <p className="text-white/50 mt-1">What does the family think?</p>
      </div>

      {/* Member selector */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-medium text-white/60 mb-3 uppercase tracking-wider">Commenting as</h3>
        <div className="flex flex-wrap gap-2">
          {members.map((member) => (
            <button
              key={member.id}
              onClick={() => setSelectedMemberId(member.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedMemberId === member.id
                  ? 'scale-105'
                  : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: `${member.color}20`,
                border: `2px solid ${selectedMemberId === member.id ? member.color : 'transparent'}`,
              }}
            >
              <span>{member.emoji}</span>
              <span>{member.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Songs with comments */}
      <div className="space-y-4">
        {songsWithComments.map((song) => {
          const comments = song.ratings.filter((r) => r.comment);
          const avgRating = song.ratings.length
            ? song.ratings.reduce((sum, r) => sum + r.stars, 0) / song.ratings.length
            : 0;

          return (
            <div key={song.id} className="glass-card overflow-hidden">
              {/* Song header */}
              <div className="flex items-center gap-4 p-4 border-b border-white/10">
                {song.youtubeVideoId && (
                  <img
                    src={`https://img.youtube.com/vi/${song.youtubeVideoId}/default.jpg`}
                    alt=""
                    className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getFlagEmoji(song.countryCode)}</span>
                    <h3 className="font-bold">{song.country}</h3>
                    {avgRating > 0 && (
                      <span className="text-sm text-eurovision-gold">
                        {avgRating.toFixed(1)} ⭐
                      </span>
                    )}
                  </div>
                  <p className="text-white/50 text-sm truncate">
                    {song.artist} — &ldquo;{song.title}&rdquo;
                  </p>
                </div>
                <span className="text-white/30 text-sm">{comments.length} comment{comments.length !== 1 ? 's' : ''}</span>
              </div>

              {/* Comments */}
              <div className="divide-y divide-white/5">
                {comments.map((r) => (
                  <div key={r.id} className="flex gap-3 p-4">
                    <span className="text-2xl flex-shrink-0">{r.familyMember.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm" style={{ color: r.familyMember.color }}>
                          {r.familyMember.name}
                        </span>
                        {r.stars > 0 && (
                          <span className="text-xs text-white/40">
                            {'⭐'.repeat(r.stars)}
                          </span>
                        )}
                        <span className="text-xs text-white/20">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-white/80 text-sm mt-1">{r.comment}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add comment */}
              {selectedMemberId && (
                <div className="p-4 bg-white/[0.02] border-t border-white/10">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={expandedSong === song.id ? newComment : ''}
                      onFocus={() => setExpandedSong(song.id)}
                      onChange={(e) => {
                        setExpandedSong(song.id);
                        setNewComment(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newComment.trim()) {
                          handleAddComment(song.id);
                        }
                      }}
                      placeholder="Add a comment..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-eurovision-pink"
                    />
                    <button
                      onClick={() => handleAddComment(song.id)}
                      disabled={submitting || !newComment.trim() || expandedSong !== song.id}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-eurovision-pink to-eurovision-purple text-white text-sm font-medium hover:opacity-90 disabled:opacity-30 transition-all"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Songs without comments - compact list to add */}
      {songsWithoutComments.length > 0 && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider">
              No comments yet — be the first!
            </h3>
          </div>
          <div className="divide-y divide-white/5">
            {songsWithoutComments.map((song) => (
              <button
                key={song.id}
                onClick={() => setExpandedSong(song.id)}
                className="w-full text-left p-3 flex items-center gap-3 hover:bg-white/5 transition-colors"
              >
                <span className="text-lg">{getFlagEmoji(song.countryCode)}</span>
                <span className="font-medium text-sm">{song.country}</span>
                <span className="text-white/30 text-xs truncate">
                  {song.artist} — &ldquo;{song.title}&rdquo;
                </span>
                <span className="ml-auto text-white/20 text-xs">+ comment</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
