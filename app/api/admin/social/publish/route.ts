import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { postPhoto, postText, verifyCredentials, FacebookError } from '@/lib/facebook';
import { appendToLog } from '@/lib/socialLog';
import { PublishError } from '@/lib/githubPublish';

export const runtime = 'nodejs';
export const maxDuration = 60;

/** Publishes the reviewed post to the Page, then records that it went out. */
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

  let body: { topicId?: string; message?: string; image?: string; imageSource?: 'real' | 'generated' };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Expected a JSON body.' }, { status: 400 });
  }

  const message = body.message?.trim();
  if (!message) {
    return NextResponse.json({ error: 'The post has no text.' }, { status: 400 });
  }
  if (!body.topicId) {
    return NextResponse.json({ error: 'No topic attached to this post.' }, { status: 400 });
  }

  let result;
  try {
    result = body.image ? await postPhoto(body.image, message) : await postText(message);
  } catch (err) {
    if (err instanceof FacebookError) {
      return NextResponse.json({ error: err.message }, { status: 502 });
    }
    console.error('[admin/social/publish]', err);
    return NextResponse.json({ error: 'Publishing to Facebook failed.' }, { status: 500 });
  }

  // The post is live from here on. A failure to record it must not read as a
  // failure to publish, or the owner will post the same thing again.
  try {
    const { commitUrl } = await appendToLog({
      topicId: body.topicId,
      postedAt: new Date().toISOString(),
      postId: result.postId,
      imageSource: body.image ? (body.imageSource ?? 'real') : 'none',
      preview: message.split('\n')[0].slice(0, 120),
    });
    return NextResponse.json({ ...result, logged: true, commitUrl });
  } catch (err) {
    const detail = err instanceof PublishError ? err.message : 'the log could not be written';
    return NextResponse.json({
      ...result,
      logged: false,
      warning: `Posted to Facebook, but ${detail}. The rotation will offer this topic again — skip it manually next time.`,
    });
  }
}

/** Checks the Facebook credentials without posting anything. */
export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

  try {
    return NextResponse.json({ page: await verifyCredentials() });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof FacebookError ? err.message : 'Could not verify the Page.' },
      { status: 502 }
    );
  }
}
