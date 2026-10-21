'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, User, RefreshCw } from 'lucide-react';
import { Profile } from '@/lib/types';

export function RoleSwitcher() {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) setCurrentUser(data.user);
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const switchRole = async (userId: string) => {
    setLoading(true);
    try {
      await fetch('/api/auth/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      await fetchUser();
      window.location.reload();
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full am-glass am-gold-border text-xs font-medium text-amber-200 hover:text-white shadow-xl transition-all"
          title="Switch Active Persona for Testing"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-gray-400">Persona:</span>
          <span className="font-semibold text-amber-300 capitalize">{currentUser.role.replace('_', ' ')}</span>
          <span className="text-gray-400">({currentUser.full_name.split(' ')[0]})</span>
        </button>
      </div>

      {isOpen && (
        <div className="absolute bottom-12 right-0 w-72 am-glass rounded-xl p-3 am-gold-border shadow-2xl space-y-2 border border-amber-500/20 backdrop-blur-xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-semibold text-gray-300">Live Test Personas</span>
            <span className="text-[10px] text-amber-400/80">Scenario Testing</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <button
              onClick={() => switchRole('usr_free_001')}
              disabled={loading}
              className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all ${
                currentUser.role === 'free_user'
                  ? 'bg-amber-400/15 border border-amber-400/40 text-amber-200'
                  : 'hover:bg-white/5 text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-gray-400" />
                <div>
                  <p className="font-medium">Alex Rivera</p>
                  <p className="text-[10px] text-gray-400">Free User (Locked Network)</p>
                </div>
              </div>
              {currentUser.role === 'free_user' && <span className="text-[10px] text-amber-300 font-bold">ACTIVE</span>}
            </button>

            <button
              onClick={() => switchRole('usr_premium_001')}
              disabled={loading}
              className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all ${
                currentUser.role === 'premium_member'
                  ? 'bg-amber-400/15 border border-amber-400/40 text-amber-200'
                  : 'hover:bg-white/5 text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <div>
                  <p className="font-medium text-white">Elena Rostova</p>
                  <p className="text-[10px] text-amber-300/80">Premium Member (Full Access)</p>
                </div>
              </div>
              {currentUser.role === 'premium_member' && <span className="text-[10px] text-amber-300 font-bold">ACTIVE</span>}
            </button>

            <button
              onClick={() => switchRole('usr_ceo_001')}
              disabled={loading}
              className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all ${
                currentUser.role === 'ceo'
                  ? 'bg-amber-400/15 border border-amber-400/40 text-amber-200'
                  : 'hover:bg-white/5 text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <div>
                  <p className="font-medium text-white">Mahammad Razi</p>
                  <p className="text-[10px] text-purple-300/80">CEO / Super Admin (Full Control)</p>
                </div>
              </div>
              {currentUser.role === 'ceo' && <span className="text-[10px] text-amber-300 font-bold">ACTIVE</span>}
            </button>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400">
            <span>Instant RBAC Testing</span>
            {loading && <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />}
          </div>
        </div>
      )}
    </div>
  );
}
