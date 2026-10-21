'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, Eye, Send, Award, Sparkles, TrendingUp, Users } from 'lucide-react';
import { platformStore } from '@/lib/store';
import { Profile } from '@/lib/types';

export default function MemberAnalyticsPage() {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setCurrentUser(data.user);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full am-badge-gold text-xs font-semibold uppercase tracking-wider mb-2">
          <BarChart3 className="w-3.5 h-3.5" /> Performance Intelligence
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Member Analytics
        </h1>
        <p className="text-xs md:text-sm text-gray-400 mt-1 max-w-2xl">
          Track directory visibility, proposal engagement, and leadership review activity.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="am-card p-5 space-y-1">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Profile Impressions</span>
            <Eye className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">482</p>
          <p className="text-[11px] text-emerald-400 font-medium">↑ 18% this month</p>
        </div>

        <div className="am-card p-5 space-y-1">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Project Proposals</span>
            <Send className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">3</p>
          <p className="text-[11px] text-gray-400">1 Shortlisted</p>
        </div>

        <div className="am-card p-5 space-y-1">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Network Connections</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">24</p>
          <p className="text-[11px] text-gray-400">Across 6 countries</p>
        </div>

        <div className="am-card p-5 space-y-1">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Reputation Score</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-300">98 / 100</p>
          <p className="text-[11px] text-gray-400">Verified Specialist</p>
        </div>
      </div>
    </div>
  );
}
