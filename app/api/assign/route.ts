import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { generateAssignments } from '@/lib/assignment'
import { sendAssignmentEmails, sendAssignmentSMS } from '@/lib/notifications'

export async function POST() {
  try {
    await requireAdmin()

    // Check if assignments already exist
    const existingAssignments = await prisma.assignment.findFirst()
    if (existingAssignments) {
      return NextResponse.json(
        { error: 'Assignments have already been generated. Please reset the database to generate new assignments.' },
        { status: 400 }
      )
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
    })

    // Send emails and SMS
    for (const assignment of savedAssignments) {
      if (assignment.giver.email) {
        await sendAssignmentEmails(assignment.giver.email, assignment.giver.name, assignment.receiver.name)
      }
      if (assignment.giver.phone) {
        await sendAssignmentSMS(assignment.giver.phone, assignment.giver.name, assignment.receiver.name)
      }
    }

    return NextResponse.json({
      message: 'Assignments generated and notifications sent successfully',
      assignments: savedAssignments.map((a: typeof savedAssignments[0]) => ({
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
        giver: true,
        receiver: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      assignments: assignments.map((a: typeof assignments[0]) => ({
        id: a.id,
        giver: a.giver.name,
        receiver: a.receiver.name,
        createdAt: a.createdAt,
      })),
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching assignments:', error)
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 })
  }
}

