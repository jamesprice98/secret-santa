'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import ParticipantList from '@/components/ParticipantList'
import Link from 'next/link'

interface Assignment {
  id: string
  giver: string
  receiver: string
  createdAt: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchAssignments = async () => {
    try {
      setIsLoadingAssignments(true)
      const response = await fetch('/api/assign')
      if (!response.ok) throw new Error('Failed to fetch assignments')
      const data = await response.json()
      setAssignments(data.assignments || [])
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoadingAssignments(false)
    }
  }

  useEffect(() => {
    fetchAssignments()
  }, [])

  const handleGenerateAssignments = async () => {
    const hasExisting = assignments.length > 0
    const confirmMessage = hasExisting
      ? 'Are you sure you want to regenerate assignments? This will delete existing assignments and send new notifications to all participants.'
      : 'Are you sure you want to generate assignments? This will send notifications to all participants.'
    
    if (!confirm(confirmMessage)) {
      return
    }

    setIsGenerating(true)
    setMessage(null)

    try {
      const response = await fetch('/api/assign', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate assignments')
      }

      setMessage({ type: 'success', text: 'Assignments generated and notifications sent successfully!' })
      await fetchAssignments()
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to generate assignments',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleResetAssignments = async () => {
    if (!confirm('Are you sure you want to delete all assignments? This will not send any notifications.')) {
      return
    }

    setIsResetting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/assign', {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset assignments')
      }

      setMessage({ type: 'success', text: `Successfully deleted ${data.deletedCount} assignment(s).` })
      await fetchAssignments()
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to reset assignments',
      })
    } finally {
      setIsResetting(false)
    }
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Secret Santa Admin</h1>
            <div className="flex gap-4">
              <Link
                href="/admin/spouses"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Manage Spouses
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Generate Assignments</h2>
            <div className="flex gap-3">
              {assignments.length > 0 && (
                <button
                  onClick={handleResetAssignments}
                  disabled={isResetting}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isResetting ? 'Resetting...' : 'Reset Assignments'}
                </button>
              )}
              <button
                onClick={handleGenerateAssignments}
                disabled={isGenerating}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? 'Generating...' : assignments.length > 0 ? 'Regenerate Assignments' : 'Generate Assignments'}
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Once all participants are registered and spouse relationships are set, click to generate Secret Santa assignments.
            Notifications will be sent automatically via email. You can regenerate assignments for testing.
          </p>
        </div>

        {assignments.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Assignments</h2>
            {isLoadingAssignments ? (
              <div className="text-center py-4">Loading assignments...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giver
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Receiver
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {assignments.map((assignment) => (
                      <tr key={assignment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {assignment.giver}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {assignment.receiver}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <ParticipantList />
        </div>
      </div>
    </div>
  )
}

