import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, isAdminPasswordValid, mintSessionToken } from '@/lib/adminAuth';

export const runtime = 'nodejs';

/** Sign in. */
export async function POST(req: NextRequest) {
  let password: unknown;
  try {
    ({ password } = await req.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  try {
    if (!isAdminPasswordValid(password)) {
      // Deliberately vague: no hint about whether the password or the config
      // is what failed.
      return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
    }

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
