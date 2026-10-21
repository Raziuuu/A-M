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
      const { data: coupons, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && coupons) {
        return NextResponse.json({ coupons, source: 'supabase' });
      }
    }

    return NextResponse.json({ coupons: platformStore.getCoupons(), source: 'local' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.code || !body.discount_value) {
      return NextResponse.json({ error: 'Code and discount value are required' }, { status: 400 });
    }

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    if (isSupabaseConfigured) {
      const supabase = createAdminClient();
      const newCoupon = {
        code: body.code.trim().toUpperCase(),
        discount_type: body.discount_type || 'percentage',
        discount_value: Number(body.discount_value),
        max_uses: Number(body.max_uses) || 500,
        current_uses: 0,
        max_uses_per_user: 1,
        applicable_plans: ['monthly', 'annual'],
        is_active: true,
      };

      const { data, error } = await supabase.from('coupons').insert(newCoupon).select().single();
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, coupon: data });
    }

    const created = platformStore.createCoupon({
      code: body.code.trim().toUpperCase(),
      discount_type: body.discount_type || 'percentage',
      discount_value: Number(body.discount_value),
      max_uses: Number(body.max_uses) || 500,
      max_uses_per_user: 1,
      applicable_plans: ['monthly', 'annual'],
      starts_at: new Date().toISOString(),
      is_active: true,
    });

    return NextResponse.json({ success: true, coupon: created });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create coupon' }, { status: 500 });
  }
}
