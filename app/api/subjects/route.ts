import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        _count: {
          select: { topics: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(subjects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json();
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    
    const subject = await prisma.subject.create({
      data: { name, description }
    });
    
    return NextResponse.json(subject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create subject' }, { status: 500 });
  }
}
