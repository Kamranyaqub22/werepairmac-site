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
      subject: `New Repair Request - ${device} (${area})`,
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
              <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Email</td><td style="padding: 8px 0;">${email ? `<a href="mailto:${email}" style="color: #0f2b5b;">${email}</a>` : '-'}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Device / Fault</td><td style="padding: 8px 0; color: #111827;">${device}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Area / Postcode</td><td style="padding: 8px 0; color: #111827;">${area}</td></tr>
              ${message ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #374151; vertical-align: top;">Details</td><td style="padding: 8px 0; color: #111827;">${message}</td></tr>` : ''}
            </table>
            <div style="margin-top: 20px; padding: 12px; background: #dbeafe; border-radius: 6px; font-size: 13px; color: #1e3a8a;">
              💡 Reply directly to this email to respond to the customer.
            </div>
            <div style="margin-top: 16px; padding: 14px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px;">
              <p style="margin: 0 0 8px; font-weight: bold; font-size: 13px; color: #166534;">⭐ After the job — send ${name} a review request:</p>
              <p style="margin: 0; font-size: 13px; color: #374151; line-height: 1.6; background: white; padding: 10px 12px; border-radius: 4px; border: 1px solid #d1fae5; white-space: pre-wrap;">Hi ${name}, thanks for using We Repair Mac! If you're happy with the repair, it would mean a lot if you could leave us a quick Google review — it takes under a minute: https://www.werepairmac.co.uk/review  Thanks again 👍</p>
            </div>
          </div>
        </div>
      `,
    });

    // Send confirmation email to the customer if they provided an email address
    if (email) {
      await transporter.sendMail({
        from: `"We Repair Mac" <${process.env.SMTP_USER}>`,
        to: email,
        replyTo: process.env.CONTACT_EMAIL || 'info@werepairmac.co.uk',
        subject: `We've received your repair request — We Repair Mac`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #0f2b5b; padding: 20px 24px; border-radius: 8px 8px 0 0; text-align: center;">
              <img src="https://www.werepairmac.co.uk/logo.png" alt="We Repair Mac" style="height: 48px; width: auto; display: inline-block;" />
            </div>
            <div style="background: #0f2b5b; color: white; padding: 0 24px 24px; border-radius: 0;">
              <h2 style="margin: 0; font-size: 20px;">Thanks for getting in touch, ${name}!</h2>
              <p style="margin: 6px 0 0; opacity: 0.8; font-size: 14px;">We&apos;ve received your repair request and will get back to you shortly.</p>
            </div>
            <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 16px; color: #374151; font-size: 15px;">Here&apos;s a summary of what you submitted:</p>
              <table style="width: 100%; border-collapse: collapse; background: white; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                <tr style="background: #f3f4f6;">
                  <td style="padding: 10px 14px; font-weight: bold; width: 140px; color: #374151; font-size: 13px;">Name</td>
                  <td style="padding: 10px 14px; color: #111827; font-size: 13px;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; font-weight: bold; color: #374151; font-size: 13px; border-top: 1px solid #e5e7eb;">Phone</td>
                  <td style="padding: 10px 14px; color: #111827; font-size: 13px; border-top: 1px solid #e5e7eb;">${phone}</td>
                </tr>
                <tr style="background: #f3f4f6;">
                  <td style="padding: 10px 14px; font-weight: bold; color: #374151; font-size: 13px; border-top: 1px solid #e5e7eb;">Device / Fault</td>
                  <td style="padding: 10px 14px; color: #111827; font-size: 13px; border-top: 1px solid #e5e7eb;">${device}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; font-weight: bold; color: #374151; font-size: 13px; border-top: 1px solid #e5e7eb;">Area / Postcode</td>
                  <td style="padding: 10px 14px; color: #111827; font-size: 13px; border-top: 1px solid #e5e7eb;">${area}</td>
                </tr>
                ${message ? `
                <tr style="background: #f3f4f6;">
                  <td style="padding: 10px 14px; font-weight: bold; color: #374151; font-size: 13px; border-top: 1px solid #e5e7eb; vertical-align: top;">Additional Details</td>
                  <td style="padding: 10px 14px; color: #111827; font-size: 13px; border-top: 1px solid #e5e7eb;">${message}</td>
                </tr>` : ''}
              </table>
              <div style="margin-top: 20px; padding: 14px 16px; background: #dbeafe; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <p style="margin: 0; font-size: 14px; color: #1e3a8a; font-weight: 600;">⏱ We aim to respond within 30 minutes.</p>
                <p style="margin: 6px 0 0; font-size: 13px; color: #1e40af;">If it&apos;s urgent, call us directly on <a href="tel:07378349222" style="color: #1e40af; font-weight: bold;">0737 834 9222</a>.</p>
              </div>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
              <p style="margin: 0; font-size: 12px; color: #9ca3af; text-align: center;">
                We Repair Mac &bull; <a href="https://www.werepairmac.co.uk" style="color: #9ca3af;">werepairmac.co.uk</a>
              </p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
