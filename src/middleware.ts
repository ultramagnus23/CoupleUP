import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token as Record<string, unknown> | null;
    const pathname = req.nextUrl.pathname;

    // Not authenticated at all → landing page
    if (!token) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Authenticated but hasn't consented → /consent  (allow /consent itself through)
    if (!token.consentGiven && pathname !== '/consent') {
      return NextResponse.redirect(new URL('/consent', req.url));
    }

    // Consented but is a Google user who hasn't uploaded a photo yet → /upload-photo
    // (Instagram users always have photoUploaded = true set at consent time)
    if (
      token.consentGiven &&
      token.provider === 'google' &&
      !token.photoUploaded &&
      pathname !== '/upload-photo' &&
      pathname !== '/consent'
    ) {
      return NextResponse.redirect(new URL('/upload-photo', req.url));
    }

    // Consented, photo OK, but hasn't completed setup → /setup
    if (
      token.consentGiven &&
      (token.provider !== 'google' || token.photoUploaded) &&
      !token.setupDone &&
      pathname !== '/setup' &&
      pathname !== '/consent' &&
      pathname !== '/upload-photo'
    ) {
      return NextResponse.redirect(new URL('/setup', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Let withAuth know we want it to run even when there is no token
      // (so the inner middleware can redirect to /)
      authorized: () => true,
    },
  }
);

// Protect all app pages (not API routes, not static files, not public pages)
export const config = {
  matcher: [
    '/feed/:path*',
    '/leaderboard/:path*',
    '/my-couples/:path*',
    '/settings/:path*',
    '/consent',
    '/setup',
    '/upload-photo',
  ],
};
