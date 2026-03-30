import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// 5 MB limit
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * POST /api/upload-photo
 * Accepts multipart/form-data with a single "photo" file field.
 * Uploads to Vercel Blob, updates the user's profilePhotoUrl and marks photoUploaded = true.
 *
 * Required env var: BLOB_READ_WRITE_TOKEN (Vercel Blob)
 */
export async function POST(req: NextRequest) {
  try {
    // Require an authenticated session
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const instagramId = (session.user as { instagramId?: string }).instagramId;
    if (!instagramId) {
      return NextResponse.json({ error: 'Missing instagramId in session' }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get('photo') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No photo file provided' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5 MB.' }, { status: 400 });
    }

    // Sanitise file name — strip path segments and limit length
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
    const blobPath = `photos/${instagramId.replace(/[^a-zA-Z0-9_-]/g, '_')}/${Date.now()}_${safeName}`;

    // Upload to Vercel Blob (requires BLOB_READ_WRITE_TOKEN env var)
    const blob = await put(blobPath, file, { access: 'public' });

    // Persist the new photo URL and mark photoUploaded = true
    await prisma.user.update({
      where: { instagramId },
      data: {
        profilePhotoUrl: blob.url,
        photoUploaded: true,
        lastActiveAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, url: blob.url });
  } catch (error) {
    console.error('Upload photo error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
