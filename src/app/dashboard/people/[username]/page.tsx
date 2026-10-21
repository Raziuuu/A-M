'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Globe,
  Linkedin,
  Github,
  ShieldCheck,
  Briefcase,
  Sparkles,
  Calendar,
  MessageSquare,
  Award,
  Lock,
  ExternalLink
} from 'lucide-react';
import { platformStore } from '@/lib/store';
import { Profile, SkillNetworkMember } from '@/lib/types';
import { UpgradeModal } from '@/components/auth/UpgradeModal';

export default function MemberProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [member, setMember] = useState<SkillNetworkMember | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setCurrentUser(data.user);
          const found = platformStore.getMemberByUsername(username);
          if (found) setMember(found);
        }
      })
      .catch(() => {});
  }, [username]);

  const isFree = currentUser?.role === 'free_user' && currentUser.membership_status !== 'active';

  if (!member) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-white">Member Profile Not Found</h2>
        <p className="text-xs text-gray-400">
          The specialist you are looking for may have been archived or is awaiting administrative approval.
        </p>
        <Link href="/dashboard/people" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl am-btn-secondary text-xs">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Back button */}
      <Link
        href="/dashboard/people"
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to People Directory
      </Link>

      {/* Main Profile Header Card */}
      <div className="am-card p-6 md:p-8 am-gold-border space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-white/10 border-2 border-amber-400/30 shrink-0 shadow-xl">
              <img
                src={member.profile?.avatar_url}
                alt={member.profile?.full_name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white break-words">
                  {member.profile?.full_name}
                </h1>
                {member.verification_status === 'verified' && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-amber-200/90">{member.title}</p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  {member.profile?.city ? `${member.profile.city}, ` : ''}{member.profile?.country_name}
                </span>
                <span>•</span>
                <span>{member.experience_years} years experience</span>
                <span>•</span>
                <span className="capitalize text-emerald-400 font-medium">{member.availability.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Direct CTA */}
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
            {isFree ? (
              <button
                onClick={() => setUpgradeModalOpen(true)}
                className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl am-btn-primary text-xs font-bold shadow-md active:scale-95 transition-all"
              >
                <Lock className="w-3.5 h-3.5" /> Message Member
              </button>
            ) : (
              <Link
                href={`/dashboard/messages?to=${member.user_id}`}
                className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl am-btn-primary text-xs font-bold shadow-md active:scale-95 transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Send Message
              </Link>
            )}
          </div>
        </div>

        {/* Badges Bar */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
          {member.badges.map((b) => (
            <span key={b} className="px-2.5 py-1 rounded-lg am-badge-gold text-xs font-semibold">
              {b}
            </span>
          ))}
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">About</h3>
          <p className="text-xs md:text-sm text-gray-300 leading-relaxed max-w-3xl">
            {member.profile?.bio}
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
          {member.profile?.website && (
            <a
              href={member.profile.website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-gray-400 hover:text-amber-300 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" /> Website <ExternalLink className="w-3 h-3" />
            </a>
          )}
          {member.profile?.linkedin && (
            <a
              href={member.profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-gray-400 hover:text-amber-300 transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5" /> LinkedIn <ExternalLink className="w-3 h-3" />
            </a>
          )}
          {member.profile?.github && (
            <a
              href={member.profile.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-gray-400 hover:text-amber-300 transition-colors"
            >
              <Github className="w-3.5 h-3.5" /> GitHub <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Skills & Areas of Expertise */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="am-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> Core Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {member.skills.map((skill) => (
              <span key={skill} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-200 font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="am-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-amber-400" /> Areas of Expertise
          </h3>
          <div className="flex flex-wrap gap-2">
            {member.areas_of_expertise.map((area) => (
              <span key={area} className="px-3 py-1.5 rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-medium">
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio Showcase */}
      {member.portfolio_items.length > 0 && (
        <div className="am-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" /> Featured Work & Projects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {member.portfolio_items.map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
                <p className="text-xs text-gray-400">{item.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-black/40 text-[10px] text-gray-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience History */}
      {member.experiences.length > 0 && (
        <div className="am-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" /> Professional Experience
          </h3>
          <div className="space-y-4">
            {member.experiences.map((exp) => (
              <div key={exp.id} className="border-l-2 border-amber-500/40 pl-4 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{exp.role}</h4>
                  <span className="text-[11px] text-gray-500">{exp.period}</span>
                </div>
                <p className="text-xs text-amber-300/80 font-medium">{exp.company}</p>
                <p className="text-xs text-gray-400">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        title="Direct Specialist Communication"
        subtitle="Upgrade to Premium to initiate direct discussions and collaboration with verified Skill Network specialists."
      />
    </div>
  );
}
