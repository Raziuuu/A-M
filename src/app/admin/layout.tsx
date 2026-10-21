'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Shield,
  LayoutDashboard,
  Users,
  Sparkles,
  Briefcase,
  ClipboardList,
  Compass,
  Receipt,
  Tag,
  ArrowLeft,
  Lock,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { Profile } from '@/lib/types';
import { RoleSwitcher } from '@/components/ui/RoleSwitcher';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setCurrentUser(data.user);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'ceo';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070a] flex items-center justify-center text-xs text-amber-400 p-4 text-center">
        Authenticating administrative credentials...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-4">
        <div className="max-w-md w-full am-card p-6 sm:p-8 am-gold-border text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Administrative Access Required</h2>
          <p className="text-xs text-gray-400">
            This sector is restricted to Action = Matter executive staff and administrators. Switch to the CEO persona using the tester widget below to access.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl am-btn-primary text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Member Dashboard
          </Link>
        </div>
        <RoleSwitcher />
      </div>
    );
  }

  const adminNav = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'User Directory', href: '/admin/users', icon: Users },
    { label: 'Skill Network Profiles', href: '/admin/skill-network', icon: Sparkles },
    { label: 'Projects Marketplace', href: '/admin/projects', icon: Briefcase },
    { label: 'Client Requests', href: '/admin/requests', icon: ClipboardList },
    { label: 'Project Applications', href: '/admin/interests', icon: Compass },
    { label: 'Invoices & Finance', href: '/admin/invoices', icon: Receipt },
    { label: 'Coupons & Promos', href: '/admin/coupons', icon: Tag },
    { label: 'Audit Security Logs', href: '/admin/audit', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#05070a] text-white flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden h-16 bg-[#080b10] border-b border-purple-500/20 px-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/20 active:scale-95 transition-transform"
            aria-label="Open admin menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center font-black text-xs">
              AM
            </div>
            <span className="font-extrabold text-xs tracking-wider text-white">ADMIN COMMAND</span>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="text-xs text-gray-400 hover:text-white px-3 py-2 rounded-lg bg-white/5 border border-white/10"
        >
          Exit
        </Link>
      </div>

      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#080b10] border-r border-purple-500/20 flex flex-col justify-between h-full transform transition-transform duration-300 ease-in-out md:static md:w-64 md:h-screen md:shrink-0 md:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } overflow-y-auto`}
      >
        <div>
          <div className="h-16 sm:h-20 px-4 sm:px-6 flex items-center justify-between border-b border-white/10">
            <Link href="/admin" onClick={() => setMobileSidebarOpen(false)} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center font-black text-sm">
                AM
              </div>
              <div>
                <span className="font-extrabold text-xs tracking-wider text-white">ADMIN COMMAND</span>
                <p className="text-[9px] text-purple-400 font-bold uppercase">{currentUser?.role}</p>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              aria-label="Close admin menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-3 space-y-1 text-xs">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 min-h-[44px] rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-purple-500/20 text-purple-200 border border-purple-500/40 font-semibold'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-gray-500'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-white/10 space-y-2 text-xs bg-black/40">
          <Link
            href="/dashboard"
            onClick={() => setMobileSidebarOpen(false)}
            className="flex items-center justify-between p-2.5 min-h-[44px] rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
          >
            <span>Exit to Member App</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
        {children}
      </div>

      <RoleSwitcher />
    </div>
  );
}
