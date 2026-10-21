import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const code = body.code;
    const planId = body.planId || body.plan || 'annual';

    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required.' }, { status: 400 });
    }

    const result = platformStore.validateCoupon(code, planId);

    if (!result.valid) {
      return NextResponse.json({ valid: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      message: result.message,
      coupon: {
        code: result.coupon?.code,
        discount_type: result.coupon?.discount_type,
        discount_value: result.coupon?.discount_value,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to validate coupon.' }, { status: 500 });
  }
}
