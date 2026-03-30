/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from 'next-auth';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  // No PrismaAdapter — we manage our own `users` table. JWT strategy handles sessions without DB-backed sessions.
  providers: [
    {
      id: 'instagram',
      name: 'Instagram',
      type: 'oauth',
      authorization: {
        url: 'https://api.instagram.com/oauth/authorize',
        params: {
          scope: 'user_profile',
          response_type: 'code',
        },
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
          // Extra fields stored into JWT via jwt() callback
          instagramId: profile.id,
          username: profile.username,
          displayName: profile.name || profile.username,
          profilePhotoUrl: profile.profile_picture_url || '',
        };
      },
    },
  ],
  callbacks: {
    /** Persist full Instagram profile into the JWT on first sign-in. */
    async jwt({ token, user, profile }: { token: any; user?: any; profile?: any }) {
      if (user) {
        // `user` is populated only on initial sign-in
        token.instagramId = (user as any).instagramId || (profile as any)?.id;
        token.username = (user as any).username || (profile as any)?.username;
        token.displayName = (user as any).displayName || user.name;
        token.profilePhotoUrl = (user as any).profilePhotoUrl || user.image || '';
      }

      // On every JWT refresh, check DB to get latest consent / setup status
      if (token.instagramId) {
        const dbUser = await prisma.user.findUnique({
          where: { instagramId: token.instagramId as string },
          select: { consentGiven: true, gender: true, lifePathNumber: true, isActive: true },
        });
        token.consentGiven = dbUser?.consentGiven ?? false;
        token.setupDone = !!(dbUser?.gender && dbUser?.lifePathNumber);
        token.isActive = dbUser?.isActive ?? true;
      }

      return token;
    },
    /** Expose safe fields on the client-side session object. */
    async session({ session, token }: { session: any; token: any }) {
      session.user.instagramId = token.instagramId;
      session.user.username = token.username;
      session.user.displayName = token.displayName;
      session.user.profilePhotoUrl = token.profilePhotoUrl;
      session.user.consentGiven = token.consentGiven;
      session.user.setupDone = token.setupDone;
      return session;
    },
  },
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/',
    error: '/',
  },
};
