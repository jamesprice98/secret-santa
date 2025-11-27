'use client'

import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface Assignment {
  receiverName: string
  createdAt: string
}

export default function ParticipantDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/participant/login')
    } else if (status === 'authenticated' && (session?.user as any)?.role !== 'participant') {
      router.push('/participant/login')
    }
  }, [status, session, router])

  useEffect(() => {
    if (status === 'authenticated' && (session?.user as any)?.role === 'participant') {
      fetchAssignment()
    }
  }, [status, session])

  const fetchAssignment = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/participant/assignment')
      
      if (response.status === 401) {
        router.push('/participant/login')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch assignment')
      }

      const data = await response.json()
      setAssignment(data.assignment)
      setError('')
    } catch (err) {
      setError('Failed to load your assignment')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/participant/login')
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated' || (session?.user as any)?.role !== 'participant') {
    return null
  }

  const userName = (session?.user as any)?.name || session?.user?.email

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Secret Santa Dashboard</h1>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {userName}!</h2>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          {assignment ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  🎄 Your Secret Santa Assignment 🎄
                </h3>
                <div className="bg-white rounded-lg p-4 border-2 border-green-300">
                  <p className="text-center text-2xl font-bold text-gray-900 mb-2">
                    You are the Secret Santa for:
                  </p>
                  <p className="text-center text-3xl font-extrabold text-blue-600">
                    {assignment.receiverName}
                  </p>
                </div>
                <p className="mt-4 text-sm text-gray-600 text-center">
                  Assignment created on {new Date(assignment.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> Keep this information secret! The magic of Secret Santa is in the surprise.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                ⏳ No Assignment Yet
              </h3>
              <p className="text-yellow-800">
                Your Secret Santa assignment hasn't been generated yet. Check back later, or contact the event organizer.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

