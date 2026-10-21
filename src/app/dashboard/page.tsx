'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Briefcase,
  Users,
  Calendar,
  ArrowRight,
  Shield,
  TrendingUp,
  Lock,
  ArrowUpRight,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { Profile, Project, SkillNetworkMember, Event } from '@/lib/types';
import { UpgradeModal } from '@/components/auth/UpgradeModal';

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<SkillNetworkMember[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState({
    activeProjects: 0,
    skillMembers: 0,
    totalHubs: 0,
    upcomingEvents: 0
  });
  const [loading, setLoading] = useState(true);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [meRes, projRes, membersRes, eventsRes, statsRes] = await Promise.all([
          fetch('/api/auth/me').then(r => r.json()).catch(() => ({ user: null })),
          fetch('/api/projects').then(r => r.json()).catch(() => ({ projects: [] })),
          fetch('/api/skill-network').then(r => r.json()).catch(() => ({ members: [] })),
          fetch('/api/events?filter=upcoming').then(r => r.json()).catch(() => ({ events: [] })),
          fetch('/api/stats').then(r => r.json()).catch(() => ({})),
        ]);

        if (meRes.user) {
          setCurrentUser(meRes.user);
        }
        if (projRes.projects) {
          setProjects(projRes.projects.slice(0, 3));
        }
        if (membersRes.members) {
          setMembers(membersRes.members.slice(0, 3));
        }
        if (eventsRes.events) {
          setEvents(eventsRes.events.slice(0, 2));
        }
        setStats({
          activeProjects: statsRes.activeProjects || projRes.projects?.length || 0,
          skillMembers: statsRes.skillMembers || membersRes.members?.length || 0,
          totalHubs: statsRes.totalHubs || 0,
          upcomingEvents: statsRes.upcomingEvents || eventsRes.events?.length || 0
        });
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const isFree = !currentUser || (currentUser.role === 'free_user' && currentUser.membership_status !== 'active');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Hero Card */}
      <div className="relative overflow-hidden rounded-2xl am-card p-6 md:p-8 am-gold-border border-amber-500/20 bg-gradient-to-r from-[#080b10] via-[#0d121a] to-[#080b10]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full am-badge-gold text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {currentUser?.role === 'premium_member'
                  ? 'Premium Skill Network Member'
                  : currentUser?.role === 'ceo'
                  ? 'CEO / Super Admin'
                  : currentUser?.role === 'admin'
                  ? 'Admin Portal'
                  : 'Free Account (Limited Access)'}
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white">
              Welcome back, <span className="am-gold-text">{currentUser?.full_name || 'Member'}</span>
            </h1>
            <p className="text-sm text-gray-400 max-w-xl">
              {isFree
                ? 'You are viewing the Action = Matter platform. Join the Skill Network to unlock vetted international commissions, messaging, and peer collaborations.'
                : 'Your Skill Network profile is active and verified. Explore available client commissions and connect with international peers.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {isFree ? (
              <button
                onClick={() => setUpgradeModalOpen(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl am-btn-primary text-xs font-bold shadow-lg transition-transform hover:scale-105"
              >
                <Sparkles className="w-4 h-4" /> Become Premium Member
              </button>
            ) : (
              <Link
                href="/dashboard/projects"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl am-btn-primary text-xs font-bold shadow-lg transition-transform hover:scale-105"
              >
                Browse Projects <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            <Link
              href="/dashboard/settings"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl am-btn-secondary text-xs font-semibold"
            >
              Manage Profile
            </Link>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Free User Upgrade Banner Callout */}
      {isFree && (
        <div className="rounded-2xl p-6 bg-gradient-to-r from-amber-950/40 via-black to-amber-950/20 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" /> Unlock the Full Action = Matter Ecosystem
            </h3>
            <p className="text-xs text-gray-300 max-w-2xl">
              Free users cannot appear in the People directory, access commission budgets, or message clients. Plans start at €9 / $10 / ₹899 monthly with instant activation.
            </p>
          </div>
          <button
            onClick={() => setUpgradeModalOpen(true)}
            className="px-5 py-2.5 rounded-xl am-gold-gradient text-black font-bold text-xs shrink-0 shadow-md hover:scale-105 transition-all"
          >
            Upgrade Account Now
          </button>
        </div>
      )}

      {/* High-Level Real Database Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="am-card p-5 space-y-1">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Membership Status</span>
            <Shield className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-bold text-white capitalize">
            {currentUser?.membership_status || 'Inactive'}
          </p>
          <p className="text-[11px] text-gray-500">
            {currentUser?.membership_status === 'active' ? 'Active Membership' : 'Upgrade available'}
          </p>
        </div>

        <div className="am-card p-5 space-y-1">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Live Projects</span>
            <Briefcase className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-bold text-white">
            {stats.activeProjects} Active
          </p>
          <p className="text-[11px] text-gray-500">
            {stats.activeProjects > 0 ? 'Vetted international commissions' : 'No active commissions yet'}
          </p>
        </div>

        <div className="am-card p-5 space-y-1">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Skill Network Members</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-bold text-white">
            {stats.skillMembers} Verified
          </p>
          <p className="text-[11px] text-gray-500">
            {stats.skillMembers > 0 ? 'Curated international network' : 'Directory awaiting members'}
          </p>
        </div>

        <div className="am-card p-5 space-y-1">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Global Hubs</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-bold text-white">
            {stats.totalHubs} Hubs
          </p>
          <p className="text-[11px] text-gray-500">
            {stats.totalHubs > 0 ? 'Regional & industry hubs' : 'No regional hubs yet'}
          </p>
        </div>
      </div>

      {/* Recommended Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-400" /> Featured Project Opportunities
            </h2>
            <p className="text-xs text-gray-400">Commissions submitted by vetted international founders & clients.</p>
          </div>
          <Link
            href={isFree ? '/dashboard/upgrade' : '/dashboard/projects'}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
          >
            View all projects <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="am-card p-8 text-center space-y-2 border-white/5">
            <FolderOpen className="w-8 h-8 text-gray-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">No projects are available right now</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Client commissions will appear here once vetted and published by Action = Matter leadership.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {projects.map((proj) => (
              <div key={proj.id} className="am-card p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2 py-0.5 rounded-full bg-white/5 text-amber-300 font-medium border border-white/10">
                      {proj.category}
                    </span>
                    <span className="text-gray-400">{proj.work_mode}</span>
                  </div>
                  <h3 className="text-base font-bold text-white hover:text-amber-300 transition-colors line-clamp-1">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {proj.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-white/10">
                  <div className="flex flex-wrap gap-1.5">
                    {proj.required_skills?.slice(0, 3).map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-gray-300">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-bold text-white">
                      {proj.currency} {proj.budget_min?.toLocaleString()} - {proj.budget_max?.toLocaleString()}
                    </span>
                    {isFree ? (
                      <button
                        onClick={() => setUpgradeModalOpen(true)}
                        className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300"
                      >
                        <Lock className="w-3 h-3" /> Unlock
                      </button>
                    ) : (
                      <Link
                        href={`/dashboard/projects/${proj.id}`}
                        className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300"
                      >
                        Details & Apply <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Two Column Grid: Skill Network Directory Preview & Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Curated Skill Network Directory */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" /> Skill Network Directory
              </h2>
              <p className="text-xs text-gray-400">Approved, active professionals in the international directory.</p>
            </div>
            <Link
              href={isFree ? '/dashboard/upgrade' : '/dashboard/people'}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              Browse People <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {members.length === 0 ? (
            <div className="am-card p-8 text-center space-y-2 border-white/5">
              <Users className="w-8 h-8 text-gray-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Skill Network members to display yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Members will appear here once approved by Action = Matter administration.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="am-card p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    {member.profile?.avatar_url ? (
                      <img src={member.profile.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover border border-amber-400/30" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-xs border border-amber-500/30">
                        {member.profile?.full_name?.charAt(0) || 'M'}
                      </div>
                    )}
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-white">{member.profile?.full_name}</p>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-semibold">
                          Verified
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">{member.title}</p>
                      <p className="text-[11px] text-gray-500">{member.profile?.country_name} • {member.experience_years}y exp</p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isFree ? (
                      <button
                        onClick={() => setUpgradeModalOpen(true)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs flex items-center gap-1"
                      >
                        <Lock className="w-3 h-3 text-amber-400" />
                      </button>
                    ) : (
                      <Link
                        href={`/dashboard/people/${member.profile?.username}`}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
                      >
                        View Profile
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Flagship Events & Hubs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" /> Events & City Hubs
              </h2>
              <p className="text-xs text-gray-400">Networking summits, tech roundtables, and regional city hubs.</p>
            </div>
            <Link
              href="/dashboard/events"
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              All Events <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="am-card p-8 text-center space-y-2 border-white/5">
              <Calendar className="w-8 h-8 text-gray-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">No upcoming events</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Upcoming international summits and roundtable schedules will be posted here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((e) => (
                <div key={e.id} className="am-card p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                        {e.event_type} • {e.date}
                      </span>
                      <h4 className="text-sm font-bold text-white">{e.title}</h4>
                      <p className="text-xs text-gray-400 line-clamp-1">{e.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-gray-400">
                    <span>{e.location}</span>
                    <Link
                      href="/dashboard/events"
                      className="text-amber-300 font-semibold hover:text-white transition-colors flex items-center gap-1"
                    >
                      RSVP / Join <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
      />
    </div>
  );
}
