'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Receipt, DollarSign, ExternalLink, ShieldCheck } from 'lucide-react';
import { platformStore } from '@/lib/store';
import { Invoice, SupportedCurrency } from '@/lib/types';
import { formatPrice } from '@/lib/countries';

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    setInvoices(platformStore.getInvoices());
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Financial Ledger & Invoices
        </h1>
        <p className="text-xs md:text-sm text-gray-400 mt-1">
          Complete audit trail of international subscription receipts, tax compliance records, and payment gateway transactions.
        </p>
      </div>

      <div className="am-card p-6 border-purple-500/20 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-[10px] uppercase font-bold text-gray-400 border-b border-white/10">
            <tr>
              <th className="py-3 px-2">Invoice #</th>
              <th className="py-3 px-2">Customer</th>
              <th className="py-3 px-2">Description</th>
              <th className="py-3 px-2">Amount</th>
              <th className="py-3 px-2">Gateway</th>
              <th className="py-3 px-2">Date</th>
              <th className="py-3 px-2 text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                <td className="py-3 px-2 font-mono font-medium text-amber-300">{inv.invoice_number}</td>
                <td className="py-3 px-2">
                  <p className="font-bold text-white">{inv.billing_name}</p>
                  <p className="text-[10px] text-gray-400">{inv.billing_country}</p>
                </td>
                <td className="py-3 px-2 text-gray-300">{inv.plan_name}</td>
                <td className="py-3 px-2 font-bold text-white">
                  {formatPrice(inv.total_amount, inv.currency as SupportedCurrency)}
                </td>
                <td className="py-3 px-2 uppercase font-mono text-[10px] text-gray-400">{inv.payment_provider}</td>
                <td className="py-3 px-2 text-gray-400">{new Date(inv.paid_at).toLocaleDateString()}</td>
                <td className="py-3 px-2 text-right">
                  <Link
                    href={`/dashboard/invoices/${inv.id}`}
                    className="text-amber-400 hover:text-white font-semibold inline-flex items-center gap-1"
                  >
                    View <ExternalLink className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
