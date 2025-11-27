import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireParticipant } from '@/lib/auth'

// GET: Fetch participant's wishlist
export async function GET() {
  try {
    const participant = await requireParticipant()
    const participantId = (participant as any).id

    const ideas = await prisma.presentIdea.findMany({
      where: {
        participantId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return NextResponse.json({ ideas })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

// POST: Add a new idea to wishlist
export async function POST(request: NextRequest) {
  try {
    const participant = await requireParticipant()
    const participantId = (participant as any).id

    const body = await request.json()
    const { idea } = body

    if (!idea || typeof idea !== 'string' || idea.trim().length === 0) {
      return NextResponse.json(
        { error: 'Idea text is required' },
        { status: 400 }
      )
    }

    if (idea.length > 500) {
      return NextResponse.json(
        { error: 'Idea must be 500 characters or less' },
        { status: 400 }
      )
    }

    const presentIdea = await prisma.presentIdea.create({
      data: {
        participantId,
        idea: idea.trim(),
      },
    })

    return NextResponse.json({ idea: presentIdea }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error adding wishlist item:', error)
    return NextResponse.json(
      { error: 'Failed to add wishlist item' },
      { status: 500 }
    )
  }
}

