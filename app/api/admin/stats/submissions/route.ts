import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {

    // Get submission statistics
    const [pendingResult] = await sql`
      SELECT COUNT(*) as count FROM submissions WHERE status = 'pending'
    `
    
    const [totalResult] = await sql`
      SELECT COUNT(*) as total FROM submissions
    `

    return NextResponse.json({
      pending: parseInt(pendingResult.count),
      total: parseInt(totalResult.total)
    })
  } catch (error) {
    console.error('Error fetching submission stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submission statistics' },
      { status: 500 }
    )
  }
}