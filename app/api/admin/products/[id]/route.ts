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

    // Get product with all details including pros/cons
    const [product] = await sql`
      SELECT * FROM products WHERE id = ${productId}
    `

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Get pros and cons
    const [pros, cons] = await Promise.all([
      sql`
        SELECT text FROM product_pros 
        WHERE product_id = ${productId} 
        ORDER BY display_order, id
      `,
      sql`
        SELECT text FROM product_cons 
        WHERE product_id = ${productId} 
        ORDER BY display_order, id
      `
    ])

    return NextResponse.json({
      ...product,
      pros: pros.map(p => p.text),
      cons: cons.map(c => c.text)
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
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

    const data = await request.json()

    // Update product
    const [updatedProduct] = await sql`
      UPDATE products SET
        name = ${data.name},
        slug = ${data.slug},
        category = ${data.category},
        verdict = ${data.verdict},
        hype_score = ${data.hype_score},
        tagline = ${data.tagline},
        website_url = ${data.website_url},
        full_review = ${data.full_review},
        updated_at = NOW()
      WHERE id = ${productId}
      RETURNING *
    `

    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Update pros and cons if provided
    if (data.pros && Array.isArray(data.pros)) {
      // Delete existing pros
      await sql`DELETE FROM product_pros WHERE product_id = ${productId}`
      
      // Insert new pros
      for (let i = 0; i < data.pros.length; i++) {
        await sql`
          INSERT INTO product_pros (product_id, text, display_order)
          VALUES (${productId}, ${data.pros[i]}, ${i})
        `
      }
    }

    if (data.cons && Array.isArray(data.cons)) {
      // Delete existing cons
      await sql`DELETE FROM product_cons WHERE product_id = ${productId}`
      
      // Insert new cons
      for (let i = 0; i < data.cons.length; i++) {
        await sql`
          INSERT INTO product_cons (product_id, text, display_order)
          VALUES (${productId}, ${data.cons[i]}, ${i})
        `
      }
    }

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const productId = parseInt(id)
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    // Delete related records first (due to foreign key constraints)
    await Promise.all([
      sql`DELETE FROM product_screenshots WHERE product_id = ${productId}`,
      sql`DELETE FROM product_pros WHERE product_id = ${productId}`,
      sql`DELETE FROM product_cons WHERE product_id = ${productId}`
    ])

    // Delete the product
    const [deletedProduct] = await sql`
      DELETE FROM products WHERE id = ${productId} RETURNING *
    `

    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}