'use client';

import { useState, useEffect, useCallback } from 'react';
import { getFlagEmoji } from '@/lib/flags';
import VideoPlayer from '@/components/VideoPlayer';

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
  year: number;
  youtubeVideoId: string | null;
  ratings: Rating[];
}

export default function LeaderboardPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [memberFilter, setMemberFilter] = useState<number | 'all'>('all');
  const [tab, setTab] = useState<'overall' | 'by-member' | 'activity' | 'cross-year'>('overall');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [availableYears, setAvailableYears] = useState<number[]>([2026]);
  const [watchVideo, setWatchVideo] = useState<{ videoId: string; title: string; country: string } | null>(null);

  const fetchData = useCallback(async () => {
    const params = new URLSearchParams();
    params.set('year', String(selectedYear));
    if (dateFrom) params.set('dateFrom', dateFrom);
    if (dateTo) params.set('dateTo', dateTo);
    if (memberFilter !== 'all') params.set('memberId', String(memberFilter));

    const [songsRes, membersRes, allRes] = await Promise.all([
      fetch(`/api/songs?${params}`),
      fetch('/api/members'),
      fetch('/api/songs'),
    ]);
    setSongs(await songsRes.json());
    setMembers(await membersRes.json());
    const all = await allRes.json();
    setAllSongs(all);
    const years = Array.from(new Set(all.map((s: Song) => s.year))).sort((a, b) => (b as number) - (a as number)) as number[];
    setAvailableYears(years);
  }, [dateFrom, dateTo, memberFilter, selectedYear]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const rankedSongs = songs
    .map((s) => ({
      ...s,
      avgRating: s.ratings.length
        ? s.ratings.reduce((sum, r) => sum + r.stars, 0) / s.ratings.length
        : 0,
      totalRatings: s.ratings.length,
    }))
    .sort((a, b) => b.avgRating - a.avgRating || b.totalRatings - a.totalRatings);

  const memberStats = members.map((m) => {
    const memberRatings = songs.flatMap((s) =>
      s.ratings.filter((r) => r.familyMember.id === m.id)
    );
    const avgGiven = memberRatings.length
      ? memberRatings.reduce((s, r) => s + r.stars, 0) / memberRatings.length
      : 0;
    const favorite = songs
      .map((s) => {
        const myRatings = s.ratings.filter((r) => r.familyMember.id === m.id);
        return {
          song: s,
          avg: myRatings.length ? myRatings.reduce((sum, r) => sum + r.stars, 0) / myRatings.length : 0,
        };
      })
      .filter((x) => x.avg > 0)
      .sort((a, b) => b.avg - a.avg)[0];

    return { member: m, totalRatings: memberRatings.length, avgGiven, favorite };
  });

  const allRatings = songs
    .flatMap((s) =>
      s.ratings.map((r) => ({ ...r, song: s }))
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="space-y-6 pt-6">
      <div className="text-center py-4">
        <h1 className="text-4xl font-bold neon-text">🏆 Leaderboard</h1>
        <p className="text-white/50 mt-1">See how the songs stack up</p>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-xs text-white/40 block mb-1">From</label>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-eurovision-pink [color-scheme:dark]" />
        </div>
        <div>
          <label className="text-xs text-white/40 block mb-1">To</label>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-eurovision-pink [color-scheme:dark]" />
        </div>
        <div>
          <label className="text-xs text-white/40 block mb-1">Member</label>
          <select value={memberFilter === 'all' ? 'all' : memberFilter}
            onChange={(e) => setMemberFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-eurovision-pink [&>option]:bg-gray-900">
            <option value="all">Everyone</option>
            {members.map((m) => (<option key={m.id} value={m.id}>{m.emoji} {m.name}</option>))}
          </select>
        </div>
      </div>

      {/* Year selector */}
      {availableYears.length > 1 && (
        <div className="flex gap-2 mb-4">
          {availableYears.map((year) => (
            <button key={year} onClick={() => setSelectedYear(year)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                selectedYear === year
                  ? 'bg-gradient-to-r from-eurovision-pink to-eurovision-purple text-white'
                  : 'bg-white/5 text-white/40 hover:text-white'
              }`}>{year}</button>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1">
        {[
          { key: 'overall' as const, label: 'Overall Rankings', icon: '📊' },
          { key: 'by-member' as const, label: 'By Family Member', icon: '👨‍👩‍👧‍👦' },
          { key: 'activity' as const, label: 'Recent Activity', icon: '📝' },
          ...(availableYears.length > 1 ? [{ key: 'cross-year' as const, label: 'Cross-Year', icon: '📈' }] : []),
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              tab === t.key
                ? 'bg-white/10 text-white'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Overall Rankings */}
      {tab === 'overall' && (
        <div className="glass-card overflow-hidden">
          {/* Top 3 podium */}
          {rankedSongs.filter(s => s.avgRating > 0).length >= 3 && (
            <div className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-b from-white/5 to-transparent">
              {[1, 0, 2].map((idx) => {
                const song = rankedSongs.filter(s => s.avgRating > 0)[idx];
                if (!song) return <div key={idx} />;
                return (
                  <div
                    key={song.id}
                    className={`text-center ${idx === 0 ? 'order-2 -mt-4' : idx === 1 ? 'order-1 mt-4' : 'order-3 mt-8'}`}
                  >
                    <div className="text-4xl mb-1">{medals[idx === 0 ? 0 : idx === 1 ? 1 : 2]}</div>
                    <div className="text-3xl mb-1">{getFlagEmoji(song.countryCode)}</div>
                    <div className="font-bold text-sm">{song.country}</div>
                    <div className="text-white/60 text-xs">{song.title}</div>
                    <div className="text-eurovision-gold font-bold mt-1">
                      {song.avgRating.toFixed(1)} ★
                    </div>
                    <div className="text-white/40 text-xs">{song.totalRatings} ratings</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/40 border-b border-white/10">
                  <th className="text-left py-3 px-4 font-medium">#</th>
                  <th className="text-left py-3 px-4 font-medium">Country</th>
                  <th className="text-left py-3 px-4 font-medium">Song</th>
                  <th className="text-left py-3 px-4 font-medium">Artist</th>
                  <th className="text-center py-3 px-4 font-medium">Avg Rating</th>
                  <th className="text-center py-3 px-4 font-medium">Total Ratings</th>
                  <th className="text-left py-3 px-4 font-medium">Rating Distribution</th>
                </tr>
              </thead>
              <tbody>
                {rankedSongs.map((song, idx) => {
                  const starCounts = [0, 0, 0, 0, 0];
                  song.ratings.forEach((r) => starCounts[r.stars - 1]++);
                  const maxCount = Math.max(...starCounts, 1);

                  return (
                    <tr
                      key={song.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className={idx < 3 && song.avgRating > 0 ? 'text-xl' : 'text-white/50'}>
                          {idx < 3 && song.avgRating > 0 ? medals[idx] : idx + 1}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="mr-2">{getFlagEmoji(song.countryCode)}</span>
                        <span className="font-medium">{song.country}</span>
                      </td>
                      <td className="py-3 px-4 text-white/80">{song.title}</td>
                      <td className="py-3 px-4 text-white/60">{song.artist}</td>
                      <td className="py-3 px-4 text-center">
                        {song.avgRating > 0 ? (
                          <span className="font-bold text-eurovision-gold">
                            {song.avgRating.toFixed(1)} ★
                          </span>
                        ) : (
                          <span className="text-white/20">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center text-white/60">{song.totalRatings}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-end gap-0.5 h-6">
                          {starCounts.map((count, i) => (
                            <div
                              key={i}
                              className="w-4 rounded-sm bg-gradient-to-t from-eurovision-pink to-eurovision-purple transition-all"
                              style={{ height: `${(count / maxCount) * 100}%`, minHeight: count > 0 ? '4px' : '0' }}
                              title={`${i + 1}★: ${count}`}
                            />
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* By Member */}
      {tab === 'by-member' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {memberStats.map(({ member, totalRatings, avgGiven, favorite }) => (
            <div key={member.id} className="glass-card p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{member.emoji}</span>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: member.color }}>{member.name}</h3>
                  <p className="text-white/40 text-sm">{totalRatings} ratings given</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-white/40 text-xs mb-1">Average Given</div>
                  <div className="text-xl font-bold text-eurovision-gold">
                    {avgGiven > 0 ? `${avgGiven.toFixed(1)} ★` : '—'}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-white/40 text-xs mb-1">Favorite</div>
                  <div className="text-lg font-bold">
                    {favorite ? (
                      <span>
                        {getFlagEmoji(favorite.song.countryCode)} {favorite.song.country}
                      </span>
                    ) : '—'}
                  </div>
                </div>
              </div>

              {/* This member's top 5 */}
              {totalRatings > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs text-white/40 uppercase tracking-wider mb-2">Top Songs</h4>
                  <div className="space-y-1.5">
                    {songs
                      .map((s) => {
                        const myRatings = s.ratings.filter((r) => r.familyMember.id === member.id);
                        return {
                          song: s,
                          avg: myRatings.length ? myRatings.reduce((sum, r) => sum + r.stars, 0) / myRatings.length : 0,
                          count: myRatings.length,
                        };
                      })
                      .filter((x) => x.avg > 0)
                      .sort((a, b) => b.avg - a.avg)
                      .slice(0, 5)
                      .map(({ song, avg, count }, i) => (
                        <div key={song.id} className="flex items-center justify-between text-sm">
                          <span>
                            <span className="text-white/30 mr-2">{i + 1}.</span>
                            {getFlagEmoji(song.countryCode)} {song.country}
                          </span>
                          <span className="text-eurovision-gold">
                            {avg.toFixed(1)} ★ <span className="text-white/30">({count})</span>
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Recent Activity */}
      {tab === 'activity' && (
        <div className="glass-card overflow-hidden">
          <div className="divide-y divide-white/5">
            {allRatings.length === 0 ? (
              <div className="p-8 text-center text-white/40">No ratings yet. Start rating some songs!</div>
            ) : (
              allRatings.slice(0, 50).map((r) => (
                <div key={r.id} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                  <span className="text-2xl">{r.familyMember.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium" style={{ color: r.familyMember.color }}>
                        {r.familyMember.name}
                      </span>
                      <span className="text-white/30">rated</span>
                      <span>{getFlagEmoji(r.song.countryCode)}</span>
                      <span className="font-medium">{r.song.country}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-eurovision-gold font-bold">{r.stars} ★</div>
                    <div className="text-white/30 text-xs">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {/* Cross-Year Comparison */}
      {tab === 'cross-year' && (
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-bold">📈 Country Ratings Across Years</h3>
            <p className="text-white/40 text-xs mt-1">See how countries performed in your family&apos;s ratings over time</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/40 border-b border-white/10">
                  <th className="text-left py-3 px-4 font-medium">Country</th>
                  {availableYears.map((y) => (
                    <th key={y} className="text-center py-3 px-4 font-medium">{y}</th>
                  ))}
                  <th className="text-center py-3 px-4 font-medium">Avg</th>
                  <th className="text-center py-3 px-4 font-medium">Trend</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  // Get all countries that appear in any year
                  const countryData: Record<string, { code: string; years: Record<number, { avg: number; count: number; artist: string; title: string; videoId: string | null }> }> = {};

                  allSongs.forEach((s) => {
                    if (!countryData[s.country]) countryData[s.country] = { code: s.countryCode, years: {} };
                    const avg = s.ratings.length ? s.ratings.reduce((sum, r) => sum + r.stars, 0) / s.ratings.length : 0;
                    countryData[s.country].years[s.year] = { avg, count: s.ratings.length, artist: s.artist, title: s.title, videoId: s.youtubeVideoId };
                  });

                  // Sort alphabetically by country for clarity
                  const sorted = Object.entries(countryData)
                    .map(([country, data]) => {
                      const yearAvgs = Object.values(data.years).filter((y) => y.count > 0).map((y) => y.avg);
                      const overallAvg = yearAvgs.length > 0 ? yearAvgs.reduce((s, v) => s + v, 0) / yearAvgs.length : 0;
                      return { country, ...data, overallAvg };
                    })
                    .sort((a, b) => b.overallAvg - a.overallAvg || a.country.localeCompare(b.country));

                  return sorted.map((c) => {
                    // Trend: compare most recent year with ratings to the year before it
                    const sortedYears = availableYears.slice().sort((a, b) => a - b); // oldest first
                    const ratedYears = sortedYears.filter((y) => c.years[y]?.count > 0);
                    let trend = 0;
                    if (ratedYears.length >= 2) {
                      const latest = c.years[ratedYears[ratedYears.length - 1]].avg;
                      const previous = c.years[ratedYears[ratedYears.length - 2]].avg;
                      trend = latest - previous;
                    }

                    return (
                      <tr key={c.country} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4">
                          <span className="mr-2">{getFlagEmoji(c.code)}</span>
                          <span className="font-medium">{c.country}</span>
                        </td>
                        {availableYears.map((y) => {
                          const yearData = c.years[y];
                          const participated = !!yearData; // has an entry for this year
                          const rated = yearData && yearData.count > 0;
                          return (
                            <td key={y} className="text-center py-3 px-4">
                              {rated ? (
                                <div className={yearData.videoId ? 'cursor-pointer hover:scale-105 transition-transform' : ''}
                                  onClick={() => yearData.videoId && setWatchVideo({ videoId: yearData.videoId, title: `${yearData.artist} - ${yearData.title}`, country: `${c.country} ${y}` })}>
                                  <span className="font-bold text-eurovision-gold">{yearData.avg.toFixed(1)} ★</span>
                                  {yearData.videoId && <span className="text-white/15 text-[9px] ml-1">▶</span>}
                                  <div className="text-[9px] text-white/25 mt-0.5 truncate max-w-[100px]">{yearData.artist}</div>
                                </div>
                              ) : participated ? (
                                <div className={yearData.videoId ? 'cursor-pointer hover:scale-105 transition-transform' : ''}
                                  onClick={() => yearData.videoId && setWatchVideo({ videoId: yearData.videoId, title: `${yearData.artist} - ${yearData.title}`, country: `${c.country} ${y}` })}>
                                  <span className="text-white/20">Not rated</span>
                                  {yearData.videoId && <span className="text-white/15 text-[9px] ml-1">▶</span>}
                                  <div className="text-[9px] text-white/15 mt-0.5 truncate max-w-[100px]">{yearData.artist}</div>
                                </div>
                              ) : (
                                <span className="text-white/10 text-xs italic">NP</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="text-center py-3 px-4">
                          {c.overallAvg > 0 ? (
                            <span className="font-bold text-white/60">{c.overallAvg.toFixed(1)}</span>
                          ) : (
                            <span className="text-white/15">—</span>
                          )}
                        </td>
                        <td className="text-center py-3 px-4">
                          {ratedYears.length >= 2 ? (
                            trend > 0.3 ? <span className="text-green-400 font-bold">↑ +{trend.toFixed(1)}</span> :
                            trend < -0.3 ? <span className="text-red-400 font-bold">↓ {trend.toFixed(1)}</span> :
                            <span className="text-white/20">→</span>
                          ) : (
                            <span className="text-white/10">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
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
