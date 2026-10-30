import { NextResponse } from 'next/server';
import { z } from 'zod';
import { platformStore } from '@/lib/store';
import { requirePremium } from '@/lib/auth';

const SendMessageSchema = z.object({
  recipientId: z.string().min(1, 'Recipient ID is required'),
  content: z.string().min(1, 'Message content cannot be empty').max(2000, 'Message cannot exceed 2000 characters'),
});

export async function GET(req: Request) {
  try {
    // 1. Enforce premium membership server-side
    const authCheck = await requirePremium(req);
    if ('response' in authCheck) {
      return authCheck.response;
    }
    const currentUser = authCheck.user;

    const { searchParams } = new URL(req.url);
    const threadId = searchParams.get('threadId');

    if (threadId) {
      // IDOR Protection: Verify caller is an active participant in this specific thread
      const userThreads = platformStore.getThreads(currentUser.id);
      const isParticipant = userThreads.some(t => t.id === threadId && t.participant_ids.includes(currentUser.id));

      if (!isParticipant && currentUser.role !== 'admin' && currentUser.role !== 'ceo') {
        return NextResponse.json(
          { error: 'Forbidden. You do not have access to this conversation.' },
          { status: 403 }
        );
      }

      const messages = platformStore.getThreadMessages(threadId);
      return NextResponse.json({ messages });
    }

    // Only return threads for the authenticated user
    const threads = platformStore.getThreads(currentUser.id);
    return NextResponse.json({ threads });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve messages';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // 1. Enforce premium membership server-side
    const authCheck = await requirePremium(req);
    if ('response' in authCheck) {
      return authCheck.response;
    }
    const currentUser = authCheck.user;

    // 2. Validate input schema
    const rawBody = await req.json();
    const parseResult = SendMessageSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { recipientId, content } = parseResult.data;

    // Prevent sending message to oneself
    if (recipientId === currentUser.id) {
      return NextResponse.json(
        { error: 'Cannot send messages to yourself.' },
        { status: 400 }
      );
    }

    const message = platformStore.sendMessage(currentUser.id, recipientId, content.trim());
    return NextResponse.json({ success: true, message });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to send message';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
