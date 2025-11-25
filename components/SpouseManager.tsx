'use client'

import { useEffect, useState } from 'react'

interface Participant {
  id: string
  name: string
}

interface SpousePair {
  id: string
  participant1: Participant
  participant2: Participant
}

export default function SpouseManager() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [spousePairs, setSpousePairs] = useState<SpousePair[]>([])
  const [selectedParticipant1, setSelectedParticipant1] = useState('')
  const [selectedParticipant2, setSelectedParticipant2] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [participantsRes, spousesRes] = await Promise.all([
        fetch('/api/participants'),
        fetch('/api/spouses'),
      ])

      if (!participantsRes.ok || !spousesRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const participantsData = await participantsRes.json()
      const spousesData = await spousesRes.json()

      setParticipants(participantsData.participants)
      setSpousePairs(spousesData.spousePairs)
      setMessage(null)
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load data' })
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAddSpousePair = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedParticipant1 || !selectedParticipant2) {
      setMessage({ type: 'error', text: 'Please select both participants' })
      return
    }

    if (selectedParticipant1 === selectedParticipant2) {
      setMessage({ type: 'error', text: 'A participant cannot be their own spouse' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/spouses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participant1Id: selectedParticipant1,
          participant2Id: selectedParticipant2,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create spouse pair')
      }

      setMessage({ type: 'success', text: 'Spouse pair added successfully!' })
      setSelectedParticipant1('')
      setSelectedParticipant2('')
      await fetchData()
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to add spouse pair',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteSpousePair = async (id: string) => {
    if (!confirm('Are you sure you want to remove this spouse pair?')) {
      return
    }

    try {
      const response = await fetch(`/api/spouses?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete spouse pair')
      }

      setMessage({ type: 'success', text: 'Spouse pair removed successfully!' })
      await fetchData()
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to remove spouse pair',
      })
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Add Spouse Pair</h3>
        <form onSubmit={handleAddSpousePair} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="participant1" className="block text-sm font-medium text-gray-700 mb-1">
                Participant 1
              </label>
              <select
                id="participant1"
                value={selectedParticipant1}
                onChange={(e) => setSelectedParticipant1(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select participant...</option>
                {participants.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="participant2" className="block text-sm font-medium text-gray-700 mb-1">
                Participant 2
              </label>
              <select
                id="participant2"
                value={selectedParticipant2}
                onChange={(e) => setSelectedParticipant2(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select participant...</option>
                {participants
                  .filter((p) => p.id !== selectedParticipant1)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !selectedParticipant1 || !selectedParticipant2}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Adding...' : 'Add Spouse Pair'}
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Existing Spouse Pairs</h3>
        {spousePairs.length === 0 ? (
          <p className="text-gray-500">No spouse pairs defined yet.</p>
        ) : (
          <div className="space-y-2">
            {spousePairs.map((pair) => (
              <div
                key={pair.id}
                className="flex justify-between items-center bg-white border border-gray-200 rounded-lg p-4"
              >
                <span className="text-gray-900">
                  <span className="font-medium">{pair.participant1.name}</span>
                  {' ↔ '}
                  <span className="font-medium">{pair.participant2.name}</span>
                </span>
                <button
                  onClick={() => handleDeleteSpousePair(pair.id)}
                  className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

