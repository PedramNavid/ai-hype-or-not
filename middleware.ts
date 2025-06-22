import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        // Only allow access to admin routes and admin APIs if user has admin role
        if (path.startsWith('/admin') || path.startsWith('/api/admin')) {
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
  matcher: ['/admin/:path*', '/api/admin/:path*']
}
