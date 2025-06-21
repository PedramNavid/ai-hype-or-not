import { Header } from "@/components/header"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Clock, Eye, Bookmark, User, Copy, Check, ChevronRight, BookOpen } from "lucide-react"
import { sql } from "@/lib/db"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Workflow {
  id: string
  title: string
  slug: string
  description: string
  content: string
  author: {
    id: string
    name: string
    slug: string
    bio?: string
    avatar_url?: string
    github_username?: string
    twitter_username?: string
  }
  workflow_type: string
  difficulty_level: string
  time_estimate: string
  view_count: number
  save_count: number
  comment_count: number
  tools: Array<{
    tool_name: string
    tool_category: string
    is_required: boolean
  }>
  steps: Array<{
    step_number: number
    title: string
    description: string
    code_snippet?: string
    prompt_template?: string
    tips?: string
  }>
  created_at: string
  updated_at: string
}

async function getWorkflow(slug: string): Promise<Workflow | null> {
  try {
    // Get workflow details
    const workflows = await sql`
      SELECT 
        w.id,
        w.title,
        w.slug,
        w.description,
        w.content,
        w.workflow_type,
        w.difficulty_level,
        w.time_estimate,
        w.view_count,
        w.created_at,
        w.updated_at,
        json_build_object(
          'id', u.id,
          'name', u.name,
          'slug', u.slug,
          'bio', u.bio,
          'avatar_url', u.avatar_url,
          'github_username', u.github_username,
          'twitter_username', u.twitter_username
        ) as author,
        COUNT(DISTINCT ws.user_id) as save_count,
        COUNT(DISTINCT wc.id) as comment_count
      FROM workflows w
      JOIN users u ON w.author_id = u.id
      LEFT JOIN workflow_saves ws ON w.id = ws.workflow_id
      LEFT JOIN workflow_comments wc ON w.id = wc.workflow_id
      WHERE w.slug = ${slug} AND w.status = 'published'
      GROUP BY w.id, u.id
    `

    if (workflows.length === 0) {
      return null
    }

    const workflow = workflows[0]

    // Get tools
    const tools = await sql`
      SELECT tool_name, tool_category, is_required
      FROM workflow_tools
      WHERE workflow_id = ${workflow.id}
      ORDER BY is_required DESC, tool_name
    `

    // Get steps
    const steps = await sql`
      SELECT step_number, title, description, code_snippet, prompt_template, tips
      FROM workflow_steps
      WHERE workflow_id = ${workflow.id}
      ORDER BY step_number
    `

    // Increment view count
    await sql`
      UPDATE workflows 
      SET view_count = view_count + 1 
      WHERE id = ${workflow.id}
    `

    return {
      ...workflow,
      tools,
      steps
    } as Workflow
  } catch (error) {
    console.error('Error fetching workflow:', error)
    return null
  }
}

// Markdown component for rendering workflow content
function WorkflowContent({ content }: { content: string }) {
  return (
    <div className="prose prose-gray max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : 'text'

            // Check if this is a fenced code block (has className starting with 'language-' or contains newlines)
            const isCodeBlock = className?.startsWith('language-') || String(children).includes('\n')

            return isCodeBlock ? (
              <SyntaxHighlighter
                style={tomorrow}
                language={language}
                customStyle={{
                  margin: 0,
                  borderRadius: '0.5rem',
                  padding: '1rem',
                } as any}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            )
          },
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-bold mt-4 mb-2 text-gray-900">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed text-gray-700">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-700">{children}</li>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-800">{children}</em>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 my-4 italic text-gray-700">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default async function WorkflowPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const workflow = await getWorkflow(slug)

  if (!workflow) {
    notFound()
  }

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
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/browse" className="hover:text-gray-900">Browse</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">{workflow.title}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`text-sm font-semibold px-3 py-1 rounded-full ${typeColors[workflow.workflow_type as keyof typeof typeColors] || "bg-gray-100 text-gray-700"
                }`}
            >
              {workflow.workflow_type}
            </span>
            <span
              className={`text-sm font-semibold px-3 py-1 rounded-full ${difficultyColors[workflow.difficulty_level as keyof typeof difficultyColors]
                }`}
            >
              {workflow.difficulty_level}
            </span>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {workflow.time_estimate}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{workflow.title}</h1>
          <p className="text-xl text-gray-600 leading-relaxed">{workflow.description}</p>
        </div>

        {/* Author and Stats */}
        <div className="flex items-center justify-between py-6 border-y border-gray-200 mb-8">
          <Link href={`/authors/${workflow.author.slug}`} className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            {workflow.author.avatar_url ? (
              <img
                src={workflow.author.avatar_url}
                alt={workflow.author.name}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-500" />
              </div>
            )}
            <div>
              <div className="font-semibold text-gray-900">{workflow.author.name}</div>
              {workflow.author.bio && (
                <div className="text-sm text-gray-600">{workflow.author.bio}</div>
              )}
            </div>
          </Link>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {workflow.view_count} views
            </span>
            <span className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              {workflow.save_count} saves
            </span>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              <Bookmark className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>

        {/* Tools Required */}
        <section className="mb-8 p-6 bg-gray-50 rounded-xl">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tools & Prerequisites</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Required Tools</h3>
              <div className="space-y-2">
                {workflow.tools.filter(t => t.is_required).map((tool) => (
                  <div key={tool.tool_name} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{tool.tool_name}</span>
                    <span className="text-xs text-gray-500">({tool.tool_category})</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Optional Tools</h3>
              <div className="space-y-2">
                {workflow.tools.filter(t => !t.is_required).map((tool) => (
                  <div key={tool.tool_name} className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-gray-300"></span>
                    <span className="text-sm">{tool.tool_name}</span>
                    <span className="text-xs text-gray-500">({tool.tool_category})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Steps */}
        {workflow.steps.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Step-by-Step Guide</h2>
            <div className="space-y-6">
              {workflow.steps.map((step) => (
                <div key={step.step_number} className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {step.step_number}
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600 mb-4">{step.description}</p>

                      {step.prompt_template && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-gray-700">Prompt Template</h4>
                            <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                              <Copy className="w-3 h-3" />
                              Copy
                            </button>
                          </div>
                          <pre className="bg-gray-100 rounded-lg p-4 text-sm overflow-x-auto">
                            <code>{step.prompt_template}</code>
                          </pre>
                        </div>
                      )}

                      {step.code_snippet && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-gray-700">Code Example</h4>
                            <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                              <Copy className="w-3 h-3" />
                              Copy
                            </button>
                          </div>
                          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm overflow-x-auto">
                            <code>{step.code_snippet}</code>
                          </pre>
                        </div>
                      )}

                      {step.tips && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-blue-900 mb-1">Pro Tip</h4>
                          <p className="text-sm text-blue-800">{step.tips}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Main Content */}
        <section className="mb-12">
          <WorkflowContent content={workflow.content} />
        </section>

        {/* Comments Section */}
        <section className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Discussion ({workflow.comment_count})
          </h2>
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Comments coming soon!</p>
          </div>
        </section>
      </main>
    </div>
  )
}