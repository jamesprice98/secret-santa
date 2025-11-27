import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth-config'

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentAdmin() {
  const session = await getSession()
  if (session?.user && (session.user as any).role === 'admin') {
    return session.user
  }
  return null
}

export async function getCurrentParticipant() {
  const session = await getSession()
  if (session?.user && (session.user as any).role === 'participant') {
    return session.user
  }
  return null
}

export async function requireAdmin() {
  const session = await getSession()
  if (!session?.user || (session.user as any).role !== 'admin') {
    throw new Error('Unauthorized')
  }
  return session.user
}

export async function requireParticipant() {
  const session = await getSession()
  if (!session?.user || (session.user as any).role !== 'participant') {
    throw new Error('Unauthorized')
  }
  return session.user
}
