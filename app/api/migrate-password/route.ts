import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Temporary endpoint to add password column
// DELETE THIS FILE after running it once!
export async function GET() {
  try {
    // Run the SQL to add the password column
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Participant" ADD COLUMN IF NOT EXISTS "password" TEXT;
    `)

    return NextResponse.json({ 
      success: true, 
      message: 'Password column added successfully! You can now delete this API route.' 
    })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json(
      { 
        error: 'Migration failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  return GET()
}

