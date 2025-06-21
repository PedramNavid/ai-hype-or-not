import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { sql } from '@/lib/db'
import type { Session } from 'next-auth'

// Check if user is admin
async function isAdmin(session: Session | null): Promise<boolean> {
  if (!session?.user?.email) return false
  
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim().toLowerCase()) || []
  return adminEmails.includes(session.user.email.toLowerCase())
}

// GET - List all authors for admin
export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session || !(await isAdmin(session))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const authors = await sql`
      SELECT 
        u.id,
        u.email,
        u.name,
        u.bio,
        u.slug,
        u.github_username,
        u.twitter_username,
        u.linkedin_username,
        u.website_url,
        u.avatar_url,
        u.created_at,
        u.updated_at,
        COUNT(DISTINCT w.id) as workflow_count
      FROM users u
      LEFT JOIN workflows w ON u.id = w.author_id
      GROUP BY u.id
      ORDER BY u.name ASC
    `

    return NextResponse.json(authors)
  } catch (error) {
    console.error('Error fetching authors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch authors' },
      { status: 500 }
    )
  }
}

// POST - Create new author
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session || !(await isAdmin(session))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const {
      email,
      name,
      bio = '',
      github_username = '',
      twitter_username = '',
      linkedin_username = '',
      website_url = '',
      avatar_url = ''
    } = data

    // Generate slug from name
    const baseSlug = name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // Check if slug already exists and make it unique if needed
    let slug = baseSlug
    let counter = 1
    while (true) {
      const existing = await sql`
        SELECT id FROM users WHERE slug = ${slug} LIMIT 1
      `
      if (existing.length === 0) break
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Insert author
    const author = await sql`
      INSERT INTO users (
        email, name, bio, slug, github_username, twitter_username,
        linkedin_username, website_url, avatar_url
      ) VALUES (
        ${email}, ${name}, ${bio}, ${slug}, ${github_username}, 
        ${twitter_username}, ${linkedin_username}, ${website_url}, ${avatar_url}
      )
      RETURNING *
    `

    return NextResponse.json(author[0], { status: 201 })
  } catch (error) {
    console.error('Error creating author:', error)
    return NextResponse.json(
      { error: 'Failed to create author' },
      { status: 500 }
    )
  }
}