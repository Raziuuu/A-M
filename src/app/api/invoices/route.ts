import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { platformStore } from '@/lib/store';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    if (isSupabaseConfigured) {
      const supabase = createAdminClient();
      let query = supabase.from('invoices').select('*').order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data: invoices, error } = await query;
      if (!error && invoices) {
        return NextResponse.json({ invoices, source: 'supabase' });
      }
    }

    return NextResponse.json({ invoices: platformStore.getInvoices(userId || undefined), source: 'local' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch invoices' }, { status: 500 });
  }
}
