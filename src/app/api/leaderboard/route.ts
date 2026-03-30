import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'alltime';
    const instagramId = searchParams.get('instagramId');

    let dateFilter: Date | null = null;
    if (period === 'today') {
      dateFilter = new Date();
      dateFilter.setUTCHours(0, 0, 0, 0);
    } else if (period === 'week') {
      dateFilter = new Date();
      dateFilter.setDate(dateFilter.getDate() - 7);
    }

    const voteWhere: any = {};
    if (dateFilter) {
      voteWhere.votedAt = { gte: dateFilter };
    }

    const couples = await prisma.couple.findMany({
      where: { isActive: true },
      include: {
        user1: { select: { id: true, displayName: true, profilePhotoUrl: true, instagramId: true } },
        user2: { select: { id: true, displayName: true, profilePhotoUrl: true, instagramId: true } },
        votes: { where: voteWhere, select: { id: true } },
      },
    });

    const ranked = couples
      .map((c) => ({ ...c, voteCount: c.votes.length }))
      .filter((c) => c.voteCount > 0 || period === 'alltime')
      .sort((a, b) => b.voteCount - a.voteCount)
      .slice(0, 50)
      .map((c, i) => ({
        rank: i + 1,
        id: c.id,
        user1: c.user1,
        user2: c.user2,
        compatibilityScore: c.compatibilityScore,
        voteCount: c.voteCount,
      }));

    let userBestRank = null;
    if (instagramId) {
      const currentUser = await prisma.user.findUnique({ where: { instagramId } });
      if (currentUser) {
        const userCouples = couples
          .filter((c) => c.user1Id === currentUser.id || c.user2Id === currentUser.id)
          .map((c) => ({ ...c, voteCount: c.votes.length }))
          .sort((a, b) => b.voteCount - a.voteCount);

        if (userCouples.length > 0) {
          const fullRanking = couples
            .map((c) => ({ id: c.id, voteCount: c.votes.length }))
            .sort((a, b) => b.voteCount - a.voteCount);
          const topCouple = userCouples[0];
          const rank = fullRanking.findIndex((c) => c.id === topCouple.id) + 1;
          if (rank > 50) {
            userBestRank = { rank, voteCount: topCouple.voteCount };
          }
        }
      }
    }

    return NextResponse.json({ leaderboard: ranked, userBestRank });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
