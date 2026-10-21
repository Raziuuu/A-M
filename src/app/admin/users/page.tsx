'use client';

import React, { useState, useEffect } from 'react';
import { Users, Shield, Sparkles, Check, UserPlus } from 'lucide-react';
import { platformStore } from '@/lib/store';
import { Profile, UserRole } from '@/lib/types';

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const loadProfiles = () => {
    setProfiles([...platformStore.getProfiles()]);
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const changeRole = (id: string, newRole: UserRole) => {
    platformStore.updateProfile(id, { role: newRole });
    loadProfiles();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          User Directory & RBAC Roles
        </h1>
        <p className="text-xs md:text-sm text-gray-400 mt-1">
          Review all registered accounts, change roles (Free, Premium, Admin, CEO), and control platform permissions.
        </p>
      </div>

      <div className="am-card p-6 border-purple-500/20 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-[10px] uppercase font-bold text-gray-400 border-b border-white/10">
            <tr>
              <th className="py-3 px-2">User</th>
              <th className="py-3 px-2">Email</th>
              <th className="py-3 px-2">Country</th>
              <th className="py-3 px-2">Role</th>
              <th className="py-3 px-2">Membership Status</th>
              <th className="py-3 px-2 text-right">Assign Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {profiles.map((p) => (
              <tr key={p.id} className="hover:bg-white/5 transition-colors">
                <td className="py-3 px-2 font-bold text-white flex items-center gap-2">
                  <img src={p.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
                  {p.full_name}
                </td>
                <td className="py-3 px-2 text-gray-400">{p.email}</td>
                <td className="py-3 px-2 text-gray-300">{p.country_name}</td>
                <td className="py-3 px-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    p.role === 'ceo' || p.role === 'admin'
                      ? 'bg-purple-500/20 text-purple-300'
                      : p.role === 'premium_member'
                      ? 'bg-amber-400/20 text-amber-300'
                      : 'bg-white/10 text-gray-400'
                  }`}>
                    {p.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <span className="capitalize text-gray-400">{p.membership_status}</span>
                </td>
                <td className="py-3 px-2 text-right">
                  <select
                    value={p.role}
                    onChange={(e) => changeRole(p.id, e.target.value as UserRole)}
                    className="px-2 py-1 rounded bg-black/50 border border-white/10 text-[11px] text-gray-300 focus:outline-none"
                  >
                    <option value="free_user">Free User</option>
                    <option value="premium_member">Premium Member</option>
                    <option value="admin">Admin</option>
                    <option value="ceo">CEO</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
