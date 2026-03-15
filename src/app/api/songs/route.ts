import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  const memberId = searchParams.get('memberId');

  const ratingWhere: Record<string, unknown> = {};

  if (dateFrom || dateTo) {
    ratingWhere.createdAt = {};
    if (dateFrom) (ratingWhere.createdAt as Record<string, unknown>).gte = new Date(dateFrom);
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      (ratingWhere.createdAt as Record<string, unknown>).lte = to;
    }
  }

  if (memberId && memberId !== 'all') {
    ratingWhere.familyMemberId = Number(memberId);
  }

  const year = searchParams.get('year');
  const songWhere: Record<string, unknown> = {};
  if (year) songWhere.year = Number(year);

  const songs = await prisma.song.findMany({
    where: songWhere,
    include: {
      ratings: {
        where: Object.keys(ratingWhere).length > 0 ? ratingWhere : undefined,
        include: {
          familyMember: true,
        },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { country: 'asc' },
  });

  return NextResponse.json(songs);
}
