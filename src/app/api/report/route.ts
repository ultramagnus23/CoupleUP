import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { instagramId, coupleId, reason, detail } = body;

    if (!instagramId || !coupleId || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const reporter = await prisma.user.findUnique({ where: { instagramId } });
    if (!reporter) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.report.create({
      data: {
        reporterId: reporter.id,
        coupleId,
        reason,
        detail: detail || null,
      },
    });

    const reportCount = await prisma.report.count({
      where: { coupleId, status: 'PENDING' },
    });

    if (reportCount >= 5) {
      await prisma.couple.update({
        where: { id: coupleId },
        data: { isActive: false },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Report error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
