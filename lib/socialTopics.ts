import { getAllBlogPosts } from '@/lib/blog';
import { getAllCaseStudies } from '@/lib/caseStudies';
import { services } from '@/lib/services';

/**
 * What a Facebook post can be about.
 *
 * Every topic points at a real page on the site, because a post with nowhere to
 * go is a post that cannot earn a call. The kind matters: a real repair we
 * actually did outranks generic advice, which outranks a service pitch, and the
 * rotation below leans on that order rather than treating all three as equal.
 */
export type TopicKind = 'repair' | 'advice' | 'service';

export interface Topic {
  /** Stable id, used to remember what has already gone out. */
  id: string;
  kind: TopicKind;
  /** Headline fact the caption is written from. */
  subject: string;
  /** Everything the caption may draw on. Nothing outside this is ours to claim. */
  detail: string;
  /** Where the post should send people. */
  url: string;
  /** Repo-relative image paths already associated with this topic, best first. */
  photos: string[];
}

const SITE = 'https://www.werepairmac.co.uk';

/**
 * Every topic we could post about, richest first.
 *
 * Case studies come first deliberately. They are the only content here that
 * nobody else could publish — a photograph of a board we actually worked on,
 * from a job that actually happened — and on a local trade page that is worth
 * more than any amount of advice.
 */
export function allTopics(): Topic[] {
  const topics: Topic[] = [];

  for (const study of getAllCaseStudies()) {
    topics.push({
      id: `repair:${study.slug}`,
      kind: 'repair',
      subject: study.title,
      detail: [
        study.excerpt,
        study.device ? `Device: ${study.device}.` : '',
        study.fault ? `Fault: ${study.fault}.` : '',
        study.outcome ? `Outcome: ${study.outcome}` : '',
      ]
        .filter(Boolean)
        .join(' '),
      url: `${SITE}/repairs/${study.slug}`,
      photos: study.photos.map((p) => p.src),
    });
  }

  for (const post of getAllBlogPosts()) {
    topics.push({
      id: `advice:${post.slug}`,
      kind: 'advice',
      subject: post.title,
      detail: post.excerpt,
      url: `${SITE}/blog/${post.slug}`,
      photos: [post.image],
    });
  }

  for (const service of services) {
    topics.push({
      id: `service:${service.slug}`,
      kind: 'service',
      subject: service.title,
      detail: service.description,
      url: `${SITE}/${service.slug}`,
      photos: [service.image],
    });
  }

  return topics;
}

/**
 * The next topic to post about.
 *
 * Least-recently-posted wins, and anything never posted beats anything posted.
 * Within that, the kind order above breaks ties, so a fresh repair jumps a
 * service page that has also never run.
 *
 * The queue therefore never empties — it cycles. That is the intended
 * behaviour and the difference between this and the blog, which quietly ran dry
 * because it could only ever count down.
 */
const KIND_RANK: Record<TopicKind, number> = { repair: 0, advice: 1, service: 2 };

export function nextTopic(postedIds: Record<string, string>, skip: string[] = []): Topic | null {
  const candidates = allTopics().filter((t) => !skip.includes(t.id));
  if (candidates.length === 0) return null;

  return candidates.sort((a, b) => {
    const aAt = postedIds[a.id];
    const bAt = postedIds[b.id];

    // Never posted sorts ahead of ever posted.
    if (!aAt && bAt) return -1;
    if (aAt && !bAt) return 1;
    // Both posted: oldest first.
    if (aAt && bAt && aAt !== bAt) return aAt < bAt ? -1 : 1;

    return KIND_RANK[a.kind] - KIND_RANK[b.kind];
  })[0];
}
