'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  Sparkles,
  ClipboardList,
  Compass,
  ArrowRight,
  Shield,
  CreditCard
} from 'lucide-react';
import { platformStore } from '@/lib/store';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    freeUsers: 0,
    premiumMembers: 0,
    activeProjects: 0,
    pendingRequests: 0,
    interestsCount: 0,
    invoicesCount: 0,
    totalRevenue: '€14,890',
    mrr: '€1,240',
  });

  useEffect(() => {
    async function loadStats() {
      let profiles = platformStore.getProfiles();
      try {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        if (data.profiles) {
          profiles = data.profiles;
        }
      } catch (e) {
        console.warn('Could not fetch remote profiles for admin stats:', e);
      }

      const premium = profiles.filter(p => p.role === 'premium_member' || p.membership_status === 'active');
      const projects = platformStore.getAllProjectsForAdmin();
      const requests = platformStore.getProjectRequests();
      const interests = platformStore.getProjectInterests();
      const invoices = platformStore.getInvoices();

      setStats({
        totalUsers: profiles.length,
        freeUsers: Math.max(0, profiles.length - premium.length),
        premiumMembers: premium.length,
        activeProjects: projects.length,
        pendingRequests: requests.filter(r => r.status === 'pending_review').length,
        interestsCount: interests.length,
        invoicesCount: invoices.length,
        totalRevenue: '€18,240',
        mrr: '€1,420',
      });
    }

    loadStats();
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-purple-500/30">
          <Shield className="w-3.5 h-3.5" /> Executive Command
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Platform Operations & Business Analytics
        </h1>
        <p className="text-xs md:text-sm text-gray-400 mt-1 max-w-2xl">
          Real-time oversight of members, international subscription revenue, marketplace commissions, and client onboarding.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="am-card p-5 space-y-1 border-purple-500/20">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Monthly Recurring (MRR)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">{stats.mrr}</p>
          <p className="text-[11px] text-emerald-400">↑ 14% this month</p>
        </div>

        <div className="am-card p-5 space-y-1 border-purple-500/20">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Premium Members</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">{stats.premiumMembers}</p>
          <p className="text-[11px] text-gray-400">of {stats.totalUsers} registered users</p>
        </div>

        <div className="am-card p-5 space-y-1 border-purple-500/20">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Client Inquiries</span>
            <ClipboardList className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-amber-300">{stats.pendingRequests}</p>
          <p className="text-[11px] text-gray-400">Pending review</p>
        </div>

        <div className="am-card p-5 space-y-1 border-purple-500/20">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Project Proposals</span>
            <Compass className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">{stats.interestsCount}</p>
          <p className="text-[11px] text-gray-400">Submitted by members</p>
        </div>
      </div>

      {/* Quick Operational Management Queues */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="am-card p-6 space-y-3 border-purple-500/20">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-purple-400" /> Client Requests
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Review submitted requirements from companies and convert them into live marketplace projects.
          </p>
          <Link
            href="/admin/requests"
            className="inline-flex items-center gap-1.5 text-xs text-purple-300 font-bold hover:text-white pt-2"
          >
            Review Requests ({stats.pendingRequests}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="am-card p-6 space-y-3 border-purple-500/20">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" /> Member Proposals
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Review expressions of interest from Premium members, shortlist candidates, and select contributors.
          </p>
          <Link
            href="/admin/interests"
            className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-bold hover:text-white pt-2"
          >
            Manage Proposals ({stats.interestsCount}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="am-card p-6 space-y-3 border-purple-500/20">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> Skill Network Curation
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Approve new profiles, award verification badges, feature top specialists, and curate listings.
          </p>
          <Link
            href="/admin/skill-network"
            className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-bold hover:text-white pt-2"
          >
            Curate Network Directory <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
