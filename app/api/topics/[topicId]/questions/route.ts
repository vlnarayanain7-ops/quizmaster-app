import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ topicId: string }> }) {
  try {
    const { topicId } = await params;
    const questions = await prisma.question.findMany({
      where: { topicId },
      orderBy: { createdAt: 'asc' }
    });
    
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ topicId: string }> }) {
  try {
    const { topicId } = await params;
    const { text, options, correctOption } = await request.json();
    
    if (!text || !options || options.length < 2 || correctOption === undefined) {
      return NextResponse.json({ error: 'Invalid question data' }, { status: 400 });
    }
    
    const question = await prisma.question.create({
      data: { 
        text, 
        options: JSON.stringify(options), 
        correctOption, 
        topicId 
      }
    });
    
    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}
