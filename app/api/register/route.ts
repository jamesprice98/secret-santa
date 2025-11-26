import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email } = body

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if participant already exists (by email)
    const existing = await prisma.participant.findFirst({
      where: {
        email,
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'A participant with this email already exists' },
        { status: 409 }
      )
    }

    // Create participant
    const participant = await prisma.participant.create({
      data: {
        name,
        email,
      },
    })

    return NextResponse.json(
      { message: 'Registration successful!', participant: { id: participant.id, name: participant.name } },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { 
        error: 'Failed to register participant',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}

