import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'admin@quizmaster.com' },
      select: {
        name: true,
        xp: true,
        level: true,
        streak: true,
      }
    });
    
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user stats' }, { status: 500 });
  }
}
