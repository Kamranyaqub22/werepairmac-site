import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, device, area, message } = body;

    if (!name || !phone || !device || !area) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"We Repair Mac Website" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'info@werepairmac.co.uk',
      replyTo: email || undefined,
      subject: `New Repair Request — ${device} (${area})`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0f2b5b; color: white; padding: 24px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0; font-size: 20px;">New Repair Request</h2>
            <p style="margin: 4px 0 0; opacity: 0.8; font-size: 14px;">From werepairmac.co.uk</p>
          </div>
          <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold; width: 140px; color: #374151;">Name</td><td style="padding: 8px 0; color: #111827;">${name}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Phone</td><td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #0f2b5b;">${phone}</a></td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Email</td><td style="padding: 8px 0;">${email ? `<a href="mailto:${email}" style="color: #0f2b5b;">${email}</a>` : '—'}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Device / Fault</td><td style="padding: 8px 0; color: #111827;">${device}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Area / Postcode</td><td style="padding: 8px 0; color: #111827;">${area}</td></tr>
              ${message ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #374151; vertical-align: top;">Details</td><td style="padding: 8px 0; color: #111827;">${message}</td></tr>` : ''}
            </table>
            <div style="margin-top: 20px; padding: 12px; background: #dbeafe; border-radius: 6px; font-size: 13px; color: #1e3a8a;">
              💡 Reply directly to this email to respond to the customer.
            </div>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
