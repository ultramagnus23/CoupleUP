import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const instagramId = searchParams.get('instagramId');
    const filter = searchParams.get('filter') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 20;
    const skip = (page - 1) * limit;

    const currentUser = instagramId
      ? await prisma.user.findUnique({ where: { instagramId } })
      : null;

    const where: Prisma.CoupleWhereInput = { isActive: true };
    if (filter === 'wwomen') {
      where.preferenceType = { in: ['FEMALE-WOMEN', 'NONBINARY-WOMEN'] };
    } else if (filter === 'mmen') {
      where.preferenceType = { in: ['MALE-MEN', 'NONBINARY-MEN'] };
    } else if (filter === 'mwomen') {
      where.preferenceType = { in: ['MALE-WOMEN', 'FEMALE-MEN'] };
    }

    const [couples, total] = await Promise.all([
      prisma.couple.findMany({
        where,
        include: {
          user1: { select: { id: true, displayName: true, profilePhotoUrl: true, instagramId: true } },
          user2: { select: { id: true, displayName: true, profilePhotoUrl: true, instagramId: true } },
          _count: { select: { votes: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.couple.count({ where }),
    ]);

    let userVotes: Set<string> = new Set();
    if (currentUser) {
      const votes = await prisma.vote.findMany({
        where: { voterId: currentUser.id },
        select: { coupleId: true },
      });
      userVotes = new Set(votes.map((v) => v.coupleId));
    }

    const shuffled = [...couples];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const result = shuffled.map((couple) => ({
      id: couple.id,
      user1: couple.user1,
      user2: couple.user2,
      compatibilityScore: couple.compatibilityScore,
      totalVotes: couple._count.votes,
      hasVoted: userVotes.has(couple.id),
      isCurrentUserCouple: currentUser
        ? couple.user1Id === currentUser.id || couple.user2Id === currentUser.id
        : false,
    }));

    return NextResponse.json({ couples: result, total, page, hasMore: skip + limit < total });
  } catch (error) {
    console.error('Feed error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
