'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Check, Sparkles, Zap, Globe, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { SupportedCurrency } from '@/lib/types';
import { REGIONAL_PRICING } from '@/lib/countries';
import { toast } from 'sonner';

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
  const [activating, setActivating] = useState(false);
  const [activated, setActivated] = useState(false);

  if (!isOpen) return null;

  const pricing = REGIONAL_PRICING[currency];
  const regularPrice = billingCycle === 'monthly' ? pricing.formattedMonthly : pricing.formattedAnnual;
  const cycleLabel = billingCycle === 'monthly' ? '/ month' : '/ year';

  const handleInstantActivate = async () => {
    setActivating(true);
    try {
      const res = await fetch('/api/membership/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: billingCycle, currency }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          toast.error('Please log in or sign up first to claim access.');
          setTimeout(() => {
            window.location.href = `/signup?plan=${billingCycle}&currency=${currency}`;
          }, 800);
          return;
        }
        throw new Error(data.error || 'Failed to activate access.');
      }

      setActivated(true);
      toast.success('Premium Skill Network unlocked! Full access granted.');
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 700);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Activation error';
      toast.error(msg);
    } finally {
      setActivating(false);
    }
  };

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
            <Sparkles className="w-3.5 h-3.5" /> Premium Skill Network Access
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            {title}
          </h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Promotional Free Access Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-b from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/30 mb-6 text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" /> Early Access Promotion • 100% Free
          </div>
          <div className="flex items-baseline justify-center gap-2.5 pt-1">
            <span className="text-lg text-gray-500 line-through font-medium">{regularPrice} {cycleLabel}</span>
            <span className="text-3xl md:text-4xl font-black text-amber-300 tracking-tight">$0 Free Access</span>
          </div>
          <p className="text-xs text-emerald-400 font-medium">
            Zero payment details or credit cards required. Instant access granted on click.
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
              Annual <span className="text-[10px] bg-black/20 text-white px-1.5 py-0.5 rounded font-bold">Recommended</span>
            </button>
          </div>

          {/* Currency Selector */}
          <div className="flex items-center gap-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-gray-400 ml-1" />
            <span className="text-gray-400 mr-1">Region:</span>
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
          <button
            onClick={handleInstantActivate}
            disabled={activating || activated}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl am-btn-primary text-sm font-bold shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01] disabled:opacity-60 cursor-pointer"
          >
            {activating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Unlocking Premium Privileges...
              </>
            ) : activated ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-black" /> Premium Access Granted!
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-black text-black" /> Get Instant Premium Access (Free)
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-gray-500">
            No credit card, Stripe, or payment details required. Immediate full access to all features.
          </p>
        </div>
      </div>
    </div>
  );
}
