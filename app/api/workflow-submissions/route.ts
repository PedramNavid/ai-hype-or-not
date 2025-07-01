import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

async function verifyTurnstile(token: string): Promise<boolean> {
  const formData = new FormData()
  formData.append('secret', process.env.TURNSTILE_SECRET_KEY!)
  formData.append('response', token)
  
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    })
    
    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error('Turnstile verification error:', error)
    return false
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const {
      title,
      description,
      workflowType: workflow_type,
      content,
      tools_used,
      submitterName: submitter_name,
      submitterEmail: submitter_email,
      githubUrl: github_url,
      turnstileToken,
    } = body

    // Validate required fields
    if (!title || !description || !workflow_type || !content || !submitter_name || !submitter_email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Verify Turnstile token
    if (!turnstileToken) {
      return NextResponse.json(
        { error: "Security verification required" },
        { status: 400 }
      )
    }

    const isValidToken = await verifyTurnstile(turnstileToken)
    if (!isValidToken) {
      return NextResponse.json(
        { error: "Security verification failed" },
        { status: 400 }
      )
    }

    // Insert workflow submission
    const result = await sql`
      INSERT INTO workflow_submissions (
        title,
        description,
        workflow_type,
        content,
        tools_used,
        submitter_name,
        submitter_email,
        github_url,
        status
      ) VALUES (
        ${title},
        ${description},
        ${workflow_type},
        ${content},
        ${tools_used || '[]'},
        ${submitter_name},
        ${submitter_email},
        ${github_url || null},
        'pending'
      )
      RETURNING id
    `

    return NextResponse.json({ 
      success: true, 
      id: result[0].id,
      message: "Workflow submission received successfully" 
    })
    
  } catch (error) {
    console.error("Error creating workflow submission:", error)
    return NextResponse.json(
      { error: "Failed to submit workflow" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const submissions = await sql`
      SELECT 
        id,
        title,
        description,
        workflow_type,
        submitter_name,
        submitter_email,
        status,
        created_at
      FROM workflow_submissions
      ORDER BY created_at DESC
    `

    return NextResponse.json(submissions)
  } catch (error) {
    console.error("Error fetching workflow submissions:", error)
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    )
  }
}