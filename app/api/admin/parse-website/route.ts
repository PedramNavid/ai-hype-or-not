import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

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

export async function POST(request: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      )
    }

    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Fetch website content
    let websiteContent: string
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      websiteContent = await response.text()
    } catch (error) {
      return NextResponse.json(
        { error: `Failed to fetch website content: ${error instanceof Error ? error.message : 'Unknown error'}` },
        { status: 500 }
      )
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    // Create prompt for parsing workflow information
    const prompt = `You are an expert at extracting software development workflow information from web content. 

Please analyze the following website content and extract workflow information suitable for a developer workflow submission form. 

Website URL: ${url}
Content: ${websiteContent.slice(0, 100000)} // Limit content to avoid token limits

Please extract and format the information as a JSON object with the following structure:
{
  "title": "Brief, descriptive title of the workflow",
  "description": "2-3 sentence description of what this workflow accomplishes",
  "workflowType": "greenfield|refactoring|debugging|testing", 
  "difficulty": "beginner|intermediate|advanced",
  "timeEstimate": "Estimated time to complete (e.g., '30 minutes', '2 hours')",
  "content": "Detailed markdown content describing the overall workflow. IMPORTANT: Most of the content should be in this field.",
  "tools": [
    {
      "tool_name": "Name of the tool (e.g., 'Claude', 'VS Code', 'Git')",
      "tool_category": "Category (e.g., 'AI Assistant', 'IDE', 'Version Control')",
      "is_required": true|false
    }
  ],
  "steps": [
    {
      "step_number": 1,
      "title": "Clear, actionable step title",
      "description": "Detailed description of what to do in this step",
      "code_snippet": "Code example if applicable (optional)",
      "prompt_template": "LLM prompt template if mentioned (optional)",
      "tips": "Pro tips or important notes for this step (optional)"
    }
  ],
  "submitterName": "Extract author name if available, otherwise 'Unknown'",
  "submitterEmail": "Extract contact email if available, otherwise empty string",
  "githubUrl": "Extract GitHub URL if mentioned, otherwise empty string"
}

Guidelines:
- Focus on actionable workflows and development processes
- Break down the workflow into clear, sequential steps with specific actions
- Extract code snippets, commands, and prompt templates exactly as shown
- Classify workflowType based on the main purpose (default to "greenfield" if unclear)  
- Set difficulty based on technical complexity and prerequisites
- For tools: identify all mentioned tools/technologies and categorize them appropriately
- For steps: number them sequentially and include all actionable instructions
- Include specific commands, code snippets, and LLM prompts in the appropriate step fields
- Extract pro tips, warnings, or important notes into the tips field
- Use markdown formatting in text fields where appropriate
- If this doesn't appear to be a development workflow, return null

Return only the JSON object, no additional text.`

    try {
      const message = await anthropic.messages.create({
        model: 'claude-opus-4-20250514',
        max_tokens: 6000,
        temperature: 0.1,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })

      const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

      // Try to parse the JSON response
      let parsedData: ParsedWorkflowData | null
      try {
        parsedData = JSON.parse(responseText)
      } catch {
        // If JSON parsing fails, try to extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          parsedData = JSON.parse(jsonMatch[0])
        } else {
          throw new Error('Could not parse JSON response')
        }
      }

      if (!parsedData) {
        return NextResponse.json(
          { error: 'Content does not appear to contain a development workflow' },
          { status: 400 }
        )
      }

      // Validate required fields
      if (!parsedData.title || !parsedData.description || !parsedData.content) {
        return NextResponse.json(
          { error: 'Could not extract sufficient workflow information from the website' },
          { status: 400 }
        )
      }

      return NextResponse.json({
        success: true,
        data: parsedData
      })

    } catch (error) {
      console.error('Anthropic API error:', error)
      return NextResponse.json(
        { error: `Failed to parse content with AI: ${error instanceof Error ? error.message : 'Unknown error'}` },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Parse website error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}