import { PrismaClient } from '@/generated/prisma-client/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getPrismaClient() {
  // Vercel Postgres provides multiple connection strings:
  // - POSTGRES_URL: Direct connection (best for our adapter)
  // - POSTGRES_PRISMA_URL: Prisma connection string
  // - DATABASE_URL: May be Prisma Accelerate URL (not compatible with adapter)
  
  // Prefer POSTGRES_URL or POSTGRES_PRISMA_URL over DATABASE_URL
  // to avoid Prisma Accelerate URLs
  const connectionString = process.env.POSTGRES_URL || 
                          process.env.POSTGRES_PRISMA_URL || 
                          process.env.DATABASE_URL
  
  if (!connectionString) {
    const envKeys = Object.keys(process.env).filter(k => 
      k.includes('DATABASE') || k.includes('POSTGRES') || k.includes('PRISMA')
    )
    console.error('No database connection string found!')
    console.error('Available env vars:', envKeys)
    console.error('Looking for: POSTGRES_URL, POSTGRES_PRISMA_URL, or DATABASE_URL')
    throw new Error('Database connection string environment variable is not set')
  }
  
  // Reject Prisma Accelerate URLs (they start with "prisma+")
  if (connectionString.startsWith('prisma+')) {
    console.error('ERROR: Prisma Accelerate URL detected, but we need a direct connection!')
    console.error('Please use POSTGRES_URL or POSTGRES_PRISMA_URL instead of DATABASE_URL')
    console.error('Current connection string starts with:', connectionString.substring(0, 50))
    throw new Error('Prisma Accelerate URLs are not supported. Use POSTGRES_URL or POSTGRES_PRISMA_URL instead.')
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

