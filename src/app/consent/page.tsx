'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ConsentPage() {
  const router = useRouter();
  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);
  const [checkbox3, setCheckbox3] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const allChecked = checkbox1 && checkbox2 && checkbox3;

  async function handleConsent() {
    if (!allChecked) return;
    setLoading(true);
    setError('');

    try {
      // In production this data comes from the NextAuth session
      // For the consent flow, instagramId is passed via query params or session
      const params = new URLSearchParams(window.location.search);
      const instagramId = params.get('instagramId') || '';
      const username = params.get('username') || '';
      const displayName = params.get('displayName') || username;
      const profilePhotoUrl = params.get('profilePhotoUrl') || '';

      const res = await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instagramId,
          username,
          displayName,
          profilePhotoUrl,
          checkbox1,
          checkbox2,
          checkbox3,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

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
            <p><strong>Welcome to CoupleUp!</strong> By using our platform, you agree to the following:</p>
            <p><strong>1. Age Requirement:</strong> You must be 18 years or older to use this service.</p>
            <p><strong>2. Data Collection:</strong> We collect your Instagram profile information (username, display name, profile photo) and the numerology data you provide (name for calculation, date of birth). This data is used solely to facilitate matchmaking and display your profile to other users.</p>
            <p><strong>3. Visibility:</strong> Your display name and profile photo will be visible to all CoupleUp users as part of couple pairings in the public feed.</p>
            <p><strong>4. Matching:</strong> You will be algorithmically matched with other consenting users based on numerological compatibility. You may leave a couple pairing at any time.</p>
            <p><strong>5. Voting:</strong> Other users may vote for couple pairings including yours. You may vote on up to 10 couples per day, but not on your own couples.</p>
            <p><strong>6. Conduct:</strong> Harassment, impersonation, or abusive behaviour will result in immediate account removal.</p>
            <p><strong>7. Data Deletion:</strong> You may delete your account and all associated data at any time from the Settings page.</p>
            <p>Read the <Link href="/terms" className="text-rose-500 hover:underline" target="_blank">full Terms &amp; Conditions</Link> and <Link href="/privacy" className="text-rose-500 hover:underline" target="_blank">Privacy Policy</Link>.</p>
          </div>

          <div className="mt-6 space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checkbox1}
                onChange={(e) => setCheckbox1(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                aria-label="I am 18 years or older and agree to the Terms and Conditions"
              />
              <span className="text-sm text-gray-700">
                I confirm that I am <strong>18 years of age or older</strong> and I have read and agree to the{' '}
                <Link href="/terms" className="text-rose-500 hover:underline" target="_blank">Terms &amp; Conditions</Link>.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checkbox2}
                onChange={(e) => setCheckbox2(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                aria-label="I consent to my profile being displayed publicly"
              />
              <span className="text-sm text-gray-700">
                I consent to my <strong>Instagram display name and profile photo</strong> being shown publicly to other CoupleUp users as part of couple pairings.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checkbox3}
                onChange={(e) => setCheckbox3(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                aria-label="I have read and agree to the Privacy Policy"
              />
              <span className="text-sm text-gray-700">
                I have read and agree to the{' '}
                <Link href="/privacy" className="text-rose-500 hover:underline" target="_blank">Privacy Policy</Link>{' '}
                and consent to my data being processed as described.
              </span>
            </label>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleConsent}
            disabled={!allChecked || loading}
            className="mt-6 w-full bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? 'Processing...' : 'I Agree — Continue to Setup'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500">
          Changed your mind?{' '}
          <Link href="/" className="text-rose-500 hover:underline">
            Return to home
          </Link>
        </p>
      </div>
    </main>
  );
}
