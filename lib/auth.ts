import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth-config'

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentAdmin() {
  const session = await getSession()
  return session?.user
}

export async function requireAdmin() {
  const session = await getSession()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  return session.user
}
