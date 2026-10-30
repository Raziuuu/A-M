'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sparkles,
  Search,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Layers,
  Cpu,
  Film,
  TrendingUp,
  SlidersHorizontal,
  ChevronRight,
  Info,
  Loader2,
  Lock,
  Globe,
  MapPin,
  Clock,
  DollarSign,
  User,
  Shield,
  ExternalLink,
  Code2,
  CheckCheck
} from 'lucide-react';
import { Niche, Skill, ProfileSkill, Profile } from '@/lib/types';
import { V1_NICHES, V1_SKILLS } from '@/lib/expertise';
import { COUNTRIES } from '@/lib/countries';

const ONBOARDING_STEPS = [
  { num: 1, title: 'Account Setup', short: 'Account', desc: 'Confirm your credentials & primary identity' },
  { num: 2, title: 'Professional Profile', short: 'Profile', desc: 'Your headline, title, and public avatar' },
  { num: 3, title: 'Country & Timezone', short: 'Region', desc: 'Your operating location and timezone' },
  { num: 4, title: 'Bio & Experience', short: 'Bio', desc: 'Summary of background, years, and portfolio links' },
  { num: 5, title: 'Network Preferences', short: 'Preferences', desc: 'Availability status and preferred collaboration styles' },
  { num: 6, title: 'Availability & Rates', short: 'Rates', desc: 'Standard hourly rates and project scope' },
  { num: 7, title: 'What is your expertise?', short: 'Expertise', desc: 'Standardized skill catalog selection across niches' },
  { num: 8, title: 'Membership & Launch', short: 'Launch', desc: 'Review completed dossier and launch profile' },
];

