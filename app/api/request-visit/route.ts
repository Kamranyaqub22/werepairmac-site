import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, device, area, preferredDay, timeWindow, estimate, message } = body;

    if (!name || !phone || !device || !area || !timeWindow) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const smtpPort = Number(process.env.SMTP_PORT) || 587;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: smtpPort,
      // 465 is implicit TLS; 587 upgrades via STARTTLS
      secure: smtpPort === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const row = (label: string, value?: string) =>
      value
        ? `<tr><td style="padding: 8px 0; font-weight: bold; width: 150px; color: #374151;">${label}</td><td style="padding: 8px 0; color: #111827;">${value}</td></tr>`
        : '';

    await transporter.sendMail({
      from: `"We Repair Mac Website" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'info@werepairmac.co.uk',
      replyTo: email || undefined,
      subject: `New Visit Request - ${device} (${area})`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0f2b5b; color: white; padding: 24px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0; font-size: 20px;">New Home Visit Request</h2>
            <p style="margin: 4px 0 0; opacity: 0.8; font-size: 14px;">From werepairmac.co.uk quote & booking page</p>
          </div>
          <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <table style="width: 100%; border-collapse: collapse;">
              ${row('Name', name)}
              <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Phone</td><td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #0f2b5b;">${phone}</a></td></tr>
              ${row('Email', email ? `<a href="mailto:${email}" style="color: #0f2b5b;">${email}</a>` : '')}
              ${row('Device / Fault', device)}
              ${row('Est. price shown', estimate)}
              ${row('Area / Postcode', area)}
              ${row('Preferred date', preferredDay)}
              ${row('Preferred time', timeWindow)}
              ${row('Details', message)}
            </table>
            <div style="margin-top: 20px; padding: 12px; background: #fef3c7; border-radius: 6px; font-size: 13px; color: #92400e;">
              📅 Call or WhatsApp ${name} to confirm a visit time — no fixed slot was promised.
            </div>
            <div style="margin-top: 16px; padding: 12px; background: #dbeafe; border-radius: 6px; font-size: 13px; color: #1e3a8a;">
              💡 Reply directly to this email to respond to the customer.
            </div>
          </div>
        </div>
      `,
    });

    if (email) {
      await transporter.sendMail({
        from: `"We Repair Mac" <${process.env.SMTP_USER}>`,
        to: email,
        replyTo: process.env.CONTACT_EMAIL || 'info@werepairmac.co.uk',
        subject: `We've received your visit request — We Repair Mac`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #0f2b5b; color: white; padding: 24px; border-radius: 8px 8px 0 0;">
              <h2 style="margin: 0; font-size: 20px;">Thanks, ${name}! We've got your request.</h2>
              <p style="margin: 6px 0 0; opacity: 0.85; font-size: 14px;">We'll call or message you shortly to confirm a visit time that suits you.</p>
            </div>
            <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 16px; color: #374151; font-size: 15px;">Here's what you submitted:</p>
              <table style="width: 100%; border-collapse: collapse; background: white; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                ${row('Device / Fault', device)}
                ${row('Estimated price', estimate)}
                ${row('Area / Postcode', area)}
                ${row('Preferred date', preferredDay)}
                ${row('Preferred time', timeWindow)}
              </table>
              <div style="margin-top: 20px; padding: 14px 16px; background: #dbeafe; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <p style="margin: 0; font-size: 14px; color: #1e3a8a; font-weight: 600;">⏱ We'll be in touch shortly to confirm.</p>
                <p style="margin: 6px 0 0; font-size: 13px; color: #1e40af;">Any estimate shown is a guide only — the final price is confirmed on site before any work. If it's urgent, call <a href="tel:07378349222" style="color: #1e40af; font-weight: bold;">0737 834 9222</a>.</p>
              </div>
              <p style="margin: 20px 0 0; font-size: 12px; color: #9ca3af; text-align: center;">
                We Repair Mac &bull; <a href="https://www.werepairmac.co.uk" style="color: #9ca3af;">werepairmac.co.uk</a>
              </p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Visit request error:', err);
    return NextResponse.json({ error: 'Failed to send request' }, { status: 500 });
  }
}
