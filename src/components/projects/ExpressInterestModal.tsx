'use client';

import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Project } from '@/lib/types';

interface ExpressInterestModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ExpressInterestModal({ project, isOpen, onClose, onSuccess }: ExpressInterestModalProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !project) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please provide a message outlining your background and approach.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/project-interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          message: message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit expression of interest.');
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setMessage('');
        onSuccess();
        onClose();
      }, 1800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error submitting interest.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg am-glass rounded-2xl border border-amber-500/30 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Interest Submitted!</h3>
            <p className="text-xs text-gray-300 max-w-sm mx-auto">
              Your profile and message have been delivered to the Action = Matter project committee for review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Project Opportunity
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">Express Your Interest</h2>
              <p className="text-xs text-gray-400">
                Applying for: <span className="text-amber-200 font-medium">{project.title}</span>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 space-y-1">
              <p className="font-semibold text-white">How selection works:</p>
              <p className="text-gray-400">
                Your professional profile, verified skills, and message are forwarded directly to the CEO/Admin team. If shortlisted, you will receive a direct notification and message to discuss compensation and deliverables.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300">
                Why are you suitable for this project? <span className="text-amber-400">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Highlight your relevant experience, architectural approach, and typical weekly availability..."
                rows={4}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50 transition-colors"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl am-btn-primary text-xs font-semibold shadow-md transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Interest'}
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
