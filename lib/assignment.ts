interface Participant {
  id: string
  name: string
}

interface SpousePair {
  participant1Id: string
  participant2Id: string
}

interface Assignment {
  giverId: string
  receiverId: string
}

/**
 * Generates Secret Santa assignments ensuring:
 * - No one is assigned to themselves
 * - Spouses are not assigned to each other
 * Uses a backtracking algorithm to find a valid permutation
 */
export function generateAssignments(
  participants: Participant[],
  spousePairs: SpousePair[]
): Assignment[] | null {
  if (participants.length < 2) {
    return null
  }

  // Create a map of spouse relationships for quick lookup
  const spouseMap = new Map<string, Set<string>>()
  
  for (const pair of spousePairs) {
    if (!spouseMap.has(pair.participant1Id)) {
      spouseMap.set(pair.participant1Id, new Set())
    }
    if (!spouseMap.has(pair.participant2Id)) {
      spouseMap.set(pair.participant2Id, new Set())
    }
    spouseMap.get(pair.participant1Id)!.add(pair.participant2Id)
    spouseMap.get(pair.participant2Id)!.add(pair.participant1Id)
  }

  // Helper function to check if an assignment is valid
  const isValidAssignment = (giverId: string, receiverId: string): boolean => {
    // Can't assign to self
    if (giverId === receiverId) {
      return false
    }
    
    // Can't assign to spouse
    const spouses = spouseMap.get(giverId)
    if (spouses && spouses.has(receiverId)) {
      return false
    }
    
    return true
  }

  // Create array of participant IDs
  const participantIds = participants.map((p) => p.id)
  const receivers = [...participantIds]

  // Try to find a valid assignment using backtracking
  const assignments: Assignment[] = []
  const usedReceivers = new Set<string>()

  const backtrack = (index: number): boolean => {
    if (index === participantIds.length) {
      return true // All participants assigned
    }

    const giverId = participantIds[index]
    const availableReceivers = receivers.filter(
      (receiverId) => !usedReceivers.has(receiverId) && isValidAssignment(giverId, receiverId)
    )

    // Shuffle available receivers for randomness
    for (let i = availableReceivers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[availableReceivers[i], availableReceivers[j]] = [availableReceivers[j], availableReceivers[i]]
    }

    for (const receiverId of availableReceivers) {
      usedReceivers.add(receiverId)
      assignments.push({ giverId, receiverId })

      if (backtrack(index + 1)) {
        return true
      }

      // Backtrack
      assignments.pop()
      usedReceivers.delete(receiverId)
    }

    return false
  }

  // Try multiple times with different shuffles if first attempt fails
  for (let attempt = 0; attempt < 100; attempt++) {
    assignments.length = 0
    usedReceivers.clear()
    
    // Shuffle receivers for randomness
    for (let i = receivers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[receivers[i], receivers[j]] = [receivers[j], receivers[i]]
    }

    if (backtrack(0)) {
      return assignments
    }
  }

  return null // Could not find valid assignment
}

