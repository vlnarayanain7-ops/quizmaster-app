import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const subject = await prisma.subject.findUnique({
      where: { id },
      include: {
        topics: {
          include: {
            _count: {
              select: { questions: true, flashcards: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!subject) return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    return NextResponse.json(subject);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch subject details' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { name, description } = await request.json();
    
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    
    const topic = await prisma.topic.create({
      data: { 
        name, 
        description,
        subjectId: id 
      }
    });
    
    return NextResponse.json(topic, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create topic' }, { status: 500 });
  }
}
