'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { RoleSwitcher } from '@/components/ui/RoleSwitcher';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed.');
      }

      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (presetEmail: string) => {
    setEmail(presetEmail);
    setPassword('Password123!');
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-white flex flex-col justify-center items-center p-4 selection:bg-amber-400 selection:text-black">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Brand Logo Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl am-gold-gradient flex items-center justify-center font-black text-black text-lg shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              AM
            </div>
            <span className="font-extrabold text-lg tracking-wider text-white">
              ACTION <span className="text-amber-400">=</span> MATTER
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white pt-2">
            Sign In to Your Account
          </h1>
          <p className="text-xs text-gray-400">
            Enter your credentials to access the international platform.
          </p>
        </div>

        {/* Login Card */}
        <div className="am-card p-6 md:p-8 am-gold-border space-y-6 bg-[#080b10] shadow-2xl">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-gray-300 font-medium">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-gray-300 font-medium">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-amber-400 hover:text-amber-300 font-medium text-[11px]"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl am-btn-primary text-xs font-bold shadow-lg shadow-amber-500/20 hover:scale-[1.01] transition-transform disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-gray-400">
            Don't have an account yet?{' '}
            <Link href="/signup" className="text-amber-400 font-bold hover:text-amber-300">
              Create an account
            </Link>
          </div>
        </div>
      </div>

      <RoleSwitcher />
    </div>
  );
}
