import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only allow specific admin emails to sign in
      const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim().toLowerCase()) || []

      if (user.email && adminEmails.includes(user.email.toLowerCase())) {
        // Check if user exists in database, if not create them
        try {
          const { sql } = await import('@/lib/db')

          const existingUser = await sql`
            SELECT id FROM users WHERE email = ${user.email}
          `

          if (existingUser.length === 0) {
            // Create new user record
            await sql`
              INSERT INTO users (email, name, avatar_url, github_username)
              VALUES (
                ${user.email}, 
                ${user.name || user.email}, 
                ${user.image || null},
                ${account?.provider === 'github' ? (profile as { login?: string })?.login : null}
              )
            `
          }
        } catch (error) {
          console.error('Error creating user record:', error)
          // Still allow sign in even if user creation fails
        }

        return true
      }

      return false
    },
    async jwt({ token, user }) {
      // Add admin role to JWT token
      if (user) {
        const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim().toLowerCase()) || []

        if (user.email && adminEmails.includes(user.email.toLowerCase())) {
          token.role = 'admin'
        }
      }

      return token
    },
    async session({ session, token }) {
      // Pass role from JWT token to session
      if (token.role) {
        session.user.role = token.role as string
      }

      return session
    },
  },
  pages: {
    error: '/admin/auth-error',
  },
})

export { handler as GET, handler as POST }