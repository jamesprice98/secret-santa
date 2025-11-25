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
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Spouse(s)
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
                  {participant.phone || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {participant.spouses.length > 0 ? participant.spouses.join(', ') : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

