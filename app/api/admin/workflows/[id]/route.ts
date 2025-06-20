import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { sql } from '@/lib/db'
import type { Session } from 'next-auth'

// Check if user is admin
async function isAdmin(session: Session | null): Promise<boolean> {
  if (!session?.user?.email) return false
  
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim().toLowerCase()) || []
  return adminEmails.includes(session.user.email.toLowerCase())
}

// GET - Get specific workflow for editing
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession()
    
    if (!session || !(await isAdmin(session))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get workflow details
    const workflows = await sql`
      SELECT 
        w.*,
        json_build_object(
          'id', u.id,
          'name', u.name,
          'email', u.email
        ) as author
      FROM workflows w
      JOIN users u ON w.author_id = u.id
      WHERE w.id = ${id}
    `

    if (workflows.length === 0) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    const workflow = workflows[0]

    // Get tools
    const tools = await sql`
      SELECT tool_name, tool_category, is_required
      FROM workflow_tools
      WHERE workflow_id = ${id}
      ORDER BY is_required DESC, tool_name
    `

    // Get steps
    const steps = await sql`
      SELECT step_number, title, description, code_snippet, prompt_template, tips
      FROM workflow_steps
      WHERE workflow_id = ${id}
      ORDER BY step_number
    `

    return NextResponse.json({
      ...workflow,
      tools,
      steps
    })
  } catch (error) {
    console.error('Error fetching workflow:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workflow' },
      { status: 500 }
    )
  }
}

// PUT - Update workflow
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession()
    
    if (!session || !(await isAdmin(session))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const {
      title,
      slug,
      description,
      content,
      workflow_type,
      difficulty_level,
      time_estimate,
      status,
      is_featured,
      tools = [],
      steps = []
    } = data

    // Update workflow
    const workflow = await sql`
      UPDATE workflows SET
        title = ${title},
        slug = ${slug},
        description = ${description},
        content = ${content},
        workflow_type = ${workflow_type},
        difficulty_level = ${difficulty_level},
        time_estimate = ${time_estimate},
        status = ${status},
        is_featured = ${is_featured},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (workflow.length === 0) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    // Delete existing tools and steps
    await sql`DELETE FROM workflow_tools WHERE workflow_id = ${id}`
    await sql`DELETE FROM workflow_steps WHERE workflow_id = ${id}`

    // Insert updated tools
    if (tools.length > 0) {
      for (const tool of tools) {
        await sql`
          INSERT INTO workflow_tools (workflow_id, tool_name, tool_category, is_required)
          VALUES (${id}, ${tool.tool_name}, ${tool.tool_category}, ${tool.is_required})
        `
      }
    }

    // Insert updated steps
    if (steps.length > 0) {
      for (const step of steps) {
        await sql`
          INSERT INTO workflow_steps (
            workflow_id, step_number, title, description,
            code_snippet, prompt_template, tips
          )
          VALUES (
            ${id}, ${step.step_number}, ${step.title}, ${step.description},
            ${step.code_snippet}, ${step.prompt_template}, ${step.tips}
          )
        `
      }
    }

    return NextResponse.json(workflow[0])
  } catch (error) {
    console.error('Error updating workflow:', error)
    return NextResponse.json(
      { error: 'Failed to update workflow' },
      { status: 500 }
    )
  }
}

// DELETE - Delete workflow
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession()
    
    if (!session || !(await isAdmin(session))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete workflow (cascade will handle related records)
    const result = await sql`
      DELETE FROM workflows WHERE id = ${id} RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Workflow deleted successfully' })
  } catch (error) {
    console.error('Error deleting workflow:', error)
    return NextResponse.json(
      { error: 'Failed to delete workflow' },
      { status: 500 }
    )
  }
}