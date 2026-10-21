'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CheckCircle2, XCircle, Sparkles, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import { REGIONAL_PRICING } from '@/lib/countries';
import { SupportedCurrency } from '@/lib/types';

export default function PricingPage() {
  const [currency, setCurrency] = useState<SupportedCurrency>('USD');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const pricing = REGIONAL_PRICING[currency];

  const comparisonRows = [
    { feature: 'Basic Account & Profile Creation', free: true, premium: true },
    { feature: 'Browse Public Platform Content', free: true, premium: true },
    { feature: 'Inclusion in Official People Directory', free: false, premium: true },
    { feature: 'Discover Vetted Project Commissions', free: false, premium: true },
    { feature: 'View Project Budgets & Scope Deliverables', free: false, premium: true },
    { feature: 'Express Interest in Projects', free: false, premium: true },
    { feature: 'Selection for Paid Project Execution', free: false, premium: true },
    { feature: 'Direct Peer & Project Messaging', free: false, premium: true },
    { feature: 'Access to City Hubs & Summits', free: false, premium: true },
    { feature: 'AI Command Center Intelligence Suite', free: false, premium: true },
  ];

  return (
    <div className="min-h-screen bg-[#05070a] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full am-badge-gold text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> International Rates
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Skill Network Membership
          </h1>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">
            Connect with skilled professionals, discover real projects, and access verified commissions through Action = Matter.
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
            {(['EUR', 'USD', 'INR'] as SupportedCurrency[]).map((cur) => (
              <button
                key={cur}
                onClick={() => setCurrency(cur)}
                className={`px-4 py-1.5 rounded-lg font-medium transition-colors ${
                  currency === cur
                    ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {cur} {cur === 'EUR' ? '(€)' : cur === 'INR' ? '(₹)' : '($)'}
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-500">
            Regional pricing configured. Taxes and reverse-charge VAT handled automatically.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Monthly Plan */}
          <div className="am-card p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs uppercase font-bold text-gray-400">Monthly Membership</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">{pricing.formattedMonthly}</span>
                <span className="text-xs text-gray-400">/ month</span>
              </div>
              <p className="text-xs text-gray-400">
                Cancel anytime. Ideal for testing project fit and building your initial network presence.
              </p>
              <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-gray-300">
                <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Directory Inclusion</p>
                <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Discover All Projects</p>
                <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Submit Proposals</p>
                <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Direct Messaging</p>
              </div>
            </div>

            <Link
              href={`/signup?plan=monthly&currency=${currency}`}
              className="w-full py-3 rounded-xl am-btn-secondary text-center text-xs font-bold hover:border-amber-400/40"
            >
              Get Started Monthly
            </Link>
          </div>

          {/* Annual Plan */}
          <div className="am-card p-8 am-gold-border space-y-6 flex flex-col justify-between relative bg-gradient-to-b from-amber-500/10 to-transparent shadow-xl">
            <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-extrabold uppercase">
              Best Value
            </div>

            <div className="space-y-4">
              <span className="text-xs uppercase font-bold text-amber-400">Annual Membership</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">{pricing.formattedAnnual}</span>
                <span className="text-xs text-gray-400">/ year</span>
              </div>
              <p className="text-xs text-gray-400">
                Highest priority review on commission proposals, verified directory badge, and full summit access.
              </p>
              <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-gray-300">
                <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Official Verified Member Badge</p>
                <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Priority Proposal Review by CEO/Admin</p>
                <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> AI Command Center Suite</p>
                <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> All City Hubs & Global Summits</p>
              </div>
            </div>

            <Link
              href={`/signup?plan=annual&currency=${currency}`}
              className="w-full py-3 rounded-xl am-btn-primary text-center text-xs font-bold shadow-lg shadow-amber-500/20 hover:scale-105 transition-transform"
            >
              Join Skill Network Annually
            </Link>
          </div>
        </div>

        {/* Feature Comparison Matrix */}
        <div className="am-card p-6 md:p-8 space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-bold text-white">Compare Account Privileges</h3>
            <p className="text-xs text-gray-400">Understand the clear distinction between Free Users and Skill Network Members.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase font-bold text-gray-400 border-b border-white/10">
                <tr>
                  <th className="py-3 px-2">Platform Capability</th>
                  <th className="py-3 px-2 text-center w-36">Free User</th>
                  <th className="py-3 px-2 text-center w-48 text-amber-300">Skill Network Member</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {comparisonRows.map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-2 text-white font-medium">{row.feature}</td>
                    <td className="py-3.5 px-2 text-center">
                      {row.free ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-600 mx-auto" />
                      )}
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      {row.premium ? (
                        <CheckCircle2 className="w-4 h-4 text-amber-400 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-600 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
