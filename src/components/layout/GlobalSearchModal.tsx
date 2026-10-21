'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, Users, Briefcase, Calendar, MapPin, Sparkles, ArrowRight, Lock } from 'lucide-react';
import { platformStore } from '@/lib/store';
import { Profile, Project, SkillNetworkMember, Event, Hub } from '@/lib/types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Profile | null;
}

export function GlobalSearchModal({ isOpen, onClose, currentUser }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<SkillNetworkMember[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [hubs, setHubs] = useState<Hub[]>([]);

  const isFree = currentUser?.role === 'free_user' && currentUser.membership_status !== 'active';

  useEffect(() => {
    if (isOpen) {
      Promise.all([
        fetch('/api/projects').then(r => r.json()).catch(() => ({ projects: [] })),
        fetch('/api/skill-network').then(r => r.json()).catch(() => ({ members: [] })),
        fetch('/api/events?filter=upcoming').then(r => r.json()).catch(() => ({ events: [] })),
        fetch('/api/hubs').then(r => r.json()).catch(() => ({ hubs: [] })),
      ]).then(([p, m, e, h]) => {
        if (p.projects) setProjects(p.projects);
        if (m.members) setMembers(m.members);
        if (e.events) setEvents(e.events);
        if (h.hubs) setHubs(h.hubs);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredProjects = q
    ? projects.filter(p => p.title.toLowerCase().includes(q) || p.required_skills.some(s => s.toLowerCase().includes(q)))
    : projects.slice(0, 3);

  const filteredMembers = q
    ? members.filter(m => m.profile?.full_name.toLowerCase().includes(q) || m.title.toLowerCase().includes(q) || m.skills.some(s => s.toLowerCase().includes(q)))
    : members.slice(0, 3);

  const filteredEvents = q
    ? events.filter(e => e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q))
    : events.slice(0, 2);

  const filteredHubs = q
    ? hubs.filter(h => h.name.toLowerCase().includes(q) || h.description.toLowerCase().includes(q))
    : hubs.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl am-glass rounded-2xl border border-amber-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, skills, people, city hubs, events..."
            className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-4 space-y-5 text-xs">
          {/* Projects Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-gray-400 font-medium px-2">
              <span className="flex items-center gap-1.5 text-amber-300">
                <Briefcase className="w-3.5 h-3.5" /> Projects ({filteredProjects.length})
              </span>
              {isFree && (
                <span className="text-[10px] text-amber-400 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Premium Access Required
                </span>
              )}
            </div>

            <div className="space-y-1">
              {filteredProjects.map((proj) => (
                <Link
                  key={proj.id}
                  href={isFree ? '/dashboard/upgrade' : `/dashboard/projects/${proj.id}`}
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-colors group border border-transparent hover:border-amber-400/20"
                >
                  <div className="space-y-0.5">
                    <p className="text-white font-medium group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                      {proj.title}
                      {isFree && <Lock className="w-3 h-3 text-amber-400" />}
                    </p>
                    <p className="text-[11px] text-gray-400 line-clamp-1">{proj.description}</p>
                    <div className="flex items-center gap-1.5 pt-1">
                      {proj.required_skills.slice(0, 3).map((s) => (
                        <span key={s} className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-gray-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-amber-300 shrink-0 ml-3" />
                </Link>
              ))}
            </div>
          </div>

          {/* People Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-gray-400 font-medium px-2">
              <span className="flex items-center gap-1.5 text-amber-300">
                <Users className="w-3.5 h-3.5" /> Skill Network ({filteredMembers.length})
              </span>
            </div>

            <div className="space-y-1">
              {filteredMembers.map((member) => (
                <Link
                  key={member.id}
                  href={isFree ? '/dashboard/upgrade' : `/dashboard/people/${member.profile?.username}`}
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-colors group border border-transparent hover:border-amber-400/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 shrink-0 border border-amber-400/20">
                      <img src={member.profile?.avatar_url} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-white font-medium group-hover:text-amber-300 transition-colors">
                        {member.profile?.full_name}
                      </p>
                      <p className="text-[11px] text-gray-400">{member.title} • {member.profile?.country_name}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-amber-300 shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Events & Hubs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="flex items-center gap-1.5 text-amber-300 px-2 font-medium">
                <Calendar className="w-3.5 h-3.5" /> Upcoming Events
              </span>
              {filteredEvents.map((e) => (
                <Link
                  key={e.id}
                  href="/dashboard/events"
                  onClick={onClose}
                  className="block p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <p className="text-white font-medium line-clamp-1">{e.title}</p>
                  <p className="text-[10px] text-gray-400">{e.date} • {e.location}</p>
                </Link>
              ))}
            </div>

            <div className="space-y-2">
              <span className="flex items-center gap-1.5 text-amber-300 px-2 font-medium">
                <MapPin className="w-3.5 h-3.5" /> Hubs
              </span>
              {filteredHubs.map((h) => (
                <Link
                  key={h.id}
                  href="/dashboard/events?tab=hubs"
                  onClick={onClose}
                  className="block p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <p className="text-white font-medium">{h.name}</p>
                  <p className="text-[10px] text-gray-400">{h.member_count} members</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-black/60 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
          <span>Navigate with <strong>↑</strong> <strong>↓</strong> and <strong>Enter</strong></span>
          <span>Press <strong>ESC</strong> to dismiss</span>
        </div>
      </div>
    </div>
  );
}
