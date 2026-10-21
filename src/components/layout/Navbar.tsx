'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Sparkles, ArrowRight, Globe } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full am-glass border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="w-10 h-10 rounded-xl am-gold-gradient flex items-center justify-center font-black text-black text-lg tracking-tighter shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            AM
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base md:text-lg tracking-wider text-white flex items-center gap-1.5">
              ACTION <span className="text-amber-400">=</span> MATTER
            </span>
            <span className="text-[10px] text-gray-400 tracking-widest uppercase font-medium">
              Where Ideas Turn Into Action
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-gray-300">
          <Link href="/how-it-works" className="hover:text-amber-300 transition-colors">
            How It Works
          </Link>
          <Link href="/dashboard/people" className="hover:text-amber-300 transition-colors">
            Skill Network
          </Link>
          <Link href="/dashboard/projects" className="hover:text-amber-300 transition-colors">
            Projects
          </Link>
          <Link href="/pricing" className="hover:text-amber-300 transition-colors">
            Pricing
          </Link>
          <Link href="/dashboard/events" className="hover:text-amber-300 transition-colors">
            Events & Hubs
          </Link>
          <Link href="/request-project" className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-amber-400/40 text-amber-200 transition-all">
            Need Work Done?
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3.5">
          <Link
            href="/login"
            className="text-xs font-medium text-gray-300 hover:text-white px-3 py-2 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl am-btn-primary text-xs font-semibold shadow-md transition-all hover:scale-[1.02]"
          >
            Join Network <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-amber-400" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden am-glass border-b border-white/10 px-4 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-gray-300">
            <Link
              href="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-amber-300 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/dashboard/people"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-amber-300 transition-colors"
            >
              Skill Network
            </Link>
            <Link
              href="/dashboard/projects"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-amber-300 transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-amber-300 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/dashboard/events"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-amber-300 transition-colors"
            >
              Events & Hubs
            </Link>
            <Link
              href="/request-project"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-amber-300 font-semibold"
            >
              Need Work Done? (Submit Project)
            </Link>
          </nav>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl text-center text-xs font-medium text-gray-300 am-btn-secondary"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl text-center text-xs font-semibold am-btn-primary"
            >
              Join the Skill Network
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
