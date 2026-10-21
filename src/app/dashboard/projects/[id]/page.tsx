'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Send,
  Building,
  CheckCircle2,
  Lock,
  ShieldAlert,
  Users
} from 'lucide-react';
import { platformStore } from '@/lib/store';
import { Profile, Project } from '@/lib/types';
import { ExpressInterestModal } from '@/components/projects/ExpressInterestModal';
import { UpgradeModal } from '@/components/auth/UpgradeModal';

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [hasExpressedInterest, setHasExpressedInterest] = useState(false);
  const [interestModalOpen, setInterestModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const loadData = () => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setCurrentUser(data.user);
          const found = platformStore.getProjectById(id);
          if (found) {
            setProject(found);
            const userInterests = platformStore.getUserInterests(data.user.id);
            setHasExpressedInterest(userInterests.some(i => i.project_id === found.id));
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const isFree = currentUser?.role === 'free_user' && currentUser.membership_status !== 'active';

  if (!project) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-white">Project Not Found</h2>
        <p className="text-xs text-gray-400">
          This project may have finished selection or been archived by Action = Matter.
        </p>
        <Link href="/dashboard/projects" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl am-btn-secondary text-xs">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Back button */}
      <Link
        href="/dashboard/projects"
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects Discovery
      </Link>

      {/* Main Project Card */}
      <div className="am-card p-6 md:p-8 am-gold-border space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full am-badge-gold font-semibold uppercase tracking-wider">
                {project.category}
              </span>
              <span className="text-gray-400 capitalize">• {project.work_mode}</span>
              <span className="text-emerald-400 font-semibold">• Status: {project.status.replace('_', ' ')}</span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight break-words">
              {project.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs text-gray-400">
              <span className="flex items-center gap-1.5 text-amber-200">
                <Building className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate max-w-[200px]">{project.client_company || project.client_name}</span>
              </span>
              {project.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
                  {project.location}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gray-500 shrink-0" />
                Duration: {project.expected_duration}
              </span>
            </div>
          </div>

          {/* Action CTA */}
          <div className="shrink-0 w-full md:w-auto flex flex-col items-start md:items-end space-y-2 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
            <p className="text-[10px] uppercase font-bold text-gray-400">Commission Budget</p>
            <p className="text-xl sm:text-2xl font-extrabold text-white">
              {project.currency} {project.budget_min?.toLocaleString()} - {project.budget_max?.toLocaleString()}
            </p>

            {isFree ? (
              <button
                onClick={() => setUpgradeModalOpen(true)}
                className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl am-btn-primary text-xs font-bold shadow-lg"
              >
                <Lock className="w-3.5 h-3.5" /> Unlock Application
              </button>
            ) : hasExpressedInterest ? (
              <div className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" /> Interest Registered
              </div>
            ) : (
              <button
                onClick={() => setInterestModalOpen(true)}
                className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl am-btn-primary text-xs font-bold shadow-lg active:scale-95 transition-all"
              >
                <Send className="w-3.5 h-3.5" /> Express Interest
              </button>
            )}
          </div>
        </div>

        {/* Detailed Description */}
        <div className="space-y-3 pt-6 border-t border-white/10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Project Overview</h3>
          <p className="text-sm text-gray-300 leading-relaxed max-w-4xl whitespace-pre-line">
            {project.description}
          </p>
        </div>

        {/* Required Skills */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Required Skills & Stack</h3>
          <div className="flex flex-wrap gap-2">
            {project.required_skills.map((skill) => (
              <span key={skill} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-gray-200">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Administrative & Governance Notice */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs text-gray-400 space-y-1.5">
          <p className="font-semibold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Selection & Compensation Process:
          </p>
          <p>
            Project selection remains under the administrative review of the Action = Matter team. Submitting an expression of interest presents your profile and proposed approach directly to project leaders. Final compensation and agreements are confirmed prior to project kickoff.
          </p>
        </div>
      </div>

      <ExpressInterestModal
        project={project}
        isOpen={interestModalOpen}
        onClose={() => setInterestModalOpen(false)}
        onSuccess={loadData}
      />

      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        title="Apply for Real International Commissions"
        subtitle="Only verified Action = Matter Skill Network members can express interest and work on paid project commissions."
      />
    </div>
  );
}
