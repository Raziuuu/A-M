import { SupportedCurrency } from '../types';

export interface CreateCheckoutParams {
  userId: string;
  userEmail: string;
  userName: string;
  planId: 'monthly' | 'annual';
  currency: SupportedCurrency;
  couponCode?: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutResult {
  sessionId: string;
  checkoutUrl: string;
  provider: 'stripe' | 'razorpay' | 'demo';
  amount: number;
  currency: SupportedCurrency;
  discountAmount: number;
  totalAmount: number;
}

export interface WebhookVerificationResult {
  isValid: boolean;
  event?: {
    type: string;
    id: string;
    data: Record<string, unknown>;
  };
  error?: string;
}

export interface PaymentProvider {
  name: 'stripe' | 'razorpay' | 'demo';
  createCustomer(params: { email: string; name: string; userId: string }): Promise<{ customerId: string }>;
  createCheckout(params: CreateCheckoutParams): Promise<CheckoutResult>;
  cancelSubscription(subscriptionId: string): Promise<{ success: boolean; effectiveDate: string }>;
  resumeSubscription(subscriptionId: string): Promise<{ success: boolean }>;
  verifyWebhook(payload: string, signature: string): Promise<WebhookVerificationResult>;
  createInvoice(params: {
    userId: string;
    subscriptionId: string;
    planName: string;
    amount: number;
    discountAmount: number;
    currency: string;
    billingName: string;
    billingEmail: string;
  }): Promise<{ invoiceNumber: string; id: string }>;
}
