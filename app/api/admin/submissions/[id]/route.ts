import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const submissionId = parseInt(id)
    if (isNaN(submissionId)) {
      return NextResponse.json({ error: 'Invalid submission ID' }, { status: 400 })
    }

    const data = await request.json()

    // Update submission status
    const [updatedSubmission] = await sql`
      UPDATE submissions SET
        status = ${data.status},
        updated_at = NOW()
      WHERE id = ${submissionId}
      RETURNING *
    `

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
    const { id } = await params
    const submissionId = parseInt(id)
    if (isNaN(submissionId)) {
      return NextResponse.json({ error: 'Invalid submission ID' }, { status: 400 })
    }

    // Delete the submission
    const [deletedSubmission] = await sql`
      DELETE FROM submissions WHERE id = ${submissionId} RETURNING *
    `

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