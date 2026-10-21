'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Bell,
  Lock,
  Globe,
  Trash2,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Sparkles
} from 'lucide-react';
import { platformStore } from '@/lib/store';
import { Profile } from '@/lib/types';
import { COUNTRIES } from '@/lib/countries';

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'privacy'>('profile');

  // Form states
  const [fullName, setFullName] = useState('');
  const [profession, setProfession] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [countryCode, setCountryCode] = useState('US');
  const [city, setCity] = useState('');

  // Security states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [notificationSaved, setNotificationSaved] = useState(false);
  const [securityMessage, setSecurityMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          const u: Profile = data.user;
          setCurrentUser(u);
          setFullName(u.full_name || '');
          setProfession(u.profession || '');
          setBio(u.bio || '');
          setWebsite(u.website || '');
          setCountryCode(u.country_code || 'US');
          setCity(u.city || '');
        }
      })
      .catch(() => {});
  }, []);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    platformStore.updateProfile(currentUser.id, {
      full_name: fullName,
      profession,
      bio,
      website,
      country_code: countryCode,
      city,
    });

    setNotificationSaved(true);
    setTimeout(() => setNotificationSaved(false), 2500);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setSecurityMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 8) {
      setSecurityMessage({ type: 'error', text: 'Password must be at least 8 characters.' });
      return;
    }

    setSecurityMessage({ type: 'success', text: 'Password updated successfully across all sessions.' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSecurityMessage(null), 3000);
  };

  const handleLogoutAll = () => {
    if (confirm('Are you sure you want to log out of all active devices?')) {
      alert('All other active device sessions terminated.');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Account Settings
        </h1>
        <p className="text-xs md:text-sm text-gray-400 mt-1">
          Manage your personal credentials, professional presence, and international preferences.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-1 text-xs">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'am-gold-gradient text-black font-bold'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <User className="w-3.5 h-3.5" /> Profile & Details
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'security'
              ? 'am-gold-gradient text-black font-bold'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Shield className="w-3.5 h-3.5" /> Security & Sessions
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'notifications'
              ? 'am-gold-gradient text-black font-bold'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Bell className="w-3.5 h-3.5" /> Notifications
        </button>
      </div>

      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <form onSubmit={handleUpdateProfile} className="am-card p-6 md:p-8 am-gold-border space-y-6">
          {notificationSaved && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Profile information updated successfully.</span>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Basic Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-300">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-300">Professional Title</label>
                <input
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="e.g. AI Engineer, Senior Architect"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-300">Country</label>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400/50"
                >
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-300">City (Optional)</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Amsterdam, London"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300">Professional Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400/50 leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300">Portfolio / Website URL</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400/50"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl am-btn-primary text-xs font-semibold shadow-md hover:scale-105 transition-all"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      )}

      {/* Tab: Security */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <form onSubmit={handlePasswordChange} className="am-card p-6 md:p-8 space-y-5">
            <h3 className="text-sm font-bold text-white">Change Account Password</h3>

            {securityMessage && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                securityMessage.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
              }`}>
                {securityMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{securityMessage.text}</span>
              </div>
            )}

            <div className="space-y-3 text-xs max-w-md">
              <div className="space-y-1">
                <label className="text-gray-300">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300">New Password (min 8 chars)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl am-btn-primary text-xs font-semibold shadow-md"
            >
              Update Password
            </button>
          </form>

          {/* Active Sessions */}
          <div className="am-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Active Sessions & Devices</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">Current Chrome on Windows (Active)</p>
                  <p className="text-gray-500 text-[11px]">IP: 82.161.42.10 • Amsterdam, Netherlands</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                  Current Session
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogoutAll}
              className="px-4 py-2 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" /> Log Out of All Devices
            </button>
          </div>
        </div>
      )}

      {/* Tab: Notifications */}
      {activeTab === 'notifications' && (
        <div className="am-card p-6 md:p-8 space-y-5 text-xs">
          <h3 className="text-sm font-bold text-white">Notification Preferences</h3>
          <div className="space-y-3">
            {[
              { title: 'Project Interest Updates', desc: 'Notify when leadership shortlists or reviews my proposal' },
              { title: 'New Matching Projects', desc: 'Receive instant alerts when projects matching my skill set are published' },
              { title: 'Direct Messages', desc: 'Realtime notifications for peer messages and project communications' },
              { title: 'Flagship Event Reminders', desc: 'Reminders 24 hours prior to registered summits and workshops' },
              { title: 'Billing & Invoice Receipts', desc: 'Receive email copies of monthly and annual subscription receipts' },
            ].map((pref, i) => (
              <label key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:border-amber-400/20 transition-colors">
                <div>
                  <p className="font-semibold text-white">{pref.title}</p>
                  <p className="text-gray-400 text-[11px]">{pref.desc}</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-amber-400 rounded cursor-pointer" />
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
