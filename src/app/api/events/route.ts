import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { platformStore } from '@/lib/store';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter'); // 'upcoming' | 'past'

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    if (isSupabaseConfigured) {
      const supabase = createAdminClient();
      let query = supabase.from('events').select('*').order('date', { ascending: true });

      if (filter === 'upcoming') {
        query = query.gte('date', new Date().toISOString().split('T')[0]);
      } else if (filter === 'past') {
        query = query.lt('date', new Date().toISOString().split('T')[0]);
      }

      const { data: events, error } = await query;
      if (!error && events) {
        return NextResponse.json({ events, source: 'supabase' });
      }
      if (error) {
        console.error('Supabase events query error:', error.message);
      }
    }

    return NextResponse.json({ events: platformStore.getEvents(filter as any), source: 'local' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.title || !body.date || !body.location) {
      return NextResponse.json({ error: 'Title, date, and location are required.' }, { status: 400 });
    }

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    if (isSupabaseConfigured) {
      const supabase = createAdminClient();
      const newEvent = {
        title: body.title,
        description: body.description || '',
        event_type: body.event_type || 'Summit',
        date: body.date,
        start_time: body.start_time || '18:00:00',
        end_time: body.end_time || '20:00:00',
        timezone: body.timezone || 'UTC',
        location: body.location,
        is_online: Boolean(body.is_online),
        host: body.host || 'Action = Matter Directorate',
        capacity: Number(body.capacity) || 100,
        topics: Array.isArray(body.topics) ? body.topics : [],
        attendees_count: 0,
        status: body.status || 'upcoming',
      };

      const { data, error } = await supabase.from('events').insert(newEvent).select().single();
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, event: data });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create event' }, { status: 500 });
  }
}
