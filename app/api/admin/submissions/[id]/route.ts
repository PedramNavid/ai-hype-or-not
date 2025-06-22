import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { sql } from '@/lib/db'
import type { Session } from 'next-auth'

// Check if user is admin
async function isAdmin(session: Session | null): Promise<boolean> {
  if (!session?.user?.email) return false

  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim().toLowerCase()) || []
  return adminEmails.includes(session.user.email.toLowerCase())
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession()
    if (!session || !(await isAdmin(session))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const submissionId = parseInt(id)
    if (isNaN(submissionId)) {
      return NextResponse.json({ error: 'Invalid submission ID' }, { status: 400 })
    }

    const data = await request.json()
    const { submission_type } = data

    let updatedSubmission;

    if (submission_type === 'workflow') {
      // Update workflow submission
      const [result] = await sql`
        UPDATE workflow_submissions SET
          status = ${data.status},
          reviewer_notes = ${data.reviewer_notes || null},
          updated_at = NOW()
        WHERE id = ${submissionId}
        RETURNING *
      `
      updatedSubmission = result;
    } else {
      // Update legacy submission (default for backwards compatibility)
      const [result] = await sql`
        UPDATE submissions SET
          status = ${data.status},
          updated_at = NOW()
        WHERE id = ${submissionId}
        RETURNING *
      `
      updatedSubmission = result;
    }

    if (!updatedSubmission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    return NextResponse.json(updatedSubmission)
  } catch (error) {
    console.error('Error updating submission:', error)
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession()
    if (!session || !(await isAdmin(session))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const submissionId = parseInt(id)
    if (isNaN(submissionId)) {
      return NextResponse.json({ error: 'Invalid submission ID' }, { status: 400 })
    }

    const url = new URL(request.url)
    const submissionType = url.searchParams.get('type')

    let deletedSubmission;

    if (submissionType === 'workflow') {
      // Delete workflow submission
      const [result] = await sql`
        DELETE FROM workflow_submissions WHERE id = ${submissionId} RETURNING *
      `
      deletedSubmission = result;
    } else {
      // Delete legacy submission (default for backwards compatibility)
      const [result] = await sql`
        DELETE FROM submissions WHERE id = ${submissionId} RETURNING *
      `
      deletedSubmission = result;
    }

    if (!deletedSubmission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Submission deleted successfully' })
  } catch (error) {
    console.error('Error deleting submission:', error)
    return NextResponse.json(
      { error: 'Failed to delete submission' },
      { status: 500 }
    )
  }
}
