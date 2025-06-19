import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const productId = parseInt(id)
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    // Get screenshots for the product
    const screenshots = await sql`
      SELECT id, product_id, image_url, caption, display_order
      FROM product_screenshots 
      WHERE product_id = ${productId}
      ORDER BY display_order, id
    `

    return NextResponse.json(screenshots)
  } catch (error) {
    console.error('Error fetching screenshots:', error)
    return NextResponse.json(
      { error: 'Failed to fetch screenshots' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const productId = parseInt(id)
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    const { screenshots } = await request.json()

    // Delete existing screenshots
    await sql`DELETE FROM product_screenshots WHERE product_id = ${productId}`

    // Insert new screenshots
    if (screenshots && Array.isArray(screenshots)) {
      for (let i = 0; i < screenshots.length; i++) {
        const screenshot = screenshots[i]
        if (screenshot.image_url) {
          await sql`
            INSERT INTO product_screenshots (product_id, image_url, caption, display_order)
            VALUES (${productId}, ${screenshot.image_url}, ${screenshot.caption || ''}, ${i})
          `
        }
      }
    }

    return NextResponse.json({ message: 'Screenshots updated successfully' })
  } catch (error) {
    console.error('Error updating screenshots:', error)
    return NextResponse.json(
      { error: 'Failed to update screenshots' },
      { status: 500 }
    )
  }
}