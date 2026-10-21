'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Sparkles,
  ShieldCheck,
  Calendar,
  Receipt,
  Download,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { platformStore } from '@/lib/store';
import { Profile, Invoice, SupportedCurrency } from '@/lib/types';
import { formatPrice } from '@/lib/countries';
import { UpgradeModal } from '@/components/auth/UpgradeModal';

export default function BillingPage() {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const loadData = () => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setCurrentUser(data.user);
          setInvoices(platformStore.getInvoices(data.user.id));
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const isPremium = currentUser?.role === 'premium_member' || currentUser?.role === 'admin' || currentUser?.role === 'ceo' || currentUser?.membership_status === 'active';

  const handleCancelSubscription = () => {
    if (!currentUser) return;
    if (!confirm('Are you sure you want to cancel renewal? You will retain all Premium Skill Network privileges until the end of your billing cycle.')) {
      return;
    }

    setLoading(true);
    const res = platformStore.cancelSubscription(currentUser.id);
    setCancelMessage(res.message);
    loadData();
    setLoading(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full am-badge-gold text-xs font-semibold uppercase tracking-wider mb-2">
          <CreditCard className="w-3.5 h-3.5" /> Finance & Subscriptions
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Billing & Membership Settings
        </h1>
        <p className="text-xs md:text-sm text-gray-400 mt-1 max-w-2xl">
          Manage your Skill Network subscription, payment methods, renewal preferences, and official tax invoices.
        </p>
      </div>

      {cancelMessage && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{cancelMessage}</span>
        </div>
      )}

      {/* Current Plan Overview Card */}
      <div className="am-card p-6 md:p-8 am-gold-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="space-y-1">
            <span className="text-[11px] uppercase font-bold text-gray-500">Active Membership</span>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white capitalize">
                {isPremium ? `Skill Network (${currentUser?.membership_tier || 'Annual'})` : 'Free Account'}
              </h2>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize ${
                isPremium
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-gray-500/20 text-gray-400'
              }`}>
                {currentUser?.membership_status}
              </span>
            </div>
          </div>

          <div>
            {!isPremium ? (
              <button
                onClick={() => setUpgradeModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl am-btn-primary text-xs font-bold shadow-md hover:scale-105 transition-all"
              >
                <Sparkles className="w-4 h-4" /> Upgrade to Premium
              </button>
            ) : currentUser?.cancel_at_period_end ? (
              <span className="text-xs text-amber-400 font-medium">
                Cancellation Pending (Active until period end)
              </span>
            ) : (
              <button
                onClick={handleCancelSubscription}
                disabled={loading}
                className="px-4 py-2 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors"
              >
                Cancel Subscription
              </button>
            )}
          </div>
        </div>

        {/* Plan Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <p className="text-gray-500">Billing Period</p>
            <p className="font-semibold text-white mt-0.5 capitalize">{currentUser?.membership_tier || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500">Current Period End</p>
            <p className="font-semibold text-white mt-0.5">
              {currentUser?.subscription_period_end
                ? new Date(currentUser.subscription_period_end).toLocaleDateString()
                : 'Lifetime Free'}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Payment Gateway</p>
            <p className="font-semibold text-white mt-0.5">Stripe / Razorpay</p>
          </div>
          <div>
            <p className="text-gray-500">Auto-Renewal</p>
            <p className={`font-semibold mt-0.5 ${currentUser?.cancel_at_period_end ? 'text-rose-400' : 'text-emerald-400'}`}>
              {currentUser?.cancel_at_period_end ? 'Off (Expiring)' : 'Active (Automatic)'}
            </p>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="am-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Receipt className="w-4 h-4 text-amber-400" /> Invoice History
          </h3>
          <span className="text-[11px] text-gray-500">All payments generate verifiable VAT invoices</span>
        </div>

        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[560px] text-left text-xs">
            <thead className="text-[10px] uppercase font-bold text-gray-400 border-b border-white/10">
              <tr>
                <th className="py-3 px-2">Invoice #</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Description</th>
                <th className="py-3 px-2">Amount</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-2 font-mono font-medium text-amber-300">{inv.invoice_number}</td>
                  <td className="py-3.5 px-2 text-gray-400 whitespace-nowrap">{new Date(inv.paid_at).toLocaleDateString()}</td>
                  <td className="py-3.5 px-2 text-white font-medium">{inv.plan_name}</td>
                  <td className="py-3.5 px-2 font-bold text-white whitespace-nowrap">
                    {formatPrice(inv.total_amount, inv.currency as SupportedCurrency)}
                  </td>
                  <td className="py-3.5 px-2">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                      Paid
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-right">
                    <Link
                      href={`/dashboard/invoices/${inv.id}`}
                      className="text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1 min-h-[44px] px-2 py-1"
                    >
                      View Invoice <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}

              {invoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No payment invoices recorded for this account.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
      />
    </div>
  );
}
