import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { nextTopic } from '@/lib/socialTopics';
import { localLog, postedIndex } from '@/lib/socialLog';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * The every-two-days nudge.
 *
 * It does not write or publish anything. It works out what is due, emails a
 * one-line prompt with a link to the console, and stops there — which is what
 * "hold each post for approval" means in practice. Drafting happens when the
 * console is opened, so a nudge that is ignored costs nothing, and a caption is
 * never written for a post that never runs.
 */
export async function GET(req: NextRequest) {
  // Vercel signs its cron requests with CRON_SECRET. Without this check the
  // route is a public endpoint that emails the owner on demand.
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Not authorised.' }, { status: 401 });
    }
  }

  const log = localLog();
  const topic = nextTopic(postedIndex(log));
  if (!topic) {
    return NextResponse.json({ ok: true, skipped: 'no topics available' });
  }

  const lastPost = log[0]?.postedAt;
  const daysSince = lastPost
    ? Math.floor((Date.now() - new Date(lastPost).getTime()) / 86_400_000)
    : null;

  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    // Nothing to send with. Report rather than throw, so a missing mail config
    // shows up as a quiet cron result instead of a red deployment.
    return NextResponse.json({ ok: false, error: 'SMTP is not configured.' });
  }

  const smtpPort = Number(process.env.SMTP_PORT) || 587;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });

  await transporter.sendMail({
    from: `"We Repair Mac" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_EMAIL || 'info@werepairmac.co.uk',
    subject: `Facebook post ready to write — ${topic.subject}`,
    text: [
      'Next Facebook post is due.',
      '',
      `Suggested topic: ${topic.subject}`,
      `Links to: ${topic.url}`,
      daysSince === null
        ? 'Nothing has been posted through this tool yet.'
        : `Last post went out ${daysSince} day${daysSince === 1 ? '' : 's'} ago.`,
      '',
      'Open the console, read the draft, press Publish:',
      'https://www.werepairmac.co.uk/admin/social',
      '',
      'Ignoring this is fine — nothing posts without you.',
    ].join('\n'),
  });

  return NextResponse.json({ ok: true, topicId: topic.id });
}
