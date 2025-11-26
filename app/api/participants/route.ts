import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    await requireAdmin()

    const participants = await prisma.participant.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        spousePairs1: {
          include: {
            participant2: true,
          },
        },
        spousePairs2: {
          include: {
            participant1: true,
          },
        },
      },
    }) as Array<{
      id: string
      name: string
      email: string | null
      phone: string | null
      createdAt: Date
      spousePairs1: Array<{ participant2: { name: string } }>
      spousePairs2: Array<{ participant1: { name: string } }>
    }>

    // Format participants with their spouses
    const formatted = participants.map((p) => {
      const spouses = [
        ...p.spousePairs1.map((sp) => sp.participant2.name),
        ...p.spousePairs2.map((sp) => sp.participant1.name),
      ]
      return {
        id: p.id,
        name: p.name,
        email: p.email,
        phone: p.phone,
        createdAt: p.createdAt,
        spouses,
      }
    })

    return NextResponse.json({ participants: formatted })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching participants:', error)
    return NextResponse.json({ error: 'Failed to fetch participants' }, { status: 500 })
  }
}

