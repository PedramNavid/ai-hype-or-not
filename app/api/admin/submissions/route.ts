import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    // Get all submissions ordered by creation date (newest first)
    const submissions = await sql`
      SELECT 
        id,
        tool_name,
        website_url,
        category,
        description,
        why_review,
        your_role,
        email,
        additional_info,
        status,
        created_at,
        updated_at
      FROM submissions 
      ORDER BY created_at DESC
    `

    return NextResponse.json(submissions)
  } catch (error) {
    console.error('Error fetching submissions for admin:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}