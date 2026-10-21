'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Briefcase, Send, CheckCircle2, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { COUNTRIES } from '@/lib/countries';

export default function RequestProjectPage() {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [country, setCountry] = useState('United States');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [budgetRange, setBudgetRange] = useState('€20,000 - €35,000');
  const [currency, setCurrency] = useState('EUR');
  const [timeline, setTimeline] = useState('Within 30-60 days');
  const [workMode, setWorkMode] = useState('remote');
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/project-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: clientName,
          client_email: clientEmail,
          client_company: clientCompany,
          country,
          title,
          description,
          required_skills: requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
          budget_range: budgetRange,
          currency,
          timeline,
          work_mode: workMode,
          additional_requirements: additionalRequirements,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit project request.');
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error submitting request.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full am-badge-gold text-xs font-semibold uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" /> Client Commissioning
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Need Work Done?
          </h1>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">
            Tell us about your project requirements. Action = Matter reviews technical feasibility, scopes deliverables, and identifies vetted specialists from our Skill Network.
          </p>
        </div>

        {submitted ? (
          <div className="am-card p-8 md:p-12 text-center space-y-4 am-gold-border max-w-xl mx-auto animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">Project Inquiry Received</h2>
            <p className="text-xs text-gray-300 leading-relaxed max-w-md mx-auto">
              Your submission has been entered into the Action = Matter administrative review queue. A project director will evaluate requirements and follow up with you via email within 24 hours.
            </p>
            <div className="pt-4">
              <Link href="/" className="px-6 py-2.5 rounded-xl am-btn-primary text-xs font-semibold">
                Return to Homepage
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="am-card p-6 md:p-10 am-gold-border space-y-6">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">
                1. Client & Contact Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Your Full Name *</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Henrik Lindqvist"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Work Email Address *</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Company / Organization</label>
                  <input
                    type="text"
                    value={clientCompany}
                    onChange={(e) => setClientCompany(e.target.value)}
                    placeholder="e.g. Synthetix Labs"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                  >
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">
                2. Project Brief & Technical Scope
              </h3>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Project Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Next-Gen Automated Logistics Telemetry Engine"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Detailed Description & Key Deliverables *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Describe the problem, operational constraints, expected milestones, and architectural goals..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50 leading-relaxed"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Required Technical Skills / Stack</label>
                  <input
                    type="text"
                    value={requiredSkills}
                    onChange={(e) => setRequiredSkills(e.target.value)}
                    placeholder="e.g. Python, PyTorch, Go, Cloud Architecture"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-gray-300 font-medium">Estimated Budget</label>
                    <input
                      type="text"
                      value={budgetRange}
                      onChange={(e) => setBudgetRange(e.target.value)}
                      placeholder="e.g. €25,000 - €40,000"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 font-medium">Expected Timeline</label>
                    <input
                      type="text"
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      placeholder="e.g. 2 - 3 months"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 font-medium">Work Arrangement</label>
                    <select
                      value={workMode}
                      onChange={(e) => setWorkMode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                    >
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="onsite">On-Site</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[11px] text-gray-500">
                Action = Matter guarantees technical nondisclosure and confidential evaluation.
              </span>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl am-btn-primary text-xs font-bold shadow-xl hover:scale-105 transition-all disabled:opacity-50"
              >
                {loading ? 'Submitting Inquiry...' : 'Submit Project Requirements'}
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
