'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Check, Sparkles, Shield, Zap, Globe, ArrowRight } from 'lucide-react';
import { SupportedCurrency } from '@/lib/types';
import { REGIONAL_PRICING } from '@/lib/countries';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export function UpgradeModal({
  isOpen,
  onClose,
  title = 'Join the Action = Matter Skill Network',
  subtitle = 'Unlock direct access to international projects, verified skilled professionals, and messaging.'
}: UpgradeModalProps) {
  const [currency, setCurrency] = useState<SupportedCurrency>('USD');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  if (!isOpen) return null;

  const pricing = REGIONAL_PRICING[currency];
  const price = billingCycle === 'monthly' ? pricing.formattedMonthly : pricing.formattedAnnual;
  const cycleLabel = billingCycle === 'monthly' ? '/ month' : '/ year';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl am-glass rounded-2xl border border-amber-500/30 p-6 md:p-8 shadow-2xl overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full am-badge-gold text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Premium Skill Network
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            {title}
          </h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Currency & Cycle Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 rounded-xl bg-white/5 border border-white/10 mb-6">
          {/* Billing Cycle Toggle */}
          <div className="flex items-center p-1 bg-black/40 rounded-lg w-full sm:w-auto">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'am-gold-gradient text-black font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                billingCycle === 'annual'
                  ? 'am-gold-gradient text-black font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Annual <span className="text-[10px] bg-black/20 text-white px-1.5 py-0.5 rounded font-bold">Best Value</span>
            </button>
          </div>

          {/* Currency Selector */}
          <div className="flex items-center gap-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-gray-400 ml-1" />
            <span className="text-gray-400 mr-1">Currency:</span>
            {(['EUR', 'USD', 'INR'] as SupportedCurrency[]).map((cur) => (
              <button
                key={cur}
                onClick={() => setCurrency(cur)}
                className={`px-2.5 py-1 rounded font-medium text-xs transition-colors ${
                  currency === cur
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {cur}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Display */}
        <div className="p-4 rounded-xl bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/20 mb-6 text-center">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-extrabold text-white tracking-tight">{price}</span>
            <span className="text-sm font-medium text-gray-400">{cycleLabel}</span>
          </div>
          <p className="text-xs text-amber-300/80 mt-1">{pricing.taxNote}</p>
        </div>

        {/* Exclusive Benefits List */}
        <div className="space-y-2.5 mb-8">
          {[
            'Official inclusion in the Action = Matter People/Skill Network directory',
            'Discover and browse real international project commissions',
            'Express interest in projects & earn compensation upon selection',
            'Direct peer-to-peer and project messaging with verified members',
            'Access to exclusive City Hubs, technology masterclasses & AI tools',
          ].map((benefit, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs text-gray-300">
              <div className="p-0.5 rounded-full bg-amber-400/20 text-amber-300 shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Link
            href={`/dashboard/upgrade?cycle=${billingCycle}&currency=${currency}`}
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl am-btn-primary text-sm font-semibold shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01]"
          >
            Become a Premium Member <ArrowRight className="w-4 h-4" />
          </Link>

          <p className="text-[11px] text-center text-gray-500">
            Secure international checkout via Stripe & Razorpay. Cancel anytime from Billing Settings.
          </p>
        </div>
      </div>
    </div>
  );
}
