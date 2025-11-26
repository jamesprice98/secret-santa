import { PrismaClient } from '@/generated/prisma-client/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getPrismaClient() {
  const connectionString = process.env.DATABASE_URL
  
  if (!connectionString) {
    console.error('DATABASE_URL is not set! Available env vars:', Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('POSTGRES')))
    throw new Error('DATABASE_URL environment variable is not set')
  }
  
  // Log for debugging
  console.log('Initializing Prisma with DATABASE_URL:', connectionString.substring(0, 30) + '...')
  
  // Ensure it's not localhost
  if (connectionString.includes('localhost') || connectionString.includes('127.0.0.1')) {
    console.error('WARNING: DATABASE_URL points to localhost! This will not work in production.')
  }
  
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? getPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

