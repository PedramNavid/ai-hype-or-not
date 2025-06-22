import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { sql } from '@/lib/db'
import type { Session } from 'next-auth'

// Check admin status
async function isAdmin(session: Session | null): Promise<boolean> {
  if (!session?.user?.email) return false
  
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim().toLowerCase()) || []
  return adminEmails.includes(session.user.email.toLowerCase())
}

export async function GET() {
  try {
    // Check if user is admin
    const session = await getServerSession()
    
    if (!session || !(await isAdmin(session))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get total workflows and total views
    const totals = await sql`
      SELECT 
        COUNT(*) as total_workflows,
        COALESCE(SUM(view_count), 0) as total_views
      FROM workflows
      WHERE status = 'published'
    `

    // Get most viewed workflows
    const mostViewed = await sql`
      SELECT 
        w.id,
        w.title,
        w.slug,
        w.view_count,
        w.workflow_type,
        u.name as author_name
      FROM workflows w
      LEFT JOIN users u ON w.author_id = u.id
      WHERE w.status = 'published'
      ORDER BY w.view_count DESC
      LIMIT 10
    `

    // Get most saved workflows
    const mostSaved = await sql`
      SELECT 
        w.id,
        w.title,
        w.slug,
        w.workflow_type,
        u.name as author_name,
        COUNT(ws.workflow_id) as save_count
      FROM workflows w
      LEFT JOIN workflow_saves ws ON w.id = ws.workflow_id
      LEFT JOIN users u ON w.author_id = u.id
      WHERE w.status = 'published'
      GROUP BY w.id, w.title, w.slug, w.workflow_type, u.name
      ORDER BY save_count DESC
      LIMIT 10
    `

    return NextResponse.json({
      totalWorkflows: parseInt(totals[0].total_workflows),
      totalViews: parseInt(totals[0].total_views),
      mostViewed: mostViewed.map(workflow => ({
        ...workflow,
        view_count: parseInt(workflow.view_count || 0)
      })),
      mostSaved: mostSaved.map(workflow => ({
        ...workflow,
        save_count: parseInt(workflow.save_count || 0)
      }))
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}