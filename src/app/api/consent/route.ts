import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { instagramId, username, displayName, profilePhotoUrl, checkbox1, checkbox2, checkbox3 } = body;

    if (!checkbox1 || !checkbox2 || !checkbox3) {
      return NextResponse.json({ error: 'All checkboxes must be checked' }, { status: 400 });
    }

    if (!instagramId || !username || !displayName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || '';
    const tcVersion = process.env.TC_VERSION || '1.0';
    const now = new Date();

    const user = await prisma.user.upsert({
      where: { instagramId },
      create: {
        instagramId,
        username,
        displayName,
        profilePhotoUrl: profilePhotoUrl || '',
        consentGiven: true,
        consentTimestamp: now,
        consentIp: ip,
        consentUserAgent: userAgent,
      },
      update: {
        username,
        displayName,
        profilePhotoUrl: profilePhotoUrl || '',
        consentGiven: true,
        consentTimestamp: now,
        consentIp: ip,
        consentUserAgent: userAgent,
        lastActiveAt: now,
      },
    });

    await prisma.consentRecord.create({
      data: {
        userId: user.id,
        consentTimestamp: now,
        ipAddress: ip,
        userAgent,
        tcVersion,
        checkbox1,
        checkbox2,
        checkbox3,
      },
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error) {
    console.error('Consent error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
