'use client';

import React, { useState, useEffect } from 'react';
import { Compass, CheckCircle2, UserCheck, XCircle, Clock, DollarSign, MessageSquare } from 'lucide-react';
import { platformStore } from '@/lib/store';
import { ProjectInterest } from '@/lib/types';

export default function AdminProjectInterestsPage() {
  const [interests, setInterests] = useState<ProjectInterest[]>([]);
  const [activeInterest, setActiveInterest] = useState<ProjectInterest | null>(null);
  const [compensation, setCompensation] = useState<number>(12000);
  const [notes, setNotes] = useState<string>('');

  const loadInterests = () => {
    setInterests([...platformStore.getProjectInterests()]);
  };

  useEffect(() => {
    loadInterests();
  }, []);

  const handleUpdateStatus = (interestId: string, status: ProjectInterest['status']) => {
    platformStore.updateInterestStatus(interestId, status, notes || undefined, compensation || undefined);
    loadInterests();
    setActiveInterest(null);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Project Interest Applications & Selection
        </h1>
        <p className="text-xs md:text-sm text-gray-400 mt-1">
          Review member expressions of interest, shortlist candidates, finalize compensation milestones, and select lead specialists.
        </p>
      </div>

      <div className="space-y-4">
        {interests.map((interest) => (
          <div key={interest.id} className="am-card p-6 border-purple-500/20 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{interest.profile?.full_name}</span>
                  <span className="text-xs text-amber-300">({interest.profile?.profession})</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                    interest.status === 'selected'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : interest.status === 'shortlisted'
                      ? 'bg-amber-500/20 text-amber-300'
                      : interest.status === 'rejected'
                      ? 'bg-rose-500/20 text-rose-300'
                      : 'bg-white/10 text-gray-300'
                  }`}>
                    {interest.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-gray-200">
                  Project: <span className="text-white">{interest.project?.title}</span>
                </h3>
                <p className="text-[11px] text-gray-400">{interest.profile?.country_name} • Submitted: {new Date(interest.submitted_at).toLocaleDateString()}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus(interest.id, 'shortlisted')}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold"
                >
                  Shortlist
                </button>
                <button
                  onClick={() => handleUpdateStatus(interest.id, 'selected')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold"
                >
                  Select Member
                </button>
                <button
                  onClick={() => handleUpdateStatus(interest.id, 'rejected')}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-semibold"
                >
                  Reject
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1 text-xs">
              <p className="text-[10px] uppercase font-bold text-gray-500">Proposal Statement:</p>
              <p className="text-gray-300 italic">"{interest.message}"</p>
            </div>

            {interest.agreed_compensation && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                <DollarSign className="w-4 h-4" /> Agreed Compensation: {interest.currency} {interest.agreed_compensation.toLocaleString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
