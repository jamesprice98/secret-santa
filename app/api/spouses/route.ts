import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    await requireAdmin()

    const spousePairs = await prisma.spousePair.findMany({
      include: {
        participant1: true,
        participant2: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      spousePairs: spousePairs.map((sp) => ({
        id: sp.id,
        participant1: {
          id: sp.participant1.id,
          name: sp.participant1.name,
        },
        participant2: {
          id: sp.participant2.id,
          name: sp.participant2.name,
        },
      })),
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching spouse pairs:', error)
    return NextResponse.json({ error: 'Failed to fetch spouse pairs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const { participant1Id, participant2Id } = body

    if (!participant1Id || !participant2Id) {
      return NextResponse.json(
        { error: 'Both participant IDs are required' },
        { status: 400 }
      )
    }

    if (participant1Id === participant2Id) {
      return NextResponse.json(
        { error: 'A participant cannot be their own spouse' },
        { status: 400 }
      )
    }

    // Check if pair already exists (in either direction)
    const existing = await prisma.spousePair.findFirst({
      where: {
        OR: [
          {
            participant1Id,
            participant2Id,
          },
          {
            participant1Id: participant2Id,
            participant2Id: participant1Id,
          },
        ],
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'This spouse pair already exists' },
        { status: 409 }
      )
    }

    // Ensure consistent ordering (smaller ID first)
    const [id1, id2] = participant1Id < participant2Id
      ? [participant1Id, participant2Id]
      : [participant2Id, participant1Id]

    const spousePair = await prisma.spousePair.create({
      data: {
        participant1Id: id1,
        participant2Id: id2,
      },
      include: {
        participant1: true,
        participant2: true,
      },
    })

    return NextResponse.json({
      message: 'Spouse pair created successfully',
      spousePair: {
        id: spousePair.id,
        participant1: {
          id: spousePair.participant1.id,
          name: spousePair.participant1.name,
        },
        participant2: {
          id: spousePair.participant2.id,
          name: spousePair.participant2.name,
        },
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error creating spouse pair:', error)
    return NextResponse.json({ error: 'Failed to create spouse pair' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Spouse pair ID is required' },
        { status: 400 }
      )
    }

    await prisma.spousePair.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Spouse pair deleted successfully' })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error deleting spouse pair:', error)
    return NextResponse.json({ error: 'Failed to delete spouse pair' }, { status: 500 })
  }
}

