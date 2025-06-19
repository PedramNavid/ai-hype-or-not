import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const products = await sql`
      SELECT
        p.id,
        p.name,
        p.slug,
        p.category,
        p.verdict,
        p.hype_score,
        p.tagline,
        COALESCE(ps.image_url, '/screenshots/placeholder.svg') as image
      FROM products p
      LEFT JOIN (
        SELECT DISTINCT ON (product_id)
          product_id,
          image_url
        FROM product_screenshots
        ORDER BY product_id, display_order, id
      ) ps ON p.id = ps.product_id
      ORDER BY p.created_at DESC
    `;

    // Transform database format to match the frontend interface
    const transformedProducts = products.map(product => ({
      id: product.slug,
      name: product.name,
      slug: product.slug,
      category: product.category,
      rating: product.verdict,
      hyeScore: product.hype_score,
      description: product.tagline,
      image: product.image,
      tags: [product.category, "AI Tool"]
    }));

    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}