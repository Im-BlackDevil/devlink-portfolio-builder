import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Simple auth handler that doesn't access database during build
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Skip authentication during build
        if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL) {
          return null
        }

        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Only run authentication in runtime
        if (typeof window === 'undefined') {
          try {
            const { prisma } = await import('@/lib/prisma')
            const bcrypt = await import('bcryptjs')

            const user = await prisma.user.findUnique({
              where: {
                email: credentials.email
              }
            })

            if (!user) {
              return null
            }

            const isPasswordValid = await bcrypt.compare(
              credentials.password,
              user.password || ''
            )

            if (!isPasswordValid) {
              return null
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
            }
          } catch (error) {
            console.error('Auth error:', error)
            return null
          }
        }

        return null
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  }
})

export { handler as GET, handler as POST }

// Force dynamic rendering for Vercel deployment
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'

// Prevent any static generation attempts
export const revalidate = 0
export const fetchCache = 'force-no-store' 