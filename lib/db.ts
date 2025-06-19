import { neon } from '@neondatabase/serverless';

// Get the database URL from environment variables
const getDatabaseUrl = () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL environment variable is not set');
    console.error('Make sure you have a .env.local file with DATABASE_URL defined');
    throw new Error('DATABASE_URL environment variable is not set');
  }
  return databaseUrl;
};

// Create a SQL query function
export const sql = neon(getDatabaseUrl());

// Type definitions for our database tables
export interface Product {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  verdict: 'LEGIT' | 'OVERHYPED';
  hype_score: number;
  category: string;
  website_url?: string;
  full_review: string;
  created_at: Date;
  updated_at: Date;
}

export interface ProductScreenshot {
  id: number;
  product_id: number;
  image_url: string;
  caption?: string;
  display_order: number;
  created_at: Date;
}

export interface ProductPro {
  id: number;
  product_id: number;
  text: string;
  display_order: number;
  created_at: Date;
}

export interface ProductCon {
  id: number;
  product_id: number;
  text: string;
  display_order: number;
  created_at: Date;
}

export interface Submission {
  id: number;
  tool_name: string;
  website_url: string;
  category: string;
  description: string;
  why_review: string;
  your_role?: string;
  email?: string;
  additional_info?: string;
  status: 'pending' | 'reviewing' | 'reviewed' | 'rejected';
  created_at: Date;
  updated_at: Date;
}

// Helper function to get a product with all related data
export async function getProductWithDetails(slug: string) {
  const [product] = await sql`
    SELECT * FROM products WHERE slug = ${slug} LIMIT 1
  `;

  if (!product) {
    return null;
  }

  const [screenshots, pros, cons] = await Promise.all([
    sql`
      SELECT * FROM product_screenshots
      WHERE product_id = ${product.id}
      ORDER BY display_order, id
    `,
    sql`
      SELECT * FROM product_pros
      WHERE product_id = ${product.id}
      ORDER BY display_order, id
    `,
    sql`
      SELECT * FROM product_cons
      WHERE product_id = ${product.id}
      ORDER BY display_order, id
    `
  ]);

  return {
    ...product,
    screenshots,
    pros: pros.map(p => p.text),
    cons: cons.map(c => c.text)
  };
}

// Helper function to get all products
export async function getAllProducts() {
  return sql`
    SELECT * FROM products
    ORDER BY created_at DESC
  `;
}

// Helper function to create a submission
export async function createSubmission(data: Omit<Submission, 'id' | 'status' | 'created_at' | 'updated_at'>) {
  const [submission] = await sql`
    INSERT INTO submissions (
      tool_name, website_url, category, description,
      why_review, your_role, email, additional_info
    ) VALUES (
      ${data.tool_name}, ${data.website_url}, ${data.category}, ${data.description},
      ${data.why_review}, ${data.your_role}, ${data.email}, ${data.additional_info}
    )
    RETURNING *
  `;

  return submission;
}