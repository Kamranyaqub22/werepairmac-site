/**
 * Posts to the We Repair Mac Facebook Page through the Graph API.
 *
 * Two env vars carry the whole thing:
 *   FACEBOOK_PAGE_ID        — the numeric id of the Page
 *   FACEBOOK_PAGE_TOKEN     — a long-lived Page access token
 *
 * The token must be a PAGE token, not a user token. A user token will
 * authenticate and then fail on the write with a permissions error that does
 * not say which kind of token it got, so `verifyCredentials` below checks the
 * distinction up front rather than leaving it to a failed publish.
 */

const GRAPH = 'https://graph.facebook.com/v21.0';

export class FacebookError extends Error {}

interface GraphErrorBody {
  error?: { message?: string; type?: string; code?: number; error_subcode?: number };
}

function credentials(): { pageId: string; token: string } {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const token = process.env.FACEBOOK_PAGE_TOKEN;

  if (!pageId) {
    throw new FacebookError(
      'FACEBOOK_PAGE_ID is not set. It is the numeric id of the Page — find it under Meta Business Suite → Settings → Pages.'
    );
  }
  if (!token) {
    throw new FacebookError(
      'FACEBOOK_PAGE_TOKEN is not set. Generate a long-lived Page access token with the pages_manage_posts and pages_read_engagement permissions.'
    );
  }
  return { pageId, token };
}

/** Turns Graph's error shapes into something worth reading in the admin UI. */
async function graphError(res: Response, what: string): Promise<FacebookError> {
  let body: GraphErrorBody = {};
  try {
    body = (await res.json()) as GraphErrorBody;
  } catch {
    /* non-JSON error body — fall through to the status */
  }
  const message = body.error?.message ?? `HTTP ${res.status}`;
  const code = body.error?.code;

  if (code === 190) {
    return new FacebookError(
      `Facebook rejected the token (${message}). Page tokens expire — generate a new long-lived one and update FACEBOOK_PAGE_TOKEN.`
    );
  }
  if (code === 200 || code === 10) {
    return new FacebookError(
      `Facebook refused the post for lack of permission (${message}). The token needs pages_manage_posts, and the account that issued it must be an admin of the Page.`
    );
  }
  if (code === 4 || code === 17 || code === 32) {
    return new FacebookError(
      `Facebook is rate limiting this Page (${message}). Wait an hour and try again — nothing was posted.`
    );
  }
  return new FacebookError(`${what} failed: ${message}`);
}

export interface PageIdentity {
  id: string;
  name: string;
}

/**
 * Confirms the token works, belongs to a Page, and can publish.
 *
 * Called before the first post from the admin screen, so a misconfigured token
 * surfaces as a sentence the owner can act on instead of a failed publish.
 */
export async function verifyCredentials(): Promise<PageIdentity> {
  const { pageId, token } = credentials();

  const res = await fetch(`${GRAPH}/${pageId}?fields=id,name&access_token=${encodeURIComponent(token)}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw await graphError(res, 'Reading the Page');

  const page = (await res.json()) as { id?: string; name?: string };
  if (!page.id) {
    throw new FacebookError('Facebook returned no Page id. Check FACEBOOK_PAGE_ID.');
  }

  // A user token can read a Page but cannot publish as it. Asking what the
  // token is for is the cheapest way to tell the two apart before we rely on it.
  const perm = await fetch(
    `${GRAPH}/${pageId}?fields=access_token&access_token=${encodeURIComponent(token)}`,
    { cache: 'no-store' }
  );
  if (perm.status === 400) {
    throw new FacebookError(
      'That looks like a user token rather than a Page token. In Graph API Explorer, select the Page under "User or Page" before generating it.'
    );
  }

  return { id: page.id, name: page.name ?? 'Unknown Page' };
}

export interface PublishResult {
  postId: string;
  permalink: string;
}

/**
 * Publishes a photo with a caption.
 *
 * Photo posts rather than link posts: a link post renders whatever thumbnail
 * Facebook scrapes from the page, which for these URLs is the same og:image
 * every time. A photo post shows the picture we chose, and the URL still
 * appears in the caption text.
 */
export async function postPhoto(imageBase64: string, message: string): Promise<PublishResult> {
  const { pageId, token } = credentials();

  const form = new FormData();
  form.append('access_token', token);
  form.append('caption', message);
  form.append('published', 'true');
  form.append('source', new Blob([Buffer.from(imageBase64, 'base64')], { type: 'image/jpeg' }), 'post.jpg');

  const res = await fetch(`${GRAPH}/${pageId}/photos`, { method: 'POST', body: form });
  if (!res.ok) throw await graphError(res, 'Publishing the photo');

  const body = (await res.json()) as { id?: string; post_id?: string };
  const postId = body.post_id ?? body.id;
  if (!postId) throw new FacebookError('Facebook accepted the post but returned no id.');

  return { postId, permalink: `https://www.facebook.com/${postId.replace('_', '/posts/')}` };
}

/** Publishes a text-only post. Used when no image is attached. */
export async function postText(message: string): Promise<PublishResult> {
  const { pageId, token } = credentials();

  const res = await fetch(`${GRAPH}/${pageId}/feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, access_token: token }),
  });
  if (!res.ok) throw await graphError(res, 'Publishing the post');

  const body = (await res.json()) as { id?: string };
  if (!body.id) throw new FacebookError('Facebook accepted the post but returned no id.');

  return { postId: body.id, permalink: `https://www.facebook.com/${body.id.replace('_', '/posts/')}` };
}

/** True when both env vars are present, so the UI can say what is missing. */
export function isConfigured(): boolean {
  return Boolean(process.env.FACEBOOK_PAGE_ID && process.env.FACEBOOK_PAGE_TOKEN);
}
