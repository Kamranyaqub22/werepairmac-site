import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto';
import type { NextRequest } from 'next/server';

/**
 * Auth for /admin. One operator, one password — no user table, no library.
 *
 * The password is never stored in a cookie. A successful login mints a signed,
 * httpOnly session cookie carrying only an expiry timestamp; every admin request
 * re-verifies the signature. That means a stolen cookie expires on its own and
 * cannot be edited to extend itself.
 */

export const ADMIN_COOKIE = 'wrm_admin';
const SESSION_MS = 12 * 60 * 60 * 1000; // 12 hours — a working day, then re-auth.

function secret(): string {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error(
      'ADMIN_SESSION_SECRET is missing or shorter than 32 characters. ' +
        'Generate one with: openssl rand -hex 32'
    );
  }
  return value;
}

/** Constant-time string compare that does not leak length via early return. */
function safeEqual(a: string, b: string): boolean {
  const ha = createHmac('sha256', secret()).update(a).digest();
  const hb = createHmac('sha256', secret()).update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function isAdminPasswordValid(submitted: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof submitted !== 'string') return false;
  return safeEqual(submitted, expected);
}

/** `<expiry-ms>.<nonce>.<hmac>` — opaque to the client, verifiable by us. */
export function mintSessionToken(): { token: string; maxAgeSeconds: number } {
  const expiresAt = Date.now() + SESSION_MS;
  const nonce = randomBytes(12).toString('hex');
  const payload = `${expiresAt}.${nonce}`;
  const signature = createHmac('sha256', secret()).update(payload).digest('hex');
  return {
    token: `${payload}.${signature}`,
    maxAgeSeconds: Math.floor(SESSION_MS / 1000),
  };
}

export function isSessionTokenValid(token: string | undefined): boolean {
  if (!token) return false;

  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [expiresAt, nonce, signature] = parts;

  const expected = createHmac('sha256', secret())
    .update(`${expiresAt}.${nonce}`)
    .digest('hex');

  // Compare the signatures before trusting the expiry: an unsigned token's
  // expiry is attacker-controlled and means nothing.
  if (signature.length !== expected.length) return false;
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;

  const expiry = Number(expiresAt);
  return Number.isFinite(expiry) && Date.now() < expiry;
}

/** Guard for admin API routes. Returns null when authorised. */
export function requireAdmin(req: NextRequest): { error: string; status: number } | null {
  try {
    if (!isSessionTokenValid(req.cookies.get(ADMIN_COOKIE)?.value)) {
      return { error: 'Not signed in.', status: 401 };
    }
    return null;
  } catch (err) {
    // A missing ADMIN_SESSION_SECRET must fail closed, not throw a 500 that
    // reads like a bug.
    return {
      error: err instanceof Error ? err.message : 'Admin auth is not configured.',
      status: 503,
    };
  }
}
