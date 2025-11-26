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
  
  // Ensure it's not localhost in production runtime (but allow during build)
  // During build, Next.js may use a local DATABASE_URL for static generation
  // We only enforce this check at actual runtime in Vercel
  const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                      process.env.NEXT_PHASE === 'phase-development-build' ||
                      !process.env.VERCEL_ENV
  
  if ((connectionString.includes('localhost') || connectionString.includes('127.0.0.1')) && !isBuildTime) {
    // Only throw at runtime in Vercel, not during build
    if (process.env.VERCEL) {
      console.error('ERROR: DATABASE_URL points to localhost in production!')
      console.error('Full DATABASE_URL:', connectionString)
      throw new Error('DATABASE_URL cannot point to localhost in production')
    }
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

// Initialize lazily to ensure environment variables are available
// Use a getter function instead of initializing at module load
function getPrisma() {
  if (process.env.NODE_ENV === 'production') {
    // In production, always create a new client to ensure fresh env vars
    return getPrismaClient()
  } else {
    // In development, use globalThis to prevent multiple PrismaClient instances
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = getPrismaClient()
    }
    return globalForPrisma.prisma
  }
}

// Export a proxy that initializes on first access
// This prevents initialization during build time
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    const client = getPrisma()
    const value = (client as any)[prop]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  }
})

