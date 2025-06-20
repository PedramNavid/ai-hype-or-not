import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query with filters - default to recent for now
    let workflows
    if (type) {
      workflows = await sql`
        SELECT 
          w.id,
          w.title,
          w.slug,
          w.description,
          w.workflow_type,
          w.difficulty_level,
          w.time_estimate,
          w.view_count,
          w.created_at,
          json_build_object(
            'name', u.name,
            'avatar_url', u.avatar_url
          ) as author,
          COALESCE(
            array_agg(DISTINCT wt.tool_name) FILTER (WHERE wt.tool_name IS NOT NULL),
            ARRAY[]::text[]
          ) as tools,
          COUNT(DISTINCT ws.user_id) as save_count
        FROM workflows w
        JOIN users u ON w.author_id = u.id
        LEFT JOIN workflow_tools wt ON w.id = wt.workflow_id
        LEFT JOIN workflow_saves ws ON w.id = ws.workflow_id
        WHERE w.status = 'published'
          AND w.workflow_type = ${type}
        GROUP BY w.id, u.id
        ORDER BY w.is_featured DESC, w.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    } else {
      workflows = await sql`
        SELECT 
          w.id,
          w.title,
          w.slug,
          w.description,
          w.workflow_type,
          w.difficulty_level,
          w.time_estimate,
          w.view_count,
          w.created_at,
          json_build_object(
            'name', u.name,
            'avatar_url', u.avatar_url
          ) as author,
          COALESCE(
            array_agg(DISTINCT wt.tool_name) FILTER (WHERE wt.tool_name IS NOT NULL),
            ARRAY[]::text[]
          ) as tools,
          COUNT(DISTINCT ws.user_id) as save_count
        FROM workflows w
        JOIN users u ON w.author_id = u.id
        LEFT JOIN workflow_tools wt ON w.id = wt.workflow_id
        LEFT JOIN workflow_saves ws ON w.id = ws.workflow_id
        WHERE w.status = 'published'
        GROUP BY w.id, u.id
        ORDER BY w.is_featured DESC, w.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    }

    // Get total count
    const countResult = await sql`
      SELECT COUNT(DISTINCT w.id) as total
      FROM workflows w
      WHERE w.status = 'published'
    `
    const total = countResult[0]?.total || 0

    return NextResponse.json({
      workflows,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (error) {
    console.error('Error fetching workflows:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workflows' },
      { status: 500 }
    )
  }
}