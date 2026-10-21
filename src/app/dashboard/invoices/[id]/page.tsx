'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Printer, Download, CheckCircle2, ShieldCheck, Globe } from 'lucide-react';
import { platformStore } from '@/lib/store';
import { Invoice, SupportedCurrency } from '@/lib/types';
import { formatPrice } from '@/lib/countries';

export default function InvoiceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const found = platformStore.getInvoiceById(id);
    if (found) setInvoice(found);
  }, [id]);

  if (!invoice) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-white">Invoice Not Found</h2>
        <Link href="/dashboard/billing" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl am-btn-secondary text-xs">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Billing
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      {/* Top Nav & Print Trigger */}
      <div className="flex items-center justify-between no-print">
        <Link
          href="/dashboard/billing"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Invoices
        </Link>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl am-btn-primary text-xs font-semibold shadow-md"
        >
          <Printer className="w-4 h-4" /> Print / Save PDF
        </button>
      </div>

      {/* Invoice Document Sheet */}
      <div className="am-card p-8 md:p-12 am-gold-border space-y-8 bg-[#080b10] shadow-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl am-gold-gradient flex items-center justify-center font-black text-black text-lg">
              AM
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-wider">
                ACTION <span className="text-amber-400">=</span> MATTER
              </h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                International Skilled Professional Network
              </p>
            </div>
          </div>

          <div className="sm:text-right space-y-1">
            <span className="text-xs uppercase font-bold text-gray-400">Tax Invoice</span>
            <p className="text-lg font-mono font-extrabold text-amber-300">{invoice.invoice_number}</p>
            <p className="text-xs text-gray-400">Date: {new Date(invoice.paid_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Billed To & Platform Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase font-bold text-gray-500">Billed To</p>
            <p className="text-sm font-bold text-white">{invoice.billing_name}</p>
            <p className="text-gray-400">{invoice.billing_email}</p>
            {invoice.billing_address && <p className="text-gray-400">{invoice.billing_address}</p>}
            <p className="text-gray-400">{invoice.billing_country}</p>
          </div>

          <div className="sm:text-right space-y-1.5">
            <p className="text-[10px] uppercase font-bold text-gray-500">Issued By</p>
            <p className="text-sm font-bold text-white">Action = Matter Global B.V.</p>
            <p className="text-gray-400">Akerkhof 22, Amsterdam, Netherlands</p>
            <p className="text-gray-400">Tax / VAT ID: NL864198274B01</p>
            <p className="text-gray-400">billing@actionismatter.com</p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 text-[10px] uppercase font-bold text-gray-400">
              <tr>
                <th className="py-3 px-2">Item Description</th>
                <th className="py-3 px-2">Period</th>
                <th className="py-3 px-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="py-4 px-2 font-medium text-white">{invoice.plan_name}</td>
                <td className="py-4 px-2 text-gray-400">{invoice.billing_period}</td>
                <td className="py-4 px-2 text-right font-semibold text-white">
                  {formatPrice(invoice.amount, invoice.currency as SupportedCurrency)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals Breakdown */}
        <div className="pt-4 border-t border-white/10 flex justify-end">
          <div className="w-64 space-y-2 text-xs">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>{formatPrice(invoice.amount, invoice.currency as SupportedCurrency)}</span>
            </div>

            {invoice.discount_amount > 0 && (
              <div className="flex justify-between text-emerald-400 font-medium">
                <span>Discount Applied</span>
                <span>-{formatPrice(invoice.discount_amount, invoice.currency as SupportedCurrency)}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-400">
              <span>Tax / VAT (0% / Reverse Charge)</span>
              <span>{formatPrice(invoice.tax_amount, invoice.currency as SupportedCurrency)}</span>
            </div>

            <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-sm text-white">
              <span>Total Paid</span>
              <span className="text-lg text-amber-300 font-extrabold">
                {formatPrice(invoice.total_amount, invoice.currency as SupportedCurrency)}
              </span>
            </div>
          </div>
        </div>

        {/* Settlement Footer */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>Paid via {invoice.payment_provider.toUpperCase()} (Ref: {invoice.provider_transaction_id || 'TRX-WEBHOOK-VERIFIED'})</span>
          </div>
          <p className="text-[10px] text-gray-500">Thank you for powering the Action = Matter network.</p>
        </div>
      </div>
    </div>
  );
}
