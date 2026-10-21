'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sparkles,
  Check,
  ShieldCheck,
  CreditCard,
  Globe,
  Tag,
  ArrowRight,
  Lock,
  AlertCircle
} from 'lucide-react';
import { SupportedCurrency, Profile } from '@/lib/types';
import { REGIONAL_PRICING, formatPrice } from '@/lib/countries';

function UpgradeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(
    (searchParams.get('cycle') as 'monthly' | 'annual') || 'annual'
  );
  const [currency, setCurrency] = useState<SupportedCurrency>(
    (searchParams.get('currency') as SupportedCurrency) || 'USD'
  );
  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState<{ valid: boolean; message: string; discount?: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setCurrentUser(data.user);
      })
      .catch(() => {});
  }, []);

  const pricing = REGIONAL_PRICING[currency];
  const baseAmount = billingCycle === 'monthly' ? pricing.monthly : pricing.annual;

  // Calculate discount
  let discountAmount = 0;
  if (couponStatus?.valid && couponStatus.discount) {
    discountAmount = (baseAmount * couponStatus.discount) / 100;
  }
  const totalAmount = Math.max(0, baseAmount - discountAmount);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setError(null);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim(), planId: billingCycle }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponStatus({ valid: false, message: data.message || 'Invalid coupon code.' });
      } else {
        setCouponStatus({
          valid: true,
          message: data.message,
          discount: data.coupon.discount_value,
        });
      }
    } catch {
      setCouponStatus({ valid: false, message: 'Failed to validate coupon.' });
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: billingCycle,
          currency,
          couponCode: couponStatus?.valid ? couponCode : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize checkout.');
      }

      // Route to checkout URL (Stripe / Razorpay or simulated production success)
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Checkout error.';
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full am-badge-gold text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Action = Matter Skill Network
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Upgrade to Premium Membership
        </h1>
        <p className="text-sm text-gray-400 max-w-xl mx-auto">
          Connect directly with vetted international clients, gain access to live project commissions, and showcase your profile in the official Skill Network directory.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left 2 Cols: Plan Selection & Currency */}
        <div className="md:col-span-2 space-y-6">
          {/* Plan Duration Toggle */}
          <div className="am-card p-6 am-gold-border space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">1. Select Billing Period</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`p-4 rounded-xl border text-left transition-all relative ${
                  billingCycle === 'annual'
                    ? 'border-amber-400 bg-amber-400/10 shadow-lg'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-amber-400 text-black text-[10px] font-extrabold uppercase">
                  Best Value
                </div>
                <p className="text-sm font-bold text-white">Annual Membership</p>
                <p className="text-xl font-black text-amber-300 mt-2">{pricing.formattedAnnual} <span className="text-xs text-gray-400 font-normal">/ year</span></p>
                <p className="text-[11px] text-gray-400 mt-1">Full 12 months access with highest priority</p>
              </button>

              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  billingCycle === 'monthly'
                    ? 'border-amber-400 bg-amber-400/10 shadow-lg'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <p className="text-sm font-bold text-white">Monthly Membership</p>
                <p className="text-xl font-black text-amber-300 mt-2">{pricing.formattedMonthly} <span className="text-xs text-gray-400 font-normal">/ month</span></p>
                <p className="text-[11px] text-gray-400 mt-1">Flexible monthly billing, cancel anytime</p>
              </button>
            </div>
          </div>

          {/* Regional Currency Configuration */}
          <div className="am-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">2. Billing Currency</h3>
              <span className="text-[11px] text-gray-500 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> Regional rates
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {(['EUR', 'USD', 'INR'] as SupportedCurrency[]).map((cur) => (
                <button
                  key={cur}
                  type="button"
                  onClick={() => setCurrency(cur)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    currency === cur
                      ? 'border-amber-400 bg-amber-400/15 text-white font-bold'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="text-sm">{cur}</span>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {cur === 'EUR' ? 'Europe' : cur === 'INR' ? 'India' : 'International'}
                  </p>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-gray-500">{pricing.taxNote}</p>
          </div>

          {/* Promotional Coupon Input */}
          <div className="am-card p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">3. Apply Promo Code</h3>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter code (e.g. ACTION50, WELCOME20)"
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50 uppercase font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl am-btn-secondary text-xs font-semibold hover:border-amber-400/40"
              >
                Apply
              </button>
            </form>

            {couponStatus && (
              <p className={`text-xs flex items-center gap-1.5 ${couponStatus.valid ? 'text-emerald-400' : 'text-rose-400'}`}>
                {couponStatus.valid ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                {couponStatus.message}
              </p>
            )}
          </div>
        </div>

        {/* Right Col: Order Summary & Checkout */}
        <div className="space-y-6">
          <div className="am-card p-6 am-gold-border space-y-5 sticky top-24">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-3">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-gray-300">
                <span>Skill Network {billingCycle === 'monthly' ? 'Monthly' : 'Annual'} Plan</span>
                <span>{formatPrice(baseAmount, currency)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-400 font-semibold">
                  <span>Discount ({couponStatus?.discount}%)</span>
                  <span>-{formatPrice(discountAmount, currency)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-gray-400 text-[11px]">
                <span>Taxes</span>
                <span>Included</span>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-baseline justify-between">
                <span className="text-sm font-bold text-white">Total Amount</span>
                <span className="text-2xl font-black text-amber-300">
                  {formatPrice(totalAmount, currency)}
                </span>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl am-btn-primary text-xs font-bold shadow-xl transition-all hover:scale-105 disabled:opacity-50"
            >
              {loading ? 'Processing Checkout...' : 'Proceed to Payment'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-3 border-t border-white/10 space-y-2 text-[11px] text-gray-500 text-center">
              <p className="flex items-center justify-center gap-1.5 text-gray-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Verified Server-Side Webhook Activation
              </p>
              <p>Supports Visa, Mastercard, AMEX, Apple Pay, Google Pay, and UPI via Stripe/Razorpay.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UpgradePage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-zinc-400 text-xs mt-3">Loading checkout configuration...</p>
        </div>
      }
    >
      <UpgradeContent />
    </Suspense>
  );
}
