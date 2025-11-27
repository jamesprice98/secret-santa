import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { generateAssignments } from '@/lib/assignment'
import { sendAssignmentEmails } from '@/lib/notifications'

export async function POST() {
  try {
    await requireAdmin()

    // Delete existing assignments if they exist (allow regeneration for testing)
    // This allows testing by regenerating assignments
    const existingAssignments = await prisma.assignment.findMany()
    if (existingAssignments.length > 0) {
      await prisma.assignment.deleteMany()
      console.log(`Deleted ${existingAssignments.length} existing assignment(s) before generating new ones`)
    }

    // Get all participants
    const participants = await prisma.participant.findMany()
    
    if (participants.length < 2) {
      return NextResponse.json(
        { error: 'Need at least 2 participants to generate assignments' },
        { status: 400 }
      )
    }

    // Get all spouse pairs
    const spousePairs = await prisma.spousePair.findMany({
      include: {
        participant1: true,
        participant2: true,
      },
    })

    // Generate assignments
    const assignments = generateAssignments(participants, spousePairs)

    if (!assignments) {
      return NextResponse.json(
        { error: 'Unable to generate valid assignments. Check spouse relationships.' },
        { status: 400 }
      )
    }

    // Save assignments to database
    await prisma.assignment.createMany({
      data: assignments.map((a) => ({
        giverId: a.giverId,
        receiverId: a.receiverId,
      })),
    })

    // Send notifications
    const savedAssignments = await prisma.assignment.findMany({
      include: {
        giver: true,
        receiver: true,
      },
    }) as Array<{
      id: string
      giverId: string
      receiverId: string
      giver: { name: string; email: string | null; phone: string | null }
      receiver: { name: string }
      createdAt: Date
    }>

    // Send emails
    for (const assignment of savedAssignments) {
      if (assignment.giver.email) {
        await sendAssignmentEmails(assignment.giver.email, assignment.giver.name, assignment.receiver.name)
      }
    }

    return NextResponse.json({
      message: 'Assignments generated and notifications sent successfully',
      assignments: savedAssignments.map((a) => ({
        giver: a.giver.name,
        receiver: a.receiver.name,
      })),
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error generating assignments:', error)
    return NextResponse.json(
      { error: 'Failed to generate assignments' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await requireAdmin()

    const assignments = await prisma.assignment.findMany({
      include: {
        giver: {
          select: {
            id: true,
            name: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }) as Array<{
      id: string
      giver: { id: string; name: string }
      receiver: { id: string; name: string }
      createdAt: Date
    }>

    // Get all unique participant IDs to create consistent obfuscation
    const participantIds = new Set<string>()
    assignments.forEach(a => {
      participantIds.add(a.giver.id)
      participantIds.add(a.receiver.id)
    })

    // Create consistent obfuscation mapping (sorted for consistency)
    const sortedIds = Array.from(participantIds).sort()
    const obfuscationMap = new Map<string, string>()
    sortedIds.forEach((id, index) => {
      obfuscationMap.set(id, `Participant ${String.fromCharCode(65 + index)}`) // A, B, C, etc.
    })

    // Get spouse pairs to verify no spouse matches
    const spousePairs = await prisma.spousePair.findMany({
      select: {
        participant1Id: true,
        participant2Id: true,
      },
    })

    // Check if any assignments violate spouse rules
    const spouseViolations = assignments.filter(a => {
      return spousePairs.some(sp => 
        (sp.participant1Id === a.giver.id && sp.participant2Id === a.receiver.id) ||
        (sp.participant1Id === a.receiver.id && sp.participant2Id === a.giver.id)
      )
    })

    return NextResponse.json({
      assignments: assignments.map((a) => ({
        id: a.id,
        giver: obfuscationMap.get(a.giver.id) || 'Unknown',
        receiver: obfuscationMap.get(a.receiver.id) || 'Unknown',
        createdAt: a.createdAt,
      })),
      verification: {
        totalAssignments: assignments.length,
        uniqueParticipants: participantIds.size,
        spouseViolations: spouseViolations.length,
        allValid: spouseViolations.length === 0,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching assignments:', error)
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    await requireAdmin()

    const deleted = await prisma.assignment.deleteMany()
    
    return NextResponse.json({
      message: `Successfully deleted ${deleted.count} assignment(s)`,
      deletedCount: deleted.count,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error deleting assignments:', error)
    return NextResponse.json(
      { error: 'Failed to delete assignments' },
      { status: 500 }
    )
  }
}

