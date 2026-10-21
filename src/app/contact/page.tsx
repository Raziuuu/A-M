'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Building,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Enterprise & Private Commissions',
    inquiryType: 'general',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please complete all required fields.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Your message has been dispatched to the ACTION = MATTER directorate.');
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-white flex flex-col selection:bg-amber-400/20 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <Building className="w-3.5 h-3.5" />
            Direct Communications Desk
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            Get in Touch with{' '}
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              ACTION = MATTER
            </span>
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            Whether you are an enterprise seeking bespoke high-stakes project execution or a prospective member with inquiries about accreditation, our concierge desk is at your service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#080b10] border border-white/5 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Mail className="w-5 h-5 text-amber-400" />
                Direct Enquiries
              </h2>

              <div className="space-y-6">
                <div>
                  <div className="text-xs uppercase font-mono text-zinc-500 mb-1">General Directorate & Press</div>
                  <a
                    href="mailto:contact@actionismatter.com"
                    className="text-amber-300 hover:text-amber-200 font-medium transition-colors"
                  >
                    contact@actionismatter.com
                  </a>
                </div>

                <div>
                  <div className="text-xs uppercase font-mono text-zinc-500 mb-1">Enterprise Project Requests</div>
                  <a
                    href="mailto:projects@actionismatter.com"
                    className="text-amber-300 hover:text-amber-200 font-medium transition-colors"
                  >
                    projects@actionismatter.com
                  </a>
                  <p className="text-xs text-zinc-400 mt-1">
                    Or submit via the{' '}
                    <Link href="/request-project" className="text-amber-400 underline hover:text-amber-300">
                      Project Request Portal
                    </Link>
                  </p>
                </div>

                <div>
                  <div className="text-xs uppercase font-mono text-zinc-500 mb-1">Skill Network Membership Desk</div>
                  <a
                    href="mailto:admissions@actionismatter.com"
                    className="text-amber-300 hover:text-amber-200 font-medium transition-colors"
                  >
                    admissions@actionismatter.com
                  </a>
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-white/5 flex items-center gap-3 text-xs text-zinc-400">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Executive response window: Mon – Fri within 12 business hours.</span>
              </div>
            </div>

            {/* Regional Hubs */}
            <div className="bg-[#080b10] border border-white/5 rounded-2xl p-8">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                International Presence
              </h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="font-semibold text-white">Amsterdam Hub</div>
                  <div className="text-xs text-zinc-400 mt-1">Keizersgracht 421</div>
                  <div className="text-xs text-amber-400/80 font-mono mt-0.5">The Netherlands</div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="font-semibold text-white">London Desk</div>
                  <div className="text-xs text-zinc-400 mt-1">100 Bishopsgate</div>
                  <div className="text-xs text-amber-400/80 font-mono mt-0.5">United Kingdom</div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="font-semibold text-white">New York</div>
                  <div className="text-xs text-zinc-400 mt-1">One World Trade Center</div>
                  <div className="text-xs text-amber-400/80 font-mono mt-0.5">United States</div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="font-semibold text-white">Bengaluru Tech Hub</div>
                  <div className="text-xs text-zinc-400 mt-1">Indiranagar 100ft Rd</div>
                  <div className="text-xs text-amber-400/80 font-mono mt-0.5">India</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white text-sm">Strict Discretion & NDA Standard</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  All enterprise client inquiries and proprietary project details are handled under international non-disclosure protocols.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#080b10] border border-white/5 rounded-2xl p-8 sm:p-10 relative">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Dispatch Confirmed</h3>
                  <p className="text-zinc-400 text-sm max-w-md mx-auto">
                    Thank you, <span className="text-white font-medium">{formData.name}</span>. Your message has been routed to our executive triage desk. We will respond to <span className="text-amber-300">{formData.email}</span> shortly.
                  </p>
                  <div className="pt-6">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          email: '',
                          subject: 'Enterprise & Private Commissions',
                          inquiryType: 'general',
                          message: '',
                        });
                      }}
                      className="px-6 py-2.5 rounded-xl border border-white/10 hover:border-amber-400/40 text-sm text-zinc-300 hover:text-white transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Send an Official Dispatch</h2>
                    <p className="text-sm text-zinc-400">
                      Fill out the form below and an ACTION = MATTER team officer will attend to your request.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider mb-2">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Marcus Vance"
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@domain.com"
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider mb-2">
                        Inquiry Nature
                      </label>
                      <select
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-sm transition-colors"
                      >
                        <option value="enterprise" className="bg-[#080b10]">
                          Enterprise Commission Inquiry
                        </option>
                        <option value="membership" className="bg-[#080b10]">
                          Skill Network Membership / Upgrade
                        </option>
                        <option value="hubs" className="bg-[#080b10]">
                          City Hubs & Chapter Events
                        </option>
                        <option value="press" className="bg-[#080b10]">
                          Press & Media Relations
                        </option>
                        <option value="general" className="bg-[#080b10]">
                          General Inquiry
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider mb-2">
                        Subject Line
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 text-sm transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider mb-2">
                      Your Message / Details *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please detail your scope, requirements, timeline, or question..."
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm transition-colors"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-semibold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          <span>Dispatching...</span>
                        </>
                      ) : (
                        <>
                          <span>Transmit Message</span>
                          <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
