import { NextResponse } from 'next/server';
import { getAIService } from '@/lib/ai/service';
import { platformStore } from '@/lib/store';

export async function POST(req: Request) {
  try {
    const { action, payload } = await req.json();
    const currentUser = platformStore.getCurrentUser();

    // AI Command Center is a premium feature
    if (!currentUser || (currentUser.role === 'free_user' && currentUser.membership_status !== 'active')) {
      return NextResponse.json(
        { error: 'AI Command Center is a premium feature reserved for Skill Network members.' },
        { status: 403 }
      );
    }

    const ai = getAIService();

    if (action === 'match') {
      const result = await ai.matchMemberToProject(payload);
      return NextResponse.json({ success: true, result });
    }

    if (action === 'suggest') {
      const suggestion = await ai.generateSuggestion(payload);
      return NextResponse.json({ success: true, suggestion });
    }

    if (action === 'chat') {
      const reply = await ai.chatAssistant(payload.message, { userId: currentUser.id });
      return NextResponse.json({ success: true, reply });
    }

    return NextResponse.json({ error: 'Unknown AI action.' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'AI Command Center service encountered an error.' }, { status: 500 });
  }
}
