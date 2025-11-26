import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials')
          return null
        }

        try {
          // Import prisma lazily to ensure DATABASE_URL is available
          const { prisma } = await import('@/lib/db')
          const admin = await prisma.admin.findUnique({
            where: { email: credentials.email },
          })

          if (!admin) {
            console.log('Admin not found:', credentials.email)
            return null
          }

          const isValid = await bcrypt.compare(credentials.password, admin.password)
          console.log('Password check result:', isValid)

          if (!isValid) {
            return null
          }

          return {
            id: admin.id,
            email: admin.email,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

