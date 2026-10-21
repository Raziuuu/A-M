'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Network, Sparkles, UserCheck, Briefcase, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { platformStore } from '@/lib/store';
import { SkillNetworkMember, Project } from '@/lib/types';

export default function NetworkPage() {
  const [members, setMembers] = useState<SkillNetworkMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setMembers(platformStore.getSkillMembers());
    setProjects(platformStore.getProjects());
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full am-badge-gold text-xs font-semibold uppercase tracking-wider mb-2">
          <Network className="w-3.5 h-3.5" /> Connections
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Network Activity & Stream
        </h1>
        <p className="text-xs md:text-sm text-gray-400 mt-1 max-w-2xl">
          Real-time activity across verified specialists, new project commissions, and regional chapter updates.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white">Recent Global Activity</h2>

        <div className="space-y-3">
          <div className="am-card p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">
                  Commission Published: <span className="text-amber-300">Next-Gen Autonomous Agent Platform</span>
                </p>
                <p className="text-[11px] text-gray-400">Synthetix AI Labs (Zurich) • Budget: €18,000 - €25,000</p>
              </div>
            </div>
            <Link href="/dashboard/projects" className="text-xs text-amber-400 hover:text-white font-medium flex items-center gap-1">
              View <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="am-card p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">
                  Specialist Verified: <span className="text-amber-300">Elena Rostova</span>
                </p>
                <p className="text-[11px] text-gray-400">Approved for official Skill Network directory (Berlin, Germany)</p>
              </div>
            </div>
            <Link href="/dashboard/people/erostova" className="text-xs text-amber-400 hover:text-white font-medium flex items-center gap-1">
              Profile <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="am-card p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">
                  Flagship Event Announced: <span className="text-amber-300">Global AI & Real-World Engineering Summit</span>
                </p>
                <p className="text-[11px] text-gray-400">Amsterdam & Online Stream • Nov 18, 2026</p>
              </div>
            </div>
            <Link href="/dashboard/events" className="text-xs text-amber-400 hover:text-white font-medium flex items-center gap-1">
              RSVP <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
