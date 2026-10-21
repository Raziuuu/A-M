'use client';

import React, { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle2, ArrowRight, Building, Globe, Sparkles } from 'lucide-react';
import { platformStore } from '@/lib/store';
import { ProjectRequest } from '@/lib/types';

export default function AdminProjectRequestsPage() {
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [convertedId, setConvertedId] = useState<string | null>(null);

  const loadRequests = () => {
    setRequests([...platformStore.getProjectRequests()]);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleConvert = async (requestId: string) => {
    const res = await fetch('/api/project-requests', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, action: 'convert' }),
    });
    const data = await res.json();
    if (data.success) {
      setConvertedId(requestId);
      loadRequests();
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Client Project Inquiries
        </h1>
        <p className="text-xs md:text-sm text-gray-400 mt-1">
          Review inbound requirements submitted through the public "Need Work Done?" flow and convert vetted inquiries into published marketplace projects.
        </p>
      </div>

      <div className="space-y-4">
        {requests.map((req) => (
          <div key={req.id} className="am-card p-6 border-purple-500/20 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-300">{req.client_name}</span>
                  {req.client_company && (
                    <span className="text-xs text-gray-400">({req.client_company})</span>
                  )}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                    req.status === 'converted'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {req.status.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{req.title}</h3>
                <p className="text-xs text-gray-400">{req.client_email} • {req.country || 'International'}</p>
              </div>

              <div>
                {req.status === 'pending_review' ? (
                  <button
                    onClick={() => handleConvert(req.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl am-btn-primary text-xs font-bold shadow-md hover:scale-105 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Convert to Live Project
                  </button>
                ) : (
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Converted & Published
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed max-w-3xl whitespace-pre-line">
              {req.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pt-2 border-t border-white/10">
              <span>Budget: <strong className="text-white">{req.budget_range || 'Flexible'}</strong></span>
              <span>•</span>
              <span>Timeline: <strong className="text-white">{req.timeline || 'Immediate'}</strong></span>
              <span>•</span>
              <span>Mode: <strong className="text-white">{req.work_mode}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
