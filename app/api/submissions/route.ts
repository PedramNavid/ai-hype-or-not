import { NextResponse } from 'next/server';
import { createSubmission } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.tool_name || !data.website_url || !data.category || !data.description || !data.why_review) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const submission = await createSubmission({
      tool_name: data.tool_name,
      website_url: data.website_url,
      category: data.category,
      description: data.description,
      why_review: data.why_review,
      your_role: data.your_role || null,
      email: data.email || null,
      additional_info: data.additional_info || null,
    });
    
    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    );
  }
}