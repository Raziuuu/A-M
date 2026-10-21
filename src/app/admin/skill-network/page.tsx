'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, Star, Power, Edit, Check } from 'lucide-react';
import { platformStore } from '@/lib/store';
import { SkillNetworkMember } from '@/lib/types';

export default function AdminSkillNetworkCurationPage() {
  const [members, setMembers] = useState<SkillNetworkMember[]>([]);

  const loadMembers = () => {
    setMembers([...platformStore.getAllSkillMembersForAdmin()]);
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const toggleApproval = (id: string, current: boolean) => {
    platformStore.updateMemberStatus(id, { is_approved: !current });
    loadMembers();
  };

  const toggleFeatured = (id: string, current: boolean) => {
    platformStore.updateMemberStatus(id, { is_featured: !current });
    loadMembers();
  };

  const toggleActive = (id: string, current: boolean) => {
    platformStore.updateMemberStatus(id, { is_active: !current });
    loadMembers();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Skill Network Curation & Directory Moderation
        </h1>
        <p className="text-xs md:text-sm text-gray-400 mt-1">
          Manage inclusion in the official Action = Matter People directory. Only approved and active specialists are visible to international clients.
        </p>
      </div>

      <div className="am-card p-6 border-purple-500/20 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-[10px] uppercase font-bold text-gray-400 border-b border-white/10">
            <tr>
              <th className="py-3 px-2">Specialist</th>
              <th className="py-3 px-2">Title & Country</th>
              <th className="py-3 px-2">Approved</th>
              <th className="py-3 px-2">Featured</th>
              <th className="py-3 px-2">Active in Directory</th>
              <th className="py-3 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-white/5 transition-colors">
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2.5">
                    <img src={member.profile?.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-white">{member.profile?.full_name}</p>
                      <p className="text-[10px] text-gray-500">@{member.profile?.username}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <p className="text-white font-medium">{member.title}</p>
                  <p className="text-[10px] text-gray-400">{member.profile?.country_name}</p>
                </td>
                <td className="py-3 px-2">
                  <button
                    onClick={() => toggleApproval(member.id, member.is_approved)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      member.is_approved
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {member.is_approved ? 'Approved' : 'Pending'}
                  </button>
                </td>
                <td className="py-3 px-2">
                  <button
                    onClick={() => toggleFeatured(member.id, member.is_featured)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      member.is_featured
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-white/10 text-gray-400'
                    }`}
                  >
                    {member.is_featured ? '★ Featured' : 'Normal'}
                  </button>
                </td>
                <td className="py-3 px-2">
                  <button
                    onClick={() => toggleActive(member.id, member.is_active)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      member.is_active
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {member.is_active ? 'Active' : 'Suspended'}
                  </button>
                </td>
                <td className="py-3 px-2 text-right">
                  <span className="text-[10px] text-gray-400 font-mono">
                    {member.verification_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
