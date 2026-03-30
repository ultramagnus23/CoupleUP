'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [gender, setGender] = useState('');
  const [matchPreference, setMatchPreference] = useState('');
  const [numerologyName, setNumerologyName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [consentDate, setConsentDate] = useState('');
  const [lifePathNumber, setLifePathNumber] = useState<number | null>(null);

  const instagramId = typeof window !== 'undefined' ? localStorage.getItem('instagramId') || '' : '';

  useEffect(() => {
    if (!instagramId) return;
    fetch(`/api/settings?instagramId=${instagramId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setGender(data.user.gender || '');
          setMatchPreference(data.user.matchPreference || '');
          setNumerologyName(data.user.numerologyName || '');
          setDisplayName(data.user.displayName || '');
          setUsername(data.user.username || '');
          setLifePathNumber(data.user.lifePathNumber);
          if (data.user.consentTimestamp) {
            setConsentDate(new Date(data.user.consentTimestamp).toLocaleDateString());
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [instagramId]);

  async function handleSave() {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instagramId, gender, matchPreference, numerologyName }),
      });
      if (res.ok) {
        setSuccess('Settings saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save settings');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (deleteConfirmation !== 'DELETE') return;
    setDeleting(true);
    setError('');
    try {
      const res = await fetch('/api/settings', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instagramId, confirmation: 'DELETE' }),
      });
      if (res.ok) {
        localStorage.removeItem('instagramId');
        router.push('/');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete account');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-rose-100 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/my-couples" className="text-gray-500 hover:text-gray-700">← Back</Link>
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">
            ⚙️ Settings
          </h1>
          <div className="w-12" />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Account info */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Account Information</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Display Name</span>
                  <span className="font-medium text-gray-800">{displayName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Instagram Username</span>
                  <span className="font-medium text-gray-800">@{username}</span>
                </div>
                {lifePathNumber && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Life Path Number</span>
                    <span className="font-bold text-rose-500">{lifePathNumber}</span>
                  </div>
                )}
                {consentDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Joined</span>
                    <span className="font-medium text-gray-800">{consentDate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Matching Preferences</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="settings-gender">
                    I identify as
                  </label>
                  <select
                    id="settings-gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    <option value="">Select gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="NONBINARY">Non-binary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="settings-preference">
                    I am interested in
                  </label>
                  <select
                    id="settings-preference"
                    value={matchPreference}
                    onChange={(e) => setMatchPreference(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    <option value="">Select preference</option>
                    <option value="WOMEN">Women</option>
                    <option value="MEN">Men</option>
                    <option value="EVERYONE">Everyone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="settings-name">
                    Full Name for Numerology
                  </label>
                  <input
                    type="text"
                    id="settings-name"
                    value={numerologyName}
                    onChange={(e) => setNumerologyName(e.target.value)}
                    placeholder="Your full birth name"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                  <p className="text-xs text-gray-500 mt-1">Changing this will recalculate your numerology numbers and re-run matching.</p>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
              )}
              {success && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">{success}</div>
              )}

              <button
                onClick={handleSave}
                disabled={saving}
                className="mt-6 w-full bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {/* Legal */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Legal</h2>
              <div className="space-y-3">
                <Link href="/terms" className="flex justify-between items-center text-sm text-gray-700 hover:text-rose-500 transition-colors">
                  <span>Terms &amp; Conditions</span>
                  <span>→</span>
                </Link>
                <Link href="/privacy" className="flex justify-between items-center text-sm text-gray-700 hover:text-rose-500 transition-colors">
                  <span>Privacy Policy</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Danger zone */}
            <div className="bg-white rounded-3xl shadow-sm border border-red-100 p-6">
              <h2 className="text-lg font-bold text-red-700 mb-2">Danger Zone</h2>
              <p className="text-sm text-gray-500 mb-4">
                Deleting your account will remove all your data, couples, and votes permanently.
              </p>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full border border-red-300 text-red-600 font-medium py-3 rounded-xl hover:bg-red-50 transition-all"
                >
                  Delete My Account
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">
                    Type <strong>DELETE</strong> to confirm:
                  </p>
                  <input
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="DELETE"
                    className="w-full border border-red-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-300"
                    aria-label="Type DELETE to confirm account deletion"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmation(''); }}
                      className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleteConfirmation !== 'DELETE' || deleting}
                      className="flex-1 bg-red-500 text-white font-medium py-3 rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleting ? 'Deleting...' : 'Confirm Delete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
