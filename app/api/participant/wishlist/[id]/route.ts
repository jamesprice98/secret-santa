import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireParticipant } from '@/lib/auth'

// PUT: Update an existing idea
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const participant = await requireParticipant()
    const participantId = (participant as any).id
    const { id } = await params

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

    // Verify the idea belongs to this participant
    const existing = await prisma.presentIdea.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Wishlist item not found' },
        { status: 404 }
      )
    }

    if (existing.participantId !== participantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const updated = await prisma.presentIdea.update({
      where: { id },
      data: {
        idea: idea.trim(),
      },
    })

    return NextResponse.json({ idea: updated })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error updating wishlist item:', error)
    return NextResponse.json(
      { error: 'Failed to update wishlist item' },
      { status: 500 }
    )
  }
}

// DELETE: Remove an idea from wishlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const participant = await requireParticipant()
    const participantId = (participant as any).id
    const { id } = await params

    // Verify the idea belongs to this participant
    const existing = await prisma.presentIdea.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Wishlist item not found' },
        { status: 404 }
      )
    }

    if (existing.participantId !== participantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    await prisma.presentIdea.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Wishlist item deleted successfully' })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error deleting wishlist item:', error)
    return NextResponse.json(
      { error: 'Failed to delete wishlist item' },
      { status: 500 }
    )
  }
}

