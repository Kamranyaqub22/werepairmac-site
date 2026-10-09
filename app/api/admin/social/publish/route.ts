import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { postPhotos, postText, verifyCredentials, FacebookError } from '@/lib/facebook';
import { appendToLog } from '@/lib/socialLog';
import { PublishError } from '@/lib/githubPublish';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Each prepared photo is a ~1200px JPEG, around 100–300 kB once base64'd.
// Six keeps the request well inside Vercel's 4.5 MB body limit.
const MAX_IMAGES = 6;

/** Publishes the reviewed post to the Page, then records that it went out. */
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

  let body: {
    topicId?: string;
    message?: string;
    /** Every image to attach, in display order. */
    images?: string[];
    /** Single-image form, kept so an open console tab from before still works. */
    image?: string;
    imageSource?: 'real' | 'generated';
  };
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

  const images = (body.images ?? (body.image ? [body.image] : [])).filter(Boolean);
  if (images.length > MAX_IMAGES) {
    return NextResponse.json({ error: `Attach at most ${MAX_IMAGES} photos.` }, { status: 400 });
  }

  let result;
  try {
    result = images.length ? await postPhotos(images, message) : await postText(message);
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
      imageSource: images.length ? (body.imageSource ?? 'real') : 'none',
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
