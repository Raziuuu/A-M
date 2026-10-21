import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { platformStore } from '@/lib/store';

export async function GET() {
  try {
    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    if (isSupabaseConfigured) {
      const supabase = createAdminClient();
      const { data: hubs, error } = await supabase.from('hubs').select('*').order('created_at', { ascending: false });

      if (!error && hubs) {
        return NextResponse.json({ hubs, source: 'supabase' });
      }
      if (error) {
        console.error('Supabase hubs query error:', error.message);
      }
    }

    return NextResponse.json({ hubs: platformStore.getHubs(), source: 'local' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch hubs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name || !body.type) {
      return NextResponse.json({ error: 'Name and type are required' }, { status: 400 });
    }

    const slug = (body.name || 'hub')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    if (isSupabaseConfigured) {
      const supabase = createAdminClient();
      const newHub = {
        name: body.name,
        slug,
        type: body.type || 'city',
        city: body.city || null,
        country: body.country || null,
        industry: body.industry || null,
        description: body.description || '',
        member_count: 0,
      };

      const { data, error } = await supabase.from('hubs').insert(newHub).select().single();
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, hub: data });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create hub' }, { status: 500 });
  }
}
