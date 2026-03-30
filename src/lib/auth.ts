import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
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
        params: { fields: 'id,username,name,profile_picture_url,account_type' },
      },
      clientId: process.env.INSTAGRAM_CLIENT_ID!,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET!,
      profile(profile: any) {
        return {
          id: profile.id,
          name: profile.name || profile.username,
          image: profile.profile_picture_url,
          email: null,
          instagramId: profile.id,
          username: profile.username,
        };
      },
    },
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (account?.provider === 'instagram') {
        const instagramId = (profile as any)?.id || user.id;
        const existingUser = await prisma.user.findUnique({
          where: { instagramId },
        });
        if (!existingUser) {
          (user as any).isNewUser = true;
          (user as any).instagramId = instagramId;
        }
      }
      return true;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.sub;
        session.user.instagramId = token.instagramId;
        session.user.isNewUser = token.isNewUser;
      }
      return session;
    },
    async jwt({ token, user, account, profile }: any) {
      if (user) {
        token.instagramId = (user as any).instagramId || (profile as any)?.id;
        token.isNewUser = (user as any).isNewUser;
      }
      return token;
    },
  },
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/',
    error: '/',
  },
};
