import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const threadId = searchParams.get('threadId');

  const currentUser = platformStore.getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  // Gate: Free users cannot access messaging
  if (currentUser.role === 'free_user' && currentUser.membership_status !== 'active') {
    return NextResponse.json({ error: 'Messaging is available exclusively to Skill Network members.' }, { status: 403 });
  }

  if (threadId) {
    const messages = platformStore.getThreadMessages(threadId);
    return NextResponse.json({ messages });
  }

  const threads = platformStore.getThreads(currentUser.id);
  return NextResponse.json({ threads });
}

export async function POST(req: Request) {
  try {
    const { recipientId, content } = await req.json();

    if (!recipientId || !content) {
      return NextResponse.json({ error: 'Recipient and content are required.' }, { status: 400 });
    }

    const currentUser = platformStore.getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    // Role gate
    if (currentUser.role === 'free_user' && currentUser.membership_status !== 'active') {
      return NextResponse.json({ error: 'Messaging is available exclusively to Skill Network members.' }, { status: 403 });
    }

    const message = platformStore.sendMessage(currentUser.id, recipientId, content);

    return NextResponse.json({ success: true, message });
  } catch {
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
