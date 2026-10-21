'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell, Sparkles, User, Settings, CreditCard, LogOut, ChevronDown, Shield, Menu } from 'lucide-react';
import { Profile } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

interface HeaderProps {
  currentUser: Profile | null;
  onOpenSearch: () => void;
  onOpenUpgradeModal: () => void;
  onToggleMobileSidebar?: () => void;
}

export function Header({
  currentUser,
  onOpenSearch,
  onOpenUpgradeModal,
  onToggleMobileSidebar
}: HeaderProps) {
  const router = useRouter();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const unreadNotificationsCount = 0; // Pure database driven - 0 when empty

  const isFree = !currentUser || (currentUser?.role === 'free_user' && currentUser?.membership_status !== 'active');
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'ceo';

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out notice:', e);
    }
    router.push('/login');
  };

  return (
    <header className="h-16 sm:h-20 bg-[#080b10]/95 backdrop-blur-md border-b border-white/10 px-3.5 sm:px-6 flex items-center justify-between sticky top-0 z-30 w-full">
      {/* Left: Mobile Menu Toggle + Global Search Trigger */}
      <div className="flex items-center gap-2.5 sm:gap-4 flex-1 max-w-md min-w-0">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2.5 -ml-1 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5 text-amber-400" />
          </button>
        )}

        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/30 text-xs text-gray-400 transition-all group min-h-[40px] truncate"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-4 h-4 text-gray-400 group-hover:text-amber-400 transition-colors shrink-0" />
            <span className="truncate hidden xs:inline sm:inline">Search people, projects, events...</span>
            <span className="inline xs:hidden sm:hidden">Search...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-[10px] text-gray-400 font-mono shrink-0 ml-1">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0 ml-2">
        {/* Upgrade pill for free users */}
        {isFree && (
          <button
            onClick={onOpenUpgradeModal}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full am-btn-primary text-xs font-semibold shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" /> Join Skill Network
          </button>
        )}

        {/* Notifications Icon (dot only appears when real unread count > 0) */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 relative transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 am-glass rounded-2xl p-4 am-gold-border shadow-2xl z-50 text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="font-semibold text-white">Notifications</span>
                <span className="text-[10px] text-gray-400">All caught up</span>
              </div>
              <div className="py-4 text-center text-gray-400">
                <p className="text-[11px]">You're all caught up. No unread alerts.</p>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 sm:p-1.5 rounded-xl hover:bg-white/5 transition-all text-left min-h-[44px]"
            aria-label="User menu"
          >
            {currentUser?.avatar_url ? (
              <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 border border-amber-400/30 shrink-0">
                <img src={currentUser.avatar_url} alt="" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-xs border border-amber-500/30 shrink-0">
                {currentUser?.full_name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="hidden md:block text-xs max-w-[120px] truncate">
              <p className="font-medium text-white leading-tight truncate">{currentUser?.full_name || 'Member'}</p>
              <p className="text-[10px] text-amber-400/90 font-medium capitalize truncate">
                {currentUser?.role === 'premium_member'
                  ? 'Skill Network Member'
                  : currentUser?.role === 'ceo'
                  ? 'CEO / Super Admin'
                  : currentUser?.role === 'admin'
                  ? 'Admin'
                  : 'Free Account'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 am-glass rounded-2xl p-2 am-gold-border shadow-2xl z-50 text-xs space-y-1 border border-amber-500/20">
              <div className="p-2.5 border-b border-white/10">
                <p className="font-semibold text-white truncate">{currentUser?.full_name || 'My Account'}</p>
                <p className="text-[11px] text-gray-400 truncate">{currentUser?.email || ''}</p>
              </div>

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 p-2 rounded-lg text-purple-300 hover:text-purple-200 hover:bg-purple-500/10 transition-colors font-medium min-h-[40px]"
                >
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span>Executive Admin</span>
                </Link>
              )}

              <Link
                href="/dashboard/settings"
                onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors min-h-[40px]"
              >
                <User className="w-4 h-4 text-gray-400" />
                <span>My Profile</span>
              </Link>

              <Link
                href="/dashboard/billing"
                onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors min-h-[40px]"
              >
                <CreditCard className="w-4 h-4 text-gray-400" />
                <span>Billing & Membership</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors text-left min-h-[40px]"
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
