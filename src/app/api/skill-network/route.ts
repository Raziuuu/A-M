import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { platformStore } from '@/lib/store';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const skill = searchParams.get('skill');
    const country = searchParams.get('country');
    const query = searchParams.get('q');
    const all = searchParams.get('all') === 'true';

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    if (isSupabaseConfigured) {
      const supabase = createAdminClient();
      let dbQuery = supabase
        .from('skill_network_members')
        .select(`
          *,
          profile:profiles(*)
        `)
        .order('created_at', { ascending: false });

      if (!all) {
        dbQuery = dbQuery.eq('is_approved', true).eq('is_active', true);
      }

      const { data: members, error } = await dbQuery;

      if (!error && members) {
        let filtered = members;
        if (skill) {
          filtered = filtered.filter(m => m.skills && m.skills.some((s: string) => s.toLowerCase() === skill.toLowerCase()));
        }
        if (country) {
          filtered = filtered.filter(m => m.profile && m.profile.country_code === country);
        }
        if (query) {
          const q = query.toLowerCase();
          filtered = filtered.filter(m => 
            (m.profile?.full_name?.toLowerCase().includes(q)) ||
            (m.title?.toLowerCase().includes(q)) ||
            (m.skills?.some((s: string) => s.toLowerCase().includes(q)))
          );
        }

        return NextResponse.json({ members: filtered, source: 'supabase' });
      }

      if (error) {
        console.error('Supabase skill members query error:', error.message);
      }
    }

    return NextResponse.json({ members: platformStore.getSkillMembers(), source: 'local' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch skill members' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, is_approved, is_featured, is_active, verification_status } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Member ID required' }, { status: 400 });
    }

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    if (isSupabaseConfigured) {
      const supabase = createAdminClient();
      const updates: Record<string, any> = {
        updated_at: new Date().toISOString()
      };
      if (typeof is_approved === 'boolean') updates.is_approved = is_approved;
      if (typeof is_featured === 'boolean') updates.is_featured = is_featured;
      if (typeof is_active === 'boolean') updates.is_active = is_active;
      if (verification_status) updates.verification_status = verification_status;

      const { data, error } = await supabase
        .from('skill_network_members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, member: data });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update member status' }, { status: 500 });
  }
}
