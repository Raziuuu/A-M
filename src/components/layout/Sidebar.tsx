'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Compass,
  Calendar,
  Sparkles,
  MessageSquare,
  Network,
  PlusCircle,
  BarChart3,
  Bot,
  Settings,
  CreditCard,
  Shield,
  Lock,
  ChevronRight,
  Receipt,
  Tag,
  ClipboardList,
  X
} from 'lucide-react';
import { Profile } from '@/lib/types';

interface SidebarProps {
  currentUser: Profile | null;
  onOpenUpgradeModal: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ currentUser, onOpenUpgradeModal, isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isFree = currentUser?.role === 'free_user' && currentUser.membership_status !== 'active';
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'ceo';

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, premiumOnly: false },
    { label: 'People', href: '/dashboard/people', icon: Users, premiumOnly: true },
    { label: 'Projects', href: '/dashboard/projects', icon: Briefcase, premiumOnly: true },
    { label: 'Opportunities', href: '/dashboard/opportunities', icon: Compass, premiumOnly: true },
    { label: 'Events & Hubs', href: '/dashboard/events', icon: Calendar, premiumOnly: false },
    { label: 'Skills', href: '/dashboard/skills', icon: Sparkles, premiumOnly: false },
    { label: 'Messages', href: '/dashboard/messages', icon: MessageSquare, premiumOnly: true },
    { label: 'Network', href: '/dashboard/network', icon: Network, premiumOnly: true },
    { label: 'Create', href: '/dashboard/create', icon: PlusCircle, premiumOnly: true },
    { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3, premiumOnly: true },
    { label: 'AI Command', href: '/dashboard/ai', icon: Bot, premiumOnly: true },
  ];

  const adminItems = [
    { label: 'Overview', href: '/admin', icon: Shield },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Skill Network', href: '/admin/skill-network', icon: Sparkles },
    { label: 'Projects', href: '/admin/projects', icon: Briefcase },
    { label: 'Client Requests', href: '/admin/requests', icon: ClipboardList },
    { label: 'Project Interests', href: '/admin/interests', icon: Compass },
    { label: 'Invoices & Billing', href: '/admin/invoices', icon: Receipt },
    { label: 'Coupons', href: '/admin/coupons', icon: Tag },
    { label: 'Audit Logs', href: '/admin/audit', icon: ClipboardList },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#080b10] border-r border-white/10 flex flex-col justify-between h-full transform transition-transform duration-300 ease-in-out md:static md:w-64 md:h-screen md:shrink-0 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } overflow-y-auto`}
      >
        {/* Top Branding */}
        <div>
          <div className="h-16 sm:h-20 px-4 sm:px-6 flex items-center justify-between border-b border-white/10">
            <Link href="/dashboard" onClick={handleLinkClick} className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl am-gold-gradient flex items-center justify-center font-black text-black text-sm tracking-tighter shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                AM
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm tracking-wider text-white">
                  ACTION <span className="text-amber-400">=</span> MATTER
                </span>
                <span className="text-[9px] text-gray-400 uppercase tracking-widest">
                  Skill Network
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="md:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

        {/* Upgrade Banner for Free Users */}
        {isFree && (
          <div className="p-3 mx-3 my-3 rounded-xl bg-gradient-to-r from-amber-500/15 to-amber-600/5 border border-amber-500/30">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-white">Skill Network Access</p>
                <p className="text-[11px] text-gray-300">Unlock projects, people directory & messaging.</p>
                <button
                  onClick={onOpenUpgradeModal}
                  className="mt-1 w-full py-1.5 rounded-lg am-btn-primary text-[11px] font-bold shadow-sm"
                >
                  Become Premium
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Section */}
        <div className="px-3 py-3 space-y-1">
          <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">
            Platform
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const isLocked = isFree && item.premiumOnly;

            if (isLocked) {
              return (
                <button
                  key={item.label}
                  onClick={onOpenUpgradeModal}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-gray-500 group-hover:text-amber-400 transition-colors" />
                    <span>{item.label}</span>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                    <Lock className="w-2.5 h-2.5" /> Premium
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleLinkClick}
                className={`flex items-center justify-between px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30 font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.label === 'Messages' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Admin Navigation */}
        {isAdmin && (
          <div className="px-3 py-3 border-t border-white/10 space-y-1">
            <div className="px-3 pb-1.5 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                <Shield className="w-3 h-3" /> Admin Command
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-bold">
                {currentUser?.role === 'ceo' ? 'CEO' : 'ADMIN'}
              </span>
            </div>

            {adminItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-purple-500/20 text-purple-200 border border-purple-500/40'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-purple-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Profile & Settings */}
      <div className="p-3 border-t border-white/10 space-y-1 bg-black/30">
        <Link
          href="/dashboard/billing"
          onClick={handleLinkClick}
          className={`flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-medium transition-colors ${
            pathname === '/dashboard/billing' ? 'text-amber-300 bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <CreditCard className="w-4 h-4 text-gray-400" />
          <span>Billing & Membership</span>
        </Link>

        <Link
          href="/dashboard/settings"
          onClick={handleLinkClick}
          className={`flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-medium transition-colors ${
            pathname === '/dashboard/settings' ? 'text-amber-300 bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Settings className="w-4 h-4 text-gray-400" />
          <span>Settings</span>
        </Link>

        {/* Profile Card */}
        <div className="pt-2">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 shrink-0 border border-amber-400/20">
              <img src={currentUser?.avatar_url} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{currentUser?.full_name}</p>
              <div className="flex items-center gap-1">
                <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                  currentUser?.role === 'premium_member'
                    ? 'bg-amber-400/20 text-amber-300'
                    : currentUser?.role === 'ceo' || currentUser?.role === 'admin'
                    ? 'bg-purple-500/20 text-purple-300'
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {currentUser?.role === 'premium_member' ? 'Premium' : currentUser?.role === 'ceo' ? 'CEO' : currentUser?.role === 'admin' ? 'Admin' : 'Free User'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
}
