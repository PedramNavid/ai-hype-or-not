import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Only allow access to admin routes if user has admin role
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'admin'
        }
        return true
      },
    },
    pages: {
      signIn: '/api/auth/signin',
    },
  }
)

export const config = {
  matcher: ['/admin/:path*']
}