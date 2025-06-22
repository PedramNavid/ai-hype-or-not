import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// GET - Get single author
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const author = await sql`
      SELECT 
        u.*,
        COUNT(DISTINCT w.id) as workflow_count
      FROM users u
      LEFT JOIN workflows w ON u.id = w.author_id
      WHERE u.id = ${id}
      GROUP BY u.id
    `

    if (author.length === 0) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 })
    }

    return NextResponse.json(author[0])
  } catch (error) {
    console.error('Error fetching author:', error)
    return NextResponse.json(
      { error: 'Failed to fetch author' },
      { status: 500 }
    )
  }
}

// PUT - Update author
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const data = await request.json()
    const {
      email,
      name,
      bio,
      github_username,
      twitter_username,
      linkedin_username,
      website_url,
      avatar_url,
      slug
    } = data

    // If slug is being updated, check for uniqueness
    if (slug) {
      const existing = await sql`
        SELECT id FROM users WHERE slug = ${slug} AND id != ${id} LIMIT 1
      `
      if (existing.length > 0) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 400 }
        )
      }
    }

    // Update author
    const updated = await sql`
      UPDATE users SET
        email = ${email},
        name = ${name},
        bio = ${bio},
        slug = ${slug},
        github_username = ${github_username},
        twitter_username = ${twitter_username},
        linkedin_username = ${linkedin_username},
        website_url = ${website_url},
        avatar_url = ${avatar_url},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 })
    }

    return NextResponse.json(updated[0])
  } catch (error) {
    console.error('Error updating author:', error)
    return NextResponse.json(
      { error: 'Failed to update author' },
      { status: 500 }
    )
  }
}

// DELETE - Delete author
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    // Check if author has workflows
    const workflows = await sql`
      SELECT id FROM workflows WHERE author_id = ${id} LIMIT 1
    `

    if (workflows.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete author with existing workflows' },
        { status: 400 }
      )
    }

    // Delete author
    const deleted = await sql`
      DELETE FROM users WHERE id = ${id} RETURNING id
    `

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting author:', error)
    return NextResponse.json(
      { error: 'Failed to delete author' },
      { status: 500 }
    )
  }
}