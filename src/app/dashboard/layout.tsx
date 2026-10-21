'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal';
import { UpgradeModal } from '@/components/auth/UpgradeModal';
import { RoleSwitcher } from '@/components/ui/RoleSwitcher';
import { Profile } from '@/lib/types';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setCurrentUser(data.user);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#05070a] text-white flex">
      {/* Sidebar */}
      <Sidebar
        currentUser={currentUser}
        onOpenUpgradeModal={() => setUpgradeOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header
          currentUser={currentUser}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenUpgradeModal={() => setUpgradeOpen(true)}
        />

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Global Modals */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        currentUser={currentUser}
      />

      <UpgradeModal
        isOpen={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
      />

      {/* Live Role Switcher for instant testing */}
      <RoleSwitcher />
    </div>
  );
}
