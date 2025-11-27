'use client'

import { useEffect, useState } from 'react'

interface Participant {
  id: string
  name: string
  email: string | null
  phone: string | null
  createdAt: string
  spouses: string[]
}

export default function ParticipantList() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchParticipants = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/participants')
      if (!response.ok) throw new Error('Failed to fetch participants')
      const data = await response.json()
      setParticipants(data.participants)
      setError('')
    } catch (err) {
      setError('Failed to load participants')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchParticipants()
  }, [])

  const handleDelete = async (participantId: string, participantName: string) => {
    if (!confirm(`Are you sure you want to delete ${participantName}? This will permanently remove them and all their data (assignments, spouse relationships, wishlist). They will be able to re-register.`)) {
      return
    }

    setDeletingId(participantId)
    setError('')

    try {
      const response = await fetch(`/api/participants/${participantId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete participant')
      }

      // Remove from local state
      setParticipants(participants.filter(p => p.id !== participantId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete participant')
      console.error(err)
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading participants...</div>
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        {error}
        <button
          onClick={fetchParticipants}
          className="ml-4 text-blue-600 hover:underline"
        >
          Retry
        </button>
      </div>
    )
  }

  if (participants.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No participants registered yet.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Participants ({participants.length})</h2>
        <button
          onClick={fetchParticipants}
          className="text-sm text-blue-600 hover:underline"
        >
          Refresh
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Spouse(s)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {participants.map((participant) => (
                  <tr key={participant.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {participant.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {participant.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {participant.spouses.length > 0 ? participant.spouses.join(', ') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDelete(participant.id, participant.name)}
                        disabled={deletingId === participant.id}
                        className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === participant.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    }

