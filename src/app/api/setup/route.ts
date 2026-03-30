import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateNumerologyProfile } from '@/lib/numerology';
import { runMatchingEngine } from '@/lib/matching';
import { Gender, MatchPreference } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { instagramId, gender, matchPreference, dateOfBirth, numerologyName } = body;

    if (!instagramId || !gender || !matchPreference || !dateOfBirth || !numerologyName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const dob = new Date(dateOfBirth);
    const profile = calculateNumerologyProfile(numerologyName, dob);

    const user = await prisma.user.update({
      where: { instagramId },
      data: {
        gender: gender as Gender,
        matchPreference: matchPreference as MatchPreference,
        dateOfBirth: dob,
        numerologyName,
        lifePathNumber: profile.lifePathNumber,
        expressionNumber: profile.expressionNumber,
        soulUrgeNumber: profile.soulUrgeNumber,
        lastActiveAt: new Date(),
      },
    });

    runMatchingEngine(user.id).catch(console.error);

    return NextResponse.json({
      success: true,
      userId: user.id,
      numerology: profile,
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { instagramId, age, city, interests, relationshipGoal, personalityType, dealbreakers, funAnswer } = body;

    if (!instagramId) {
      return NextResponse.json({ error: 'Missing instagramId' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { instagramId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.userProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        age,
        city,
        interests: interests || [],
        relationshipGoal,
        personalityType,
        dealbreakers,
        funAnswer,
      },
      update: {
        age,
        city,
        interests: interests || [],
        relationshipGoal,
        personalityType,
        dealbreakers,
        funAnswer,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Profile setup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
