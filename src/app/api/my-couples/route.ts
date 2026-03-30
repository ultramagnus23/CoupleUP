import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const instagramId = searchParams.get('instagramId');

    if (!instagramId) {
      return NextResponse.json({ error: 'Missing instagramId' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { instagramId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const couples = await prisma.couple.findMany({
      where: {
        isActive: true,
        OR: [{ user1Id: user.id }, { user2Id: user.id }],
      },
      include: {
        user1: { select: { id: true, displayName: true, profilePhotoUrl: true } },
        user2: { select: { id: true, displayName: true, profilePhotoUrl: true } },
        _count: { select: { votes: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const allActiveCouples = await prisma.couple.findMany({
      where: { isActive: true },
      include: { _count: { select: { votes: true } } },
      orderBy: { votes: { _count: 'desc' } },
    });

    const result = couples.map((couple) => {
      const partner = couple.user1Id === user.id ? couple.user2 : couple.user1;
      const rank = allActiveCouples.findIndex((c) => c.id === couple.id) + 1;
      return {
        id: couple.id,
        partner,
        compatibilityScore: couple.compatibilityScore,
        totalVotes: couple._count.votes,
        rank,
        createdAt: couple.createdAt,
      };
    });

    const totalVotesReceived = result.reduce((sum, c) => sum + c.totalVotes, 0);
    const highestRank = result.length > 0 ? Math.min(...result.map((c) => c.rank)) : 0;

    return NextResponse.json({
      couples: result,
      stats: {
        totalCouples: result.length,
        totalVotesReceived,
        highestRank,
      },
      numerology: {
        lifePathNumber: user.lifePathNumber,
        expressionNumber: user.expressionNumber,
        soulUrgeNumber: user.soulUrgeNumber,
      },
    });
  } catch (error) {
    console.error('My couples error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { instagramId, coupleId } = body;

    const user = await prisma.user.findUnique({ where: { instagramId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const couple = await prisma.couple.findFirst({
      where: {
        id: coupleId,
        OR: [{ user1Id: user.id }, { user2Id: user.id }],
      },
    });

    if (!couple) {
      return NextResponse.json({ error: 'Couple not found' }, { status: 404 });
    }

    await prisma.couple.update({
      where: { id: coupleId },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Leave couple error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
