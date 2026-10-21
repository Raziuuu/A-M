'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell, Sparkles, User, Settings, CreditCard, LogOut, ChevronDown, Check } from 'lucide-react';
import { Profile } from '@/lib/types';

interface HeaderProps {
  currentUser: Profile | null;
  onOpenSearch: () => void;
  onOpenUpgradeModal: () => void;
}

export function Header({ currentUser, onOpenSearch, onOpenUpgradeModal }: HeaderProps) {
  const router = useRouter();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const isFree = currentUser?.role === 'free_user' && currentUser.membership_status !== 'active';

  const handleLogout = async () => {
    // switch to free or guest
    await fetch('/api/auth/me', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'usr_free_001' }),
    });
    router.push('/login');
  };

  return (
    <header className="h-20 bg-[#080b10]/90 backdrop-blur-md border-b border-white/10 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Global Search Trigger */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/30 text-xs text-gray-400 transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-gray-400 group-hover:text-amber-400 transition-colors" />
            <span>Search people, projects, events, skills...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-[10px] text-gray-400 font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Upgrade pill for free users */}
        {isFree && (
          <button
            onClick={onOpenUpgradeModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full am-btn-primary text-xs font-semibold shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" /> Join Skill Network
          </button>
        )}

        {/* Notifications Icon with active badge */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 am-glass rounded-2xl p-4 am-gold-border shadow-2xl z-50 text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="font-semibold text-white">Notifications</span>
                <span className="text-[10px] text-gray-400">All caught up</span>
              </div>
              <div className="py-4 text-center text-gray-400">
                <p className="text-[11px]">No unread alerts or announcements.</p>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-white/5 transition-all text-left"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 border border-amber-400/30">
              <img src={currentUser?.avatar_url} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="hidden lg:block text-xs">
              <p className="font-medium text-white leading-tight">{currentUser?.full_name}</p>
              <p className="text-[10px] text-amber-400/90 font-medium capitalize">
                {currentUser?.role === 'premium_member'
                  ? 'Skill Network Member'
                  : currentUser?.role === 'ceo'
                  ? 'CEO / Super Admin'
                  : currentUser?.role === 'admin'
                  ? 'Admin'
                  : 'Free Account'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 am-glass rounded-2xl p-2 am-gold-border shadow-2xl z-50 text-xs space-y-1 border border-amber-500/20">
              <div className="p-2.5 border-b border-white/10">
                <p className="font-semibold text-white">{currentUser?.full_name}</p>
                <p className="text-[11px] text-gray-400 truncate">{currentUser?.email}</p>
              </div>

              <Link
                href="/dashboard/settings"
                onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <User className="w-4 h-4 text-gray-400" />
                <span>My Profile</span>
              </Link>

              <Link
                href="/dashboard/billing"
                onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <CreditCard className="w-4 h-4 text-gray-400" />
                <span>Billing & Membership</span>
              </Link>

              <Link
                href="/dashboard/settings"
                onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Settings className="w-4 h-4 text-gray-400" />
                <span>Settings</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
