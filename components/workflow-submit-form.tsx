"use client"

import { useState, useRef } from "react"
import { Send, Plus, X } from "lucide-react"
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile"

interface FormData {
  title: string
  description: string
  workflowType: string
  difficulty: string
  timeEstimate: string
  content: string
  tools: string[]
  submitterName: string
  submitterEmail: string
  githubUrl: string
}

export function WorkflowSubmitForm() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    workflowType: "",
    difficulty: "",
    timeEstimate: "",
    content: "",
    tools: [],
    submitterName: "",
    submitterEmail: "",
    githubUrl: "",
  })
  
  const [newTool, setNewTool] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const turnstileRef = useRef<TurnstileInstance>(null)

  const workflowTypes = [
    { value: "greenfield", label: "Greenfield Development" },
    { value: "refactoring", label: "Refactoring" },
    { value: "debugging", label: "Debugging" },
    { value: "testing", label: "Testing" },
  ]

  const difficulties = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ]

  const addTool = () => {
    if (newTool.trim() && !formData.tools.includes(newTool.trim())) {
      setFormData(prev => ({
        ...prev,
        tools: [...prev.tools, newTool.trim()]
      }))
      setNewTool("")
    }
  }

  const removeTool = (tool: string) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.filter(t => t !== tool)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!turnstileToken) {
      alert("Please complete the security check.")
      return
    }
    
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/workflow-submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tools_used: JSON.stringify(formData.tools),
          turnstileToken
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        throw new Error("Failed to submit workflow")
      }
    } catch (error) {
      console.error("Error submitting workflow:", error)
      alert("Failed to submit workflow. Please try again.")
    } finally {
      setIsSubmitting(false)
      // Reset Turnstile for next submission
      turnstileRef.current?.reset()
      setTurnstileToken(null)
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="text-green-600 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-green-900 mb-2">Workflow Submitted!</h3>
        <p className="text-green-800 mb-6">
          Thanks for sharing your workflow with the community. We&apos;ll review it and get back to you soon.
        </p>
        <button
          onClick={() => {
            setIsSubmitted(false)
            setFormData({
              title: "",
              description: "",
              workflowType: "",
              difficulty: "",
              timeEstimate: "",
              content: "",
              tools: [],
              submitterName: "",
              submitterEmail: "",
              githubUrl: "",
            })
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Submit Another Workflow
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Workflow Title *
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Greenfield Development with LLMs"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Workflow Type */}
        <div>
          <label htmlFor="workflowType" className="block text-sm font-medium text-gray-700 mb-2">
            Workflow Type *
          </label>
          <select
            id="workflowType"
            required
            value={formData.workflowType}
            onChange={(e) => setFormData(prev => ({ ...prev, workflowType: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a type</option>
            {workflowTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty Level *
          </label>
          <select
            id="difficulty"
            required
            value={formData.difficulty}
            onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select difficulty</option>
            {difficulties.map((diff) => (
              <option key={diff.value} value={diff.value}>
                {diff.label}
              </option>
            ))}
          </select>
        </div>

        {/* Time Estimate */}
        <div>
          <label htmlFor="timeEstimate" className="block text-sm font-medium text-gray-700 mb-2">
            Time Estimate
          </label>
          <input
            type="text"
            id="timeEstimate"
            value={formData.timeEstimate}
            onChange={(e) => setFormData(prev => ({ ...prev, timeEstimate: e.target.value }))}
            placeholder="e.g., 30 minutes, 2-3 hours"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Tools */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tools Used
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newTool}
              onChange={(e) => setNewTool(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTool())}
              placeholder="Add a tool (e.g., Claude, Cursor)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={addTool}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tools.map((tool) => (
              <span
                key={tool}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tool}
                <button
                  type="button"
                  onClick={() => removeTool(tool)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Brief Description *
        </label>
        <textarea
          id="description"
          required
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="A brief overview of what your workflow accomplishes and when to use it..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Workflow Content * 
          <span className="text-sm text-gray-500 font-normal">(Markdown supported)</span>
        </label>
        <textarea
          id="content"
          required
          rows={12}
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          placeholder="## Overview

Describe your workflow in detail...

## Prerequisites

- Tool 1
- Tool 2

## Step-by-Step Process

### Step 1: Title
Description of what to do...

```bash
command example
```

### Step 2: Title
Continue with next step...

## Tips and Tricks

- Pro tip 1
- Pro tip 2

## Common Pitfalls

- What to avoid
- Troubleshooting tips"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
        />
      </div>

      {/* Submitter Info */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="submitterName" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              id="submitterName"
              required
              value={formData.submitterName}
              onChange={(e) => setFormData(prev => ({ ...prev, submitterName: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="submitterEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="submitterEmail"
              required
              value={formData.submitterEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, submitterEmail: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-2">
              GitHub Profile or Project URL (optional)
            </label>
            <input
              type="url"
              id="githubUrl"
              value={formData.githubUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
              placeholder="https://github.com/username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Turnstile CAPTCHA */}
      <div className="border-t pt-6">
        <div className="mb-4 text-sm text-gray-600 text-center">
          Please complete the security check below
        </div>
        <div className="flex justify-center">
          {!siteKey ? (
            <div className="text-red-600 text-sm">
              Error: Turnstile site key not configured. Please check environment variables.
            </div>
          ) : (
            <Turnstile
              ref={turnstileRef}
              siteKey={siteKey}
              onSuccess={(token) => {
                console.log('Turnstile success:', token)
                setTurnstileToken(token)
              }}
              onError={() => {
                console.error('Turnstile error')
                setTurnstileToken(null)
                alert("Security verification failed. Please try again.")
              }}
              onExpire={() => {
                console.log('Turnstile expired')
                setTurnstileToken(null)
                turnstileRef.current?.reset()
              }}
              options={{
                theme: 'light',
                size: 'normal',
              }}
            />
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <button
          type="submit"
          disabled={isSubmitting || !turnstileToken}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Submitting...
            </>
          ) : !turnstileToken ? (
            <>
              <Send className="w-4 h-4 opacity-50" />
              Complete Security Check Above
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Workflow
            </>
          )}
        </button>
        <p className="text-sm text-gray-500 text-center mt-3">
          By submitting, you agree to share your workflow under a Creative Commons license
        </p>
      </div>
    </form>
  )
}