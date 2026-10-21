import React from 'react';
import Link from 'next/link';
import { Globe, ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#05070a] text-gray-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand info */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg am-gold-gradient flex items-center justify-center font-bold text-black text-sm">
                AM
              </div>
              <span className="font-extrabold text-base tracking-wider text-white">
                ACTION <span className="text-amber-400">=</span> MATTER
              </span>
            </Link>
            <p className="text-gray-400 text-xs max-w-sm leading-relaxed">
              An international skilled professional network and project marketplace connecting high-caliber talent with real, vetted opportunities. Where ideas turn into action.
            </p>
            <div className="flex items-center gap-3 text-gray-400 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                Network Systems Operational
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-amber-400" /> Multi-Country Supported
              </span>
            </div>
          </div>

          {/* Network */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Network</h4>
            <ul className="space-y-2">
              <li><Link href="/dashboard/people" className="hover:text-amber-300 transition-colors">Skill Network</Link></li>
              <li><Link href="/dashboard/projects" className="hover:text-amber-300 transition-colors">Projects Marketplace</Link></li>
              <li><Link href="/dashboard/events" className="hover:text-amber-300 transition-colors">Events & Hubs</Link></li>
              <li><Link href="/pricing" className="hover:text-amber-300 transition-colors">Membership Pricing</Link></li>
              <li><Link href="/how-it-works" className="hover:text-amber-300 transition-colors">How It Works</Link></li>
            </ul>
          </div>

          {/* Businesses */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">For Clients</h4>
            <ul className="space-y-2">
              <li><Link href="/request-project" className="hover:text-amber-300 transition-colors">Request a Project</Link></li>
              <li><Link href="/request-project" className="hover:text-amber-300 transition-colors">Need Work Done?</Link></li>
              <li><Link href="/how-it-works" className="hover:text-amber-300 transition-colors">Vetting & Selection</Link></li>
              <li><Link href="/contact" className="hover:text-amber-300 transition-colors">Enterprise Inquiries</Link></li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Governance</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="hover:text-amber-300 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-amber-300 transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund-policy" className="hover:text-amber-300 transition-colors">Refund Policy</Link></li>
              <li><Link href="/cookies" className="hover:text-amber-300 transition-colors">Cookie Preferences</Link></li>
              <li><Link href="/contact" className="hover:text-amber-300 transition-colors">Contact Action = Matter</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <p>© {new Date().getFullYear()} ACTION = MATTER Inc. All international rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Amsterdam</span>
            <span>•</span>
            <span>London</span>
            <span>•</span>
            <span>San Francisco</span>
            <span>•</span>
            <span>Zurich</span>
            <span>•</span>
            <span>Berlin</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
