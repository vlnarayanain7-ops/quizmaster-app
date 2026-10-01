import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { score, total, wrongQuestionIds } = await request.json();
    
    // Hardcoded user for demo
    const email = 'admin@quizmaster.com';
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const xpEarned = score * 50; // 50 XP per correct answer
    
    // Calculate new level (every 500 XP = 1 Level)
    const totalXp = user.xp + xpEarned;
    const newLevel = Math.floor(totalXp / 500) + 1;

    // Update user stats
    await prisma.user.update({
      where: { email },
      data: {
        xp: totalXp,
        level: newLevel > user.level ? newLevel : user.level
      }
    });

    // Record wrong answers
    if (wrongQuestionIds && wrongQuestionIds.length > 0) {
      const wrongData = wrongQuestionIds.map((qId: string) => ({
        userId: user.id,
        questionId: qId
      }));
      await prisma.wrongAnswer.createMany({
        data: wrongData
      });
    }

    return NextResponse.json({ success: true, xpEarned, newLevel });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save quiz results' }, { status: 500 });
  }
}
