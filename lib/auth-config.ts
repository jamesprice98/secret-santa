import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    // Admin provider
    CredentialsProvider({
      id: 'admin',
      name: 'Admin',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const { prisma } = await import('@/lib/db')
          const admin = await prisma.admin.findUnique({
            where: { email: credentials.email },
          })

          if (!admin) {
            return null
          }

          const isValid = await bcrypt.compare(credentials.password, admin.password)
          if (!isValid) {
            return null
          }

          return {
            id: admin.id,
            email: admin.email,
            role: 'admin',
          }
        } catch (error) {
          console.error('Admin auth error:', error)
          return null
        }
      },
    }),
    // Participant provider
    CredentialsProvider({
      id: 'participant',
      name: 'Participant',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const { prisma } = await import('@/lib/db')
          const participant = await prisma.participant.findFirst({
            where: { email: credentials.email },
          })

          if (!participant || !participant.password) {
            return null
          }

          const isValid = await bcrypt.compare(credentials.password, participant.password)
          if (!isValid) {
            return null
          }

          return {
            id: participant.id,
            email: participant.email,
            name: participant.name,
            role: 'participant',
          }
        } catch (error) {
          console.error('Participant auth error:', error)
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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.name = (user as any).name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role as string
        (session.user as any).id = token.sub
        if (token.name) {
          (session.user as any).name = token.name as string
        }
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

