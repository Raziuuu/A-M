'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, Plus, ExternalLink } from 'lucide-react';
import { platformStore } from '@/lib/store';
import { Project, ProjectStatus } from '@/lib/types';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  const loadProjects = async () => {
    try {
      const res = await fetch('/api/projects?all=true');
      const data = await res.json();
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const changeStatus = async (id: string, newStatus: ProjectStatus) => {
    platformStore.updateProject(id, { status: newStatus });
    loadProjects();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Projects Marketplace Management
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Review live client commissions, update status, and manage marketplace listings.
          </p>
        </div>

        <Link
          href="/dashboard/create"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl am-btn-primary text-xs font-semibold shadow-md"
        >
          <Plus className="w-4 h-4" /> New Commission
        </Link>
      </div>

      <div className="am-card p-6 border-purple-500/20 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-[10px] uppercase font-bold text-gray-400 border-b border-white/10">
            <tr>
              <th className="py-3 px-2">Project</th>
              <th className="py-3 px-2">Client</th>
              <th className="py-3 px-2">Budget</th>
              <th className="py-3 px-2">Applicants</th>
              <th className="py-3 px-2">Marketplace Status</th>
              <th className="py-3 px-2 text-right">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-white/5 transition-colors">
                <td className="py-3.5 px-2 font-bold text-white max-w-xs truncate">{p.title}</td>
                <td className="py-3.5 px-2 text-gray-300">{p.client_company || p.client_name}</td>
                <td className="py-3.5 px-2 text-amber-300 font-semibold">
                  {p.currency} {p.budget_min?.toLocaleString()} - {p.budget_max?.toLocaleString()}
                </td>
                <td className="py-3.5 px-2 text-gray-400">{p.interest_count || 0} proposals</td>
                <td className="py-3.5 px-2">
                  <select
                    value={p.status}
                    onChange={(e) => changeStatus(p.id, e.target.value as ProjectStatus)}
                    className="px-2 py-1 rounded bg-black/50 border border-white/10 text-[11px] text-gray-200 capitalize"
                  >
                    <option value="published">Published</option>
                    <option value="interest_open">Interest Open</option>
                    <option value="selection">Selection</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </td>
                <td className="py-3.5 px-2 text-right">
                  <Link
                    href={`/dashboard/projects/${p.id}`}
                    className="text-amber-400 hover:text-white inline-flex items-center gap-1 font-semibold"
                  >
                    Live <ExternalLink className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {projects.length === 0 && (
          <div className="py-16 text-center space-y-3">
            <Briefcase className="w-10 h-10 text-gray-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No projects published yet</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Marketplace projects and client commissions will appear here. Click "New Commission" above to publish a project.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
