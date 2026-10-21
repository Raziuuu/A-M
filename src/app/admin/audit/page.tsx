'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Clock, Terminal } from 'lucide-react';
import { platformStore } from '@/lib/store';
import { AuditLog } from '@/lib/types';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    setLogs(platformStore.getAuditLogs());
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Security & Governance Audit Trail
        </h1>
        <p className="text-xs md:text-sm text-gray-400 mt-1">
          Immutable event log of critical administrative actions, member verifications, and financial modifications.
        </p>
      </div>

      <div className="am-card p-6 border-purple-500/20 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-[10px] uppercase font-bold text-gray-400 border-b border-white/10">
            <tr>
              <th className="py-3 px-2">Timestamp</th>
              <th className="py-3 px-2">Actor</th>
              <th className="py-3 px-2">Action Event</th>
              <th className="py-3 px-2">Entity Target</th>
              <th className="py-3 px-2">Metadata Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono text-[11px]">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-white/5 transition-colors">
                <td className="py-3 px-2 text-gray-400 whitespace-nowrap">
                  {new Date(log.created_at).toLocaleString()}
                </td>
                <td className="py-3 px-2 text-purple-300 font-bold">
                  {log.actor_name || 'System Engine'}
                </td>
                <td className="py-3 px-2 text-amber-300 font-semibold">
                  {log.action}
                </td>
                <td className="py-3 px-2 text-gray-300">
                  {log.entity} / {log.entity_id?.slice(0, 8)}...
                </td>
                <td className="py-3 px-2 text-gray-400 max-w-xs truncate">
                  {JSON.stringify(log.metadata || {})}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {logs.length === 0 && (
          <div className="py-16 text-center space-y-3 font-sans">
            <Shield className="w-10 h-10 text-gray-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No audit events recorded yet</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Administrative role alterations, project publications, and curation decisions will be permanently logged here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
