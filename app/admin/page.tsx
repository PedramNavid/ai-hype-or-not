"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { 
  Package, 
  MessageSquare, 
  BarChart3, 
  LogOut, 
  Plus,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalWorkflows: 0,
    publishedWorkflows: 0,
    totalViews: 0,
    totalSaves: 0,
    pendingSubmissions: 0
  })

  useEffect(() => {
    if (status === "loading") return
    
    if (!session || session.user?.role !== 'admin') {
      router.push('/admin/signin')
      return
    }

    // Fetch dashboard stats
    fetchStats()
  }, [session, status, router])

  const fetchStats = async () => {
    try {
      const [workflowsRes, submissionsRes] = await Promise.all([
        fetch('/api/admin/stats/workflows'),
        fetch('/api/admin/stats/submissions')
      ])

      if (workflowsRes.ok && submissionsRes.ok) {
        const workflowsData = await workflowsRes.json()
        const submissionsData = await submissionsRes.json()
        
        setStats({
          totalWorkflows: workflowsData.total,
          publishedWorkflows: workflowsData.published,
          totalViews: workflowsData.totalViews,
          totalSaves: workflowsData.totalSaves,
          pendingSubmissions: submissionsData.pending
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {session.user?.name || session.user?.email}
              </span>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Workflows</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalWorkflows}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-semibold text-green-600">{stats.publishedWorkflows}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">👁</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-semibold text-purple-600">{stats.totalViews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <MessageSquare className="w-8 h-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Submissions</p>
                <p className="text-2xl font-semibold text-orange-600">{stats.pendingSubmissions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/workflows">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center mb-4">
                <Package className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900 ml-3">Manage Workflows</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Add, edit, or delete workflow content and manage workflow library
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-600 font-medium">Manage Workflows →</span>
                <Plus className="w-4 h-4 text-blue-500" />
              </div>
            </div>
          </Link>

          <Link href="/admin/authors">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center mb-4">
                <Users className="w-6 h-6 text-purple-500" />
                <h3 className="text-lg font-semibold text-gray-900 ml-3">Manage Authors</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Create and manage author profiles, assign workflows to different authors
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-purple-600 font-medium">Manage Authors →</span>
                <Plus className="w-4 h-4 text-purple-500" />
              </div>
            </div>
          </Link>

          <Link href="/admin/submissions">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center mb-4">
                <MessageSquare className="w-6 h-6 text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-900 ml-3">Review Submissions</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Review community workflow submissions and decide which to feature
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-orange-600 font-medium">Review Submissions →</span>
                {stats.pendingSubmissions > 0 && (
                  <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                    {stats.pendingSubmissions} pending
                  </span>
                )}
              </div>
            </div>
          </Link>

          <Link href="/admin/analytics">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center mb-4">
                <BarChart3 className="w-6 h-6 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900 ml-3">Analytics</h3>
              </div>
              <p className="text-gray-600 mb-4">
                View detailed analytics and insights about your content
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-600 font-medium">View Analytics →</span>
                <BarChart3 className="w-4 h-4 text-green-500" />
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}