import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: Request) {
  try {
    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    if (isSupabaseConfigured) {
      const authHeader = req.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.replace('Bearer ', '');
        const supabase = createAdminClient();
        const { data: { user }, error: authErr } = await supabase.auth.getUser(token);

        if (!authErr && user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profile) {
            return NextResponse.json({ user: profile, source: 'supabase' });
          }
        }
      }
    }

    const user = platformStore.getCurrentUser();
    return NextResponse.json({ user: user || null, source: 'local' });
  } catch (err: any) {
    return NextResponse.json({ user: null, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    if (isSupabaseConfigured && userId) {
      const supabase = createAdminClient();
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profile) {
        platformStore.setCurrentUser(profile.id);
        return NextResponse.json({ success: true, user: profile });
      }
    }

    const updated = platformStore.setCurrentUser(userId);
    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, user: updated });
  } catch {
    return NextResponse.json({ error: 'Failed to switch user' }, { status: 500 });
  }
}
