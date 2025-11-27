import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session?.user || (session.user as any).role !== 'participant') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const participantId = (session.user as any).id

    // Find the assignment where this participant is the giver
    const assignment = await prisma.assignment.findFirst({
      where: {
        giverId: participantId,
      },
      include: {
        receiver: {
          select: {
            name: true,
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!assignment) {
      return NextResponse.json({ assignment: null })
    }

    // Get the receiver's wishlist
    const receiverWishlist = await prisma.presentIdea.findMany({
      where: {
        participantId: assignment.receiver.id,
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        idea: true,
      },
    })

    return NextResponse.json({
      assignment: {
        receiverName: assignment.receiver.name,
        receiverId: assignment.receiver.id,
        createdAt: assignment.createdAt,
        receiverWishlist: receiverWishlist,
      },
    })
  } catch (error) {
    console.error('Error fetching participant assignment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assignment' },
      { status: 500 }
    )
  }
}

