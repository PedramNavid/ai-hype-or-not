import { Header } from "@/components/header"
import { WorkflowCard } from "@/components/workflow-card"
import { Search, Filter, SlidersHorizontal } from "lucide-react"

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
}

async function getWorkflows(): Promise<Workflow[]> {
  if (typeof window === 'undefined') {
    const { sql } = await import('@/lib/db')
    
    try {
      const workflows = await sql`
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
        WHERE w.status = 'published'
        GROUP BY w.id, u.id
        ORDER BY w.is_featured DESC, w.created_at DESC
      `
      
      return workflows as Workflow[]
    } catch (error) {
      console.error('Database error:', error)
      return []
    }
  }
  
  return []
}

export default async function BrowsePage() {
  const workflows = await getWorkflows()

  const workflowTypes = ['greenfield', 'refactoring', 'debugging', 'testing']
  const difficultyLevels = ['beginner', 'intermediate', 'advanced']
  const popularTools = ['Claude', 'Cursor', 'Aider', 'Git', 'Python']

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Browse Workflows
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover proven LLM workflows from the community. Filter by type, difficulty, or tools to find exactly what you need.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search workflows..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-4">
            <div>
              <span className="text-sm font-medium text-gray-700 mr-2">Type:</span>
              <div className="inline-flex gap-2">
                {workflowTypes.map((type) => (
                  <button
                    key={type}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors capitalize"
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700 mr-2">Difficulty:</span>
              <div className="inline-flex gap-2">
                {difficultyLevels.map((level) => (
                  <button
                    key={level}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors capitalize"
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700 mr-2">Tools:</span>
              <div className="inline-flex gap-2">
                {popularTools.map((tool) => (
                  <button
                    key={tool}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {workflows.length} workflows found
            </h2>
            <p className="text-sm text-gray-600">Showing all published workflows</p>
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="saves">Most Saved</option>
            <option value="featured">Featured First</option>
          </select>
        </div>

        {/* Workflows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {workflows.map((workflow) => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}
        </div>

        {/* Empty State */}
        {workflows.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Filter className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No workflows found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {workflows.length > 0 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</span>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                2
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                3
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}