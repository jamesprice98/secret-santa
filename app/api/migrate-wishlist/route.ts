import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Temporary endpoint to create PresentIdea table
// DELETE THIS FILE after running it once!
export async function GET() {
  try {
    // Create the PresentIdea table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "PresentIdea" (
        "id" TEXT NOT NULL,
        "participantId" TEXT NOT NULL,
        "idea" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "PresentIdea_pkey" PRIMARY KEY ("id")
      );
    `)

    // Create index on participantId
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "PresentIdea_participantId_idx" ON "PresentIdea"("participantId");
    `)

    // Add foreign key constraint
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint 
          WHERE conname = 'PresentIdea_participantId_fkey'
        ) THEN
          ALTER TABLE "PresentIdea" 
          ADD CONSTRAINT "PresentIdea_participantId_fkey" 
          FOREIGN KEY ("participantId") 
          REFERENCES "Participant"("id") 
          ON DELETE CASCADE 
          ON UPDATE CASCADE;
        END IF;
      END $$;
    `)

    return NextResponse.json({ 
      success: true, 
      message: 'PresentIdea table created successfully! You can now delete this API route.' 
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

