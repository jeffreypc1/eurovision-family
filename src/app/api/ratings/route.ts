import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { songId, familyMemberId, stars, comment } = body;

  if (!songId || !familyMemberId || !stars || stars < 1 || stars > 5) {
    return NextResponse.json({ error: 'Invalid rating data' }, { status: 400 });
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