const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=AM_Master1',
  'https://api.dicebear.com/7.x/bottts/svg?seed=AM_Architect',
  'https://api.dicebear.com/7.x/bottts/svg?seed=AM_Director',
  'https://api.dicebear.com/7.x/bottts/svg?seed=AM_Leader',
  'https://api.dicebear.com/7.x/bottts/svg?seed=AM_Producer',
];

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active step & max reached step state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxStepReached, setMaxStepReached] = useState<number>(1);
  const [stepLockedWarning, setStepLockedWarning] = useState<string | null>(null);

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Step 1 Form: Account
  const [step1FullName, setStep1FullName] = useState('');
  const [step1Username, setStep1Username] = useState('');
  const [step1Email, setStep1Email] = useState('');

  // Step 2 Form: Profile
  const [step2Profession, setStep2Profession] = useState('');
  const [step2AvatarUrl, setStep2AvatarUrl] = useState('');

  // Step 3 Form: Region
  const [step3CountryCode, setStep3CountryCode] = useState('US');
  const [step3City, setStep3City] = useState('');
  const [step3Timezone, setStep3Timezone] = useState('UTC');

  // Step 4 Form: Bio & Experience
  const [step4Bio, setStep4Bio] = useState('');
  const [step4Years, setStep4Years] = useState<number>(4);
  const [step4Website, setStep4Website] = useState('');
  const [step4Linkedin, setStep4Linkedin] = useState('');
  const [step4Github, setStep4Github] = useState('');

  // Step 5 Form: Preferences
  const [step5Availability, setStep5Availability] = useState('available');
  const [step5NichePreference, setStep5NichePreference] = useState('Technology, AI & Automation');

  // Step 6 Form: Rates
  const [step6Rate, setStep6Rate] = useState<number>(120);
  const [step6Currency, setStep6Currency] = useState('USD');

  // Step 7 Catalog state
  const [niches, setNiches] = useState<Niche[]>(V1_NICHES);
  const [skills, setSkills] = useState<Skill[]>(V1_SKILLS);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  // Step 7 Selection state: Map of skillId -> ProfileSkill
  const [selectedSkillsMap, setSelectedSkillsMap] = useState<Map<string, ProfileSkill>>(new Map());
  const [existingLoadedCount, setExistingLoadedCount] = useState<number>(0);
  const [userSkillsLoading, setUserSkillsLoading] = useState(true);

  // Step 7 Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNicheFilter, setActiveNicheFilter] = useState<string>('all');

  // Form mutation states
  const [savingStep, setSavingStep] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Step 7 Suggestion modal state
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [suggestName, setSuggestName] = useState('');
  const [suggestNicheId, setSuggestNicheId] = useState<string>('b1000000-0000-0000-0000-000000000001');
  const [suggestSubmitting, setSuggestSubmitting] = useState(false);
  const [suggestSuccess, setSuggestSuccess] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  // Step 7 Detail drawer state
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);

  // 1. Load initial user and onboarding state from server
  useEffect(() => {
    async function loadOnboardingState() {
      try {
        const res = await fetch('/api/onboarding/step');
        if (!res.ok) {
          if (res.status === 401) {
            router.push('/login?redirect=/onboarding');
            return;
          }
          throw new Error('Failed to load onboarding profile');
        }

        const data = await res.json();
        if (data.user) {
          const u = data.user;
          setCurrentUser(u);

          // Populate step forms
          setStep1FullName(u.full_name || '');
          setStep1Username(u.username || '');
          setStep1Email(u.email || '');

          setStep2Profession(u.profession || '');
          setStep2AvatarUrl(u.avatar_url || PRESET_AVATARS[0]);

          setStep3CountryCode(u.country_code || 'US');
          setStep3City(u.city || '');
          setStep3Timezone(u.timezone || 'UTC');

          setStep4Bio(u.bio || '');
          setStep4Website(u.website || '');
          setStep4Linkedin(u.linkedin || '');
          setStep4Github(u.github || '');

          if (data.member) {
            setStep4Years(data.member.experience_years || 4);
            setStep5Availability(data.member.availability || 'available');
            setStep6Rate(Number(data.member.hourly_rate) || 120);
            setStep6Currency(data.member.currency || 'USD');
          }

          const serverMax = data.maxStepReached || 1;
          setMaxStepReached(serverMax);

          // Determine current step from URL param if valid, else clamp to maxStepReached
          const param = searchParams?.get('step');
          if (param) {
            const parsed = parseInt(param, 10);
            if (parsed >= 1 && parsed <= serverMax) {
              setCurrentStep(parsed);
            } else if (parsed > serverMax) {
              setCurrentStep(serverMax);
              setStepLockedWarning(`Please complete Step ${serverMax} before proceeding to later steps.`);
            } else {
              setCurrentStep(1);
            }
          } else {
            setCurrentStep(serverMax);
          }
        }
      } catch (err: unknown) {
        console.warn('Error loading onboarding state:', err);
      } finally {
        setAuthLoading(false);
      }
    }

    loadOnboardingState();
  }, [router, searchParams]);

  // 2. Fetch catalog from server API (with local fallback)
  useEffect(() => {
    setCatalogLoading(true);
    setCatalogError(null);
    fetch('/api/expertise/catalog')
      .then(res => {
        if (!res.ok) throw new Error('Could not load expertise catalog.');
        return res.json();
      })
      .then(data => {
        if (data.niches && Array.isArray(data.niches)) {
          setNiches(data.niches);
        }
        if (data.skills && Array.isArray(data.skills)) {
          setSkills(data.skills);
        }
      })
      .catch(err => {
        console.warn('Catalog API fallback to bundled V1 catalog:', err);
        setNiches(V1_NICHES);
        setSkills(V1_SKILLS);
      })
      .finally(() => {
        setCatalogLoading(false);
      });
  }, []);

  // 3. Load user's saved profile skills
  useEffect(() => {
    setUserSkillsLoading(true);
    fetch('/api/expertise/user')
      .then(res => {
        if (!res.ok) return { profileSkills: [] };
        return res.json();
      })
      .then(data => {
        if (data.profileSkills && Array.isArray(data.profileSkills)) {
          const map = new Map<string, ProfileSkill>();
          data.profileSkills.forEach((ps: ProfileSkill) => {
            map.set(ps.skill_id, ps);
          });
          setSelectedSkillsMap(map);
          setExistingLoadedCount(map.size);
        }
      })
      .catch(err => {
        console.warn('Error loading user profile skills:', err);
      })
      .finally(() => {
        setUserSkillsLoading(false);
      });
  }, []);

  // Safe navigation function: blocks forward jumping to uncompleted steps
  const navigateToStep = (targetStep: number) => {
    if (targetStep > maxStepReached) {
      setStepLockedWarning(`Step ${targetStep} is locked. You must complete Step ${maxStepReached} first.`);
      return;
    }

    setStepLockedWarning(null);
    setStepError(null);
    setCurrentStep(targetStep);

    const url = new URL(window.location.href);
    url.searchParams.set('step', targetStep.toString());
    window.history.pushState({}, '', url.toString());
  };

  // Generic Step Submit Handler
  const handleSaveStep = async (stepNum: number, payload: any) => {
    setSavingStep(true);
    setStepError(null);
    setStepLockedWarning(null);

    try {
      const res = await fetch('/api/onboarding/step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: stepNum,
          data: payload,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Failed to save Step ${stepNum}`);
      }

      const next = Math.min(stepNum + 1, 8);
      setMaxStepReached(prev => Math.max(prev, next));
      navigateToStep(next);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating step.';
      setStepError(msg);
    } finally {
      setSavingStep(false);
    }
  };

  // Step 7 Save Expertise Handler
  const handleSaveExpertise = async () => {
    if (selectedSkillsMap.size === 0) {
      setStepError('Please select at least one skill or specialization from the catalog to continue.');
      return;
    }

    setSavingStep(true);
    setStepError(null);
    setSaveSuccessMessage(null);

    try {
      const payloadSkills = Array.from(selectedSkillsMap.values()).map(ps => ({
        skill_id: ps.skill_id,
        level: ps.level || 'intermediate',
        years_experience: ps.years_experience || 2,
        note: ps.note || '',
      }));

      const res = await fetch('/api/expertise/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: payloadSkills }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save selected skills.');
      }

      setMaxStepReached(prev => Math.max(prev, 8));
      navigateToStep(8);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving expertise.';
      setStepError(msg);
    } finally {
      setSavingStep(false);
    }
  };

  // Filter skills based on search query and active niche tab
  const filteredSkills = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return skills.filter(skill => {
      if (skill.status !== 'active') return false;
      if (activeNicheFilter !== 'all' && skill.niche_id !== activeNicheFilter) return false;

      if (!q) return true;
      if (skill.name.toLowerCase().includes(q)) return true;
      if (skill.subcategory && skill.subcategory.toLowerCase().includes(q)) return true;
      if (skill.aliases && skill.aliases.some(alias => alias.toLowerCase().includes(q))) return true;
      if (skill.description && skill.description.toLowerCase().includes(q)) return true;

      return false;
    });
  }, [skills, searchQuery, activeNicheFilter]);

  // Group filtered skills by subcategory
  const groupedSkills = useMemo(() => {
    const groups: { [key: string]: Skill[] } = {};
    filteredSkills.forEach(skill => {
      const key = skill.subcategory || 'General';
      if (!groups[key]) groups[key] = [];
      groups[key].push(skill);
    });
    return groups;
  }, [filteredSkills]);

  // Toggle skill selection
  const handleToggleSkill = (skill: Skill) => {
    setSelectedSkillsMap(prev => {
      const next = new Map(prev);
      if (next.has(skill.id)) {
        next.delete(skill.id);
        if (editingSkillId === skill.id) setEditingSkillId(null);
      } else {
        next.set(skill.id, {
          id: `temp_${skill.id}`,
          profile_id: currentUser?.id || '',
          skill_id: skill.id,
          level: 'intermediate',
          years_experience: 2,
          note: '',
          skill,
        });
      }
      return next;
    });
    setStepError(null);
  };

  // Remove single skill from chips
  const handleRemoveSkill = (skillId: string) => {
    setSelectedSkillsMap(prev => {
      const next = new Map(prev);
      next.delete(skillId);
      if (editingSkillId === skillId) setEditingSkillId(null);
      return next;
    });
  };

  // Submit missing expertise suggestion
  const handleSubmitSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestName.trim()) {
      setSuggestError('Please provide a skill or specialization name.');
      return;
    }

    setSuggestSubmitting(true);
    setSuggestError(null);
    setSuggestSuccess(false);

    try {
      const res = await fetch('/api/expertise/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: suggestName.trim(),
          niche_id: suggestNicheId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit expertise suggestion.');
      }

      setSuggestSuccess(true);
      setTimeout(() => {
        setIsSuggestModalOpen(false);
        setSuggestSuccess(false);
        setSuggestName('');
      }, 1600);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error submitting suggestion.';
      setSuggestError(msg);
    } finally {
      setSuggestSubmitting(false);
    }
  };

  const selectedArray = Array.from(selectedSkillsMap.values());

  const getNicheIcon = (slug: string) => {
    if (slug.includes('technology')) return <Cpu className="w-3.5 h-3.5 text-amber-400" />;
    if (slug.includes('film')) return <Film className="w-3.5 h-3.5 text-purple-400" />;
    return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-white flex flex-col selection:bg-amber-400 selection:text-black">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Bar */}
      <header className="relative z-20 border-b border-white/10 bg-[#080b10]/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg am-gold-gradient flex items-center justify-center font-black text-black text-sm shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            AM
          </div>
          <span className="font-extrabold text-sm tracking-wider text-white">
            ACTION <span className="text-amber-400">=</span> MATTER
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 hidden sm:inline">
            Step-by-Step Onboarding
          </span>
          <span className="px-2.5 py-1 rounded-full am-badge-gold text-[10px] font-bold tracking-wider uppercase">
            Step {currentStep} of 8
          </span>
          {currentUser && (
            <span className="text-xs text-gray-400 border-l border-white/10 pl-3 hidden md:inline">
              {currentUser.full_name}
            </span>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-6">
        {/* ========================================================== */}
        {/* PROGRESS INDICATOR WITH STRICT STEP-BY-STEP LOCKING */}
        {/* ========================================================== */}
        <section aria-label="Onboarding Progress" className="space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-400 px-1">
            <span className="font-semibold text-gray-300">
              Onboarding Progress: {Math.round((currentStep / 8) * 100)}% Complete
            </span>
            <span>
              Step {currentStep} of 8:{' '}
              <strong className="text-amber-400">{ONBOARDING_STEPS[currentStep - 1]?.title}</strong>
            </span>
          </div>

          {/* Progress bar track */}
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full am-gold-gradient transition-all duration-500 rounded-full"
              style={{ width: `${(currentStep / 8) * 100}%` }}
            />
          </div>

          {/* 8-Step Breadcrumb Bar (Enforces: Cannot jump to locked future steps) */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 sm:gap-2 pt-1">
            {ONBOARDING_STEPS.map(step => {
              const isPast = step.num < currentStep;
              const isCurrent = step.num === currentStep;
              const isUnlocked = step.num <= maxStepReached;

              return (
                <button
                  key={step.num}
                  type="button"
                  disabled={!isUnlocked}
                  onClick={() => navigateToStep(step.num)}
                  title={
                    isUnlocked
                      ? `${step.num}. ${step.title}`
                      : `Locked: Complete Step ${maxStepReached} first`
                  }
                  className={`text-left p-2 rounded-xl border text-[11px] transition-all flex flex-col gap-1 select-none ${
                    isCurrent
                      ? 'bg-amber-400/10 border-amber-400/50 shadow-md shadow-amber-500/10 text-white font-bold ring-1 ring-amber-400/30'
                      : isPast
                      ? 'bg-white/5 border-white/10 text-gray-300 hover:border-amber-400/30 hover:bg-white/10 cursor-pointer'
                      : isUnlocked
                      ? 'bg-black/30 border-white/10 text-gray-400 hover:text-white cursor-pointer'
                      : 'bg-black/40 border-white/5 text-gray-600 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] opacity-80">0{step.num}</span>
                    {isPast ? (
                      <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                    ) : !isUnlocked ? (
                      <Lock className="w-2.5 h-2.5 text-gray-600 shrink-0" />
                    ) : null}
                  </div>
                  <span className="truncate leading-tight text-[10px] sm:text-[11px]">
                    {step.short}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Locked warning banner */}
        {stepLockedWarning && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{stepLockedWarning}</span>
            </div>
            <button
              onClick={() => setStepLockedWarning(null)}
              className="text-amber-400 hover:text-amber-200 text-[11px] underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Global Step Error */}
        {stepError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{stepError}</span>
          </div>
        )}

        {/* ========================================================== */}
        {/* STEP 1: ACCOUNT SETUP */}
        {/* ========================================================== */}
        {currentStep === 1 && (
          <section className="space-y-6 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                Step 01 / 08
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Account Credentials & Identity
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">
                Confirm your account credentials and system identity before completing your specialist profile.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveStep(1, { full_name: step1FullName, username: step1Username });
              }}
              className="am-card p-6 md:p-8 am-gold-border space-y-5 bg-[#080b10]"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-medium">Full Legal / Professional Name *</label>
                  <input
                    type="text"
                    required
                    value={step1FullName}
                    onChange={(e) => setStep1FullName(e.target.value)}
                    placeholder="e.g. David Kim"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-300 font-medium">Unique Platform Username *</label>
                  <input
                    type="text"
                    required
                    value={step1Username}
                    onChange={(e) => setStep1Username(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="e.g. davidkim"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="text-gray-300 font-medium">Email Address (Registered Account)</label>
                <input
                  type="email"
                  disabled
                  value={step1Email}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 cursor-not-allowed"
                />
                <p className="text-[10px] text-gray-500">
                  Primary notification channel for client inquiries, contracts, and platform releases.
                </p>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/10">
                <button
                  type="submit"
                  disabled={savingStep}
                  className="px-6 py-2.5 rounded-xl am-btn-primary text-xs font-bold flex items-center gap-2 shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  {savingStep ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Next: Professional Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </section>
        )}

        {/* ========================================================== */}
        {/* STEP 2: PROFESSIONAL PROFILE */}
        {/* ========================================================== */}
        {currentStep === 2 && (
          <section className="space-y-6 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                Step 02 / 08
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Professional Headline & Public Avatar
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">
                How you appear to enterprise clients and international creative directors on the platform.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveStep(2, { profession: step2Profession, avatar_url: step2AvatarUrl });
              }}
              className="am-card p-6 md:p-8 am-gold-border space-y-6 bg-[#080b10]"
            >
              <div className="space-y-2 text-xs">
                <label className="text-gray-300 font-medium">Professional Title / Headline *</label>
                <input
                  type="text"
                  required
                  value={step2Profession}
                  onChange={(e) => setStep2Profession(e.target.value)}
                  placeholder="e.g. Senior Full-Stack Architect & AI Specialist"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50"
                />
                <p className="text-[10px] text-gray-500">
                  Visible on your public Skill Network card and project proposals.
                </p>
              </div>

              {/* Avatar Selector */}
              <div className="space-y-3 text-xs">
                <label className="text-gray-300 font-medium">Select Avatar or Custom Image URL</label>
                <div className="flex flex-wrap items-center gap-3">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setStep2AvatarUrl(url)}
                      className={`w-14 h-14 rounded-2xl border p-1 transition-all ${
                        step2AvatarUrl === url
                          ? 'border-amber-400 bg-amber-400/20 ring-2 ring-amber-400/40 scale-105'
                          : 'border-white/10 bg-black/30 hover:border-white/30'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Avatar ${idx + 1}`} className="w-full h-full rounded-xl" />
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <input
                    type="url"
                    value={step2AvatarUrl}
                    onChange={(e) => setStep2AvatarUrl(e.target.value)}
                    placeholder="Or paste custom image URL (https://...)"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-amber-400/50"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => navigateToStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  type="submit"
                  disabled={savingStep}
                  className="px-6 py-2.5 rounded-xl am-btn-primary text-xs font-bold flex items-center gap-2 shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  {savingStep ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Next: Region & Timezone</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </section>
        )}

        {/* ========================================================== */}
        {/* STEP 3: REGION & TIMEZONE */}
        {/* ========================================================== */}
        {currentStep === 3 && (
          <section className="space-y-6 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                Step 03 / 08
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Operating Location & Timezone
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">
                Action = Matter connects talent across global timezones for asynchronous execution and local commissions.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const countryObj = COUNTRIES.find(c => c.code === step3CountryCode);
                handleSaveStep(3, {
                  country_code: step3CountryCode,
                  country_name: countryObj?.name || 'United States',
                  city: step3City,
                  timezone: step3Timezone,
                });
              }}
              className="am-card p-6 md:p-8 am-gold-border space-y-5 bg-[#080b10]"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-medium">Country / Region *</label>
                  <select
                    value={step3CountryCode}
                    onChange={(e) => {
                      setStep3CountryCode(e.target.value);
                      const c = COUNTRIES.find(x => x.code === e.target.value);
                      if (c?.timezone) setStep3Timezone(c.timezone);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                  >
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-300 font-medium">City / Metro Area</label>
                  <input
                    type="text"
                    value={step3City}
                    onChange={(e) => setStep3City(e.target.value)}
                    placeholder="e.g. San Francisco, London, Berlin"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="text-gray-300 font-medium">Primary Working Timezone</label>
                <input
                  type="text"
                  value={step3Timezone}
                  onChange={(e) => setStep3Timezone(e.target.value)}
                  placeholder="e.g. UTC, America/New_York, Europe/London"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50"
                />
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => navigateToStep(2)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  type="submit"
                  disabled={savingStep}
                  className="px-6 py-2.5 rounded-xl am-btn-primary text-xs font-bold flex items-center gap-2 shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  {savingStep ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Next: Bio & Experience</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </section>
        )}

        {/* ========================================================== */}
        {/* STEP 4: BIO & EXPERIENCE */}
        {/* ========================================================== */}
        {currentStep === 4 && (
          <section className="space-y-6 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                Step 04 / 08
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Professional Bio & Track Record
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">
                Highlight your experience, industry depth, and link your verified portfolios.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveStep(4, {
                  bio: step4Bio,
                  experience_years: step4Years,
                  website: step4Website,
                  linkedin: step4Linkedin,
                  github: step4Github,
                });
              }}
              className="am-card p-6 md:p-8 am-gold-border space-y-5 bg-[#080b10]"
            >
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <label className="text-gray-300 font-medium">Executive / Specialist Bio *</label>
                  <span className="text-[10px] text-gray-500">{step4Bio.length} characters</span>
                </div>
                <textarea
                  required
                  rows={4}
                  value={step4Bio}
                  onChange={(e) => setStep4Bio(e.target.value)}
                  placeholder="Detail your core engineering, creative, or growth background, leadership experience, and recent project outcomes..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-medium">Years in Industry *</label>
                  <input
                    type="number"
                    min={1}
                    max={40}
                    value={step4Years}
                    onChange={(e) => setStep4Years(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-300 font-medium">Portfolio / Personal Website</label>
                  <input
                    type="url"
                    value={step4Website}
                    onChange={(e) => setStep4Website(e.target.value)}
                    placeholder="https://yourportfolio.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-medium">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={step4Linkedin}
                    onChange={(e) => setStep4Linkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-300 font-medium">GitHub / Repository URL</label>
                  <input
                    type="url"
                    value={step4Github}
                    onChange={(e) => setStep4Github(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => navigateToStep(3)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  type="submit"
                  disabled={savingStep}
                  className="px-6 py-2.5 rounded-xl am-btn-primary text-xs font-bold flex items-center gap-2 shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  {savingStep ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Next: Preferences</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </section>
        )}

        {/* ========================================================== */}
        {/* STEP 5: PREFERENCES */}
        {/* ========================================================== */}
        {currentStep === 5 && (
          <section className="space-y-6 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                Step 05 / 08
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Availability & Collaboration Preferences
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">
                Specify your active capacity and how enterprise commissions should engage you.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveStep(5, {
                  availability: step5Availability,
                  niche_preference: step5NichePreference,
                });
              }}
              className="am-card p-6 md:p-8 am-gold-border space-y-6 bg-[#080b10]"
            >
              <div className="space-y-3">
                <label className="text-xs text-gray-300 font-medium">Engagement Capacity *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {[
                    { id: 'available', title: 'Full-Time Available', desc: 'Ready for dedicated commissions & executive sprints' },
                    { id: 'part_time', title: 'Part-Time (10-20h/wk)', desc: 'Available for secondary advisory & sprint reviews' },
                    { id: 'busy', title: 'Select High-Impact Only', desc: 'Considering only tier-1 enterprise partnerships' },
                    { id: 'unavailable', title: 'Currently Contracted', desc: 'On active engagement, open to future pipeline' },
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setStep5Availability(item.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        step5Availability === item.id
                          ? 'border-amber-400/80 bg-amber-400/10 shadow-md shadow-amber-500/10 text-white'
                          : 'border-white/10 bg-black/40 text-gray-400 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-xs">
                        <span>{item.title}</span>
                        {step5Availability === item.id && (
                          <CheckCircle2 className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 pt-1 leading-snug">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => navigateToStep(4)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  type="submit"
                  disabled={savingStep}
                  className="px-6 py-2.5 rounded-xl am-btn-primary text-xs font-bold flex items-center gap-2 shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  {savingStep ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Next: Rates & Pricing</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </section>
        )}

        {/* ========================================================== */}
        {/* STEP 6: RATES & AVAILABILITY */}
        {/* ========================================================== */}
        {currentStep === 6 && (
          <section className="space-y-6 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                Step 06 / 08
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Hourly Rates & Commercial Terms
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">
                Set transparent baseline expectations for international commissions and escrow agreements.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveStep(6, {
                  hourly_rate: step6Rate,
                  currency: step6Currency,
                });
              }}
              className="am-card p-6 md:p-8 am-gold-border space-y-6 bg-[#080b10]"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-medium">Standard Hourly Rate *</label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      min={10}
                      max={2500}
                      required
                      value={step6Rate}
                      onChange={(e) => setStep6Rate(parseFloat(e.target.value) || 0)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500">Benchmark for hourly sprint allocations.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-300 font-medium">Settlement Currency *</label>
                  <select
                    value={step6Currency}
                    onChange={(e) => setStep6Currency(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                  >
                    <option value="USD">USD ($) — Global Standard</option>
                    <option value="EUR">EUR (€) — European Economic Area</option>
                    <option value="GBP">GBP (£) — United Kingdom</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => navigateToStep(5)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  type="submit"
                  disabled={savingStep}
                  className="px-6 py-2.5 rounded-xl am-btn-primary text-xs font-bold flex items-center gap-2 shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  {savingStep ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Next: What is your expertise?</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </section>
        )}

        {/* ========================================================== */}
        {/* STEP 7: "WHAT IS YOUR EXPERTISE?" */}
        {/* ========================================================== */}
        {currentStep === 7 && (
          <section className="space-y-6 animate-in fade-in duration-300">
            {/* Header Titles */}
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full am-badge-gold text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Step 07 / 08 • Specialized Skill Network
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                What is your expertise?
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 max-w-2xl leading-relaxed">
                Select the expertise and specialized skills you have experience with or want to contribute to international commissions and client projects. You can select skills from multiple niches.
              </p>
            </div>

            {/* Search and Filters Bar */}
            <div className="am-card p-4 am-gold-border space-y-4 bg-[#080b10]">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Search Field */}
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    id="expertise-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search skills, specializations, tools, or synonyms (e.g. AI, Machine Learning, Director, SEO, React)..."
                    className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-amber-400/50 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Suggest missing expertise trigger */}
                <button
                  type="button"
                  id="suggest-missing-expertise-btn"
                  onClick={() => setIsSuggestModalOpen(true)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-gray-300 font-semibold flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Propose a Skill</span>
                </button>
              </div>

              {/* Niche Tabs Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setActiveNicheFilter('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                    activeNicheFilter === 'all'
                      ? 'bg-amber-400 text-black font-bold shadow-md shadow-amber-500/20'
                      : 'bg-black/40 text-gray-400 border border-white/5 hover:text-white hover:border-white/20'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>All Niches</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeNicheFilter === 'all' ? 'bg-black/20 text-black font-bold' : 'bg-white/10 text-gray-400'}`}>
                    {skills.length}
                  </span>
                </button>

                {niches.map(niche => {
                  const isSelected = activeNicheFilter === niche.id;
                  const count = skills.filter(s => s.niche_id === niche.id).length;
                  return (
                    <button
                      key={niche.id}
                      type="button"
                      onClick={() => setActiveNicheFilter(niche.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'bg-amber-400 text-black font-bold shadow-md shadow-amber-500/20'
                          : 'bg-black/40 text-gray-400 border border-white/5 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {getNicheIcon(niche.slug)}
                      <span>{niche.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-black/20 text-black font-bold' : 'bg-white/10 text-gray-400'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Skills Tray */}
            <div className="am-card p-4 am-gold-border space-y-3 bg-[#080b10]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCheck className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Selected Expertise ({selectedArray.length})
                  </h3>
                </div>
                {selectedArray.length > 0 && (
                  <button
                    onClick={() => setSelectedSkillsMap(new Map())}
                    className="text-[11px] text-gray-400 hover:text-rose-400 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {selectedArray.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed border-white/10 text-center text-xs text-gray-500">
                  No skills selected yet. Click any skill tile below or search to build your expertise profile.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedArray.map(ps => {
                    const skill = ps.skill || skills.find(s => s.id === ps.skill_id);
                    if (!skill) return null;
                    const isEditing = editingSkillId === skill.id;

                    return (
                      <div
                        key={skill.id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                          isEditing
                            ? 'bg-amber-400 text-black ring-2 ring-amber-400'
                            : 'bg-amber-400/10 border border-amber-400/40 text-amber-300'
                        }`}
                      >
                        <span className="font-semibold">{skill.name}</span>
                        {ps.level && ps.level !== 'intermediate' && (
                          <span className="text-[10px] opacity-75 font-mono">[{ps.level}]</span>
                        )}
                        <button
                          type="button"
                          onClick={() => setEditingSkillId(isEditing ? null : skill.id)}
                          className="p-0.5 rounded hover:bg-black/20 text-gray-400 hover:text-white"
                          title="Set experience level"
                        >
                          <SlidersHorizontal className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill.id)}
                          className="p-0.5 rounded hover:bg-black/20 text-gray-400 hover:text-rose-400"
                          title="Remove skill"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Drawer for setting proficiency level on selected skill */}
              {editingSkillId && (
                <div className="p-3.5 rounded-xl bg-black/60 border border-amber-400/30 text-xs space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400">
                      Configure Skill Depth: {skills.find(s => s.id === editingSkillId)?.name}
                    </span>
                    <button
                      onClick={() => setEditingSkillId(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['beginner', 'intermediate', 'advanced', 'expert'] as const).map(lvl => {
                      const currentLvl = selectedSkillsMap.get(editingSkillId)?.level || 'intermediate';
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => {
                            setSelectedSkillsMap(prev => {
                              const next = new Map(prev);
                              const existing = next.get(editingSkillId);
                              if (existing) {
                                next.set(editingSkillId, { ...existing, level: lvl });
                              }
                              return next;
                            });
                          }}
                          className={`p-2 rounded-lg border text-center uppercase tracking-wider text-[10px] font-bold transition-all ${
                            currentLvl === lvl
                              ? 'bg-amber-400 text-black border-amber-400'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                          }`}
                        >
                          {lvl}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Skills Catalog Grid */}
            <div className="space-y-6">
              {Object.keys(groupedSkills).length === 0 ? (
                <div className="am-card p-12 text-center space-y-3 border-dashed border-white/10 bg-[#080b10]">
                  <Search className="w-8 h-8 text-gray-500 mx-auto" />
                  <p className="text-sm font-semibold text-gray-300">No matching expertise found</p>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Try another search term or click below to propose adding this skill to our international catalog.
                  </p>
                  <button
                    onClick={() => {
                      setSuggestName(searchQuery);
                      setIsSuggestModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl am-btn-primary text-xs font-bold shadow-md shadow-amber-500/20"
                  >
                    Propose &ldquo;{searchQuery}&rdquo; as a new skill
                  </button>
                </div>
              ) : (
                Object.entries(groupedSkills).map(([subcategory, subSkills]) => (
                  <div key={subcategory} className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      {subcategory} ({subSkills.length})
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {subSkills.map(skill => {
                        const isSelected = selectedSkillsMap.has(skill.id);
                        return (
                          <button
                            key={skill.id}
                            type="button"
                            onClick={() => handleToggleSkill(skill)}
                            className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between gap-2 ${
                              isSelected
                                ? 'bg-amber-400/15 border-amber-400 text-white shadow-md shadow-amber-500/10'
                                : 'bg-[#080b10] border-white/10 text-gray-300 hover:border-amber-400/40 hover:bg-white/5'
                            }`}
                          >
                            <div className="space-y-1 pr-1">
                              <span className="font-semibold text-xs leading-tight block">
                                {skill.name}
                              </span>
                              {skill.description && (
                                <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">
                                  {skill.description}
                                </p>
                              )}
                            </div>

                            <div
                              className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                isSelected
                                  ? 'bg-amber-400 border-amber-400 text-black'
                                  : 'border-white/20 bg-black/40 text-transparent'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => navigateToStep(6)}
                className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous: Rates</span>
              </button>

              <button
                type="button"
                id="save-expertise-continue-btn"
                disabled={savingStep || selectedSkillsMap.size === 0}
                onClick={handleSaveExpertise}
                className="px-6 py-2.5 rounded-xl am-btn-primary text-xs font-bold flex items-center gap-2 shadow-md shadow-amber-500/20 disabled:opacity-50"
              >
                {savingStep ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>Save & Continue to Launch ({selectedSkillsMap.size} Selected)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}

        {/* ========================================================== */}
        {/* STEP 8: MEMBERSHIP & LAUNCH */}
        {/* ========================================================== */}
        {currentStep === 8 && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                Step 08 / 08 • Final Step
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Review Profile Dossier & Complete Onboarding
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">
                Verify your complete platform identity before launching into the verified Skill Network.
              </p>
            </div>

            {/* Review Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Profile Card */}
              <div className="am-card p-5 am-gold-border space-y-3 bg-[#080b10]">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={step2AvatarUrl || PRESET_AVATARS[0]}
                    alt="Profile Avatar"
                    className="w-12 h-12 rounded-xl border border-amber-400/40 bg-black/40"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-white">{step1FullName || currentUser?.full_name}</h3>
                    <p className="text-amber-400 text-xs font-medium">{step2Profession || 'Platform Specialist'}</p>
                    <p className="text-[10px] text-gray-500">@{step1Username || currentUser?.username}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Location:</span>
                    <span className="text-gray-200 font-medium">{step3City ? `${step3City}, ` : ''}{step3CountryCode} ({step3Timezone})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Commercial Rate:</span>
                    <span className="text-amber-400 font-bold">${step6Rate} / hr ({step6Currency})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Capacity:</span>
                    <span className="text-emerald-400 font-semibold capitalize">{step5Availability.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              {/* Bio Summary Card */}
              <div className="am-card p-5 am-gold-border space-y-3 bg-[#080b10]">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">Professional Bio</h4>
                  <span className="text-[10px] text-amber-400 font-mono">{step4Years} yrs exp</span>
                </div>
                <p className="text-gray-300 leading-relaxed text-xs line-clamp-4">
                  {step4Bio || 'Professional practitioner in the Action = Matter ecosystem.'}
                </p>

                <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                  {step4Website && (
                    <a href={step4Website} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline flex items-center gap-1">
                      <Globe className="w-3 h-3" /> Website
                    </a>
                  )}
                  {step4Linkedin && (
                    <a href={step4Linkedin} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> LinkedIn
                    </a>
                  )}
                  {step4Github && (
                    <a href={step4Github} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline flex items-center gap-1">
                      <Code2 className="w-3 h-3" /> GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Selected Skills Summary */}
            <div className="am-card p-5 am-gold-border space-y-3 bg-[#080b10]">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Selected Verified Expertise ({selectedArray.length})
                </h4>
                <button
                  type="button"
                  onClick={() => navigateToStep(7)}
                  className="text-xs text-amber-400 hover:underline font-semibold"
                >
                  Edit Skills
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedArray.map(ps => {
                  const skill = ps.skill || skills.find(s => s.id === ps.skill_id);
                  if (!skill) return null;
                  return (
                    <span
                      key={skill.id}
                      className="px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-medium flex items-center gap-1.5"
                    >
                      <Check className="w-3 h-3 text-amber-400" />
                      {skill.name}
                      {ps.level && ps.level !== 'intermediate' && (
                        <span className="text-[10px] opacity-75">({ps.level})</span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Complete Onboarding CTA */}
            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => navigateToStep(7)}
                className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Step 7 (Edit Skills)</span>
              </button>

              <button
                type="button"
                disabled={savingStep}
                onClick={async () => {
                  setSavingStep(true);
                  try {
                    await fetch('/api/onboarding/step', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ step: 8, data: {} }),
                    });
                    router.push('/dashboard');
                  } catch (err) {
                    console.error('Launch error:', err);
                    router.push('/dashboard');
                  }
                }}
                className="px-8 py-3 rounded-xl am-btn-primary text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/30 hover:scale-[1.01] transition-transform"
              >
                {savingStep ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>Complete Onboarding & Enter Platform</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}
      </main>

      {/* ========================================================== */}
      {/* SUGGEST MISSING EXPERTISE MODAL */}
      {/* ========================================================== */}
      {isSuggestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="am-card p-6 md:p-8 am-gold-border max-w-md w-full space-y-5 bg-[#080b10] shadow-2xl relative">
            <button
              onClick={() => setIsSuggestModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Suggest Missing Expertise
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Can&apos;t find your specific technical or creative skill? Submit it for review by the Action = Matter catalog administration.
              </p>
            </div>

            {suggestError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{suggestError}</span>
              </div>
            )}

            {suggestSuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">Suggestion Submitted!</h4>
                <p className="text-xs text-gray-400">
                  Our catalog team will review and index this expertise shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitSuggestion} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Expertise / Skill Name *</label>
                  <input
                    type="text"
                    required
                    value={suggestName}
                    onChange={(e) => setSuggestName(e.target.value)}
                    placeholder="e.g. CUDA Optimization, Unreal Engine 5.5, Growth Loops"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Industry Niche *</label>
                  <select
                    value={suggestNicheId}
                    onChange={(e) => setSuggestNicheId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                  >
                    {niches.map(niche => (
                      <option key={niche.id} value={niche.id}>
                        {niche.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSuggestModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={suggestSubmitting}
                    className="px-5 py-2 rounded-xl am-btn-primary font-bold shadow-md shadow-amber-500/20"
                  >
                    {suggestSubmitting ? 'Submitting...' : 'Submit Suggestion'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
