'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSessionUser } from '@/hooks/useSessionUser';
import Link from 'next/link';
import Image from 'next/image';

interface CoupleCard {
  id: string;
  user1: { id: string; displayName: string; profilePhotoUrl: string; instagramId: string };
  user2: { id: string; displayName: string; profilePhotoUrl: string; instagramId: string };
  compatibilityScore: number;
  totalVotes: number;
  hasVoted: boolean;
  isCurrentUserCouple: boolean;
}

type Filter = 'all' | 'wwomen' | 'mmen' | 'mwomen';

const FILTER_LABELS: Record<Filter, string> = {
  all: 'All Couples',
  wwomen: '👩‍❤️‍👩 Women',
  mmen: '👨‍❤️‍👨 Men',
  mwomen: '👫 Mixed',
};

export default function FeedPage() {
  const [couples, setCouples] = useState<CoupleCard[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [votingId, setVotingId] = useState<string | null>(null);
  const [reportingId, setReportingId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // In a real app, instagramId comes from session
  const { user } = useSessionUser();
  const instagramId = user?.instagramId ?? '';

  const fetchCouples = useCallback(async (pageNum: number, filterVal: Filter, reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const url = `/api/feed?page=${pageNum}&filter=${filterVal}${instagramId ? `&instagramId=${instagramId}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      if (reset) {
        setCouples(data.couples || []);
      } else {
        setCouples((prev) => [...prev, ...(data.couples || [])]);
      }
      setHasMore(data.hasMore);
    } catch (err) {
      console.error('Failed to fetch feed:', err);
    } finally {
      setLoading(false);
    }
  }, [instagramId, loading]);

  useEffect(() => {
    setPage(1);
    fetchCouples(1, filter, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchCouples(nextPage, filter);
        }
      },
      { threshold: 0.5 }
    );
    if (bottomRef.current) observerRef.current.observe(bottomRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, page, filter, fetchCouples]);

  async function handleVote(coupleId: string) {
    if (!instagramId) return;
    setVotingId(coupleId);
    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instagramId, coupleId }),
      });
      const data = await res.json();
      if (res.ok) {
        setCouples((prev) =>
          prev.map((c) =>
            c.id === coupleId ? { ...c, hasVoted: true, totalVotes: data.totalVotes } : c
          )
        );
      }
    } catch (err) {
      console.error('Vote failed:', err);
    } finally {
      setVotingId(null);
    }
  }

  async function handleReport() {
    if (!reportingId || !reportReason || !instagramId) return;
    try {
      await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instagramId, coupleId: reportingId, reason: reportReason }),
      });
      setReportingId(null);
      setReportReason('');
    } catch (err) {
      console.error('Report failed:', err);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-rose-100 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">
            💑 CoupleUp
          </Link>
          <nav className="flex gap-3">
            <Link href="/leaderboard" className="text-sm text-gray-600 hover:text-rose-500 transition-colors">🏆</Link>
            <Link href="/my-couples" className="text-sm text-gray-600 hover:text-rose-500 transition-colors">👤</Link>
            <Link href="/settings" className="text-sm text-gray-600 hover:text-rose-500 transition-colors">⚙️</Link>
          </nav>
        </div>
      </header>

      {/* Filter tabs */}
      <div className="sticky top-[57px] z-10 bg-white/80 backdrop-blur-md border-b border-rose-100">
        <div className="max-w-2xl mx-auto flex overflow-x-auto px-4 py-2 gap-2">
          {(Object.keys(FILTER_LABELS) as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-rose-300'
              }`}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {couples.map((couple) => (
          <div
            key={couple.id}
            className={`bg-white rounded-3xl shadow-sm border ${
              couple.isCurrentUserCouple ? 'border-rose-300 ring-2 ring-rose-200' : 'border-gray-100'
            } overflow-hidden`}
          >
            {couple.isCurrentUserCouple && (
              <div className="bg-gradient-to-r from-rose-500 to-purple-600 text-white text-xs font-medium px-4 py-1.5 text-center">
                ✨ This is your couple!
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Image
                      src={couple.user1.profilePhotoUrl || '/placeholder-avatar.png'}
                      alt={couple.user1.displayName}
                      width={56}
                      height={56}
                      className="rounded-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-avatar.png'; }}
                    />
                  </div>
                  <div className="text-2xl font-bold text-rose-400">💕</div>
                  <div className="relative">
                    <Image
                      src={couple.user2.profilePhotoUrl || '/placeholder-avatar.png'}
                      alt={couple.user2.displayName}
                      width={56}
                      height={56}
                      className="rounded-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-avatar.png'; }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">
                    {couple.compatibilityScore}%
                  </div>
                  <div className="text-xs text-gray-400">compatibility</div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div>
                  <p className="font-semibold text-gray-800">{couple.user1.displayName}</p>
                </div>
                <div className="text-gray-400">&amp;</div>
                <div>
                  <p className="font-semibold text-gray-800">{couple.user2.displayName}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  ❤️ {couple.totalVotes} {couple.totalVotes === 1 ? 'vote' : 'votes'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setReportingId(couple.id)}
                    className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-100 transition-all"
                    aria-label="Report this couple"
                  >
                    ⚑ Report
                  </button>
                  {!couple.isCurrentUserCouple && (
                    <button
                      onClick={() => handleVote(couple.id)}
                      disabled={couple.hasVoted || votingId === couple.id}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                        couple.hasVoted
                          ? 'bg-rose-100 text-rose-500 cursor-default'
                          : 'bg-gradient-to-r from-rose-500 to-purple-600 text-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'
                      } disabled:opacity-60`}
                      aria-label={couple.hasVoted ? 'Already voted' : 'Vote for this couple'}
                    >
                      {couple.hasVoted ? '✓ Voted' : votingId === couple.id ? '...' : '❤️ Vote'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
          </div>
        )}

        {!hasMore && couples.length > 0 && (
          <p className="text-center text-gray-400 text-sm py-4">You&apos;ve seen all couples! 💑</p>
        )}

        {!loading && couples.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">💔</div>
            <p className="text-gray-500">No couples yet. Be the first to complete setup!</p>
            <Link href="/setup" className="mt-4 inline-block text-rose-500 hover:underline">
              Complete your profile →
            </Link>
          </div>
        )}

        <div ref={bottomRef} className="h-4" />
      </div>

      {/* Report Modal */}
      {reportingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Report this couple</h3>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-rose-300"
              aria-label="Select report reason"
            >
              <option value="">Select reason</option>
              <option value="inappropriate">Inappropriate content</option>
              <option value="fake">Fake profile</option>
              <option value="harassment">Harassment</option>
              <option value="spam">Spam</option>
              <option value="other">Other</option>
            </select>
            <div className="flex gap-3">
              <button
                onClick={() => { setReportingId(null); setReportReason(''); }}
                className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                disabled={!reportReason}
                className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 disabled:opacity-50"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
