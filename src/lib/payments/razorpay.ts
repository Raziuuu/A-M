import { PaymentProvider, CreateCheckoutParams, CheckoutResult, WebhookVerificationResult } from './types';
import { REGIONAL_PRICING } from '../countries';

export class RazorpayProvider implements PaymentProvider {
  name = 'razorpay' as const;
  private keyId: string;
  private keySecret: string;
  private webhookSecret: string;

  constructor() {
    this.keyId = process.env.RAZORPAY_KEY_ID || '';
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || '';
    this.webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
  }

  isConfigured(): boolean {
    return Boolean(this.keyId && this.keySecret && !this.keyId.startsWith('mock_'));
  }

  async createCustomer(params: { email: string; name: string; userId: string }): Promise<{ customerId: string }> {
    return { customerId: `cust_rzp_${params.userId.slice(0, 8)}` };
  }

  async createCheckout(params: CreateCheckoutParams): Promise<CheckoutResult> {
    const pricing = REGIONAL_PRICING[params.currency];
    const baseAmount = params.planId === 'monthly' ? pricing.monthly : pricing.annual;
    let discount = 0;

    if (params.couponCode?.toUpperCase() === 'ACTION50') {
      discount = baseAmount * 0.5;
    } else if (params.couponCode?.toUpperCase() === 'WELCOME20') {
      discount = baseAmount * 0.2;
    }

    const totalAmount = Math.max(0, baseAmount - discount);
    const mockOrderId = `order_rzp_${Date.now()}`;

    return {
      sessionId: mockOrderId,
      checkoutUrl: `/dashboard/checkout/success?session_id=${mockOrderId}&plan=${params.planId}&currency=${params.currency}&amount=${totalAmount}&provider=razorpay`,
      provider: 'razorpay',
      amount: baseAmount,
      currency: params.currency,
      discountAmount: discount,
      totalAmount,
    };
  }

  async cancelSubscription(subscriptionId: string): Promise<{ success: boolean; effectiveDate: string }> {
    return {
      success: true,
      effectiveDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  async resumeSubscription(subscriptionId: string): Promise<{ success: boolean }> {
    return { success: true };
  }

  async verifyWebhook(payload: string, signature: string): Promise<WebhookVerificationResult> {
    try {
      const parsed = JSON.parse(payload);
      return { isValid: true, event: parsed };
    } catch {
      return { isValid: false, error: 'Invalid payload' };
    }
  }

  async createInvoice(params: {
    userId: string;
    subscriptionId: string;
    planName: string;
    amount: number;
    discountAmount: number;
    currency: string;
    billingName: string;
    billingEmail: string;
  }): Promise<{ invoiceNumber: string; id: string }> {
    const year = new Date().getFullYear();
    const rand = Math.floor(100000 + Math.random() * 900000);
    const invoiceNumber = `INV-RZP-${year}-${rand}`;
    return { invoiceNumber, id: `inv_rzp_${Date.now()}` };
  }
}
