"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Tool {
  tool_name: string
  tool_category: string
  is_required: boolean
}

interface Step {
  step_number: number
  title: string
  description: string
  code_snippet?: string
  prompt_template?: string
  tips?: string
}

interface Author {
  id: number
  name: string
  email: string
}

export default function EditWorkflowPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [workflowId, setWorkflowId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    workflow_type: 'greenfield',
    difficulty_level: 'intermediate',
    time_estimate: '',
    status: 'draft',
    is_featured: false,
    author_id: ''
  })
  const [tools, setTools] = useState<Tool[]>([])
  const [steps, setSteps] = useState<Step[]>([])
  const [authors, setAuthors] = useState<Author[]>([])

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params
      setWorkflowId(resolvedParams.id)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (status === "loading") return
    
    if (!session || session.user?.role !== 'admin') {
      router.push('/admin/signin')
      return
    }

    if (workflowId) {
      fetchWorkflow()
      fetchAuthors()
    }
  }, [session, status, router, workflowId, fetchWorkflow, fetchAuthors])

  const fetchAuthors = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/authors')
      if (response.ok) {
        const data = await response.json()
        setAuthors(data)
      }
    } catch (error) {
      console.error('Error fetching authors:', error)
    }
  }, [])

  const fetchWorkflow = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/workflows/${workflowId}`)
      if (response.ok) {
        const workflow = await response.json()
        setFormData({
          title: workflow.title,
          slug: workflow.slug,
          description: workflow.description,
          content: workflow.content,
          workflow_type: workflow.workflow_type,
          difficulty_level: workflow.difficulty_level,
          time_estimate: workflow.time_estimate || '',
          status: workflow.status,
          is_featured: workflow.is_featured,
          author_id: workflow.author_id?.toString() || ''
        })
        setTools(workflow.tools || [])
        setSteps(workflow.steps || [])
      } else {
        alert('Failed to load workflow')
        router.push('/admin/workflows')
      }
    } catch (error) {
      console.error('Error fetching workflow:', error)
      alert('Failed to load workflow')
      router.push('/admin/workflows')
    } finally {
      setInitialLoading(false)
    }
  }, [workflowId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/workflows/${workflowId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          author_id: parseInt(formData.author_id),
          tools,
          steps
        })
      })

      if (response.ok) {
        router.push('/admin/workflows')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating workflow:', error)
      alert('Failed to update workflow')
    } finally {
      setLoading(false)
    }
  }

  const addTool = () => {
    setTools([...tools, { tool_name: '', tool_category: '', is_required: true }])
  }

  const updateTool = (index: number, field: keyof Tool, value: string | boolean) => {
    const updated = [...tools]
    updated[index] = { ...updated[index], [field]: value }
    setTools(updated)
  }

  const removeTool = (index: number) => {
    setTools(tools.filter((_, i) => i !== index))
  }

  const addStep = () => {
    setSteps([...steps, {
      step_number: steps.length + 1,
      title: '',
      description: '',
      code_snippet: '',
      prompt_template: '',
      tips: ''
    }])
  }

  const updateStep = (index: number, field: keyof Step, value: string | number) => {
    const updated = [...steps]
    updated[index] = { ...updated[index], [field]: value }
    setSteps(updated)
  }

  const removeStep = (index: number) => {
    const updated = steps.filter((_, i) => i !== index)
    // Renumber steps
    updated.forEach((step, i) => {
      step.step_number = i + 1
    })
    setSteps(updated)
  }

  if (status === "loading" || initialLoading) {
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
            <div className="flex items-center gap-4">
              <Link
                href="/admin/workflows"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Workflows
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Edit Workflow</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author *
                </label>
                <select
                  required
                  value={formData.author_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, author_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select an author</option>
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name} ({author.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workflow Type *
                </label>
                <select
                  value={formData.workflow_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, workflow_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="greenfield">Greenfield</option>
                  <option value="refactoring">Refactoring</option>
                  <option value="debugging">Debugging</option>
                  <option value="testing">Testing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level *
                </label>
                <select
                  value={formData.difficulty_level}
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty_level: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Estimate
                </label>
                <input
                  type="text"
                  placeholder="e.g., 30 minutes, 2 hours"
                  value={formData.time_estimate}
                  onChange={(e) => setFormData(prev => ({ ...prev, time_estimate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Featured Workflow</span>
              </label>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Content</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Content (Markdown supported) *
              </label>
              <textarea
                required
                rows={12}
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="Write your workflow content here using Markdown..."
              />
            </div>
          </div>

          {/* Tools */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Tools & Prerequisites</h2>
              <Button type="button" onClick={addTool} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Tool
              </Button>
            </div>
            {tools.map((tool, index) => (
              <div key={index} className="border border-gray-200 rounded p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tool Name
                    </label>
                    <input
                      type="text"
                      value={tool.tool_name}
                      onChange={(e) => updateTool(index, 'tool_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="e.g., Claude, Cursor"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={tool.tool_category}
                      onChange={(e) => updateTool(index, 'tool_category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="e.g., AI Assistant, IDE"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={tool.is_required}
                        onChange={(e) => updateTool(index, 'is_required', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Required</span>
                    </label>
                    <Button
                      type="button"
                      onClick={() => removeTool(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Steps */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Step-by-Step Guide</h2>
              <Button type="button" onClick={addStep} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Step
              </Button>
            </div>
            {steps.map((step, index) => (
              <div key={index} className="border border-gray-200 rounded p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Step {step.step_number}</h3>
                  <Button
                    type="button"
                    onClick={() => removeStep(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Step Title
                    </label>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => updateStep(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={step.description}
                      onChange={(e) => updateStep(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prompt Template (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={step.prompt_template || ''}
                      onChange={(e) => updateStep(index, 'prompt_template', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Code Snippet (Optional)
                    </label>
                    <textarea
                      rows={4}
                      value={step.code_snippet || ''}
                      onChange={(e) => updateStep(index, 'code_snippet', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pro Tips (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={step.tips || ''}
                      onChange={(e) => updateStep(index, 'tips', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Link href="/admin/workflows">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Workflow'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}