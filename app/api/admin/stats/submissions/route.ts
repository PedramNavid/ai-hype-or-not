import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    // Get submission statistics from both tables
    // Count pending/reviewing submissions from legacy submissions table
    const [legacyPendingResult] = await sql`
      SELECT COUNT(*) as count 
      FROM submissions 
      WHERE status IN ('pending', 'reviewing')
    `
    
    // Count pending workflow submissions
    const [workflowPendingResult] = await sql`
      SELECT COUNT(*) as count 
      FROM workflow_submissions 
      WHERE status IN ('pending', 'reviewing')
    `
    
    // Get total counts
    const [legacyTotalResult] = await sql`
      SELECT COUNT(*) as total FROM submissions
    `
    
    const [workflowTotalResult] = await sql`
      SELECT COUNT(*) as total FROM workflow_submissions
    `

    const totalPending = parseInt(legacyPendingResult.count) + parseInt(workflowPendingResult.count)
    const totalSubmissions = parseInt(legacyTotalResult.total) + parseInt(workflowTotalResult.total)

    return NextResponse.json({
      pending: totalPending,
      total: totalSubmissions,
      legacy: {
        pending: parseInt(legacyPendingResult.count),
        total: parseInt(legacyTotalResult.total)
      },
      workflow: {
        pending: parseInt(workflowPendingResult.count),
        total: parseInt(workflowTotalResult.total)
      }
    })
  } catch (error) {
    console.error('Error fetching submission stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submission statistics' },
      { status: 500 }
    )
  }
}