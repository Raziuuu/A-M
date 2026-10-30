import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { platformStore } from '@/lib/store';
import { requireRole } from '@/lib/auth';

const PatchUserSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
  role: z.enum(['guest', 'free_user', 'premium_member', 'admin', 'ceo']).optional(),
  membership_status: z.enum(['inactive', 'active', 'trialing', 'past_due', 'cancelled', 'expired', 'payment_failed']).optional(),
});

export async function GET(req: Request) {
  try {
    // 1. Strict Server-Side Authorization: Must be Admin or CEO
    const authCheck = await requireRole(req, ['admin', 'ceo']);
    if ('response' in authCheck) {
      return authCheck.response;
    }

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

    // Fallback if Supabase is offline
    return NextResponse.json({ profiles: platformStore.getProfiles(), source: 'local' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch users';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    // 1. Strict Server-Side Authorization: Must be Admin or CEO
    const authCheck = await requireRole(req, ['admin', 'ceo']);
    if ('response' in authCheck) {
      return authCheck.response;
    }
    const adminUser = authCheck.user;

    // 2. Validate input schema
    const rawBody = await req.json();
    const parseResult = PatchUserSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { id, role, membership_status } = parseResult.data;

    // Security check: Only CEO can promote or demote someone to/from CEO role
    if (role === 'ceo' && adminUser.role !== 'ceo') {
      return NextResponse.json(
        { error: 'Forbidden. Only the Chief Executive Officer can assign the CEO role.' },
        { status: 403 }
      );
    }

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    if (isSupabaseConfigured) {
      const supabase = createAdminClient();
      const updates: Record<string, unknown> = {
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

      // Log to audit table
      await supabase.from('audit_logs').insert({
        actor_id: adminUser.id,
        action: 'UPDATE_USER_ROLE_OR_STATUS',
        entity_type: 'profiles',
        entity_id: id,
        metadata: { role, membership_status, updated_by: adminUser.email },
      });

      // Also update local store if present
      platformStore.updateProfile(id, updates);
      return NextResponse.json({ success: true, profile: data });
    }

    // Local fallback
    const updated = platformStore.updateProfile(id, { role, membership_status });
    platformStore.addAuditLog('UPDATE_USER_ROLE_OR_STATUS', 'profiles', id, {
      role,
      membership_status,
      adminId: adminUser.id,
    });

    return NextResponse.json({ success: true, profile: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update user';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    // 1. Strict Server-Side Authorization: Must be Admin or CEO
    const authCheck = await requireRole(req, ['admin', 'ceo']);
    if ('response' in authCheck) {
      return authCheck.response;
    }
    const adminUser = authCheck.user;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Protection: Prevent self-deletion of the active admin or deletion of CEO
    if (id === adminUser.id) {
      return NextResponse.json({ error: 'Cannot delete your own active administrative session.' }, { status: 400 });
    }

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    if (isSupabaseConfigured) {
      const supabase = createAdminClient();

      // Check target role
      const { data: targetUser } = await supabase.from('profiles').select('role, email').eq('id', id).single();
      if (targetUser?.role === 'ceo') {
        return NextResponse.json({ error: 'The CEO account is protected and cannot be deleted.' }, { status: 403 });
      }

      // Delete from public.profiles
      await supabase.from('profiles').delete().eq('id', id);

      // Delete from auth.users via admin API
      const { error: authErr } = await supabase.auth.admin.deleteUser(id);
      if (authErr) {
        console.warn('Supabase auth.admin.deleteUser notice:', authErr.message);
      }

      // Log audit
      await supabase.from('audit_logs').insert({
        actor_id: adminUser.id,
        action: 'DELETE_USER',
        entity_type: 'profiles',
        entity_id: id,
        metadata: { deleted_user_email: targetUser?.email, admin: adminUser.email },
      });
    }

    // Also remove from local platformStore
    const profiles = platformStore.getProfiles();
    const idx = profiles.findIndex(p => p.id === id);
    if (idx !== -1) {
      profiles.splice(idx, 1);
    }
    platformStore.addAuditLog('DELETE_USER', 'profiles', id, { adminId: adminUser.id });

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete user';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
