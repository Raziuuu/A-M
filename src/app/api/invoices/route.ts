import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { platformStore } from '@/lib/store';
import { requireAuth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    // 1. Strict Server-Side Authentication
    const authCheck = await requireAuth(req);
    if ('response' in authCheck) {
      return authCheck.response;
    }
    const currentUser = authCheck.user;

    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get('userId');

    const isAdmin = currentUser.role === 'admin' || currentUser.role === 'ceo';

    // IDOR Protection: Non-admins can only view their own invoices
    let targetUserId = currentUser.id;
    if (requestedUserId) {
      if (!isAdmin && requestedUserId !== currentUser.id) {
        return NextResponse.json(
          { error: 'Forbidden. You cannot access another member’s tax invoices.' },
          { status: 403 }
        );
      }
      targetUserId = requestedUserId;
    } else if (isAdmin) {
      // Admins without a specific userId can view all invoices
      targetUserId = '';
    }

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    if (isSupabaseConfigured) {
      const supabase = createAdminClient();
      let query = supabase.from('invoices').select('*').order('created_at', { ascending: false });

      if (targetUserId) {
        query = query.eq('user_id', targetUserId);
      }

      const { data: invoices, error } = await query;
      if (!error && invoices) {
        return NextResponse.json({ invoices, source: 'supabase' });
      }
    }

    const invoices = platformStore.getInvoices(targetUserId || undefined);
    return NextResponse.json({ invoices, source: 'local' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch invoices';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
