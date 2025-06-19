import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    // Get product statistics
    const [totalResult] = await sql`
      SELECT COUNT(*) as total FROM products
    `
    
    const [legitResult] = await sql`
      SELECT COUNT(*) as count FROM products WHERE verdict = 'LEGIT'
    `
    
    const [overhypedResult] = await sql`
      SELECT COUNT(*) as count FROM products WHERE verdict = 'OVERHYPED'
    `

    return NextResponse.json({
      total: parseInt(totalResult.total),
      legit: parseInt(legitResult.count),
      overhyped: parseInt(overhypedResult.count)
    })
  } catch (error) {
    console.error('Error fetching product stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product statistics' },
      { status: 500 }
    )
  }
}