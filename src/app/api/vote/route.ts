import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DAILY_VOTE_LIMIT } from '@/lib/matching';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { instagramId, coupleId } = body;

    if (!instagramId || !coupleId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const voter = await prisma.user.findUnique({ where: { instagramId } });
    if (!voter) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const couple = await prisma.couple.findUnique({ where: { id: coupleId } });
    if (!couple || !couple.isActive) {
      return NextResponse.json({ error: 'Couple not found' }, { status: 404 });
    }

    if (couple.user1Id === voter.id || couple.user2Id === voter.id) {
      return NextResponse.json({ error: 'Cannot vote on your own couple' }, { status: 403 });
    }

    const existingVote = await prisma.vote.findUnique({
      where: { voterId_coupleId: { voterId: voter.id, coupleId } },
    });
    if (existingVote) {
      return NextResponse.json({ error: 'Already voted for this couple' }, { status: 409 });
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const dailyCount = await prisma.dailyVoteCount.findUnique({
      where: { voterId_voteDate: { voterId: voter.id, voteDate: today } },
    });

    if (dailyCount && dailyCount.count >= DAILY_VOTE_LIMIT) {
      return NextResponse.json({ error: 'Daily vote limit reached', limit: DAILY_VOTE_LIMIT }, { status: 429 });
    }

    await prisma.$transaction([
      prisma.vote.create({
        data: { voterId: voter.id, coupleId },
      }),
      prisma.dailyVoteCount.upsert({
        where: { voterId_voteDate: { voterId: voter.id, voteDate: today } },
        create: { voterId: voter.id, voteDate: today, count: 1 },
        update: { count: { increment: 1 } },
      }),
    ]);

    const totalVotes = await prisma.vote.count({ where: { coupleId } });

    return NextResponse.json({ success: true, totalVotes });
  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
