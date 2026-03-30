import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">💑</div>
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600 mb-4">
            CoupleUp
          </h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            Discover your cosmic match through the ancient wisdom of numerology.
          </p>
        </div>

        <div className="space-y-3 w-full max-w-sm">
          {/* Google sign-in */}
          <Link
            href="/api/auth/signin/google"
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 font-semibold py-4 px-8 rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* Google "G" logo */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Link>

          {/* Instagram sign-in */}
          <Link
            href="/api/auth/signin/instagram"
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* Instagram camera icon */}
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
            Continue with Instagram
          </Link>

          <p className="text-xs text-gray-400 pt-1">
            By continuing you agree to our{' '}
            <Link href="/terms" className="text-rose-500 hover:underline">Terms &amp; Conditions</Link>{' '}
            and will be asked to give explicit consent before joining.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl text-center">
          <div>
            <div className="text-3xl mb-2">🔢</div>
            <h3 className="font-semibold text-gray-800">Numerology Matching</h3>
            <p className="text-sm text-gray-500 mt-1">Matched by life path, expression &amp; soul urge numbers</p>
          </div>
          <div>
            <div className="text-3xl mb-2">🗳️</div>
            <h3 className="font-semibold text-gray-800">Community Voting</h3>
            <p className="text-sm text-gray-500 mt-1">The community votes for their favourite couples</p>
          </div>
          <div>
            <div className="text-3xl mb-2">🏆</div>
            <h3 className="font-semibold text-gray-800">Leaderboard</h3>
            <p className="text-sm text-gray-500 mt-1">Rise to the top and become the most loved couple</p>
          </div>
        </div>
      </div>

      <footer className="py-6 text-center text-sm text-gray-400 space-x-4">
        <Link href="/terms" className="hover:text-gray-600">Terms &amp; Conditions</Link>
        <span>·</span>
        <Link href="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
      </footer>
    </main>
  );
}
