import { PaymentProvider } from './types';
import { StripeProvider } from './stripe';
import { RazorpayProvider } from './razorpay';
import { SupportedCurrency } from '../types';

export function getPaymentProvider(currency?: SupportedCurrency): PaymentProvider {
  if (currency === 'INR') {
    return new RazorpayProvider();
  }
  return new StripeProvider();
}
