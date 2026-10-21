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
  ChevronRight
} from 'lucide-react';
import { Profile } from '@/lib/types';
import { RoleSwitcher } from '@/components/ui/RoleSwitcher';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen bg-[#05070a] flex items-center justify-center text-xs text-amber-400">
        Authenticating administrative credentials...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-4">
        <div className="max-w-md w-full am-card p-8 am-gold-border text-center space-y-4">
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
    <div className="min-h-screen bg-[#05070a] text-white flex">
      {/* Admin Sidebar */}
      <aside className="w-64 shrink-0 bg-[#080b10] border-r border-purple-500/20 flex flex-col justify-between h-screen sticky top-0 overflow-y-auto">
        <div>
          <div className="h-20 px-6 flex items-center justify-between border-b border-white/10">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center font-black text-sm">
                AM
              </div>
              <div>
                <span className="font-extrabold text-xs tracking-wider text-white">ADMIN COMMAND</span>
                <p className="text-[9px] text-purple-400 font-bold uppercase">{currentUser?.role}</p>
              </div>
            </Link>
          </div>

          <div className="p-3 space-y-1 text-xs">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
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
            className="flex items-center justify-between p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
          >
            <span>Exit to Member App</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 p-6 lg:p-8 overflow-y-auto">
        {children}
      </div>

      <RoleSwitcher />
    </div>
  );
}
