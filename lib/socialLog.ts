import { commitFiles, fetchRepoJsonArray, PublishError } from '@/lib/githubPublish';
import rawLog from '@/lib/social-log.json';

/**
 * A record of what has gone out to Facebook, so the rotation can advance.
 *
 * Committed to the repo rather than kept in a database, for the same reason the
 * case studies are: this site has no persistent store, the deployed bundle is a
 * snapshot of a commit, and a serverless function's filesystem does not survive
 * the request. Git is the store that already exists.
 *
 * The cost is a rebuild per post. At a post every two days that is roughly
 * fifteen deploys a month, which is well inside what Vercel allows and cheaper
 * than introducing a database for one array.
 */

export const SOCIAL_LOG_PATH = 'lib/social-log.json';

export interface SocialLogEntry {
  /** Topic id from lib/socialTopics.ts — this is what the rotation reads. */
  topicId: string;
  /** ISO timestamp of publication. */
  postedAt: string;
  /** Facebook's id for the post, so it can be found again. */
  postId: string;
  /** How the image was obtained, for judging later which kind performs. */
  imageSource: 'real' | 'generated' | 'none';
  /** First line of the caption — enough to recognise the post in a list. */
  preview: string;
}

function isEntry(value: unknown): value is SocialLogEntry {
  if (typeof value !== 'object' || value === null) return false;
  const e = value as Record<string, unknown>;
  return typeof e.topicId === 'string' && typeof e.postedAt === 'string';
}

/** The log as it was at build time. Good enough for reads in the UI. */
export function localLog(): SocialLogEntry[] {
  return (rawLog as unknown[]).filter(isEntry);
}

/** topicId → most recent ISO timestamp, which is what `nextTopic` wants. */
export function postedIndex(entries: SocialLogEntry[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const entry of entries) {
    const seen = out[entry.topicId];
    if (!seen || entry.postedAt > seen) out[entry.topicId] = entry.postedAt;
  }
  return out;
}

/**
 * Appends an entry and commits it.
 *
 * Reads from the branch tip rather than the bundled copy, so two posts on the
 * same day cannot lose the first — the deployed bundle still holds whatever the
 * last build saw.
 */
export async function appendToLog(entry: SocialLogEntry): Promise<{ commitUrl: string }> {
  let existing: SocialLogEntry[];
  try {
    existing = (await fetchRepoJsonArray(SOCIAL_LOG_PATH)).filter(isEntry);
  } catch (err) {
    // A missing log file on a fresh install is recoverable — start one.
    if (err instanceof PublishError && /could not find|404/i.test(err.message)) {
      existing = [];
    } else {
      throw err;
    }
  }

  // Newest first, so the admin list reads top-down without sorting.
  const next = [entry, ...existing];

  const { commitUrl } = await commitFiles(
    [
      {
        path: SOCIAL_LOG_PATH,
        content: `${JSON.stringify(next, null, 2)}\n`,
        encoding: 'utf-8',
      },
    ],
    `Post to Facebook: ${entry.preview.slice(0, 60)}`
  );

  return { commitUrl };
}
