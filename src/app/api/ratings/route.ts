import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { songId, familyMemberId, stars, comment } = body;

  if (!songId || !familyMemberId || stars < 0 || stars > 5) {
    return NextResponse.json({ error: 'Invalid rating data' }, { status: 400 });
  }

  // Must have either a star rating or a comment
  if (stars === 0 && !comment?.trim()) {
    return NextResponse.json({ error: 'Comment required for comment-only entries' }, { status: 400 });
  }

  const rating = await prisma.rating.create({
    data: {
      songId: Number(songId),
      familyMemberId: Number(familyMemberId),
      stars: Number(stars),
      comment: comment || null,
    },
    include: {
      familyMember: true,
      song: true,
    },
  });

  return NextResponse.json(rating);
}
