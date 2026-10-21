'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Filter,
  Globe,
  Sparkles,
  MapPin,
  CheckCircle,
  Briefcase,
  ExternalLink,
  Lock,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { platformStore } from '@/lib/store';
import { Profile, SkillNetworkMember } from '@/lib/types';
import { COUNTRIES } from '@/lib/countries';
import { UpgradeModal } from '@/components/auth/UpgradeModal';

export default function PeoplePage() {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [members, setMembers] = useState<SkillNetworkMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [meRes, membersRes] = await Promise.all([
          fetch('/api/auth/me').then(r => r.json()).catch(() => ({ user: null })),
          fetch('/api/skill-network').then(r => r.json()).catch(() => ({ members: [] })),
        ]);
        if (meRes.user) {
          setCurrentUser(meRes.user);
        }
        if (membersRes.members) {
          setMembers(membersRes.members);
        }
      } catch (e) {
        console.error('Failed to load skill members:', e);
      }
    }
    loadData();
  }, []);

  const isFree = currentUser?.role === 'free_user' && currentUser.membership_status !== 'active';

  // Available skills filter list
  const allSkills = Array.from(
    new Set(members.flatMap(m => m.skills))
  );

  const filteredMembers = members.filter(m => {
    if (selectedCountry && m.profile?.country_code !== selectedCountry) return false;
    if (selectedSkill && !m.skills.some(s => s.toLowerCase() === selectedSkill.toLowerCase())) return false;
    if (selectedAvailability && m.availability !== selectedAvailability) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesName = m.profile?.full_name.toLowerCase().includes(q);
      const matchesTitle = m.title.toLowerCase().includes(q);
      const matchesSkill = m.skills.some(s => s.toLowerCase().includes(q));
      const matchesCountry = m.profile?.country_name.toLowerCase().includes(q);
      if (!matchesName && !matchesTitle && !matchesSkill && !matchesCountry) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full am-badge-gold text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Curated Network
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Skill Network Directory
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1 max-w-2xl">
            Official Action = Matter directory of approved, active specialists vetted by administration. Connect, collaborate, and team up on real commissions.
          </p>
        </div>

        {isFree && (
          <button
            onClick={() => setUpgradeModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl am-btn-primary text-xs font-bold shadow-lg"
          >
            <Lock className="w-3.5 h-3.5" /> Join the Directory
          </button>
        )}
      </div>

      {/* Free User Notice */}
      {isFree && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-xs text-amber-200">
              You are browsing in preview mode. Only active Premium members appear in this directory and can message specialists directly.
            </p>
          </div>
          <button
            onClick={() => setUpgradeModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg am-gold-gradient text-black font-bold text-xs shrink-0"
          >
            Upgrade to Premium
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-2xl am-card border-white/10">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, role, skill (e.g. AI, Python)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50"
          />
        </div>

        {/* Skill Filter */}
        <div>
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-gray-300 focus:outline-none focus:border-amber-400/50"
          >
            <option value="">All Skills</option>
            {allSkills.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Country Filter */}
        <div>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-gray-300 focus:outline-none focus:border-amber-400/50"
          >
            <option value="">Global / All Countries</option>
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
            ))}
          </select>
        </div>

        {/* Availability Filter */}
        <div>
          <select
            value={selectedAvailability}
            onChange={(e) => setSelectedAvailability(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-gray-300 focus:outline-none focus:border-amber-400/50"
          >
            <option value="">All Availabilities</option>
            <option value="available">Available Now</option>
            <option value="part_time">Part-Time Open</option>
            <option value="full_time">Full-Time Focus</option>
            <option value="busy">Currently Busy</option>
          </select>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="am-card p-6 flex flex-col justify-between space-y-5 group relative"
          >
            <div>
              {/* Member Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white/10 border border-amber-400/30 shrink-0 group-hover:scale-105 transition-transform shadow-md">
                    <img
                      src={member.profile?.avatar_url}
                      alt={member.profile?.full_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                      {member.profile?.full_name}
                      {member.verification_status === 'verified' && (
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                      )}
                    </h3>
                    <p className="text-xs text-amber-200/90 font-medium line-clamp-1">{member.title}</p>
                    <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-gray-500" />
                      {member.profile?.city ? `${member.profile.city}, ` : ''}{member.profile?.country_name}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                    member.availability === 'available'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {member.availability.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {member.badges.map((b) => (
                  <span key={b} className="text-[10px] font-semibold px-2 py-0.5 rounded-md am-badge-gold">
                    {b}
                  </span>
                ))}
              </div>

              {/* Bio snippet */}
              <p className="text-xs text-gray-400 mt-3 line-clamp-2 leading-relaxed">
                {member.profile?.bio || 'Experienced specialist collaborating with international projects through Action = Matter.'}
              </p>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {member.skills.slice(0, 5).map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-gray-300">
                    {s}
                  </span>
                ))}
                {member.skills.length > 5 && (
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-gray-500">
                    +{member.skills.length - 5}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <span className="text-xs text-gray-400">
                <strong className="text-white">{member.experience_years}</strong> yrs experience
              </span>

              <div className="flex items-center gap-2">
                {isFree ? (
                  <button
                    onClick={() => setUpgradeModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300"
                  >
                    <Lock className="w-3 h-3 text-amber-400" /> View Profile
                  </button>
                ) : (
                  <>
                    <Link
                      href={`/dashboard/messages?to=${member.user_id}`}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-amber-300 transition-colors"
                      title="Send Direct Message"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/dashboard/people/${member.profile?.username}`}
                      className="px-3.5 py-1.5 rounded-xl am-btn-secondary text-xs font-semibold hover:border-amber-400/40"
                    >
                      View Profile
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="py-16 text-center space-y-3 am-card p-8 border-white/5">
          <Users className="w-10 h-10 text-gray-600 mx-auto" />
          <h3 className="text-base font-bold text-white">
            {members.length === 0 ? 'No Skill Network members yet' : 'No members match your criteria'}
          </h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            {members.length === 0
              ? 'Active, approved members will appear in this directory once verified by Action = Matter leadership.'
              : 'Try adjusting your search terms or clearing the country and skill filters.'}
          </p>
          {members.length > 0 && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSkill('');
                setSelectedCountry('');
                setSelectedAvailability('');
              }}
              className="px-4 py-2 rounded-xl am-btn-secondary text-xs font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        title="Access the Skill Network Directory"
        subtitle="Only verified Premium members can browse member portfolios, view contact coordinates, and send messages."
      />
    </div>
  );
}
