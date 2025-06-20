import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const difficulty = searchParams.get('difficulty')
    const tool = searchParams.get('tool')
    const sort = searchParams.get('sort') || 'recent'
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query conditions
    const conditions = ['w.status = \'published\'']
    const params: any[] = []
    
    if (type) {
      conditions.push(`w.workflow_type = $${params.length + 1}`)
      params.push(type)
    }
    
    if (difficulty) {
      conditions.push(`w.difficulty_level = $${params.length + 1}`)
      params.push(difficulty)
    }

    // Determine sort order
    let orderBy = 'w.created_at DESC'
    switch (sort) {
      case 'popular':
        orderBy = 'w.view_count DESC'
        break
      case 'saves':
        orderBy = 'save_count DESC'
        break
      case 'featured':
        orderBy = 'w.is_featured DESC, w.created_at DESC'
        break
    }

    // Base query
    let query = `
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
      WHERE ${conditions.join(' AND ')}
    `

    // Add tool filter if specified
    if (tool) {
      query += ` AND EXISTS (
        SELECT 1 FROM workflow_tools wt2 
        WHERE wt2.workflow_id = w.id 
        AND wt2.tool_name = $${params.length + 1}
      )`
      params.push(tool)
    }

    query += `
      GROUP BY w.id, u.id
      ORDER BY ${orderBy}
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `
    
    params.push(limit, offset)

    const workflows = await sql.unsafe(query, params)

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(DISTINCT w.id) as total
      FROM workflows w
      WHERE ${conditions.join(' AND ')}
    `
    
    if (tool) {
      countQuery += ` AND EXISTS (
        SELECT 1 FROM workflow_tools wt 
        WHERE wt.workflow_id = w.id 
        AND wt.tool_name = '${tool}'
      )`
    }

    const countResult = await sql.unsafe(countQuery, params.slice(0, -2))
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