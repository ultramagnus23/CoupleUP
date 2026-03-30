import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateNumerologyProfile } from '@/lib/numerology';
import { runMatchingEngine } from '@/lib/matching';
import { Gender, MatchPreference, Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const instagramId = searchParams.get('instagramId');

    if (!instagramId) {
      return NextResponse.json({ error: 'Missing instagramId' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { instagramId },
      include: { profile: true, consentRecords: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        displayName: user.displayName,
        username: user.username,
        gender: user.gender,
        matchPreference: user.matchPreference,
        numerologyName: user.numerologyName,
        lifePathNumber: user.lifePathNumber,
        expressionNumber: user.expressionNumber,
        soulUrgeNumber: user.soulUrgeNumber,
        consentTimestamp: user.consentTimestamp,
      },
      profile: user.profile,
      consentRecord: user.consentRecords[0] || null,
    });
  } catch (error) {
    console.error('Settings get error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { instagramId, gender, matchPreference, numerologyName } = body;

    if (!instagramId) {
      return NextResponse.json({ error: 'Missing instagramId' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { instagramId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updateData: Prisma.UserUpdateInput = {};
    let rerankMatching = false;

    if (gender) { updateData.gender = gender as Gender; rerankMatching = true; }
    if (matchPreference) { updateData.matchPreference = matchPreference as MatchPreference; rerankMatching = true; }
    if (numerologyName && numerologyName !== user.numerologyName) {
      if (!user.dateOfBirth) {
        return NextResponse.json({ error: 'Date of birth required to recalculate numerology' }, { status: 400 });
      }
      const profile = calculateNumerologyProfile(numerologyName, user.dateOfBirth);
      updateData.numerologyName = numerologyName;
      updateData.lifePathNumber = profile.lifePathNumber;
      updateData.expressionNumber = profile.expressionNumber;
      updateData.soulUrgeNumber = profile.soulUrgeNumber;
      rerankMatching = true;
    }

    const updated = await prisma.user.update({
      where: { instagramId },
      data: updateData,
    });

    if (rerankMatching) {
      runMatchingEngine(updated.id).catch(console.error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { instagramId, confirmation } = body;

    if (confirmation !== 'DELETE') {
      return NextResponse.json({ error: 'Confirmation required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { instagramId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { isActive: false, displayName: '[Deleted User]', profilePhotoUrl: '/placeholder-avatar.png' },
      }),
      prisma.couple.updateMany({
        where: { OR: [{ user1Id: user.id }, { user2Id: user.id }] },
        data: { isActive: false },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
