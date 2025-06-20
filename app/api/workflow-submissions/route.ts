import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const {
      title,
      description,
      workflowType: workflow_type,
      difficulty,
      timeEstimate: time_estimate,
      content,
      tools_used,
      submitterName: submitter_name,
      submitterEmail: submitter_email,
      githubUrl: github_url,
    } = body

    // Validate required fields
    if (!title || !description || !workflow_type || !content || !submitter_name || !submitter_email) {
      return NextResponse.json(
        { error: "Missing required fields" },
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