import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// GET - List all workflows for admin
export async function GET() {
  try {

    const workflows = await sql`
      SELECT 
        w.id,
        w.title,
        w.slug,
        w.description,
        w.workflow_type,
        w.difficulty_level,
        w.status,
        w.is_featured,
        w.view_count,
        w.created_at,
        w.updated_at,
        u.name as author_name,
        COUNT(DISTINCT ws.user_id) as save_count,
        COUNT(DISTINCT wc.id) as comment_count
      FROM workflows w
      JOIN users u ON w.author_id = u.id
      LEFT JOIN workflow_saves ws ON w.id = ws.workflow_id
      LEFT JOIN workflow_comments wc ON w.id = wc.workflow_id
      GROUP BY w.id, u.id
      ORDER BY w.created_at DESC
    `

    return NextResponse.json(workflows)
  } catch (error) {
    console.error('Error fetching workflows:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workflows' },
      { status: 500 }
    )
  }
}

// POST - Create new workflow
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      title,
      slug,
      description,
      content,
      author_id,
      workflow_type,
      difficulty_level,
      time_estimate,
      status = 'draft',
      is_featured = false,
      tools = [],
      steps = []
    } = data

    // Validate author exists
    const author = await sql`
      SELECT id FROM users WHERE id = ${author_id}
    `

    if (author.length === 0) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 })
    }

    const authorId = author_id

    // Insert workflow
    const workflow = await sql`
      INSERT INTO workflows (
        title, slug, description, content, author_id, workflow_type,
        difficulty_level, time_estimate, status, is_featured
      ) VALUES (
        ${title}, ${slug}, ${description}, ${content}, ${authorId},
        ${workflow_type}, ${difficulty_level}, ${time_estimate}, ${status}, ${is_featured}
      )
      RETURNING *
    `

    const workflowId = workflow[0].id

    // Insert tools if provided
    if (tools.length > 0) {
      for (const tool of tools) {
        await sql`
          INSERT INTO workflow_tools (workflow_id, tool_name, tool_category, is_required)
          VALUES (${workflowId}, ${tool.tool_name}, ${tool.tool_category}, ${tool.is_required})
        `
      }
    }

    // Insert steps if provided
    if (steps.length > 0) {
      for (const step of steps) {
        await sql`
          INSERT INTO workflow_steps (
            workflow_id, step_number, title, description, 
            code_snippet, prompt_template, tips
          )
          VALUES (
            ${workflowId}, ${step.step_number}, ${step.title}, ${step.description},
            ${step.code_snippet}, ${step.prompt_template}, ${step.tips}
          )
        `
      }
    }

    return NextResponse.json(workflow[0], { status: 201 })
  } catch (error) {
    console.error('Error creating workflow:', error)
    return NextResponse.json(
      { error: 'Failed to create workflow' },
      { status: 500 }
    )
  }
}