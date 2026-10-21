'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, TrendingUp, ShieldCheck, CheckCircle2 } from 'lucide-react';

const SKILL_CATEGORIES = [
  {
    category: 'Artificial Intelligence & Robotics',
    demand: 'Very High',
    skills: ['PyTorch', 'Computer Vision', 'CUDA Optimization', 'Agent Orchestration', 'FastAPI', 'LLM Fine-Tuning', 'TensorRT'],
  },
  {
    category: 'Architecture & Full-Stack Systems',
    demand: 'High',
    skills: ['TypeScript', 'Next.js', 'PostgreSQL', 'Distributed Systems', 'Go', 'Kubernetes', 'GraphQL', 'TailwindCSS'],
  },
  {
    category: 'FinTech & Security Infrastructure',
    demand: 'High',
    skills: ['ISO 20022 Protocols', 'Smart Contract Auditing', 'PCI-DSS Compliance', 'Real-Time FX Pipelines', 'Zero-Trust Architecture'],
  },
  {
    category: 'Product Design & Creative Direction',
    demand: 'Medium - High',
    skills: ['Design Systems', 'Figma Tokenization', 'Enterprise UX', 'Design-to-Code Pipelines', 'Micro-Interactions'],
  },
];

export default function SkillsPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full am-badge-gold text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Skill Taxonomy
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          In-Demand Platform Skills
        </h1>
        <p className="text-xs md:text-sm text-gray-400 mt-1 max-w-2xl">
          Action = Matter tracks project demand metrics across international commissions to align specialists with high-paying client contracts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SKILL_CATEGORIES.map((cat, idx) => (
          <div key={idx} className="am-card p-6 am-gold-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">{cat.category}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                {cat.demand} Demand
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {cat.skills.map((skill) => (
                <span key={skill} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white hover:border-amber-400/30 transition-colors">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
