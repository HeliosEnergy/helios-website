import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.useCase) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate GPU count
    const gpuCount = parseInt(body.gpuCount);
    if (isNaN(gpuCount) || gpuCount < 1 || gpuCount > 20000) {
      return NextResponse.json(
        { error: 'Invalid GPU count. Must be between 1 and 20000' },
        { status: 400 }
      );
    }

    // Validate use case
    const validUseCases = ['baremetal', 'media', 'inference'];
    if (body.useCase && !validUseCases.includes(body.useCase)) {
      return NextResponse.json(
        { error: 'Invalid use case' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send notification email
    // 3. Integrate with CRM system
    // 4. Trigger follow-up processes

    console.log('Contact request received:', {
      name: body.name,
      company: body.company,
      email: body.email,
      useCase: body.useCase,
      gpuCount: gpuCount
    });

    return NextResponse.json(
      { message: 'Request submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing baremetal request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}