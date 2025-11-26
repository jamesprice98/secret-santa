import { PrismaClient } from '@/generated/prisma-client/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getPrismaClient() {
  // Read DATABASE_URL at runtime, not at module load time
  const connectionString = process.env.DATABASE_URL
  
  if (!connectionString) {
    const envKeys = Object.keys(process.env).filter(k => 
      k.includes('DATABASE') || k.includes('POSTGRES') || k.includes('PRISMA')
    )
    console.error('DATABASE_URL is not set!')
    console.error('Available env vars:', envKeys)
    console.error('All env vars starting with D:', Object.keys(process.env).filter(k => k.startsWith('D')))
    throw new Error('DATABASE_URL environment variable is not set')
  }
  
  // Log for debugging
  console.log('Initializing Prisma with DATABASE_URL:', connectionString.substring(0, 50) + '...')
  
  // Ensure it's not localhost
  if (connectionString.includes('localhost') || connectionString.includes('127.0.0.1')) {
    console.error('ERROR: DATABASE_URL points to localhost!')
    console.error('Full DATABASE_URL:', connectionString)
    throw new Error('DATABASE_URL cannot point to localhost in production')
  }
  
  try {
    const pool = new Pool({ connectionString })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
  } catch (error) {
    console.error('Failed to create Prisma client:', error)
    throw error
  }
}

// Initialize the client - it will read DATABASE_URL when first used
// In production, don't cache to ensure fresh connection with correct env vars
let _prisma: PrismaClient | undefined

function getPrisma() {
  // In production, always create a new client to ensure fresh env vars
  if (process.env.NODE_ENV === 'production') {
    return getPrismaClient()
  }
  
  // In development, cache the client
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }
  
  const client = getPrismaClient()
  globalForPrisma.prisma = client
  return client
}

export const prisma = getPrisma()

