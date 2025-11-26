import { PrismaClient } from '../generated/prisma-client/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL!
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function test() {
  const email = 'jamesprice98@gmail.com'
  const password = 'huerhuithui56&@we4'
  
  const admin = await prisma.admin.findUnique({
    where: { email },
  })
  
  if (!admin) {
    console.log('Admin not found!')
    process.exit(1)
  }
  
  console.log('Admin found:', admin.email)
  console.log('Password hash:', admin.password.substring(0, 20) + '...')
  
  const isValid = await bcrypt.compare(password, admin.password)
  console.log('Password valid:', isValid)
  
  if (!isValid) {
    console.log('Password does not match!')
    // Try rehashing
    const newHash = await bcrypt.hash(password, 10)
    console.log('New hash would be:', newHash.substring(0, 20) + '...')
  }
  
  await prisma.$disconnect()
}

test().catch(console.error)

