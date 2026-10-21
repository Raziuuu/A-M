'use client';

import React, { useState, useEffect } from 'react';
import { Users, Shield, Sparkles, RefreshCw, Trash2, CheckCircle2, AlertCircle, Search } from 'lucide-react';
import { Profile, UserRole } from '@/lib/types';

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dbSource, setDbSource] = useState<'supabase' | 'local'>('supabase');
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchUsers = async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.profiles) {
        setProfiles(data.profiles);
        setDbSource(data.source || 'supabase');
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeRole = async (id: string, newRole: UserRole) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role: newRole }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfiles(prev => prev.map(p => p.id === id ? { ...p, role: newRole } : p));
        setActionMessage({ text: `Role updated to ${newRole.toUpperCase()} in Supabase`, type: 'success' });
      } else {
        setActionMessage({ text: data.error || 'Failed to update role', type: 'error' });
      }
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Error updating role', type: 'error' });
    }
    setTimeout(() => setActionMessage(null), 3000);
  };

  const deleteUser = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}" from Supabase?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setProfiles(prev => prev.filter(p => p.id !== id));
        setActionMessage({ text: `User "${name}" permanently deleted from Supabase.`, type: 'success' });
      } else {
        setActionMessage({ text: data.error || 'Failed to delete user', type: 'error' });
      }
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Error deleting user', type: 'error' });
    }
    setTimeout(() => setActionMessage(null), 3500);
  };

  const filtered = profiles.filter(p => {
    const q = searchTerm.toLowerCase();
    return (
      p.full_name?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.country_name?.toLowerCase().includes(q) ||
      p.role?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold mb-2 border border-purple-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {dbSource === 'supabase' ? 'Live Supabase DB' : 'Local Memory Store'}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            User Directory & RBAC Roles
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Real-time accounts directly synced with Supabase PostgreSQL (<code className="text-purple-300">public.profiles</code>).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-200 border border-white/10 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Sync Supabase
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
          actionMessage.type === 'success' 
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            : 'bg-red-500/20 text-red-300 border border-red-500/30'
        }`}>
          {actionMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          {actionMessage.text}
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by name, email, country, or role..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
        />
      </div>

      <div className="am-card p-6 border-purple-500/20 overflow-x-auto">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-xs flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-purple-400" />
            Connecting to Supabase and retrieving registered accounts...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white">No Users Found in Supabase</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              {profiles.length === 0 
                ? 'Your Supabase database currently has 0 registered users. When users sign up via the registration page, they will show up here automatically.'
                : 'No registered accounts match your search query.'}
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] uppercase font-bold text-gray-400 border-b border-white/10">
              <tr>
                <th className="py-3 px-3">User</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Country</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Membership Status</th>
                <th className="py-3 px-3">Created</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3 font-bold text-white flex items-center gap-2.5">
                    {p.avatar_url ? (
                      <img src={p.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover border border-white/10" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center text-[11px] border border-purple-500/30">
                        {p.full_name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div>
                      <div>{p.full_name || 'Anonymous User'}</div>
                      <div className="text-[10px] text-gray-500 font-normal">@{p.username || 'user'}</div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-gray-400">{p.email}</td>
                  <td className="py-3 px-3 text-gray-300">{p.country_name || p.country_code || '—'}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      p.role === 'ceo' || p.role === 'admin'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : p.role === 'premium_member'
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                        : 'bg-white/10 text-gray-400 border border-white/10'
                    }`}>
                      {p.role?.replace('_', ' ') || 'free user'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`capitalize text-[11px] font-medium ${
                      p.membership_status === 'active' ? 'text-emerald-400' : 'text-gray-400'
                    }`}>
                      {p.membership_status || 'inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-gray-500 text-[11px]">
                    {p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <select
                        value={p.role}
                        onChange={(e) => changeRole(p.id, e.target.value as UserRole)}
                        className="px-2 py-1 rounded bg-black/60 border border-white/15 text-[11px] text-gray-200 focus:outline-none focus:border-purple-400"
                        title="Change user role"
                      >
                        <option value="free_user">Free User</option>
                        <option value="premium_member">Premium Member</option>
                        <option value="admin">Admin</option>
                        <option value="ceo">CEO</option>
                      </select>

                      <button
                        onClick={() => deleteUser(p.id, p.full_name)}
                        className="p-1 rounded text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete User from Supabase"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
