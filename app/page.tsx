import { WorkflowCard } from "@/components/workflow-card"
import { Header } from "@/components/header"
import { ArrowRight, Sparkles, Users, BookOpen } from "lucide-react"
import Link from "next/link"

interface Workflow {
  id: string
  title: string
  slug: string
  description: string
  author: {
    name: string
    avatar_url?: string
  }
  workflow_type: string
  difficulty_level: string
  time_estimate: string
  view_count: number
  save_count: number
  tools: string[]
  created_at: string
  is_featured: boolean
}

async function getWorkflows(): Promise<{ featured: Workflow[], recent: Workflow[] }> {
  // For server-side rendering, use the internal API directly
  if (typeof window === 'undefined') {
    const { sql } = await import('@/lib/db')
    
    try {
      // Get featured workflows
      const featuredWorkflows = await sql`
        SELECT 
          w.id,
          w.title,
          w.slug,
          w.description,
          w.workflow_type,
          w.difficulty_level,
          w.time_estimate,
          w.view_count,
          w.created_at,
          json_build_object(
            'name', u.name,
            'avatar_url', u.avatar_url
          ) as author,
          COALESCE(
            array_agg(DISTINCT wt.tool_name) FILTER (WHERE wt.tool_name IS NOT NULL),
            ARRAY[]::text[]
          ) as tools,
          COUNT(DISTINCT ws.user_id) as save_count
        FROM workflows w
        JOIN users u ON w.author_id = u.id
        LEFT JOIN workflow_tools wt ON w.id = wt.workflow_id
        LEFT JOIN workflow_saves ws ON w.id = ws.workflow_id
        WHERE w.status = 'published' AND w.is_featured = true
        GROUP BY w.id, u.id
        ORDER BY w.created_at DESC
        LIMIT 3
      `
      
      // Get recent non-featured workflows
      const recentWorkflows = await sql`
        SELECT 
          w.id,
          w.title,
          w.slug,
          w.description,
          w.workflow_type,
          w.difficulty_level,
          w.time_estimate,
          w.view_count,
          w.created_at,
          json_build_object(
            'name', u.name,
            'avatar_url', u.avatar_url
          ) as author,
          COALESCE(
            array_agg(DISTINCT wt.tool_name) FILTER (WHERE wt.tool_name IS NOT NULL),
            ARRAY[]::text[]
          ) as tools,
          COUNT(DISTINCT ws.user_id) as save_count
        FROM workflows w
        JOIN users u ON w.author_id = u.id
        LEFT JOIN workflow_tools wt ON w.id = wt.workflow_id
        LEFT JOIN workflow_saves ws ON w.id = ws.workflow_id
        WHERE w.status = 'published' AND (w.is_featured = false OR w.is_featured IS NULL)
        GROUP BY w.id, u.id
        ORDER BY w.created_at DESC
        LIMIT 21
      `
      
      return {
        featured: featuredWorkflows as Workflow[],
        recent: recentWorkflows as Workflow[]
      }
    } catch (error) {
      console.error('Database error:', error)
      return { featured: [], recent: [] }
    }
  }
  
  // Client-side fetch
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
  const res = await fetch(`${baseUrl}/api/workflows`, {
    cache: 'no-store'
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch workflows')
  }
  
  const workflows = await res.json()
  
  // Split into featured and recent on client side
  const featured = workflows.filter((w: Workflow) => w.is_featured).slice(0, 3)
  const recent = workflows.filter((w: Workflow) => !w.is_featured).slice(0, 21)
  
  return { featured, recent }
}

export default async function HomePage() {
  const { featured, recent } = await getWorkflows()
  const featuredWorkflows = featured
  const recentWorkflows = recent

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Community-Driven</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
            LLM Workflows That Actually Work
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Battle-tested workflows from developers using LLMs to ship faster. 
            Learn from real experiences, not theory.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/browse"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors flex items-center gap-2"
            >
              Browse Workflows
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/submit"
              className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-8 py-3 rounded-full font-semibold transition-colors"
            >
              Share Your Workflow
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="text-center p-8 border border-gray-200 rounded-2xl bg-gradient-to-br from-blue-50 to-white">
            <div className="flex justify-center mb-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">{featuredWorkflows.length + recentWorkflows.length}+</div>
            <div className="text-gray-600 font-medium">Workflows Shared</div>
          </div>
          <div className="text-center p-8 border border-gray-200 rounded-2xl bg-gradient-to-br from-green-50 to-white">
            <div className="flex justify-center mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">150+</div>
            <div className="text-gray-600 font-medium">Active Contributors</div>
          </div>
          <div className="text-center p-8 border border-gray-200 rounded-2xl bg-gradient-to-br from-purple-50 to-white">
            <div className="flex justify-center mb-4">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">5</div>
            <div className="text-gray-600 font-medium">Tools Covered</div>
          </div>
        </div>

        {/* Featured Workflows */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Workflows</h2>
              <p className="text-gray-600">Hand-picked workflows that demonstrate best practices</p>
            </div>
            <Link
              href="/browse?filter=featured"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredWorkflows.map((workflow) => (
              <WorkflowCard key={workflow.id} workflow={workflow} />
            ))}
          </div>
        </section>

        {/* Recent Workflows */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Recent Workflows</h2>
              <p className="text-gray-600">Fresh approaches from the community</p>
            </div>
            <Link
              href="/browse?sort=recent"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentWorkflows.map((workflow) => (
              <WorkflowCard key={workflow.id} workflow={workflow} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-20 text-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Have a workflow that works?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Share your LLM coding workflows and help other developers ship faster. 
            Join our growing community of practitioners.
          </p>
          <Link
            href="/submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors inline-flex items-center gap-2"
          >
            Share Your Workflow
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>
    </div>
  )
}