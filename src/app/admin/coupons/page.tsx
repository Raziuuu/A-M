'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, CheckCircle2, ShieldCheck } from 'lucide-react';
import { platformStore } from '@/lib/store';
import { Coupon } from '@/lib/types';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(25);
  const [maxUses, setMaxUses] = useState<number>(500);
  const [successMsg, setSuccessMsg] = useState(false);

  const loadCoupons = () => {
    setCoupons([...platformStore.getCoupons()]);
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    platformStore.createCoupon({
      code: code.trim().toUpperCase(),
      discount_type: discountType,
      discount_value: Number(discountValue),
      max_uses: Number(maxUses),
      max_uses_per_user: 1,
      applicable_plans: ['monthly', 'annual'],
      starts_at: new Date().toISOString(),
      is_active: true,
    });

    setSuccessMsg(true);
    setCode('');
    loadCoupons();
    setTimeout(() => setSuccessMsg(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Coupon & Promo Code Management
        </h1>
        <p className="text-xs md:text-sm text-gray-400 mt-1">
          Create promotional discount codes for monthly and annual Skill Network subscriptions.
        </p>
      </div>

      {/* Coupon Creator */}
      <form onSubmit={handleCreateCoupon} className="am-card p-6 border-purple-500/20 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Tag className="w-4 h-4 text-amber-400" /> Create New Coupon
        </h3>

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Coupon code created and activated for checkout.</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <label className="text-gray-300 font-medium">Coupon Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. VIP30"
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono uppercase focus:outline-none focus:border-amber-400/50"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-gray-300 font-medium">Discount Type</label>
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-gray-300 font-medium">Discount Value</label>
            <input
              type="number"
              value={discountValue}
              onChange={(e) => setDiscountValue(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-gray-300 font-medium">Max Redemptions</label>
            <input
              type="number"
              value={maxUses}
              onChange={(e) => setMaxUses(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2 rounded-xl am-btn-primary text-xs font-semibold shadow-md"
        >
          Create Promo Code
        </button>
      </form>

      {/* Existing Coupons Table */}
      <div className="am-card p-6 border-purple-500/20 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-[10px] uppercase font-bold text-gray-400 border-b border-white/10">
            <tr>
              <th className="py-3 px-2">Code</th>
              <th className="py-3 px-2">Discount</th>
              <th className="py-3 px-2">Usage</th>
              <th className="py-3 px-2">Applicable Plans</th>
              <th className="py-3 px-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-white/5 transition-colors">
                <td className="py-3 px-2 font-mono font-bold text-amber-300">{c.code}</td>
                <td className="py-3 px-2 font-bold text-white">
                  {c.discount_value}{c.discount_type === 'percentage' ? '%' : ''}
                </td>
                <td className="py-3 px-2 text-gray-400">
                  {c.current_uses} / {c.max_uses} used
                </td>
                <td className="py-3 px-2 text-gray-300 capitalize">
                  {c.applicable_plans.join(', ')}
                </td>
                <td className="py-3 px-2">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
