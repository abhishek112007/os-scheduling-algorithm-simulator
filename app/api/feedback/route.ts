import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, message } = body;

    // Validate input
    if (!email || !message) {
      return NextResponse.json(
        { error: 'Email and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Sanitize message to prevent XSS
    const sanitizedMessage = message
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    const feedbackEmail = process.env.FEEDBACK_EMAIL || 'noreply@resend.dev';

    // Send email using Resend
    const data = await resend.emails.send({
      from: 'CPU Scheduler Feedback <onboarding@resend.dev>',
      to: [feedbackEmail],
      replyTo: email,
      subject: 'New Feedback from CPU Scheduling Visualizer',
      html: `
        <h2>New Feedback Received</h2>
        <p><strong>From:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>
      `,
    });

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send feedback' },
      { status: 500 }
    );
  }
}
