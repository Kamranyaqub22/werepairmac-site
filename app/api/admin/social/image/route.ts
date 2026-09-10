import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { generateImage, loadRealPhoto, SocialImageError } from '@/lib/socialImage';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * Returns one post-ready image as base64 — either a real photograph off disk or
 * a generated one.
 *
 * Split out from drafting because generation costs money and takes seconds, and
 * most posts should use a real photo. Making it a separate press of a separate
 * button keeps the default cheap.
 */
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

  let body: { mode?: 'real' | 'generated'; src?: string; prompt?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Expected a JSON body.' }, { status: 400 });
  }

  try {
    if (body.mode === 'generated') {
      return NextResponse.json({ image: await generateImage(body.prompt ?? ''), source: 'generated' });
    }
    if (!body.src) {
      return NextResponse.json({ error: 'Pick a photo first.' }, { status: 400 });
    }
    return NextResponse.json({ image: await loadRealPhoto(body.src), source: 'real' });
  } catch (err) {
    if (err instanceof SocialImageError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error('[admin/social/image]', err);
    return NextResponse.json({ error: 'Preparing the image failed.' }, { status: 500 });
  }
}
