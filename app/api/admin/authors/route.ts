import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { validateEmail, validateTextLength, sanitizeInput, VALIDATION_LIMITS, validateURL } from '@/lib/validation'

// GET - List all authors for admin
export async function GET() {
  try {
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

    // Validate email
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      return NextResponse.json({ error: emailValidation.error }, { status: 400 })
    }

    // Validate name
    const nameValidation = validateTextLength(name, 'Name', VALIDATION_LIMITS.TITLE_MAX)
    if (!nameValidation.valid) {
      return NextResponse.json({ error: nameValidation.error }, { status: 400 })
    }

    // Validate bio if provided
    if (bio) {
      const bioValidation = validateTextLength(bio, 'Bio', VALIDATION_LIMITS.BIO_MAX)
      if (!bioValidation.valid) {
        return NextResponse.json({ error: bioValidation.error }, { status: 400 })
      }
    }

    // Validate website URL if provided
    if (website_url) {
      const urlValidation = validateURL(website_url)
      if (!urlValidation.valid) {
        return NextResponse.json({ error: urlValidation.error }, { status: 400 })
      }
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name)
    const sanitizedBio = sanitizeInput(bio)

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
        ${email}, ${sanitizedName}, ${sanitizedBio}, ${slug}, ${github_username}, 
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