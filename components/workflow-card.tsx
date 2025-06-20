import Link from "next/link"
import { Clock, Eye, Bookmark, User } from "lucide-react"

interface WorkflowCardProps {
  workflow: {
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
}

export function WorkflowCard({ workflow }: WorkflowCardProps) {
  const typeColors = {
    greenfield: "bg-green-100 text-green-800",
    refactoring: "bg-blue-100 text-blue-800",
    debugging: "bg-red-100 text-red-800",
    testing: "bg-purple-100 text-purple-800",
  }

  const difficultyColors = {
    beginner: "bg-gray-100 text-gray-700",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-orange-100 text-orange-800",
  }

  return (
    <Link href={`/workflow/${workflow.slug}`} className="block group">
      <article className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300 bg-white h-full flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                typeColors[workflow.workflow_type as keyof typeof typeColors] || "bg-gray-100 text-gray-700"
              }`}
            >
              {workflow.workflow_type}
            </span>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                difficultyColors[workflow.difficulty_level as keyof typeof difficultyColors]
              }`}
            >
              {workflow.difficulty_level}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {workflow.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 flex-grow">{workflow.description}</p>
        </div>

        {/* Tools */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {workflow.tools.slice(0, 3).map((tool) => (
              <span key={tool} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                {tool}
              </span>
            ))}
            {workflow.tools.length > 3 && (
              <span className="text-xs text-gray-500">+{workflow.tools.length - 3} more</span>
            )}
          </div>
        </div>

        {/* Author and Stats */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {workflow.author.avatar_url ? (
                <img
                  src={workflow.author.avatar_url}
                  alt={workflow.author.name}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
              )}
              <span className="text-sm text-gray-600">{workflow.author.name}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {workflow.time_estimate}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {workflow.view_count}
              </span>
              <span className="flex items-center gap-1">
                <Bookmark className="w-3 h-3" />
                {workflow.save_count}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}