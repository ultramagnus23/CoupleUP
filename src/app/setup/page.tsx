'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Step = 1 | 2;

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [instagramId, setInstagramId] = useState('');

  // Step 1 fields
  const [gender, setGender] = useState('');
  const [matchPreference, setMatchPreference] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [numerologyName, setNumerologyName] = useState('');

  // Step 2 fields
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [relationshipGoal, setRelationshipGoal] = useState('');
  const [personalityType, setPersonalityType] = useState('');
  const [dealbreakers, setDealbreakers] = useState('');
  const [funAnswer, setFunAnswer] = useState('');

  // Load session user data
  useEffect(() => {
    fetch('/api/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setInstagramId(data.user.instagramId);
          // Pre-fill numerology name from Instagram display name
          if (data.user.displayName) setNumerologyName(data.user.displayName);
          if (data.user.setupDone) router.replace('/feed');
        }
      })
      .catch(console.error);
  }, [router]);

  async function handleStep1() {
    if (!gender || !matchPreference || !dateOfBirth || !numerologyName) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instagramId, gender, matchPreference, dateOfBirth, numerologyName }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong'); return; }
      setStep(2);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleStep2() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/setup', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instagramId,
          age: age ? parseInt(age) : null,
          city,
          relationshipGoal,
          personalityType,
          dealbreakers,
          funAnswer,
        }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Something went wrong'); return; }
      router.push('/feed');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">
            💑 CoupleUp
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">
            {step === 1 ? 'Your Numerology Profile' : 'Tell Us More (Optional)'}
          </h1>
          <div className="flex justify-center gap-2 mt-3">
            <div className={`h-2 w-12 rounded-full ${step >= 1 ? 'bg-rose-500' : 'bg-gray-200'}`} />
            <div className={`h-2 w-12 rounded-full ${step >= 2 ? 'bg-rose-500' : 'bg-gray-200'}`} />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          {step === 1 ? (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="gender">I identify as *</label>
                <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-300">
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="NONBINARY">Non-binary</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="matchPreference">I am interested in *</label>
                <select id="matchPreference" value={matchPreference} onChange={(e) => setMatchPreference(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-300">
                  <option value="">Select preference</option>
                  <option value="WOMEN">Women</option>
                  <option value="MEN">Men</option>
                  <option value="EVERYONE">Everyone</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="dateOfBirth">Date of Birth *</label>
                <input type="date" id="dateOfBirth" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)}
                  max={new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-300" />
                <p className="text-xs text-gray-500 mt-1">Used to calculate your Life Path number. Never shown publicly.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="numerologyName">Full Name for Numerology *</label>
                <input type="text" id="numerologyName" value={numerologyName} onChange={(e) => setNumerologyName(e.target.value)}
                  placeholder="Enter your full birth name"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-300" />
                <p className="text-xs text-gray-500 mt-1">Used to calculate Expression and Soul Urge numbers. Not displayed publicly.</p>
              </div>

              {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

              <button onClick={handleStep1} disabled={loading}
                className="w-full bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
                {loading ? 'Calculating your numbers...' : 'Calculate My Numbers →'}
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <p className="text-sm text-gray-500">These details help us show richer profiles. All fields are optional.</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="age">Age</label>
                  <input type="number" id="age" value={age} onChange={(e) => setAge(e.target.value)} min="18" max="120" placeholder="25"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="city">City</label>
                  <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Mumbai"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-300" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="relationshipGoal">Relationship Goal</label>
                <select id="relationshipGoal" value={relationshipGoal} onChange={(e) => setRelationshipGoal(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-300">
                  <option value="">Select goal</option>
                  <option value="Casual">Casual</option>
                  <option value="Serious">Serious</option>
                  <option value="Friendship">Friendship</option>
                  <option value="Open to anything">Open to anything</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="personalityType">Personality Type</label>
                <select id="personalityType" value={personalityType} onChange={(e) => setPersonalityType(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-300">
                  <option value="">Select type</option>
                  <option value="Introvert">Introvert</option>
                  <option value="Extrovert">Extrovert</option>
                  <option value="Ambivert">Ambivert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="dealbreakers">Dealbreakers (max 200 chars)</label>
                <input type="text" id="dealbreakers" value={dealbreakers} onChange={(e) => setDealbreakers(e.target.value.slice(0, 200))}
                  placeholder="e.g. Smoking, long distance"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="funAnswer">Describe your ideal weekend (max 100 chars)</label>
                <textarea id="funAnswer" value={funAnswer} onChange={(e) => setFunAnswer(e.target.value.slice(0, 100))} rows={3}
                  placeholder="A slow morning, a hike, good food..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none" />
              </div>

              {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

              <div className="flex gap-3">
                <button onClick={() => router.push('/feed')}
                  className="flex-1 border border-gray-200 text-gray-600 font-medium py-4 rounded-2xl hover:bg-gray-50 transition-all">
                  Skip for now
                </button>
                <button onClick={handleStep2} disabled={loading}
                  className="flex-1 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
                  {loading ? 'Saving...' : 'Complete Setup 🎉'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
