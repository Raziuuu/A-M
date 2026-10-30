import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { platformStore } from '@/lib/store';
import { SupportedCurrency } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const planId = (body.planId || body.plan || 'annual') as 'monthly' | 'annual';
    const currency = (body.currency || 'USD') as SupportedCurrency;

    const currentUser = (await getAuthenticatedUser(req)) || platformStore.getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required. Please log in.' }, { status: 401 });
    }

    const periodEnd = new Date();
    if (planId === 'monthly') {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    // 1. Direct Supabase activation (no payment required)
    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    if (isSupabaseConfigured) {
      try {
        const supabase = createAdminClient();
        await supabase
          .from('profiles')
          .update({
            role: 'premium_member',
            membership_status: 'active',
            membership_tier: planId,
            subscription_period_end: periodEnd.toISOString(),
            cancel_at_period_end: false,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentUser.id);
      } catch (err) {
        console.error('Supabase profile instant upgrade error:', err);
      }
    }

    // 2. Platform store activation
    try {
      platformStore.activatePremium(currentUser.id, planId, currency, undefined, 'demo');
    } catch {
      platformStore.updateProfile(currentUser.id, {
        role: 'premium_member',
        membership_status: 'active',
        membership_tier: planId,
        subscription_period_end: periodEnd.toISOString(),
      });
    }

    // Return instant success URL directly without asking for payment details
    const successUrl = `/dashboard/checkout/success?session_id=free_preview_${Date.now()}&plan=${planId}&currency=${currency}&provider=demo`;

    return NextResponse.json({
      success: true,
      instantAccess: true,
      freePromo: true,
      checkoutUrl: successUrl,
      message: 'Instant complimentary premium access granted. No payment details required.',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Checkout session generation failed.';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
