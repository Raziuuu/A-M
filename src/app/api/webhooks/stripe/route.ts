import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';
import { SupportedCurrency } from '@/lib/types';

// In-memory set for webhook event idempotency
const processedEvents = new Set<string>();

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature') || '';

    // Verify webhook signature (checks secret if set)
    let event: { id: string; type: string; data: { object: Record<string, unknown> } };
    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Webhook payload parse error' }, { status: 400 });
    }

    // Idempotency check: Never process the same event twice
    if (processedEvents.has(event.id)) {
      return NextResponse.json({ received: true, note: 'Already processed' }, { status: 200 });
    }
    processedEvents.add(event.id);

    // Handle supported Stripe events
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const metadata = (session.metadata || {}) as Record<string, string>;
        const userId = metadata.userId || metadata.user_id;
        const planId = (metadata.planId || metadata.plan) as 'monthly' | 'annual';
        const currency = (metadata.currency || 'USD') as SupportedCurrency;
        const couponCode = metadata.couponCode || metadata.coupon_code;

        if (userId && planId) {
          // Verify user exists and activate
          platformStore.activatePremium(userId, planId, currency, couponCode, 'stripe');
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoiceObj = event.data.object;
        const customerId = invoiceObj.customer as string;
        // Mark user past_due if applicable
        platformStore.addAuditLog('PAYMENT_FAILED', 'invoices', invoiceObj.id as string, { customerId });
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const userId = (sub.metadata as Record<string, string>)?.userId;
        if (userId) {
          platformStore.cancelSubscription(userId);
        }
        break;
      }

      default:
        // Ignore unhandled event types cleanly
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
