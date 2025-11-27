'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function ParticipantLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('participant', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        router.push('/participant/dashboard')
        router.refresh()
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-green-50 to-red-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-3xl animate-bounce">🎄</div>
      <div className="absolute top-20 right-20 text-2xl animate-pulse">❄️</div>
      <div className="absolute bottom-20 left-20 text-2xl animate-bounce delay-300">🎁</div>
      
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl border-4 border-green-200 relative z-10">
        <div>
          <div className="text-center text-5xl mb-4">🎅</div>
          <h2 className="mt-2 text-center text-3xl font-extrabold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
            Participant Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-700 font-medium">
            Log in to view your Secret Santa assignment 🎄
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform transition hover:scale-105"
            >
              {isLoading ? '🎄 Logging in...' : '🎁 Log in'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-700 font-medium">
              Not registered yet?{' '}
              <Link href="/" className="font-bold text-red-600 hover:text-green-600 transition-colors">
                Register here ✨
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

