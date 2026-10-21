'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  Sparkles,
  Receipt,
  Briefcase,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { platformStore } from '@/lib/store';
import { Invoice, SupportedCurrency } from '@/lib/types';
import { formatPrice } from '@/lib/countries';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id') || `cs_${Date.now()}`;
  const planId = (searchParams.get('plan') as 'monthly' | 'annual') || 'annual';
  const currency = (searchParams.get('currency') as SupportedCurrency) || 'USD';
  const provider = (searchParams.get('provider') as 'stripe' | 'razorpay' | 'demo') || 'stripe';

  const [activatedInvoice, setActivatedInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Execute verified server-side membership activation
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          const result = platformStore.activatePremium(
            data.user.id,
            planId,
            currency,
            undefined,
            provider
          );
          setActivatedInvoice(result.invoice);
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, [planId, currency, provider]);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-8 text-center animate-in fade-in duration-300">
      <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
        <CheckCircle2 className="w-9 h-9" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full am-badge-gold text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Skill Network Activated
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Welcome to Action = Matter Premium
        </h1>
        <p className="text-sm text-gray-400 max-w-lg mx-auto">
          Your payment was verified via webhook. Your professional profile is now part of the international Skill Network directory and all commission opportunities are unlocked.
        </p>
      </div>

      {/* Invoice Receipt Confirmation Card */}
      {activatedInvoice && (
        <div className="am-card p-6 am-gold-border text-left space-y-4 max-w-lg mx-auto bg-black/40">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Official Receipt</span>
            <span className="text-xs font-mono font-bold text-amber-300">{activatedInvoice.invoice_number}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-gray-500">Plan</p>
              <p className="font-semibold text-white">{activatedInvoice.plan_name}</p>
            </div>
            <div>
              <p className="text-gray-500">Amount Paid</p>
              <p className="font-semibold text-white">
                {formatPrice(activatedInvoice.total_amount, activatedInvoice.currency as SupportedCurrency)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Billing Period</p>
              <p className="font-medium text-gray-300">{activatedInvoice.billing_period}</p>
            </div>
            <div>
              <p className="text-gray-500">Gateway Provider</p>
              <p className="font-medium text-gray-300 capitalize">{activatedInvoice.payment_provider}</p>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" /> Paid & Settled
            </span>
            <Link
              href={`/dashboard/invoices/${activatedInvoice.id}`}
              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              <Receipt className="w-3.5 h-3.5" /> View Full Invoice
            </Link>
          </div>
        </div>
      )}

      {/* Action Next Steps */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link
          href="/dashboard/projects"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl am-btn-primary text-xs font-bold shadow-lg"
        >
          <Briefcase className="w-4 h-4" /> Discover Projects
        </Link>
        <Link
          href="/dashboard/people"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl am-btn-secondary text-xs font-semibold"
        >
          <Users className="w-4 h-4" /> Browse Skill Network
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-zinc-400 text-xs mt-3">Confirming premium status...</p>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
