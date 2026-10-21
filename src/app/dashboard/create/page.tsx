'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusCircle, Briefcase, Calendar, Building2, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { platformStore } from '@/lib/store';
import { Profile } from '@/lib/types';

export default function CreateActionPage() {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);

  // Project form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [category, setCategory] = useState('Artificial Intelligence & Systems');
  const [skills, setSkills] = useState('');
  const [budgetMin, setBudgetMin] = useState(15000);
  const [budgetMax, setBudgetMax] = useState(25000);
  const [currency, setCurrency] = useState('EUR');
  const [createdSuccess, setCreatedSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setCurrentUser(data.user);
      })
      .catch(() => {});
  }, []);

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'ceo';

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    platformStore.createProject({
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      description,
      client_name: currentUser?.full_name || 'Action = Matter Commission',
      client_company: clientCompany || 'Executive Enterprise',
      category,
      required_skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      budget_min: Number(budgetMin),
      budget_max: Number(budgetMax),
      currency,
      is_budget_public: true,
      project_type: 'fixed',
      work_mode: 'remote',
      people_required: 1,
      status: 'published',
      created_by: currentUser?.id,
    });

    setCreatedSuccess(true);
    setTitle('');
    setDescription('');
    setClientCompany('');
    setSkills('');
    setTimeout(() => setCreatedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full am-badge-gold text-xs font-semibold uppercase tracking-wider mb-2">
          <PlusCircle className="w-3.5 h-3.5" /> Creation Center
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          {isAdmin ? 'Publish Commission or Event' : 'Showcase Your Work & Portfolio'}
        </h1>
        <p className="text-xs md:text-sm text-gray-400 mt-1 max-w-2xl">
          {isAdmin
            ? 'Publish vetted international project commissions directly to the Skill Network marketplace.'
            : 'Add verified case studies and portfolio accomplishments to your official Skill Network directory listing.'}
        </p>
      </div>

      {isAdmin ? (
        <form onSubmit={handleCreateProject} className="am-card p-6 md:p-8 am-gold-border space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-400" /> New Project Commission
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
              Leadership Privilege
            </span>
          </div>

          {createdSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Project published successfully to the Skill Network marketplace.</span>
            </div>
          )}

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-gray-300 font-medium">Project Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Distributed Consensus Engine"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Client / Organization</label>
                <input
                  type="text"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  placeholder="e.g. Synthetix Labs"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Domain Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                >
                  <option value="Artificial Intelligence & Systems">Artificial Intelligence & Systems</option>
                  <option value="FinTech & Web Architecture">FinTech & Web Architecture</option>
                  <option value="Healthcare & UI/UX">Healthcare & UI/UX</option>
                  <option value="Cloud & Distributed Systems">Cloud & Distributed Systems</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-medium">Required Skills (comma-separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Python, PyTorch, Docker, CUDA"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Min Budget</label>
                <input
                  type="number"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Max Budget</label>
                <input
                  type="number"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-medium">Project Scope & Deliverables</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Detail technical requirements, timeline, and architectural expectations..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                required
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl am-btn-primary text-xs font-bold shadow-md hover:scale-105 transition-all"
            >
              Publish Commission to Network
            </button>
          </div>
        </form>
      ) : (
        <div className="am-card p-6 md:p-8 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" /> Portfolio Submission
          </h2>
          <p className="text-xs text-gray-400">
            Submit your latest technical projects to be included in your verified Skill Network showcase.
          </p>
          <div className="space-y-3 max-w-lg text-xs">
            <input
              type="text"
              placeholder="Project Case Study Title"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
            />
            <textarea
              rows={3}
              placeholder="Summary of architectural contributions and quantified metrics..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
            />
            <button
              onClick={() => alert('Portfolio entry submitted to administration for review.')}
              className="px-5 py-2 rounded-xl am-btn-primary text-xs font-semibold"
            >
              Submit for Verification
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
