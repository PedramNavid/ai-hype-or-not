import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AuthError() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">
            You don&apos;t have permission to access the admin panel. Only authorized administrators can sign in.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              Return to Homepage
            </Button>
          </Link>
          
          <Link href="/admin/signin">
            <Button variant="outline" className="w-full">
              Try Different Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}