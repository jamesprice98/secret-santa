import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

// DELETE: Remove a participant
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params

    // Check if participant exists
    const participant = await prisma.participant.findUnique({
      where: { id },
    })

    if (!participant) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      )
    }

    // Delete the participant (cascade will handle related records)
    // This will automatically delete:
    // - Spouse pairs (via onDelete: Cascade)
    // - Assignments (via onDelete: Cascade)
    // - Present ideas (via onDelete: Cascade)
    await prisma.participant.delete({
      where: { id },
    })

    return NextResponse.json({ 
      message: 'Participant deleted successfully',
      deletedParticipant: { id: participant.id, name: participant.name }
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error deleting participant:', error)
    return NextResponse.json(
      { error: 'Failed to delete participant' },
      { status: 500 }
    )
  }
}

