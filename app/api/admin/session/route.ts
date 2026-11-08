import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, isAdminPasswordValid, mintSessionToken } from '@/lib/adminAuth';
import { clientIp } from '@/lib/enquiry';

export const runtime = 'nodejs';

// Brute-force brake. Without it the password can be guessed as fast as the
// server answers. Only failures count, so the owner signing in normally never
// meets it; a run of wrong guesses from one address is refused for the rest of
// the window, even if a later guess is right. In-memory, so it is per server
// instance — a brake, not a wall: the real defence is a long password.
const MAX_FAILURES = 10;
const WINDOW_MS = 15 * 60 * 1000;
const FAILURE_DELAY_MS = 1000;
const failures = new Map<string, number[]>();

function recentFailures(ip: string): number[] {
  const now = Date.now();
  const hits = (failures.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length) failures.set(ip, hits);
  else failures.delete(ip);
  return hits;
}

/** Sign in. */
export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  if (recentFailures(ip).length >= MAX_FAILURES) {
    return NextResponse.json(
      { error: 'Too many wrong passwords. Try again in 15 minutes.' },
      { status: 429 }
    );
  }

  let password: unknown;
  try {
    ({ password } = await req.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  try {
    if (!isAdminPasswordValid(password)) {
      failures.set(ip, [...recentFailures(ip), Date.now()]);
      await new Promise((r) => setTimeout(r, FAILURE_DELAY_MS));
      // Deliberately vague: no hint about whether the password or the config
      // is what failed.
      return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
    }
    failures.delete(ip);

    const { token, maxAgeSeconds } = mintSessionToken();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: maxAgeSeconds,
    });
    return res;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Admin auth is not configured.' },
      { status: 503 }
    );
  }
}

/** Sign out. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}
