import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    // Get legacy tool submissions
    const legacySubmissions = await sql`
      SELECT 
        'legacy' as submission_type,
        id,
        tool_name as title,
        website_url,
        category,
        description,
        why_review,
        your_role,
        email,
        additional_info,
        status,
        created_at,
        updated_at,
        NULL as workflow_type,
        NULL as content,
        NULL as tools_used,
        NULL as github_url,
        NULL as reviewer_notes
      FROM submissions 
    `

    // Get workflow submissions  
    const workflowSubmissions = await sql`
      SELECT 
        'workflow' as submission_type,
        id,
        title,
        NULL as website_url,
        workflow_type as category,
        description,
        'Workflow submission' as why_review,
        NULL as your_role,
        submitter_email as email,
        content as additional_info,
        status,
        created_at,
        updated_at,
        workflow_type,
        content,
        tools_used,
        github_url,
        reviewer_notes
      FROM workflow_submissions
    `

    // Combine and sort by creation date
    const allSubmissions = [...legacySubmissions, ...workflowSubmissions]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return NextResponse.json(allSubmissions)
  } catch (error) {
    console.error('Error fetching submissions for admin:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}