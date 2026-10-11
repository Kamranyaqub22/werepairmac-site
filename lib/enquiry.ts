/**
 * Shared checks for the two enquiry forms (/contact and the /quote booking).
 *
 * Three jobs:
 *  1. Validation — required fields present, a phone number we can actually
 *     call back, an email address that is at least shaped like one, and length
 *     caps so nobody can paste a novel into the inbox.
 *  2. Escaping — every value is HTML-escaped before it reaches an email body.
 *     The confirmation email goes to whatever address the visitor typed, so
 *     unescaped input would let anyone send a branded "We Repair Mac" email
 *     carrying their own links and markup to any inbox.
 *  3. Spam — a honeypot field real visitors never see, a too-fast-to-be-human
 *     check, and a per-visitor cap. Spam is answered with a normal success
 *     response so bots get no signal to adapt to; it is simply never emailed.
 */

// Deliberately meaningless: a name like "website" or "url" gets filled by
// browser autofill, which would silently drop a real customer's enquiry.
export const HONEYPOT_FIELD = 'hp_extra_notes_x';

/** Fields as the visitor typed them, trimmed and capped. Use for plain text (subjects). */
export interface EnquiryFields {
  name: string;
  phone: string;
  email: string;
  device: string;
  area: string;
  message: string;
  contactMethod: string;
  preferredDay: string;
  timeWindow: string;
  estimate: string;
}

export type EnquiryResult =
  | { ok: false; status: number; error: string }
  | { ok: true; spam: true }
  | { ok: true; spam: false; raw: EnquiryFields; safe: EnquiryFields };

const LIMITS: Record<keyof EnquiryFields, number> = {
  name: 100,
  phone: 30,
  email: 200,
  device: 200,
  area: 100,
  message: 2000,
  contactMethod: 20,
  preferredDay: 20,
  timeWindow: 40,
  estimate: 40,
};

export const CONTACT_METHODS = ['Call', 'WhatsApp', 'Text'] as const;

/** Anything submitted faster than this after the form appeared is a script. */
const MIN_FILL_MS = 2500;

// Per-visitor cap. Serverless instances do not share memory, so this is a
// speed bump rather than a wall — enough to stop one bot hammering the form.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * True for a number that could plausibly be dialled back: a UK number in
 * 0… or +44… form (10–11 digits once normalised), or another international
 * number with a leading + and 8–15 digits.
 */
export function isCallablePhone(raw: string): boolean {
  const compact = raw.replace(/[\s().-]/g, '');
  if (/^\+44\d{9,10}$/.test(compact)) return true;
  if (/^0\d{9,10}$/.test(compact)) return true;
  return /^\+[1-9]\d{7,14}$/.test(compact);
}

function isEmailShaped(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > MAX_PER_WINDOW;
}

export function parseEnquiry(
  body: Record<string, unknown>,
  ip: string,
  options: { requireTimeWindow?: boolean } = {}
): EnquiryResult {
  // Honeypot filled in, or submitted impossibly fast: a bot. Pretend it worked.
  const startedAt = Number(body.startedAt);
  if (String(body[HONEYPOT_FIELD] ?? '').trim()) {
    console.warn('[enquiry] dropped as spam: honeypot filled', { ip });
    return { ok: true, spam: true };
  }
  if (Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < MIN_FILL_MS) {
    console.warn('[enquiry] dropped as spam: submitted too fast', { ip, ms: Date.now() - startedAt });
    return { ok: true, spam: true };
  }

  if (rateLimited(ip)) {
    return {
      ok: false,
      status: 429,
      error: 'Too many requests from this connection. Please call us on 07378 349222.',
    };
  }

  const raw = {} as EnquiryFields;
  for (const key of Object.keys(LIMITS) as (keyof EnquiryFields)[]) {
    raw[key] = String(body[key] ?? '').trim().slice(0, LIMITS[key]);
  }

  if (!raw.name || !raw.phone || !raw.device || !raw.area || (options.requireTimeWindow && !raw.timeWindow)) {
    return { ok: false, status: 400, error: 'Please fill in all the required fields.' };
  }
  if (!isCallablePhone(raw.phone)) {
    return {
      ok: false,
      status: 400,
      error: 'That phone number does not look right — please check it so we can call you back.',
    };
  }
  if (raw.email && !isEmailShaped(raw.email)) {
    return { ok: false, status: 400, error: 'That email address does not look right — please check it.' };
  }
  if (raw.contactMethod && !(CONTACT_METHODS as readonly string[]).includes(raw.contactMethod)) {
    raw.contactMethod = '';
  }

  const safe = {} as EnquiryFields;
  for (const key of Object.keys(raw) as (keyof EnquiryFields)[]) safe[key] = escapeHtml(raw[key]);

  return { ok: true, spam: false, raw, safe };
}

/** Best-effort client IP for the rate limit. */
export function clientIp(headers: Headers): string {
  return headers.get('x-forwarded-for')?.split(',')[0]?.trim() || headers.get('x-real-ip') || 'unknown';
}
