'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Briefcase,
  Users,
  ShieldCheck,
  Globe,
  Compass,
  CheckCircle2,
  ChevronDown,
  Building,
  TrendingUp,
  Zap,
  Lock
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleSwitcher } from '@/components/ui/RoleSwitcher';
import { REGIONAL_PRICING } from '@/lib/countries';
import { SupportedCurrency } from '@/lib/types';

export default function LandingPage() {
  const [currency, setCurrency] = useState<SupportedCurrency>('USD');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const pricing = REGIONAL_PRICING[currency];

  const faqs = [
    {
      q: 'What is ACTION = MATTER?',
      a: 'ACTION = MATTER is an international skilled professional network and project marketplace. We connect vetted, high-caliber specialists with real client commissions and enterprise work opportunities.',
    },
    {
      q: 'Can anyone create a free account?',
      a: 'Yes. Anyone can create an account for free to explore the platform and view public initiatives. However, accessing the official People directory, viewing commission details, and expressing interest in projects requires a Premium Skill Network membership.',
    },
    {
      q: 'Does Premium membership guarantee project earnings?',
      a: 'No. Premium membership provides direct access to the Skill Network directory, networking, and the ability to express interest in client projects. Final selection remains strictly curated by Action = Matter leadership to ensure high execution standards.',
    },
    {
      q: 'How do businesses and founders submit projects?',
      a: 'Clients use our "Need Work Done? / Request a Project" submission flow. Inquiries enter administrative review, where leadership vets scopes and budgets before publishing to the Skill Network.',
    },
    {
      q: 'Which international currencies and payment gateways are supported?',
      a: 'We support international payments in EUR (€), USD ($), and INR (₹) via Stripe and Razorpay, with automated VAT invoices generated upon verified webhook completion.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#05070a] text-white flex flex-col selection:bg-amber-400 selection:text-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 md:pt-32 md:pb-36 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full am-glass am-gold-border text-xs font-semibold uppercase tracking-widest text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>International Skilled Professional Network</span>
          </div>

          {/* Headline */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] text-white">
              WHERE IDEAS TURN <br />
              <span className="am-gold-text">INTO ACTION.</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Connect skilled professionals with real opportunities, meaningful client projects, and high-standard international execution.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl am-btn-primary text-sm font-bold shadow-xl shadow-amber-500/20 hover:scale-105 transition-transform"
            >
              Join the Skill Network <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/how-it-works"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl am-btn-secondary text-sm font-semibold hover:border-amber-400/40"
            >
              Explore How It Works
            </Link>

            <Link
              href="/request-project"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-amber-200 border border-white/10"
            >
              Need Work Done? (Client Inquiry)
            </Link>
          </div>

          {/* Verified Stats Row */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto text-left">
            <div className="am-card p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-500">Global Reach</span>
              <p className="text-xl font-bold text-white">20+ Countries</p>
              <p className="text-[10px] text-gray-400">Amsterdam • London • SF</p>
            </div>
            <div className="am-card p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-500">Curation Rate</span>
              <p className="text-xl font-bold text-amber-300">100% Vetted</p>
              <p className="text-[10px] text-gray-400">By Executive Team</p>
            </div>
            <div className="am-card p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-500">Live Commissions</span>
              <p className="text-xl font-bold text-white">€18K - €50K</p>
              <p className="text-[10px] text-gray-400">Funded Engagements</p>
            </div>
            <div className="am-card p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-500">Security</span>
              <p className="text-xl font-bold text-emerald-400">Audited</p>
              <p className="text-[10px] text-gray-400">Stripe & Razorpay</p>
            </div>
          </div>
        </div>

        {/* Ambient Golden Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      </section>

      {/* How It Works Section */}
      <section className="py-24 border-b border-white/5 bg-[#080b10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Execution Architecture
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Built for High-Standard Collaboration
            </h2>
            <p className="text-sm text-gray-400 max-w-xl mx-auto">
              A transparent, two-sided workflow designed for skilled talent and enterprise clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* For Skilled Professionals */}
            <div className="am-card p-8 am-gold-border space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl am-gold-gradient flex items-center justify-center font-bold text-black text-sm">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">For Skilled Professionals</h3>
                  <p className="text-xs text-amber-300">Monetize your craft on international engagements</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                {[
                  { step: '01', title: 'Create Your Free Account', desc: 'Set up your base credentials and regional preferences globally.' },
                  { step: '02', title: 'Join the Skill Network', desc: 'Upgrade to Premium to get included in the official directory and unlock marketplace commissions.' },
                  { step: '03', title: 'Discover & Express Interest', desc: 'Submit proposals on verified client projects directly to Action = Matter administration.' },
                  { step: '04', title: 'Selection & Milestone Payouts', desc: 'Get selected by the CEO/Admin committee, deliver milestones, and receive agreed compensation.' },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="font-mono font-bold text-amber-400 text-sm">{s.step}</span>
                    <div className="space-y-0.5">
                      <p className="font-bold text-white">{s.title}</p>
                      <p className="text-gray-400">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* For Businesses & Founders */}
            <div className="am-card p-8 border-purple-500/20 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center font-bold text-sm">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">For Businesses & Founders</h3>
                  <p className="text-xs text-purple-300">Commission vetted international teams</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                {[
                  { step: '01', title: 'Tell Us What You Need', desc: 'Submit project requirements, stack preferences, timeline, and commission budget.' },
                  { step: '02', title: 'Executive Review', desc: 'Action = Matter reviews the technical scope, milestones, and deliverable feasibility.' },
                  { step: '03', title: 'Marketplace Publication', desc: 'Appropriate projects are published to active Skill Network members.' },
                  { step: '04', title: 'Curated Selection & Delivery', desc: 'Leadership selects top specialists and guarantees disciplined international delivery.' },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="font-mono font-bold text-purple-400 text-sm">{s.step}</span>
                    <div className="space-y-0.5">
                      <p className="font-bold text-white">{s.title}</p>
                      <p className="text-gray-400">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparent International Pricing */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-center">
          <div className="space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Simple Membership
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Invest in Your Professional Trajectory
            </h2>
            <p className="text-sm text-gray-400 max-w-xl mx-auto">
              Configured regional prices across Europe, North America, and India.
            </p>
          </div>

          {/* Currency Toggle */}
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
            {(['EUR', 'USD', 'INR'] as SupportedCurrency[]).map((cur) => (
              <button
                key={cur}
                onClick={() => setCurrency(cur)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  currency === cur
                    ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {cur}
              </button>
            ))}
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto text-left">
            {/* Monthly */}
            <div className="am-card p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs uppercase font-bold text-gray-500">Monthly</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">{pricing.formattedMonthly}</span>
                  <span className="text-xs text-gray-400 font-medium">/ month</span>
                </div>
                <p className="text-xs text-gray-400">Flexible month-to-month access. Cancel anytime.</p>
                <div className="space-y-2 pt-4 border-t border-white/10 text-xs text-gray-300">
                  <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Directory Listing</p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Discover All Projects</p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Express Interest in Commissions</p>
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

            {/* Annual */}
            <div className="am-card p-8 am-gold-border space-y-6 flex flex-col justify-between relative bg-gradient-to-b from-amber-500/10 to-transparent">
              <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-extrabold uppercase">
                Best Value
              </div>

              <div className="space-y-3">
                <span className="text-xs uppercase font-bold text-amber-400">Annual Membership</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">{pricing.formattedAnnual}</span>
                  <span className="text-xs text-gray-400 font-medium">/ year</span>
                </div>
                <p className="text-xs text-gray-400">Full 12-month membership with priority project matching.</p>
                <div className="space-y-2 pt-4 border-t border-white/10 text-xs text-gray-300">
                  <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Official Directory Verification Badge</p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Highest Review Priority on Proposals</p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> AI Command Center Recommendations</p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Access to All Global Summits & City Hubs</p>
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
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 border-b border-white/5 bg-[#080b10]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
            <p className="text-xs text-gray-400">Everything you need to know about Action = Matter.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="am-card p-5 cursor-pointer border-white/10 hover:border-amber-400/20 transition-all"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="flex items-center justify-between text-sm font-bold text-white">
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180 text-amber-400' : ''}`} />
                </div>
                {openFaq === i && (
                  <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-white/10 leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pre-Footer Call to Action */}
      <section className="py-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Ready to Turn Ideas Into Action?
          </h2>
          <p className="text-sm text-gray-400 max-w-lg mx-auto">
            Join the international network of skilled professionals or commission vetted teams today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/signup"
              className="px-8 py-3.5 rounded-xl am-btn-primary text-xs font-bold shadow-xl shadow-amber-500/20 hover:scale-105 transition-transform"
            >
              Get Started Now
            </Link>
            <Link
              href="/request-project"
              className="px-6 py-3.5 rounded-xl am-btn-secondary text-xs font-semibold"
            >
              Submit Project Inquiry
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <RoleSwitcher />
    </div>
  );
}
