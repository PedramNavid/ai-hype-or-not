import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// GET - Get author by slug with their published workflows
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Get author details
    const author = await sql`
      SELECT 
        id,
        name,
        bio,
        slug,
        github_username,
        twitter_username,
        linkedin_username,
        website_url,
        avatar_url,
        created_at
      FROM users
      WHERE slug = ${params.slug}
      LIMIT 1
    `

    if (author.length === 0) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 })
    }

    // Get author's published workflows
    const workflows = await sql`
      SELECT 
        w.id,
        w.title,
        w.slug,
        w.description,
        w.workflow_type,
        w.difficulty_level,
        w.time_estimate,
        w.view_count,
        w.is_featured,
        w.created_at,
        w.published_at,
        COUNT(DISTINCT ws.user_id) as save_count,
        COUNT(DISTINCT wc.id) as comment_count
      FROM workflows w
      LEFT JOIN workflow_saves ws ON w.id = ws.workflow_id
      LEFT JOIN workflow_comments wc ON w.id = wc.workflow_id
      WHERE w.author_id = ${author[0].id} 
        AND w.status = 'published'
      GROUP BY w.id
      ORDER BY w.published_at DESC
    `

    return NextResponse.json({
      ...author[0],
      workflows
    })
  } catch (error) {
    console.error('Error fetching author:', error)
    return NextResponse.json(
      { error: 'Failed to fetch author' },
      { status: 500 }
    )
  }
}