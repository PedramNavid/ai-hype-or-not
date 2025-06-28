import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { rateLimit } from '@/lib/rate-limit'

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

// Create rate limiter: 20 requests per minute per IP for admin
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 20
})

export async function POST(request: NextRequest) {
  try {
    // Admin authentication is handled by middleware

    // Check rate limit
    const isAllowed = await limiter(request)
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      )
    }

    const { text } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text content is required' },
        { status: 400 }
      )
    }

    // Limit text length to prevent abuse
    const maxLength = 100000
    if (text.length > maxLength) {
      return NextResponse.json(
        { error: `Text is too long. Maximum ${maxLength} characters allowed.` },
        { status: 400 }
      )
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    // Create prompt for parsing workflow information
    const prompt = `You are an expert at extracting software development workflow information from text content. 

Please analyze the following text and extract workflow information suitable for a developer workflow admin form. 

Text content:
${text}

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
- If this doesn't appear to be a development workflow, still try to extract whatever technical content is available

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
          { error: 'Could not extract workflow information from the text' },
          { status: 400 }
        )
      }

      // Validate required fields
      if (!parsedData.title || !parsedData.description || !parsedData.content) {
        return NextResponse.json(
          { error: 'Could not extract sufficient workflow information from the text' },
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
    console.error('Parse text error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}