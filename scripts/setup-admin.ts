import { PrismaClient, Prisma } from '../generated/prisma-client/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({} as any)

async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables')
    process.exit(1)
  }

  // Check if admin already exists
  const existing = await prisma.admin.findUnique({
    where: { email },
  })

  if (existing) {
    console.log(`Admin with email ${email} already exists. Updating password...`)
    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.admin.update({
      where: { email },
      data: { password: hashedPassword },
    })
    console.log('Admin password updated successfully!')
  } else {
    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
      },
    })
    console.log(`Admin account created successfully for ${email}!`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

