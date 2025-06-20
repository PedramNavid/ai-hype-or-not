import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { sql } from '@/lib/db'
import type { Session } from 'next-auth'

// We'll check admin status by examining the session and admin emails
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

    // Get workflow statistics
    const stats = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'published') as published,
        COUNT(*) FILTER (WHERE status = 'draft') as draft,
        COUNT(*) FILTER (WHERE is_featured = true) as featured,
        SUM(view_count) as total_views,
        COUNT(*) FILTER (WHERE workflow_type = 'greenfield') as greenfield,
        COUNT(*) FILTER (WHERE workflow_type = 'refactoring') as refactoring,
        COUNT(*) FILTER (WHERE workflow_type = 'debugging') as debugging,
        COUNT(*) FILTER (WHERE workflow_type = 'testing') as testing
      FROM workflows
    `

    // Get total saves count
    const savesResult = await sql`
      SELECT COUNT(*) as total_saves
      FROM workflow_saves
    `

    return NextResponse.json({
      total: parseInt(stats[0].total),
      published: parseInt(stats[0].published),
      draft: parseInt(stats[0].draft),
      featured: parseInt(stats[0].featured),
      totalViews: parseInt(stats[0].total_views || 0),
      totalSaves: parseInt(savesResult[0].total_saves),
      byType: {
        greenfield: parseInt(stats[0].greenfield),
        refactoring: parseInt(stats[0].refactoring),
        debugging: parseInt(stats[0].debugging),
        testing: parseInt(stats[0].testing)
      }
    })
  } catch (error) {
    console.error('Error fetching workflow stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workflow statistics' },
      { status: 500 }
    )
  }
}