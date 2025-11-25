import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone } = body

    // Validate that at least one contact method is provided
    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { error: 'Name and at least one contact method (email or phone) are required' },
        { status: 400 }
      )
    }

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if participant already exists (by email or phone)
    const existing = await prisma.participant.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : []),
        ],
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'A participant with this email or phone number already exists' },
        { status: 409 }
      )
    }

    // Create participant
    const participant = await prisma.participant.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
      },
    })

    return NextResponse.json(
      { message: 'Registration successful!', participant: { id: participant.id, name: participant.name } },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register participant' },
      { status: 500 }
    )
  }
}

