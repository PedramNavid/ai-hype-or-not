"use client"

import { useState } from "react"
import { FileText, Loader2, Check, X, Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ParsedStep {
  step_number: number
  title: string
  description: string
  code_snippet?: string
  prompt_template?: string
  tips?: string
}

interface ParsedTool {
  tool_name: string
  tool_category: string
  is_required: boolean
}

interface ParsedWorkflowData {
  title: string
  description: string
  workflowType: string
  difficulty: string
  timeEstimate: string
  content: string
  tools: ParsedTool[]
  steps: ParsedStep[]
  submitterName: string
  submitterEmail: string
  githubUrl: string
}

interface TextParserFormProps {
  onParsedData: (data: ParsedWorkflowData) => void
  onCancel: () => void
}

export function TextParserForm({ onParsedData, onCancel }: TextParserFormProps) {
  const [text, setText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [parsedData, setParsedData] = useState<ParsedWorkflowData | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const handleParse = async () => {
    if (!text.trim()) {
      setError("Please enter some text to parse")
      return
    }

    setIsLoading(true)
    setError("")
    setParsedData(null)

    try {
      const response = await fetch('/api/admin/parse-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text.trim() })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to parse text')
      }

      if (result.success && result.data) {
        setParsedData(result.data)
        setIsEditing(true) // Start in editing mode so user can review
      } else {
        throw new Error('No workflow data could be extracted from the text')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred while parsing the text')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = () => {
    if (parsedData) {
      onParsedData(parsedData)
    }
  }

  const updateParsedData = (field: keyof ParsedWorkflowData, value: string | ParsedTool[] | ParsedStep[]) => {
    if (parsedData) {
      setParsedData({
        ...parsedData,
        [field]: value
      })
    }
  }

  const addTool = () => {
    if (parsedData) {
      setParsedData({
        ...parsedData,
        tools: [...parsedData.tools, { tool_name: '', tool_category: '', is_required: true }]
      })
    }
  }

  const updateTool = (index: number, field: keyof ParsedTool, value: string | boolean) => {
    if (parsedData) {
      const updatedTools = [...parsedData.tools]
      updatedTools[index] = { ...updatedTools[index], [field]: value }
      setParsedData({
        ...parsedData,
        tools: updatedTools
      })
    }
  }

  const removeTool = (index: number) => {
    if (parsedData) {
      setParsedData({
        ...parsedData,
        tools: parsedData.tools.filter((_, i) => i !== index)
      })
    }
  }

  const addStep = () => {
    if (parsedData) {
      setParsedData({
        ...parsedData,
        steps: [...parsedData.steps, {
          step_number: parsedData.steps.length + 1,
          title: '',
          description: '',
          code_snippet: '',
          prompt_template: '',
          tips: ''
        }]
      })
    }
  }

  const updateStep = (index: number, field: keyof ParsedStep, value: string | number) => {
    if (parsedData) {
      const updatedSteps = [...parsedData.steps]
      updatedSteps[index] = { ...updatedSteps[index], [field]: value }
      setParsedData({
        ...parsedData,
        steps: updatedSteps
      })
    }
  }

  const removeStep = (index: number) => {
    if (parsedData) {
      const updatedSteps = parsedData.steps.filter((_, i) => i !== index)
      // Renumber steps
      updatedSteps.forEach((step, i) => {
        step.step_number = i + 1
      })
      setParsedData({
        ...parsedData,
        steps: updatedSteps
      })
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Parse Text to Create Workflow</h2>
      </div>

      {!parsedData && (
        <div className="space-y-4">
          <div>
            <label htmlFor="workflow-text" className="block text-sm font-medium text-gray-700 mb-2">
              Workflow Content
            </label>
            <div className="space-y-2">
              <textarea
                id="workflow-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your workflow content here...

Example:
How to Build a React Component with AI

This workflow shows you how to use AI tools to quickly create React components.

Prerequisites:
- Claude or ChatGPT
- VS Code
- React project setup

Step 1: Define the Component
First, describe what component you want to build...

Step 2: Generate the Code
Use this prompt: 'Create a React component that...'

And so on..."
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
                disabled={isLoading}
              />
              <Button
                onClick={handleParse}
                disabled={isLoading || !text.trim()}
                className="bg-blue-600 hover:bg-blue-700 w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Parsing...
                  </>
                ) : (
                  'Parse Text'
                )}
              </Button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
              <X className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">How it works:</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Paste or type your workflow content directly into the text area</li>
              <li>• AI will extract and structure the workflow information automatically</li>
              <li>• Works best with step-by-step guides, tutorials, or documentation</li>
              <li>• Include code snippets, commands, and detailed instructions for best results</li>
            </ul>
          </div>
        </div>
      )}

      {parsedData && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            <p className="text-green-700 text-sm">
              Successfully parsed workflow content
            </p>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Review Parsed Data</h3>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              size="sm"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {isEditing ? 'Preview' : 'Edit'}
            </Button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={parsedData.title}
                    onChange={(e) => updateParsedData('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Workflow Type</label>
                  <select
                    value={parsedData.workflowType}
                    onChange={(e) => updateParsedData('workflowType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="greenfield">Greenfield</option>
                    <option value="refactoring">Refactoring</option>
                    <option value="debugging">Debugging</option>
                    <option value="testing">Testing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={parsedData.difficulty}
                    onChange={(e) => updateParsedData('difficulty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Estimate</label>
                  <input
                    type="text"
                    value={parsedData.timeEstimate}
                    onChange={(e) => updateParsedData('timeEstimate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  value={parsedData.description}
                  onChange={(e) => updateParsedData('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Tools Used</label>
                  <Button onClick={addTool} size="sm" variant="outline">Add Tool</Button>
                </div>
                <div className="space-y-3">
                  {parsedData.tools.map((tool, index) => (
                    <div key={index} className="border border-gray-200 rounded p-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Tool Name</label>
                          <input
                            type="text"
                            value={tool.tool_name}
                            onChange={(e) => updateTool(index, 'tool_name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Claude, VS Code"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
                          <input
                            type="text"
                            value={tool.tool_category}
                            onChange={(e) => updateTool(index, 'tool_category', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., AI Assistant, IDE"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={tool.is_required}
                            onChange={(e) => updateTool(index, 'is_required', e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm text-gray-600">Required Tool</span>
                        </label>
                        <Button
                          onClick={() => removeTool(index)}
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workflow Content (Markdown)
                </label>
                <textarea
                  rows={8}
                  value={parsedData.content}
                  onChange={(e) => updateParsedData('content', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">Step-by-Step Guide</label>
                  <Button onClick={addStep} size="sm" variant="outline">Add Step</Button>
                </div>
                <div className="space-y-4">
                  {parsedData.steps.map((step, index) => (
                    <div key={index} className="border border-gray-200 rounded p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">Step {step.step_number}</h4>
                        <Button
                          onClick={() => removeStep(index)}
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Step Title</label>
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) => updateStep(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Clear, actionable step title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                          <textarea
                            rows={3}
                            value={step.description}
                            onChange={(e) => updateStep(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Detailed description of what to do in this step"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Code Snippet (Optional)</label>
                          <textarea
                            rows={4}
                            value={step.code_snippet || ''}
                            onChange={(e) => updateStep(index, 'code_snippet', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                            placeholder="Code example or command"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Prompt Template (Optional)</label>
                          <textarea
                            rows={3}
                            value={step.prompt_template || ''}
                            onChange={(e) => updateStep(index, 'prompt_template', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                            placeholder="LLM prompt template for this step"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Pro Tips (Optional)</label>
                          <textarea
                            rows={2}
                            value={step.tips || ''}
                            onChange={(e) => updateStep(index, 'tips', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Tips, warnings, or important notes"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700">Title</h4>
                  <p className="text-gray-600">{parsedData.title}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Workflow Type</h4>
                  <p className="text-gray-600 capitalize">{parsedData.workflowType}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Difficulty</h4>
                  <p className="text-gray-600 capitalize">{parsedData.difficulty}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Time Estimate</h4>
                  <p className="text-gray-600">{parsedData.timeEstimate || 'Not specified'}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Description</h4>
                <p className="text-gray-600 text-sm">{parsedData.description}</p>
              </div>

              {parsedData.tools.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Tools</h4>
                  <div className="space-y-2">
                    {parsedData.tools.map((tool, index) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-gray-900">{tool.tool_name}</span>
                            <span className="text-gray-500 text-sm ml-2">({tool.tool_category})</span>
                          </div>
                          {tool.is_required && (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                              Required
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {parsedData.steps.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Steps</h4>
                  <div className="space-y-3">
                    {parsedData.steps.map((step, index) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded p-4">
                        <h5 className="font-medium text-gray-900 mb-2">
                          Step {step.step_number}: {step.title}
                        </h5>
                        <p className="text-gray-600 text-sm mb-2">{step.description}</p>
                        {step.code_snippet && (
                          <div className="mb-2">
                            <h6 className="text-xs font-medium text-gray-700 mb-1">Code:</h6>
                            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                              {step.code_snippet}
                            </pre>
                          </div>
                        )}
                        {step.prompt_template && (
                          <div className="mb-2">
                            <h6 className="text-xs font-medium text-gray-700 mb-1">Prompt Template:</h6>
                            <div className="bg-blue-50 border border-blue-200 p-2 rounded text-xs">
                              {step.prompt_template}
                            </div>
                          </div>
                        )}
                        {step.tips && (
                          <div className="mb-2">
                            <h6 className="text-xs font-medium text-gray-700 mb-1">Tips:</h6>
                            <div className="bg-yellow-50 border border-yellow-200 p-2 rounded text-xs">
                              {step.tips}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Content Preview</h4>
                <div className="bg-gray-50 border border-gray-200 rounded p-3 max-h-48 overflow-y-auto">
                  <pre className="text-sm text-gray-600 whitespace-pre-wrap">{parsedData.content.slice(0, 500)}...</pre>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button onClick={onCancel} variant="outline">
              Cancel
            </Button>
            <Button onClick={() => setParsedData(null)} variant="outline">
              Parse Another
            </Button>
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              Populate Workflow Form
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}