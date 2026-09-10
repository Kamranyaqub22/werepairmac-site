import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { nextTopic, allTopics } from '@/lib/socialTopics';
import { writeCaption, composePostText, CaptionError } from '@/lib/socialCaption';
import { realPhotoOptions, isGenerationConfigured } from '@/lib/socialImage';
import { localLog, postedIndex } from '@/lib/socialLog';
import { isConfigured as facebookConfigured } from '@/lib/facebook';

export const runtime = 'nodejs';
// Same ceiling as the repair drafter — Vercel's Hobby plan kills the function
// at 60s regardless of what is asked for here.
export const maxDuration = 60;

/**
 * Prepares the next post: picks a topic, writes a caption, and offers the
 * photographs that could go with it.
 *
 * Nothing is published here and nothing is written down. The owner reviews the
 * result and posts it from the next route, which is the whole point of holding
 * drafts back rather than firing them automatically.
 */
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

  let body: { topicId?: string; skip?: string[] } = {};
  try {
    body = await req.json();
  } catch {
    /* no body is fine — means "give me the next one" */
  }

  const log = localLog();
  const topic = body.topicId
    ? allTopics().find((t) => t.id === body.topicId)
    : nextTopic(postedIndex(log), body.skip ?? []);

  if (!topic) {
    return NextResponse.json(
      { error: 'No topic to post about. Publish a repair or an article first.' },
      { status: 404 }
    );
  }

  try {
    const caption = await writeCaption(topic);
    return NextResponse.json({
      topic,
      caption,
      composed: composePostText(caption, topic.url),
      photos: await realPhotoOptions(topic.photos),
      canGenerate: isGenerationConfigured(),
      facebookReady: facebookConfigured(),
      lastPostedAt: postedIndex(log)[topic.id] ?? null,
    });
  } catch (err) {
    if (err instanceof CaptionError) {
      return NextResponse.json({ error: err.message }, { status: 502 });
    }
    console.error('[admin/social/draft]', err);
    return NextResponse.json({ error: 'Drafting failed. Check the server logs.' }, { status: 500 });
  }
}
