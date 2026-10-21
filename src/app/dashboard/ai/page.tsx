'use client';

import React, { useState, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  Zap,
  Briefcase,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { platformStore } from '@/lib/store';
import { Profile, Project } from '@/lib/types';
import { UpgradeModal } from '@/components/auth/UpgradeModal';

export default function AICommandCenterPage() {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [matchingResult, setMatchingResult] = useState<any>(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: 'Welcome to the Action = Matter AI Command Center. I can evaluate your project fit, optimize your profile, or recommend tactical execution approaches for open commissions.'
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setCurrentUser(data.user);
          const projs = platformStore.getProjects();
          setProjects(projs);
          if (projs.length > 0) setSelectedProjectId(projs[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const isFree = currentUser?.role === 'free_user' && currentUser.membership_status !== 'active';

  const handleRunMatch = async () => {
    if (!selectedProjectId) return;
    setMatchLoading(true);

    const project = projects.find(p => p.id === selectedProjectId);
    if (!project) return;

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'match',
          payload: {
            memberSkills: ['Python', 'PyTorch', 'Distributed Systems', 'CUDA', 'FastAPI'],
            memberExperience: 8,
            projectRequirements: project.required_skills,
            projectDescription: project.description,
          },
        }),
      });
      const data = await res.json();
      if (data.result) setMatchingResult(data.result);
    } catch {
      // error
    } finally {
      setMatchLoading(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: userText }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          payload: { message: userText },
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      }
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'AI Command Center processing error. Please retry.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  if (isFree) {
    return (
      <div className="py-16 text-center space-y-4 max-w-lg mx-auto am-card p-8 am-gold-border">
        <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-white">AI Command Center is a Premium Feature</h2>
        <p className="text-xs text-gray-400 leading-relaxed">
          Access algorithmic project matching, automated proposal drafting, and real-time execution assistance. Upgrade to Premium to activate intelligence tools.
        </p>
        <button
          onClick={() => setUpgradeModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl am-btn-primary text-xs font-bold shadow-lg"
        >
          <Sparkles className="w-4 h-4" /> Unlock AI Command Center
        </button>

        <UpgradeModal
          isOpen={upgradeModalOpen}
          onClose={() => setUpgradeModalOpen(false)}
          title="Unlock AI Command Center"
          subtitle="Leverage AI project matching and tactical recommendations exclusively as an Action = Matter Skill Network member."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full am-badge-gold text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Intelligence Suite
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          AI Command Center
        </h1>
        <p className="text-xs md:text-sm text-gray-400 mt-1 max-w-2xl">
          Algorithmic matching, proposal optimization, and specialized professional assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Project Match & Intelligence Analyzer */}
        <div className="am-card p-6 am-gold-border space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400" /> Commission Fit & Skill Analysis
            </h2>
            <p className="text-xs text-gray-400">
              Evaluate your profile match against any open commission in the marketplace.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-medium text-gray-300">Target Project Commission</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400/50"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.title} ({p.currency} {p.budget_min?.toLocaleString()})</option>
              ))}
            </select>

            <button
              onClick={handleRunMatch}
              disabled={matchLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl am-btn-primary text-xs font-bold shadow-md hover:scale-[1.01] transition-all disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" /> {matchLoading ? 'Analyzing Alignment...' : 'Calculate Commission Alignment'}
            </button>
          </div>

          {matchingResult && (
            <div className="p-4 rounded-xl bg-black/40 border border-amber-400/30 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400">Match Readiness Score</span>
                <span className="text-2xl font-black am-gold-text">{matchingResult.score}%</span>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">
                {matchingResult.reasoning}
              </p>

              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <span className="text-[11px] font-bold text-amber-300">Recommended Enhancements:</span>
                <ul className="space-y-1 text-xs text-gray-400">
                  {matchingResult.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-400">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Right: Specialized Assistant Chat */}
        <div className="am-card p-6 am-gold-border flex flex-col justify-between space-y-4 h-[520px]">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-amber-400" /> Action = Matter Assistant
            </h2>
            <p className="text-xs text-gray-400">
              Interactive guidance for proposal phrasing, milestone structuring, and opportunity discovery.
            </p>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto space-y-3 p-3 rounded-xl bg-black/40 border border-white/10">
            {chatMessages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2 rounded-xl text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'am-gold-gradient text-black font-medium'
                      : 'bg-white/10 text-gray-200 border border-white/10'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="text-xs text-amber-400 flex items-center gap-1.5 animate-pulse">
                <Sparkles className="w-3.5 h-3.5" /> AI analyzing response...
              </div>
            )}
          </div>

          {/* Chat Form */}
          <form onSubmit={handleSendChat} className="flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about project proposals, rates, or market skills..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50"
            />
            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              className="p-2.5 rounded-xl am-btn-primary disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
