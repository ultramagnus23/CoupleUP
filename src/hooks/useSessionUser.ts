'use client';

import { useState, useEffect } from 'react';

export interface SessionUser {
  instagramId: string;
  username: string;
  displayName: string;
  profilePhotoUrl: string;
  consentGiven: boolean;
  setupDone: boolean;
}

/**
 * useSessionUser — fetches the current user from /api/me.
 * Returns { user, loading } — user is null while loading or unauthenticated.
 */
export function useSessionUser() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.user) setUser(data.user as SessionUser);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}
