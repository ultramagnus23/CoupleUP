'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ConsentPage() {
  const router = useRouter();
  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);
  const [checkbox3, setCheckbox3] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [sessionUser, setSessionUser] = useState<{
    instagramId: string;
    provider: string;
    username: string;
    displayName: string;
    profilePhotoUrl: string;
    consentGiven: boolean;
  } | null>(null);

  useEffect(() => {
    fetch('/api/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setSessionUser(data.user);
          if (data.user.consentGiven) router.replace('/feed');
        }
      })
      .catch(console.error);
  }, [router]);

  const allChecked = checkbox1 && checkbox2 && checkbox3;

  async function handleConsent() {
    if (!allChecked || !sessionUser) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instagramId: sessionUser.instagramId,
          provider: sessionUser.provider,
          username: sessionUser.username,
          displayName: sessionUser.displayName,
          profilePhotoUrl: sessionUser.profilePhotoUrl,
          checkbox1,
          checkbox2,
          checkbox3,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong'); return; }
      router.push('/setup');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">
            Before You Continue
          </h1>
          <p className="text-gray-600 mt-2">Please read and accept our terms to join CoupleUp.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Terms &amp; Conditions Summary</h2>
          <div className="prose prose-sm text-gray-600 space-y-3 max-h-64 overflow-y-auto border border-gray-100 rounded-xl p-4">
            <p><strong>Welcome to CoupleUp!</strong></p>
            <p><strong>1. Age Requirement:</strong> You must be 18 years or older to use this service.</p>
            <p><strong>2. Data Collection:</strong> We collect your profile information (display name, profile photo) and the numerology data you provide (name, date of birth) solely to facilitate matchmaking.</p>
            <p><strong>3. Visibility:</strong> Your display name and profile photo will be visible to all CoupleUp users as part of couple pairings in the public feed.</p>
            <p><strong>4. Matching:</strong> You will be algorithmically matched with other consenting users based on numerological compatibility. You may leave a couple pairing at any time.</p>
            <p><strong>5. Voting:</strong> Other users may vote for couple pairings including yours. You may vote on up to 10 couples per day, but not on your own couples.</p>
            <p><strong>6. Conduct:</strong> Harassment, impersonation, or abusive behaviour will result in immediate account removal.</p>
            <p><strong>7. Data Deletion:</strong> You may delete your account and all data at any time from Settings.</p>
            <p>Read the full <Link href="/terms" className="text-rose-500 hover:underline" target="_blank">Terms &amp; Conditions</Link> and <Link href="/privacy" className="text-rose-500 hover:underline" target="_blank">Privacy Policy</Link>.</p>
          </div>

          <div className="mt-6 space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={checkbox1} onChange={(e) => setCheckbox1(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-rose-500 focus:ring-rose-500" />
              <span className="text-sm text-gray-700">
                I have read and agree to the <Link href="/terms" className="text-rose-500 hover:underline" target="_blank">Terms &amp; Conditions</Link> and <Link href="/privacy" className="text-rose-500 hover:underline" target="_blank">Privacy Policy</Link>.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={checkbox2} onChange={(e) => setCheckbox2(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-rose-500 focus:ring-rose-500" />
              <span className="text-sm text-gray-700 font-medium">
                I specifically consent to my <strong>display name and profile photo</strong> being displayed publicly on CoupleUp, paired with other users, shown in a public voting feed, and ranked on a public leaderboard.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={checkbox3} onChange={(e) => setCheckbox3(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-rose-500 focus:ring-rose-500" />
              <span className="text-sm text-gray-700">
                I confirm that I am <strong>18 years of age or older</strong>.
              </span>
            </label>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
          )}

          <button
            onClick={handleConsent}
            disabled={!allChecked || loading || !sessionUser}
            className="mt-6 w-full bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? 'Processing...' : 'I Agree — Continue to Setup'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500">
          Changed your mind?{' '}
          <Link href="/api/auth/signout" className="text-rose-500 hover:underline">Sign out</Link>
        </p>
      </div>
    </main>
  );
}
