import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Users, Briefcase, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Building2 } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#05070a] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full am-badge-gold text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Methodology
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            How Action = Matter Works
          </h1>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">
            Where ideas turn into action. A disciplined, two-sided international ecosystem built for skilled professionals and ambitious clients.
          </p>
        </div>

        {/* Section 1: For Skilled Professionals */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl am-gold-gradient flex items-center justify-center font-black text-black">
              1
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">For Skilled Professionals</h2>
              <p className="text-xs text-amber-300">Monetize your craft and collaborate on real international work</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {[
              { num: '01', title: 'Create Your Account', desc: 'Anyone can register for free. Build your profile, select your country, profession, and foundational skills.' },
              { num: '02', title: 'Join the Skill Network', desc: 'Purchase a Premium membership to have your profile curated into the official People directory and unlock project discovery.' },
              { num: '03', title: 'Build Your Professional Portfolio', desc: 'Add case studies, certifications, hourly rates, and availability for administrative verification.' },
              { num: '04', title: 'Discover Available Projects', desc: 'Browse real client opportunities with transparent budgets, work arrangements, and requirements.' },
              { num: '05', title: 'Express Interest in Projects', desc: 'Submit your tailored proposal and approach. Your credentials are sent directly to the project committee.' },
              { num: '06', title: 'Executive Selection', desc: 'The Action = Matter CEO/Admin reviews applicants and selects the best-fit specialists for each commission.' },
              { num: '07', title: 'Execute & Earn Compensation', desc: 'Collaborate with international peers, deliver milestone specifications, and earn agreed compensation.' },
            ].map((step) => (
              <div key={step.num} className="am-card p-5 am-gold-border space-y-2">
                <span className="font-mono font-bold text-amber-400 text-sm">{step.num}</span>
                <h3 className="text-sm font-bold text-white">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: For Clients & Businesses */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center font-black">
              2
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">For Businesses & Founders</h2>
              <p className="text-xs text-purple-300">Commission vetted international teams with confidence</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {[
              { num: '01', title: 'Tell Us What You Need', desc: 'Submit your technical specifications, timeline, budget range, and preferred work mode.' },
              { num: '02', title: 'Action = Matter Review', desc: 'Our technical leadership inspects feasibility, architecture, and milestones before publication.' },
              { num: '03', title: 'Marketplace Publication', desc: 'Vetted projects are opened to active Skill Network members to express structured interest.' },
              { num: '04', title: 'Curated Team Assembly', desc: 'We identify and shortlist elite professionals with proven domain experience.' },
              { num: '05', title: 'Milestone Delivery', desc: 'Work begins with transparent progress tracking, verified checkpoints, and clear accountability.' },
            ].map((step) => (
              <div key={step.num} className="am-card p-5 border-purple-500/20 space-y-2">
                <span className="font-mono font-bold text-purple-400 text-sm">{step.num}</span>
                <h3 className="text-sm font-bold text-white">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to action */}
        <div className="am-card p-8 am-gold-border text-center space-y-4">
          <h3 className="text-xl font-bold text-white">Ready to Participate?</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Join the Skill Network today or submit your technical requirements for administrative review.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/signup" className="px-6 py-2.5 rounded-xl am-btn-primary text-xs font-bold shadow-md">
              Join the Skill Network
            </Link>
            <Link href="/request-project" className="px-6 py-2.5 rounded-xl am-btn-secondary text-xs font-semibold">
              Submit Project Inquiry
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
