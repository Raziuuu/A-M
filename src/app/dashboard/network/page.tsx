'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Network, UserCheck, Briefcase, Calendar, ArrowRight, Activity } from 'lucide-react';
import { platformStore } from '@/lib/store';
import { SkillNetworkMember, Project } from '@/lib/types';

export default function NetworkPage() {
  const [members, setMembers] = useState<SkillNetworkMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setMembers(platformStore.getSkillMembers());
    setProjects(platformStore.getProjects());
  }, []);

  const hasActivity = members.length > 0 || projects.length > 0;

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

        {hasActivity ? (
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="am-card p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">
                      Commission Published: <span className="text-amber-300">{proj.title}</span>
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {proj.client_company || proj.client_name} • Budget: {proj.currency} {proj.budget_min?.toLocaleString()} - {proj.budget_max?.toLocaleString()}
                    </p>
                  </div>
                </div>
                <Link href={`/dashboard/projects/${proj.id}`} className="text-xs text-amber-400 hover:text-white font-medium flex items-center gap-1">
                  View <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}

            {members.map((member) => (
              <div key={member.id} className="am-card p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">
                      Specialist Verified: <span className="text-amber-300">{member.profile?.full_name || member.title}</span>
                    </p>
                    <p className="text-[11px] text-gray-400">{member.title} • {member.profile?.country_name || 'International'}</p>
                  </div>
                </div>
                <Link href={`/dashboard/people/${member.profile?.username || member.id}`} className="text-xs text-amber-400 hover:text-white font-medium flex items-center gap-1">
                  Profile <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-3 am-card p-8">
            <Activity className="w-10 h-10 text-gray-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No activity to display yet</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Newly published client commissions, accredited member arrivals, and chapter summits will stream here live.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
