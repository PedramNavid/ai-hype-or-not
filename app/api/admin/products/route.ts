import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {

    // Get all products with basic info for admin table
    const products = await sql`
      SELECT 
        id,
        name,
        slug,
        category,
        verdict,
        hype_score,
        tagline,
        website_url,
        created_at,
        updated_at
      FROM products 
      ORDER BY created_at DESC
    `

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products for admin:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {

    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.slug || !data.category || !data.verdict || !data.hype_score || !data.tagline || !data.full_review) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Insert new product
    const [product] = await sql`
      INSERT INTO products (
        name, slug, category, verdict, hype_score, tagline, 
        website_url, full_review, description
      ) VALUES (
        ${data.name}, ${data.slug}, ${data.category}, ${data.verdict}, 
        ${data.hype_score}, ${data.tagline}, ${data.website_url}, 
        ${data.full_review}, ${data.description || data.tagline}
      )
      RETURNING *
    `

    // Insert pros and cons if provided
    if (data.pros && Array.isArray(data.pros)) {
      for (let i = 0; i < data.pros.length; i++) {
        await sql`
          INSERT INTO product_pros (product_id, text, display_order)
          VALUES (${product.id}, ${data.pros[i]}, ${i})
        `
      }
    }

    if (data.cons && Array.isArray(data.cons)) {
      for (let i = 0; i < data.cons.length; i++) {
        await sql`
          INSERT INTO product_cons (product_id, text, display_order)
          VALUES (${product.id}, ${data.cons[i]}, ${i})
        `
      }
    }

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}