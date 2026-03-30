'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSessionUser } from '@/hooks/useSessionUser';
import Link from 'next/link';
import Image from 'next/image';

interface LeaderboardEntry {
  rank: number;
  id: string;
  user1: { id: string; displayName: string; profilePhotoUrl: string };
  user2: { id: string; displayName: string; profilePhotoUrl: string };
  compatibilityScore: number;
  voteCount: number;
}

type Period = 'today' | 'week' | 'alltime';

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>('alltime');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userBestRank, setUserBestRank] = useState<{ rank: number; voteCount: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const { user } = useSessionUser();
  const instagramId = user?.instagramId ?? '';

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const url = `/api/leaderboard?period=${period}${instagramId ? `&instagramId=${instagramId}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      setLeaderboard(data.leaderboard || []);
      setUserBestRank(data.userBestRank || null);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setLoading(false);
    }
  }, [period, instagramId]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Auto-refresh every 60 seconds for the today tab
  useEffect(() => {
    if (period !== 'today') return;
    const interval = setInterval(fetchLeaderboard, 60_000);
    return () => clearInterval(interval);
  }, [period, fetchLeaderboard]);

  const medalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-rose-100 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/feed" className="text-gray-500 hover:text-gray-700">← Feed</Link>
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">
            🏆 Leaderboard
          </h1>
          <div className="w-12" />
        </div>
      </header>

      {/* Period tabs */}
      <div className="max-w-2xl mx-auto px-4 pt-4">
        <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-gray-100">
          {(['today', 'week', 'alltime'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
                period === p
                  ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {p === 'today' ? 'Today' : p === 'week' ? 'This Week' : 'All Time'}
            </button>
          ))}
        </div>

        {period === 'today' && (
          <p className="text-xs text-gray-400 text-center mt-2">Auto-refreshes every 60 seconds</p>
        )}
      </div>

      {/* User rank banner */}
      {userBestRank && (
        <div className="max-w-2xl mx-auto px-4 mt-4">
          <div className="bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-2xl p-4 text-center">
            <p className="text-sm font-medium">Your best rank this period</p>
            <p className="text-3xl font-bold">#{userBestRank.rank}</p>
            <p className="text-sm opacity-80">{userBestRank.voteCount} votes</p>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🏆</div>
            <p className="text-gray-500">No votes yet for this period.</p>
          </div>
        ) : (
          leaderboard.map((entry) => (
            <div
              key={entry.id}
              className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${
                entry.rank <= 3 ? 'border-yellow-200' : 'border-gray-100'
              }`}
            >
              <div className="p-4 flex items-center gap-4">
                <div className="w-10 text-center">
                  {medalEmoji(entry.rank) ? (
                    <span className="text-2xl">{medalEmoji(entry.rank)}</span>
                  ) : (
                    <span className="text-lg font-bold text-gray-400">#{entry.rank}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <Image
                    src={entry.user1.profilePhotoUrl || '/placeholder-avatar.png'}
                    alt={entry.user1.displayName}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-avatar.png'; }}
                  />
                  <span className="text-rose-400">💕</span>
                  <Image
                    src={entry.user2.profilePhotoUrl || '/placeholder-avatar.png'}
                    alt={entry.user2.displayName}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-avatar.png'; }}
                  />
                  <div className="ml-1">
                    <p className="font-medium text-gray-800 text-sm">
                      {entry.user1.displayName} &amp; {entry.user2.displayName}
                    </p>
                    <p className="text-xs text-gray-400">{entry.compatibilityScore}% compatible</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{entry.voteCount}</p>
                  <p className="text-xs text-gray-400">votes</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
