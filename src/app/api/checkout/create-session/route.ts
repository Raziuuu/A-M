import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';
import { getPaymentProvider } from '@/lib/payments/provider';
import { SupportedCurrency } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const planId = (body.planId || body.plan || 'annual') as 'monthly' | 'annual';
    const currency = (body.currency || 'USD') as SupportedCurrency;
    const couponCode = body.couponCode || body.coupon_code;

    if (planId !== 'monthly' && planId !== 'annual') {
      return NextResponse.json({ error: 'Valid planId (monthly or annual) is required.' }, { status: 400 });
    }

    const currentUser = platformStore.getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const provider = getPaymentProvider(currency);

    const result = await provider.createCheckout({
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.full_name,
      planId,
      currency,
      couponCode,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/checkout/success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/upgrade`,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Checkout session generation failed.';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
