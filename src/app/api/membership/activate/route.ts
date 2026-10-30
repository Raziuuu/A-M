import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { platformStore } from '@/lib/store';
import { SupportedCurrency } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const currentUser = await getAuthenticatedUser(req);
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required. Please log in first.' }, { status: 401 });
    }

    let planId: 'monthly' | 'annual' = 'annual';
    let currency: SupportedCurrency = 'USD';

    try {
      const body = await req.json();
      if (body.planId === 'monthly' || body.planId === 'annual') {
        planId = body.planId;
      }
      if (body.currency) {
        currency = body.currency;
      }
    } catch {
      // Body parsing optional
    }

    const periodEnd = new Date();
    if (planId === 'monthly') {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    if (isSupabaseConfigured) {
      try {
        const supabase = createAdminClient();
        const { error: dbError } = await supabase
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

        if (dbError) {
          console.error('Supabase profile instant upgrade error:', dbError);
        }
      } catch (err) {
        console.error('Failed to update Supabase profile:', err);
      }
    }

    // Update in-memory platformStore
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

    return NextResponse.json({
      success: true,
      message: 'Instant Premium Access Granted. No payment required.',
      user: {
        ...currentUser,
        role: 'premium_member',
        membership_status: 'active',
        membership_tier: planId,
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to activate premium membership.';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
