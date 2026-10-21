import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';

export async function GET() {
  const user = platformStore.getCurrentUser();
  return NextResponse.json({ user });
}

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    const updated = platformStore.setCurrentUser(userId);
    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, user: updated });
  } catch {
    return NextResponse.json({ error: 'Failed to switch user' }, { status: 500 });
  }
}
