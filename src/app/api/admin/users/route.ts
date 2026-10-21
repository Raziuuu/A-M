import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { platformStore } from '@/lib/store';
import { UserRole } from '@/lib/types';

export async function GET() {
  try {
    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    if (isSupabaseConfigured) {
      const supabase = createAdminClient();
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && profiles) {
        return NextResponse.json({ profiles, source: 'supabase' });
      }
      if (error) {
        console.error('Error fetching Supabase profiles:', error);
      }
    }

    // Fallback if Supabase is offline or not configured
    return NextResponse.json({ profiles: platformStore.getProfiles(), source: 'local' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, role, membership_status } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
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
      if (role) updates.role = role;
      if (membership_status) updates.membership_status = membership_status;

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Also update local store if present
      platformStore.updateProfile(id, updates);
      return NextResponse.json({ success: true, profile: data });
    }

    // Local fallback
    const updated = platformStore.updateProfile(id, { role, membership_status });
    return NextResponse.json({ success: true, profile: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    if (isSupabaseConfigured) {
      const supabase = createAdminClient();
      
      // Delete from public.profiles (if not cascade from auth.users)
      await supabase.from('profiles').delete().eq('id', id);

      // Delete from auth.users via admin API
      const { error: authErr } = await supabase.auth.admin.deleteUser(id);
      if (authErr) {
        console.warn('Supabase auth.admin.deleteUser notice:', authErr.message);
      }
    }

    // Also remove from local platformStore
    const profiles = platformStore.getProfiles();
    const idx = profiles.findIndex(p => p.id === id);
    if (idx !== -1) {
      profiles.splice(idx, 1);
    }

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete user' }, { status: 500 });
  }
}
