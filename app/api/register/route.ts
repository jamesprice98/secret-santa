import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

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

    // Hash password if provided
    let hashedPassword: string | undefined
    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters' },
          { status: 400 }
        )
      }
      hashedPassword = await bcrypt.hash(password, 10)
    }

    // Create participant
    const participant = await prisma.participant.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return NextResponse.json(
      { 
        message: 'Registration successful! You can now log in to view your assignment.',
        participant: { id: participant.id, name: participant.name },
        hasPassword: !!hashedPassword,
      },
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

