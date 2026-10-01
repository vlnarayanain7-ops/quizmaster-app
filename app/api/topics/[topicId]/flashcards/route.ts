import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ topicId: string }> }) {
  try {
    const { topicId } = await params;
    const flashcards = await prisma.flashcard.findMany({
      where: { topicId },
      orderBy: { createdAt: 'asc' }
    });
    
    return NextResponse.json(flashcards);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch flashcards' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ topicId: string }> }) {
  try {
    const { topicId } = await params;
    const { front, back } = await request.json();
    
    if (!front || !back) return NextResponse.json({ error: 'Front and back are required' }, { status: 400 });
    
    const flashcard = await prisma.flashcard.create({
      data: { front, back, topicId }
    });
    
    return NextResponse.json(flashcard, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create flashcard' }, { status: 500 });
  }
}
