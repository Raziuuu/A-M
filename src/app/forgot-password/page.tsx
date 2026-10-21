'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2, Shield } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-white flex flex-col justify-center items-center p-4 selection:bg-amber-400 selection:text-black">
      <div className="relative z-10 w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl am-gold-gradient flex items-center justify-center font-black text-black text-lg">
              AM
            </div>
            <span className="font-extrabold text-lg tracking-wider text-white">
              ACTION <span className="text-amber-400">=</span> MATTER
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white pt-2">
            Reset Password
          </h1>
          <p className="text-xs text-gray-400">
            Enter your email to receive secure recovery instructions.
          </p>
        </div>

        <div className="am-card p-6 md:p-8 am-gold-border space-y-5 bg-[#080b10] shadow-2xl">
          {sent ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Recovery Email Dispatched</h3>
              <p className="text-xs text-gray-400">
                If an account exists for <strong className="text-white">{email}</strong>, you will receive password reset instructions.
              </p>
              <div className="pt-2">
                <Link href="/login" className="text-xs text-amber-400 font-bold hover:text-white">
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-gray-300 font-medium">Account Email</label>
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

              <button
                type="submit"
                className="w-full py-3 rounded-xl am-btn-primary text-xs font-bold shadow-md hover:scale-[1.01] transition-transform"
              >
                Send Password Reset Email
              </button>

              <div className="text-center pt-2">
                <Link href="/login" className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
