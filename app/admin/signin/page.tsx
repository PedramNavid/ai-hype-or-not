"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminSignIn() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to NextAuth sign-in page with admin callback
    router.push('/api/auth/signin?callbackUrl=/admin')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-lg">Redirecting to sign in...</div>
    </div>
  )
}