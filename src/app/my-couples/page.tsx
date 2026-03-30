'use client';

import { useState, useEffect } from 'react';
import { useSessionUser } from '@/hooks/useSessionUser';
import Link from 'next/link';
import Image from 'next/image';
import { LIFE_PATH_DESCRIPTIONS } from '@/lib/numerology';

interface Couple {
  id: string;
  partner: { id: string; displayName: string; profilePhotoUrl: string };
  compatibilityScore: number;
  totalVotes: number;
  rank: number;
  createdAt: string;
}

interface Stats {
  totalCouples: number;
  totalVotesReceived: number;
  highestRank: number;
}

interface Numerology {
  lifePathNumber: number | null;
  expressionNumber: number | null;
  soulUrgeNumber: number | null;
}

export default function MyCouplesPage() {
  const [couples, setCouples] = useState<Couple[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [numerology, setNumerology] = useState<Numerology | null>(null);
  const [loading, setLoading] = useState(true);
  const [leavingId, setLeavingId] = useState<string | null>(null);

  const { user } = useSessionUser();
  const instagramId = user?.instagramId ?? '';

  useEffect(() => {
    if (!instagramId) return;
    fetch(`/api/my-couples?instagramId=${instagramId}`)
      .then((r) => r.json())
      .then((data) => {
        setCouples(data.couples || []);
        setStats(data.stats || null);
        setNumerology(data.numerology || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [instagramId]);

  async function handleLeave(coupleId: string) {
    setLeavingId(coupleId);
    try {
      const res = await fetch('/api/my-couples', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instagramId, coupleId }),
      });
      if (res.ok) {
        setCouples((prev) => prev.filter((c) => c.id !== coupleId));
      }
    } catch (err) {
      console.error('Leave couple failed:', err);
    } finally {
      setLeavingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-rose-100 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/feed" className="text-gray-500 hover:text-gray-700">← Feed</Link>
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">
            👤 My Profile
          </h1>
          <Link href="/settings" className="text-gray-500 hover:text-gray-700">⚙️</Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
                  <p className="text-2xl font-bold text-rose-500">{stats.totalCouples}</p>
                  <p className="text-xs text-gray-500 mt-1">Active Couples</p>
                </div>
                <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
                  <p className="text-2xl font-bold text-purple-500">{stats.totalVotesReceived}</p>
                  <p className="text-xs text-gray-500 mt-1">Total Votes</p>
                </div>
                <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
                  <p className="text-2xl font-bold text-pink-500">
                    {stats.highestRank > 0 ? `#${stats.highestRank}` : '—'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Best Rank</p>
                </div>
              </div>
            )}

            {/* Numerology profile */}
            {numerology && numerology.lifePathNumber && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">🔢 Your Numerology Profile</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-rose-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-800">Life Path</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {numerology.lifePathNumber && LIFE_PATH_DESCRIPTIONS[numerology.lifePathNumber]}
                      </p>
                    </div>
                    <span className="text-2xl font-bold text-rose-500">{numerology.lifePathNumber}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-800">Expression</p>
                      <p className="text-xs text-gray-500 mt-0.5">How you express yourself to the world</p>
                    </div>
                    <span className="text-2xl font-bold text-purple-500">{numerology.expressionNumber}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-pink-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-800">Soul Urge</p>
                      <p className="text-xs text-gray-500 mt-0.5">Your inner desires and motivations</p>
                    </div>
                    <span className="text-2xl font-bold text-pink-500">{numerology.soulUrgeNumber}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Couples list */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-3">💑 My Couples</h2>
              {couples.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="text-4xl mb-3">💔</div>
                  <p className="text-gray-500 mb-4">No active couples yet.</p>
                  <Link
                    href="/setup"
                    className="inline-block bg-gradient-to-r from-rose-500 to-purple-600 text-white font-medium px-6 py-3 rounded-xl"
                  >
                    Complete Setup to Get Matched
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {couples.map((couple) => (
                    <div key={couple.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                      <div className="flex items-center gap-4">
                        <Image
                          src={couple.partner.profilePhotoUrl || '/placeholder-avatar.png'}
                          alt={couple.partner.displayName}
                          width={52}
                          height={52}
                          className="rounded-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-avatar.png'; }}
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{couple.partner.displayName}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-gray-500">
                              {couple.compatibilityScore}% compatible
                            </span>
                            <span className="text-sm text-gray-400">·</span>
                            <span className="text-sm text-gray-500">❤️ {couple.totalVotes} votes</span>
                            {couple.rank > 0 && (
                              <>
                                <span className="text-sm text-gray-400">·</span>
                                <span className="text-sm text-gray-500">#{couple.rank}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleLeave(couple.id)}
                          disabled={leavingId === couple.id}
                          className="text-sm text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
                          aria-label={`Leave couple with ${couple.partner.displayName}`}
                        >
                          {leavingId === couple.id ? '...' : 'Leave'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
