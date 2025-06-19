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
  callbacks: {
    async signIn({ user }) {
      // Only allow specific admin emails to sign in
      const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim().toLowerCase()) || []
      
      if (user.email && adminEmails.includes(user.email.toLowerCase())) {
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