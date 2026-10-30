import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ user: null });
    }
    return NextResponse.json({ user });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Authentication verification failed';
    return NextResponse.json({ user: null, error: msg }, { status: 500 });
  }
}

// Block any attempt to use POST /api/auth/me for impersonation
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed. User identity cannot be modified via this endpoint.' },
    { status: 405 }
  );
}
