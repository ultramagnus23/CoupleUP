/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  // No PrismaAdapter — we manage our own `users` table. JWT strategy handles sessions without DB-backed sessions.
  providers: [
    // ── Instagram (Basic Display API) ─────────────────────────────────────
    {
      id: 'instagram',
      name: 'Instagram',
      type: 'oauth',
      authorization: {
        url: 'https://api.instagram.com/oauth/authorize',
        params: { scope: 'user_profile', response_type: 'code' },
      },
      token: 'https://api.instagram.com/oauth/access_token',
      userinfo: {
        url: 'https://graph.instagram.com/me',
        params: { fields: 'id,username,name,profile_picture_url' },
      },
      clientId: process.env.INSTAGRAM_CLIENT_ID!,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET!,
      profile(profile: Record<string, string>) {
        return {
          id: profile.id,
          name: profile.name || profile.username,
          image: profile.profile_picture_url,
          instagramId: profile.id,          // raw Instagram ID stored as-is
          provider: 'instagram',
          username: profile.username,
          displayName: profile.name || profile.username,
          profilePhotoUrl: profile.profile_picture_url || '',
        };
      },
    },

    // ── Google ────────────────────────────────────────────────────────────
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          // Ask for profile + email so we get name and picture
          scope: 'openid email profile',
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          // Use a namespaced ID so it never collides with a raw Instagram numeric ID
          instagramId: `google:${profile.sub}`,
          provider: 'google',
          username: profile.email?.split('@')[0] ?? profile.sub,
          displayName: profile.name ?? profile.email,
          profilePhotoUrl: profile.picture ?? '',
          // Google users must still upload their own photo
          photoUploaded: false,
        };
      },
    }),
  ],

  callbacks: {
    /** Persist full profile into the JWT on first sign-in, refresh status from DB on subsequent calls. */
    async jwt({ token, user, account }: { token: any; user?: any; account?: any }) {
      if (user && account) {
        // Populated only on the very first sign-in
        token.instagramId   = (user as any).instagramId;
        token.provider      = (user as any).provider ?? account.provider;
        token.username      = (user as any).username;
        token.displayName   = (user as any).displayName ?? user.name;
        token.profilePhotoUrl = (user as any).profilePhotoUrl ?? user.image ?? '';
      }

      // On every JWT access refresh, pull latest flags from DB
      if (token.instagramId) {
        const dbUser = await prisma.user.findUnique({
          where: { instagramId: token.instagramId as string },
          select: {
            consentGiven: true,
            gender: true,
            lifePathNumber: true,
            isActive: true,
            photoUploaded: true,
            profilePhotoUrl: true,
          },
        });
        token.consentGiven  = dbUser?.consentGiven  ?? false;
        token.setupDone     = !!(dbUser?.gender && dbUser?.lifePathNumber);
        token.isActive      = dbUser?.isActive      ?? true;
        token.photoUploaded = dbUser?.photoUploaded ?? false;
        // Keep profilePhotoUrl in sync if the user uploaded a new one
        if (dbUser?.profilePhotoUrl) token.profilePhotoUrl = dbUser.profilePhotoUrl;
      }

      return token;
    },

    /** Expose safe fields on the client-side session object. */
    async session({ session, token }: { session: any; token: any }) {
      session.user.instagramId    = token.instagramId;
      session.user.provider       = token.provider;
      session.user.username       = token.username;
      session.user.displayName    = token.displayName;
      session.user.profilePhotoUrl = token.profilePhotoUrl;
      session.user.consentGiven   = token.consentGiven;
      session.user.setupDone      = token.setupDone;
      session.user.photoUploaded  = token.photoUploaded;
      return session;
    },
  },

  session: { strategy: 'jwt' },
  pages: {
    signIn: '/',
    error: '/',
  },
};
