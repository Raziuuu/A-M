'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Compass, Sparkles, Briefcase, Users, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { platformStore } from '@/lib/store';
import { Profile, Project } from '@/lib/types';
import { UpgradeModal } from '@/components/auth/UpgradeModal';

export default function OpportunitiesPage() {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setCurrentUser(data.user);
          setProjects(platformStore.getProjects());
        }
      })
      .catch(() => {});
  }, []);

  const isFree = currentUser?.role === 'free_user' && currentUser.membership_status !== 'active';

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full am-badge-gold text-xs font-semibold uppercase tracking-wider mb-2">
          <Compass className="w-3.5 h-3.5" /> Initiatives
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Opportunities & Initiatives
        </h1>
        <p className="text-xs md:text-sm text-gray-400 mt-1 max-w-2xl">
          Curated opportunities across enterprise commissions, high-impact collaborations, and technical venture partnerships.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="am-card p-6 am-gold-border space-y-4">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-300 flex items-center justify-center font-bold">
            <Briefcase className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Client Project Commissions</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Direct, funded work opportunities submitted by global companies and vetted by Action = Matter leadership.
          </p>
          <Link
            href={isFree ? '/dashboard/upgrade' : '/dashboard/projects'}
            className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-bold hover:text-white"
          >
            Explore Projects <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="am-card p-6 am-gold-border space-y-4">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-300 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Consortium Collaborations</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Team up with complementary specialists in the Skill Network to bid on large-scale international RFP requirements.
          </p>
          <Link
            href={isFree ? '/dashboard/upgrade' : '/dashboard/people'}
            className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-bold hover:text-white"
          >
            Find Partners <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="am-card p-6 am-gold-border space-y-4">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-300 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">City Chapter Leadership</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Represent Action = Matter as a regional hub organizer in Amsterdam, London, San Francisco, or your home city.
          </p>
          <Link
            href="/dashboard/events"
            className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-bold hover:text-white"
          >
            Explore Hubs <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
      />
    </div>
  );
}
