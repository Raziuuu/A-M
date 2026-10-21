'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Search,
  Filter,
  Sparkles,
  MapPin,
  Clock,
  Calendar,
  Lock,
  ArrowRight,
  Send,
  Building,
  CheckCircle2
} from 'lucide-react';
import { platformStore } from '@/lib/store';
import { Profile, Project } from '@/lib/types';
import { ExpressInterestModal } from '@/components/projects/ExpressInterestModal';
import { UpgradeModal } from '@/components/auth/UpgradeModal';

export default function ProjectsPage() {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedWorkMode, setSelectedWorkMode] = useState('');
  const [activeProjectForInterest, setActiveProjectForInterest] = useState<Project | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [userInterests, setUserInterests] = useState<string[]>([]);

  const fetchPlatformData = () => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setCurrentUser(data.user);
          setProjects(platformStore.getProjects());
          const interests = platformStore.getUserInterests(data.user.id);
          setUserInterests(interests.map(i => i.project_id));
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchPlatformData();
  }, []);

  const isFree = currentUser?.role === 'free_user' && currentUser.membership_status !== 'active';

  const categories = Array.from(new Set(projects.map(p => p.category)));

  const filteredProjects = projects.filter(p => {
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (selectedWorkMode && p.work_mode !== selectedWorkMode) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = p.title.toLowerCase().includes(q);
      const matchesDesc = p.description.toLowerCase().includes(q);
      const matchesSkills = p.required_skills.some(s => s.toLowerCase().includes(q));
      const matchesClient = p.client_company?.toLowerCase().includes(q);
      if (!matchesTitle && !matchesDesc && !matchesSkills && !matchesClient) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full am-badge-gold text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Project Commissions
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Discover Projects
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1 max-w-2xl">
            Vetted client commissions reviewed and published by Action = Matter. Express your interest to be reviewed by leadership and selected for execution.
          </p>
        </div>

        <Link
          href="/request-project"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl am-btn-secondary text-xs font-semibold hover:border-amber-400/40"
        >
          Have a Project to Commission?
        </Link>
      </div>

      {/* Free User Alert */}
      {isFree && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-xs text-amber-200">
              Free preview active. To unlock detailed project scopes, client intelligence, and express interest, join the Skill Network.
            </p>
          </div>
          <button
            onClick={() => setUpgradeModalOpen(true)}
            className="px-4 py-2 rounded-xl am-gold-gradient text-black font-bold text-xs shrink-0"
          >
            Become a Premium Member
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl am-card border-white/10">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title, requirement, or stack..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-gray-300 focus:outline-none focus:border-amber-400/50"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedWorkMode}
            onChange={(e) => setSelectedWorkMode(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-gray-300 focus:outline-none focus:border-amber-400/50"
          >
            <option value="">All Work Modes</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">On-Site</option>
          </select>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.map((project) => {
          const hasExpressedInterest = userInterests.includes(project.id);

          return (
            <div
              key={project.id}
              className="am-card p-6 am-gold-border flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-amber-300 font-semibold">
                    {project.category}
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium capitalize">
                    • {project.work_mode}
                  </span>
                  {project.location && (
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-500" /> {project.location}
                    </span>
                  )}
                  <span className="text-[11px] text-gray-500">
                    • Duration: {project.expected_duration}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white hover:text-amber-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2 max-w-3xl leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[10px] uppercase font-bold text-gray-500 mr-1">Skills:</span>
                  {project.required_skills.map((skill) => (
                    <span key={skill} className="px-2.5 py-0.5 rounded-lg bg-black/40 border border-white/10 text-[11px] text-gray-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Side: Budget & Express Interest CTA */}
              <div className="shrink-0 flex flex-col md:items-end justify-between space-y-3 pt-4 md:pt-0 border-t md:border-t-0 border-white/10">
                <div className="md:text-right">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400">Budget Range</p>
                  <p className="text-lg font-extrabold text-white">
                    {project.currency} {project.budget_min?.toLocaleString()} - {project.budget_max?.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-amber-400/80 font-medium">{project.people_required} specialist required</p>
                </div>

                <div className="flex items-center gap-2">
                  {isFree ? (
                    <button
                      onClick={() => setUpgradeModalOpen(true)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl am-btn-primary text-xs font-semibold shadow-md"
                    >
                      <Lock className="w-3.5 h-3.5" /> Unlock Project
                    </button>
                  ) : hasExpressedInterest ? (
                    <span className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4" /> Interest Submitted
                    </span>
                  ) : (
                    <button
                      onClick={() => setActiveProjectForInterest(project)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl am-btn-primary text-xs font-semibold shadow-md transition-all hover:scale-105"
                    >
                      <Send className="w-3.5 h-3.5" /> Interested in this project
                    </button>
                  )}

                  <Link
                    href={isFree ? '/dashboard/upgrade' : `/dashboard/projects/${project.id}`}
                    className="p-2.5 rounded-xl am-btn-secondary text-gray-300 hover:text-white"
                    title="View Full Brief"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="py-16 text-center space-y-3 am-card p-8">
          <Briefcase className="w-10 h-10 text-gray-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No projects match your criteria</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Try resetting your filters or explore other opportunities in the network.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('');
              setSelectedWorkMode('');
            }}
            className="px-4 py-2 rounded-xl am-btn-secondary text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Express Interest Modal */}
      <ExpressInterestModal
        project={activeProjectForInterest}
        isOpen={Boolean(activeProjectForInterest)}
        onClose={() => setActiveProjectForInterest(null)}
        onSuccess={fetchPlatformData}
      />

      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        title="Access Project Opportunities"
        subtitle="Exclusive project opportunities and client compensation are reserved for Action = Matter Skill Network members."
      />
    </div>
  );
}
