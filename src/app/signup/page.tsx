'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
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
  CheckCheck,
  Eye,
  EyeOff,
  Building,
  Target,
  FileText,
  Camera,
  Upload,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { Niche, Skill, ProfileSkill } from '@/lib/types';
import { V1_NICHES, V1_SKILLS } from '@/lib/expertise';
import { COUNTRIES } from '@/lib/countries';

// The exact 12 steps matching the user's interface architecture
const SIGNUP_STEPS = [
  { num: 1, title: 'Welcome', short: 'Welcome' },
  { num: 2, title: 'Type of account', short: 'Account Type' },
  { num: 3, title: 'Personal information', short: 'Personal Info' },
  { num: 4, title: 'Profile details', short: 'Profile' },
  { num: 5, title: 'Goals & preferences', short: 'Goals' },
  { num: 6, title: 'Location', short: 'Location' },
  { num: 7, title: 'Your expertise', short: 'Expertise' },
  { num: 8, title: 'Interests', short: 'Interests' },
  { num: 9, title: 'Availability', short: 'Availability' },
  { num: 10, title: 'Profile review', short: 'Review' },
  { num: 11, title: 'Terms & conditions', short: 'Terms' },
  { num: 12, title: 'Complete', short: 'Complete' },
];

const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=AM_Master1',
  'https://api.dicebear.com/7.x/bottts/svg?seed=AM_Architect',
  'https://api.dicebear.com/7.x/bottts/svg?seed=AM_Director',
  'https://api.dicebear.com/7.x/bottts/svg?seed=AM_Leader',
  'https://api.dicebear.com/7.x/bottts/svg?seed=AM_Producer',
];

const INTEREST_TAGS = [
  'Autonomous AI Agents',
  'High-Scale Distributed Systems',
  'Virtual Production & LED Volumes',
  'Commercial Cinematography',
  'Fintech & Payment Rails',
  'B2B Growth Engineering',
  'Brand Positioning & Creative Direction',
  'Unreal Engine 5.5',
  'Full-Stack Architecture',
  'Generative AI Pipelines',
  'Design Systems & UI/UX',
  'Performance Marketing'
];

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Wizard state: Step 1 to 12
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxStepReached, setMaxStepReached] = useState<number>(1);
  const [stepLockedNotice, setStepLockedNotice] = useState<string | null>(null);

  // Form Fields across the 12 steps:
  // Step 2: Type of account
  const [accountType, setAccountType] = useState<'specialist' | 'client' | 'agency' | 'consultant'>('specialist');

  // Step 3: Personal Information
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Step 4: Profile Details
  const [profession, setProfession] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(PRESET_AVATARS[0]);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isRealPhoto, setIsRealPhoto] = useState(false);
  const [showPersonaAvatars, setShowPersonaAvatars] = useState(false);
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState<number>(4);
  const [website, setWebsite] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Image size exceeds 5MB limit.');
      return;
    }

    setPhotoUploading(true);
    setPhotoError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload photo');
      }

      setAvatarUrl(data.url);
      setIsRealPhoto(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Photo upload failed';
      setPhotoError(msg);
    } finally {
      setPhotoUploading(false);
    }
  };

  // Step 5: Goals & Preferences
  const [goals, setGoals] = useState<string[]>([
    'Direct high-impact client commissions',
    'Peer networking with top-tier practitioners'
  ]);

  // Step 6: Location
  const [countryCode, setCountryCode] = useState('US');
  const [city, setCity] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');

  // Step 7: Your Expertise (117 Standardized Skills)
  const [niches] = useState<Niche[]>(V1_NICHES);
  const [skills] = useState<Skill[]>(V1_SKILLS);
  const [selectedSkillsMap, setSelectedSkillsMap] = useState<Map<string, ProfileSkill>>(new Map());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNicheFilter, setActiveNicheFilter] = useState<string>('all');
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);

  // Suggestion modal inside Step 7
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [suggestName, setSuggestName] = useState('');
  const [suggestNicheId, setSuggestNicheId] = useState<string>('b1000000-0000-0000-0000-000000000001');
  const [suggestSubmitting, setSuggestSubmitting] = useState(false);
  const [suggestSuccess, setSuggestSuccess] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  // Step 8: Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Autonomous AI Agents',
    'Virtual Production & LED Volumes'
  ]);

  // Step 9: Availability
  const [availability, setAvailability] = useState<'available' | 'part_time' | 'full_time' | 'busy' | 'unavailable'>('available');
  const [hourlyRate, setHourlyRate] = useState<number>(120);
  const [currency, setCurrency] = useState<string>('USD');

  // Step 11: Terms & Conditions
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Submission & UI status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  // Handle URL step parameter safely without allowing forward jumps
  useEffect(() => {
    const stepParam = searchParams?.get('step');
    if (stepParam) {
      const parsed = parseInt(stepParam, 10);
      if (parsed >= 1 && parsed <= maxStepReached) {
        setCurrentStep(parsed);
      }
    }
  }, [searchParams, maxStepReached]);

  // Navigation: strictly prevents forward jumps to uncompleted steps
  const navigateToStep = (targetStep: number) => {
    if (targetStep > maxStepReached) {
      setStepLockedNotice(
        `Step ${targetStep} is locked. You must complete Step ${maxStepReached} first.`
      );
      return;
    }
    setStepLockedNotice(null);
    setFormError(null);
    setCurrentStep(targetStep);
  };

  // Step progression validator
  const handleNextStep = (currentStepNum: number) => {
    setFormError(null);
    setStepLockedNotice(null);

    // Validation for Step 2
    if (currentStepNum === 2 && !accountType) {
      setFormError('Please choose an account type to proceed.');
      return;
    }

    // Validation for Step 3
    if (currentStepNum === 3) {
      if (!fullName.trim() || !username.trim() || !email.trim() || !password) {
        setFormError('Please fill in all required personal information fields.');
        return;
      }
      if (password !== confirmPassword) {
        setFormError('Passwords do not match.');
        return;
      }
      if (password.length < 8) {
        setFormError('Password must be at least 8 characters long.');
        return;
      }
    }

    // Validation for Step 4
    if (currentStepNum === 4 && !profession.trim()) {
      setFormError('Please specify your professional headline / title.');
      return;
    }

    // Validation for Step 6
    if (currentStepNum === 6 && !countryCode) {
      setFormError('Please select your operating country.');
      return;
    }

    // Validation for Step 7: Your Expertise
    if (currentStepNum === 7) {
      if (selectedSkillsMap.size === 0) {
        setFormError('Please select at least one skill or specialization from the catalog to continue.');
        return;
      }
    }

    // Validation for Step 11
    if (currentStepNum === 11 && !termsAccepted) {
      setFormError('You must review and accept the Platform Terms & Confidentiality Standards.');
      return;
    }

    const next = currentStepNum + 1;
    setMaxStepReached(prev => Math.max(prev, next));
    setCurrentStep(next);

    // If advancing from Step 11 to 12: finalize registration!
    if (currentStepNum === 11) {
      handleFinalRegistration();
    }
  };

  // Final registration submission to Supabase
  const handleFinalRegistration = async () => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      const payloadSkills = Array.from(selectedSkillsMap.values()).map(ps => ({
        skill_id: ps.skill_id,
        level: ps.level || 'intermediate',
        years_experience: ps.years_experience || 2,
        note: ps.note || '',
      }));

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account_type: accountType,
          full_name: fullName.trim(),
          username: username.trim().toLowerCase(),
          email: email.trim().toLowerCase(),
          password,
          confirm_password: confirmPassword,
          profession: profession.trim(),
          avatar_url: avatarUrl,
          bio: bio.trim(),
          experience_years: experienceYears,
          website: website.trim(),
          linkedin: linkedin.trim(),
          github: github.trim(),
          goals,
          country_code: countryCode,
          city: city.trim(),
          timezone,
          selected_skills: payloadSkills,
          interests: selectedInterests,
          availability,
          hourly_rate: hourlyRate,
          currency,
          terms_accepted: termsAccepted,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Account creation failed.');
      }

      setRegisteredSuccess(true);
      setCurrentStep(12);
      setMaxStepReached(12);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error creating account.';
      setFormError(msg);
      setCurrentStep(11); // return to terms step on error so user can re-submit
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter skills in Step 7
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

  // Toggle skill selection in Step 7
  const handleToggleSkill = (skill: Skill) => {
    setSelectedSkillsMap(prev => {
      const next = new Map(prev);
      if (next.has(skill.id)) {
        next.delete(skill.id);
        if (editingSkillId === skill.id) setEditingSkillId(null);
      } else {
        next.set(skill.id, {
          id: `temp_${skill.id}`,
          profile_id: '',
          skill_id: skill.id,
          level: 'intermediate',
          years_experience: 2,
          note: '',
          skill,
        });
      }
      return next;
    });
    setFormError(null);
  };

  const handleRemoveSkill = (skillId: string) => {
    setSelectedSkillsMap(prev => {
      const next = new Map(prev);
      next.delete(skillId);
      if (editingSkillId === skillId) setEditingSkillId(null);
      return next;
    });
  };

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
      if (!res.ok) throw new Error(data.error || 'Failed to submit suggestion.');

      setSuggestSuccess(true);
      setTimeout(() => {
        setIsSuggestModalOpen(false);
        setSuggestSuccess(false);
        setSuggestName('');
      }, 1500);
    } catch (err: unknown) {
      setSuggestError(err instanceof Error ? err.message : 'Error submitting suggestion');
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
      <div className="fixed top-0 left-1/3 -translate-x-1/2 w-[900px] h-[400px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-20 border-b border-white/10 bg-[#080b10]/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
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
            Already have an account?
          </span>
          <Link
            href="/login"
            className="px-3.5 py-1.5 rounded-xl border border-white/10 hover:border-amber-400/50 text-xs font-semibold text-gray-200 hover:text-white transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Two-Column Layout */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 gap-8">
        {/* ========================================================== */}
        {/* LEFT SIDEBAR: EXACT VERTICAL STEPPER FROM SCREENSHOT */}
        {/* ========================================================== */}
        <aside className="w-full md:w-64 lg:w-72 shrink-0">
          <div className="sticky top-8 space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-white px-2">
              Create your account
            </h2>

            {/* Stepper Vertical List with Connecting Line */}
            <div className="relative pl-2 pt-2">
              {/* The Vertical Connecting Line */}
              <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-amber-400/80 via-amber-400/30 to-white/10 pointer-events-none" />

              <nav aria-label="Registration Steps" className="space-y-4 relative">
                {SIGNUP_STEPS.map((step) => {
                  const isPast = step.num < currentStep;
                  const isCurrent = step.num === currentStep;
                  const isUnlocked = step.num <= maxStepReached;

                  return (
                    <button
                      key={step.num}
                      type="button"
                      disabled={!isUnlocked}
                      onClick={() => navigateToStep(step.num)}
                      className={`flex items-center gap-3.5 w-full text-left transition-all group ${
                        !isUnlocked ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
                      }`}
                    >
                      {/* Step Circle Node */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs transition-all relative z-10 ${
                          isCurrent
                            ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/50 ring-4 ring-amber-400/30 scale-110 font-black'
                            : isPast
                            ? 'bg-amber-400 text-black shadow-sm shadow-amber-500/20'
                            : 'bg-[#080b10] border border-white/20 text-gray-400 group-hover:border-white/40'
                        }`}
                      >
                        {isPast ? (
                          <Check className="w-4 h-4 stroke-[2.5]" />
                        ) : (
                          <span>{step.num}</span>
                        )}
                      </div>

                      {/* Step Label */}
                      <span
                        className={`text-sm transition-colors ${
                          isCurrent
                            ? 'text-amber-400 font-extrabold tracking-wide drop-shadow-[0_0_8px_rgba(223,175,75,0.4)]'
                            : isPast
                            ? 'text-gray-200 font-medium group-hover:text-white'
                            : 'text-gray-500 font-normal'
                        }`}
                      >
                        {step.title}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </aside>

        {/* ========================================================== */}
        {/* RIGHT CONTENT AREA: STEP-BY-STEP FORMS */}
        {/* ========================================================== */}
        <main className="flex-1 min-w-0 pb-12">
          {/* Step Locked Notice */}
          {stepLockedNotice && (
            <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{stepLockedNotice}</span>
              </div>
              <button
                onClick={() => setStepLockedNotice(null)}
                className="text-amber-400 hover:text-amber-200 text-[11px] underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Form Error Notice */}
          {formError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* STEP 1: WELCOME */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  Step 01 / 12
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Welcome to ACTION = MATTER
                </h1>
                <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
                  The curated international network uniting skilled practitioners, client commissions, and enterprise projects.
                </p>
              </div>

              <div className="am-card p-6 md:p-8 am-gold-border space-y-6 bg-[#080b10]">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-white text-sm">Curated Network</h3>
                    <p className="text-gray-400 leading-relaxed">
                      Specialized membership built for practitioners across Technology, Film & Media, and Growth.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                    <Shield className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-white text-sm">Direct Commissions</h3>
                    <p className="text-gray-400 leading-relaxed">
                      Escrow-backed contracts and direct engagement with verified enterprise leadership.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                    <Layers className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-white text-sm">Full Dossier</h3>
                    <p className="text-gray-400 leading-relaxed">
                      Complete your profile details, location, and standardized expertise to launch.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-400/5 border border-amber-400/20 text-xs text-gray-300 flex items-start gap-3">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    To ensure ecosystem caliber, accounts are created only after completing each verification step (including your specialized expertise).
                  </span>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => handleNextStep(1)}
                    className="px-6 py-2.5 rounded-xl am-btn-primary text-xs font-bold flex items-center gap-2 shadow-md shadow-amber-500/20"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TYPE OF ACCOUNT */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  Step 02 / 12
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Choose your account type
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
                  Select how you plan to participate in the Action = Matter ecosystem.
                </p>
              </div>

              <div className="am-card p-6 md:p-8 am-gold-border space-y-6 bg-[#080b10]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {[
                    {
                      id: 'specialist',
                      title: 'Specialist / Creator',
                      desc: 'Engineers, directors, creators, and marketers looking for verified commissions and peer collaboration.',
                      icon: <User className="w-5 h-5 text-amber-400" />
                    },
                    {
                      id: 'client',
                      title: 'Enterprise Client / Brand',
                      desc: 'Companies and creative studios looking to commission specialized talent and production teams.',
                      icon: <Building className="w-5 h-5 text-amber-400" />
                    },
                    {
                      id: 'consultant',
                      title: 'Executive Consultant',
                      desc: 'Advisors and fractionals providing strategic leadership and sprint architecture.',
                      icon: <Briefcase className="w-5 h-5 text-amber-400" />
                    },
                    {
                      id: 'agency',
                      title: 'Production Studio / Agency',
                      desc: 'Creative houses and development studios partnering for enterprise distribution.',
                      icon: <Film className="w-5 h-5 text-amber-400" />
                    },
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAccountType(item.id as any)}
                      className={`p-5 rounded-xl border text-left transition-all ${
                        accountType === item.id
                          ? 'border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-500/10 text-white ring-1 ring-amber-400/40'
                          : 'border-white/10 bg-black/40 text-gray-400 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2">
                        {item.icon}
                        {accountType === item.id && (
                          <CheckCircle2 className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                      <h3 className="font-bold text-white text-sm">{item.title}</h3>
                      <p className="text-gray-400 text-xs pt-1 leading-relaxed">{item.desc}</p>
                    </button>
                  ))}
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
                    type="button"
                    onClick={() => handleNextStep(2)}
                    className="px-6 py-2.5 rounded-xl am-btn-primary text-xs font-bold flex items-center gap-2 shadow-md shadow-amber-500/20"
                  >
                    <span>Next: Personal Information</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PERSONAL INFORMATION */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  Step 03 / 12
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Personal Information & Credentials
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
                  Enter your legal name, username, and secure credentials.
                </p>
              </div>

              <div className="am-card p-6 md:p-8 am-gold-border space-y-5 bg-[#080b10]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-gray-300 font-medium">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. David Kim"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-gray-300 font-medium">Unique Platform Username *</label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      placeholder="e.g. davidkim"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="text-gray-300 font-medium">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-gray-300 font-medium">Password (Min 8 chars) *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-gray-300 font-medium">Confirm Password *</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50"
                    />
                  </div>
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
                    type="button"
                    onClick={() => handleNextStep(3)}
                    className="px-6 py-2.5 rounded-xl am-btn-primary text-xs font-bold flex items-center gap-2 shadow-md shadow-amber-500/20"
                  >
                    <span>Next: Profile Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PROFILE DETAILS */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  Step 04 / 12
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Profile Details & Public Avatar
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
                  Define your headline, bio summary, and portfolio presence.
                </p>
              </div>

              <div className="am-card p-6 md:p-8 am-gold-border space-y-5 bg-[#080b10]">
                <div className="space-y-1.5 text-xs">
                  <label className="text-gray-300 font-medium">Professional Title / Headline *</label>
                  <input
                    type="text"
                    required
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="e.g. Senior Full-Stack Architect & AI Specialist"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50"
                  />
                </div>

                {/* Real User Photo Upload */}
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <label className="text-gray-300 font-medium">Profile Photo (Real User Image)</label>
                    <span className="text-[10px] text-amber-400/90 font-medium">
                      {isRealPhoto ? '✓ Real Photo Uploaded' : 'Recommended for Verified Specialization'}
                    </span>
                  </div>

                  {photoError && (
                    <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{photoError}</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-black/50 border border-white/10 am-gold-border">
                    {/* Photo Preview Circle */}
                    <div className="relative group shrink-0">
                      <div className="w-20 h-20 rounded-2xl border-2 border-amber-400/50 bg-[#080b10] overflow-hidden flex items-center justify-center shadow-lg shadow-amber-500/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={avatarUrl}
                          alt="Profile Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {isRealPhoto && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-[10px] shadow">
                          ✓
                        </div>
                      )}
                    </div>

                    {/* Upload Controls */}
                    <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl am-btn-primary font-bold text-xs shadow-md shadow-amber-500/20 hover:scale-[1.02] transition-transform">
                          {photoUploading ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Uploading Photo...</span>
                            </>
                          ) : (
                            <>
                              <Camera className="w-3.5 h-3.5" />
                              <span>{isRealPhoto ? 'Change Photo' : 'Upload Real Photo'}</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={handlePhotoUpload}
                            disabled={photoUploading}
                            className="hidden"
                          />
                        </label>

                        {isRealPhoto && (
                          <button
                            type="button"
                            onClick={() => {
                              setAvatarUrl(PRESET_AVATARS[0]);
                              setIsRealPhoto(false);
                            }}
                            className="px-3 py-2 rounded-xl border border-white/10 hover:border-rose-500/40 text-gray-400 hover:text-rose-400 text-xs flex items-center gap-1.5 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setShowPersonaAvatars(!showPersonaAvatars)}
                          className="px-3 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white text-[11px] transition-colors"
                        >
                          {showPersonaAvatars ? 'Hide Avatars' : 'Or choose persona avatar'}
                        </button>
                      </div>

                      <p className="text-[10px] text-gray-500 leading-normal">
                        Supports JPG, PNG, or WebP up to 5MB. Real headshots increase enterprise commission verification by 4.2x.
                      </p>
                    </div>
                  </div>

                  {/* Optional Fallback Avatars Carousel */}
                  {showPersonaAvatars && (
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2 animate-in fade-in">
                      <span className="text-[11px] text-gray-400 block">Alternative Persona Avatars:</span>
                      <div className="flex flex-wrap items-center gap-2.5">
                        {PRESET_AVATARS.map((url, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setAvatarUrl(url);
                              setIsRealPhoto(false);
                            }}
                            className={`w-11 h-11 rounded-xl border p-1 transition-all ${
                              avatarUrl === url && !isRealPhoto
                                ? 'border-amber-400 bg-amber-400/20 ring-2 ring-amber-400/40 scale-105'
                                : 'border-white/10 bg-black/30 hover:border-white/30'
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt={`Avatar ${idx + 1}`} className="w-full h-full rounded-lg" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-gray-300 font-medium">Years in Industry *</label>
                    <input
                      type="number"
                      min={0}
                      max={40}
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-gray-300 font-medium">Portfolio / Website</label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://yourportfolio.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="text-gray-300 font-medium">Brief Professional Bio</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Summary of your technical depth, key outcomes, and creative background..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50 leading-relaxed"
                  />
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
                    type="button"
                    onClick={() => handleNextStep(4)}
                    className="px-6 py-2.5 rounded-xl am-btn-primary text-xs font-bold flex items-center gap-2 shadow-md shadow-amber-500/20"
                  >
                    <span>Next: Goals & Preferences</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: GOALS & PREFERENCES */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  Step 05 / 12
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Goals & Preferences
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
                  What opportunities and engagements are you looking to unlock?
                </p>
              </div>

              <div className="am-card p-6 md:p-8 am-gold-border space-y-6 bg-[#080b10]">
                <div className="space-y-3">
                  <label className="text-xs text-gray-300 font-medium">Select all that apply:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {[
                      'Direct high-impact client commissions',
                      'Executive & fractional advisory contracts',
                      'Peer networking with top-tier practitioners',
                      'Cross-disciplinary production collaborations',
                      'International remote sprint deliverables',
                      'Private mastermind & platform events'
                    ].map(goal => {
                      const isSelected = goals.includes(goal);
                      return (
                        <button
                          key={goal}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setGoals(goals.filter(g => g !== goal));
                            } else {
                              setGoals([...goals, goal]);
                            }
                          }}
                          className={`p-3.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all ${
                            isSelected
                              ? 'border-amber-400/80 bg-amber-400/10 text-white'
                              : 'border-white/10 bg-black/40 text-gray-400 hover:border-white/20'
                          }`}
                        >
                          <span className="font-semibold text-xs leading-snug">{goal}</span>
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-amber-400 border-amber-400 text-black'
                                : 'border-white/20 text-transparent'
                            }`}
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        </button>
                      );
                    })}
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
                    type="button"
                    onClick={() => handleNextStep(5)}
                    className="px-6 py-2.5 rounded-xl am-btn-primary text-xs font-bold flex items-center gap-2 shadow-md shadow-amber-500/20"
                  >
                    <span>Next: Location</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: LOCATION */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  Step 06 / 12
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Operating Location & Timezone
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
                  Helps international clients calculate asynchronous overlap and regional sprint logistics.
                </p>
              </div>

              <div className="am-card p-6 md:p-8 am-gold-border space-y-5 bg-[#080b10]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-gray-300 font-medium">Country *</label>
                    <select
                      value={countryCode}
                      onChange={(e) => {
                        setCountryCode(e.target.value);
                        const c = COUNTRIES.find(x => x.code === e.target.value);
                        if (c?.timezone) setTimezone(c.timezone);
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
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. San Francisco, London, Seoul"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="text-gray-300 font-medium">Timezone</label>
                  <input
                    type="text"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    placeholder="e.g. America/New_York, UTC, Europe/London"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50"
                  />
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
                    type="button"
                    onClick={() => handleNextStep(6)}
                    className="px-6 py-2.5 rounded-xl am-btn-primary text-xs font-bold flex items-center gap-2 shadow-md shadow-amber-500/20"
                  >
                    <span>Next: Your Expertise</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* STEP 7: "YOUR EXPERTISE" — THE CORE MULTI-NICHE SKILL CATALOG */}
          {/* ========================================================== */}
          {currentStep === 7 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full am-badge-gold text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> Step 07 / 12 • Core Skill Selection
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

              {/* Bottom Actions for Step 7 */}
              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => navigateToStep(6)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous: Location</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNextStep(7)}
                  disabled={selectedSkillsMap.size === 0}
                  className="px-6 py-2.5 rounded-xl am-btn-primary text-xs font-bold flex items-center gap-2 shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  <span>Next: Interests ({selectedSkillsMap.size} Selected)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 8: INTERESTS */}
          {currentStep === 8 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  Step 08 / 12
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Cross-Disciplinary Interests
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
                  Select key industry verticals and project types you are interested in exploring or collaborating on.
                </p>
              </div>

              <div className="am-card p-6 md:p-8 am-gold-border space-y-6 bg-[#080b10]">
                <div className="flex flex-wrap gap-2.5">
                  {INTEREST_TAGS.map(tag => {
                    const isSelected = selectedInterests.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedInterests(selectedInterests.filter(t => t !== tag));
                          } else {
                            setSelectedInterests([...selectedInterests, tag]);
                          }
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10'
                            : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => navigateToStep(7)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous: Expertise</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNextStep(8)}
                    className="px-6 py-2.5 rounded-xl am-btn-primary text-xs font-bold flex items-center gap-2 shadow-md shadow-amber-500/20"
                  >
                    <span>Next: Availability & Rates</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 9: AVAILABILITY & RATES */}
          {currentStep === 9 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  Step 09 / 12
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Availability & Commercial Terms
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
                  Set your working capacity and commercial rate expectations for prospective commissions.
                </p>
              </div>

              <div className="am-card p-6 md:p-8 am-gold-border space-y-6 bg-[#080b10]">
                <div className="space-y-3">
                  <label className="text-xs text-gray-300 font-medium">Availability Capacity *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {[
                      { id: 'available', title: 'Full-Time Available', desc: 'Ready for dedicated commissions & executive sprints' },
                      { id: 'part_time', title: 'Part-Time (10-20h/wk)', desc: 'Available for secondary advisory & sprint reviews' },
                      { id: 'busy', title: 'High-Impact Only', desc: 'Considering only tier-1 enterprise partnerships' },
                      { id: 'unavailable', title: 'Currently Contracted', desc: 'On active engagement, pipeline only' },
                    ].map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setAvailability(item.id as any)}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          availability === item.id
                            ? 'border-amber-400 bg-amber-400/10 text-white'
                            : 'border-white/10 bg-black/40 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-xs">
                          <span>{item.title}</span>
                          {availability === item.id && (
                            <CheckCircle2 className="w-4 h-4 text-amber-400" />
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 pt-1 leading-snug">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="space-y-1.5">
                    <label className="text-gray-300 font-medium">Standard Hourly Rate *</label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        min={0}
                        max={3000}
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-gray-300 font-medium">Settlement Currency *</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                    >
                      <option value="USD">USD ($) — Global Standard</option>
                      <option value="EUR">EUR (€) — European Economic Area</option>
                      <option value="GBP">GBP (£) — United Kingdom</option>
                      <option value="INR">INR (₹) — India</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => navigateToStep(8)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous: Interests</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNextStep(9)}
                    className="px-6 py-2.5 rounded-xl am-btn-primary text-xs font-bold flex items-center gap-2 shadow-md shadow-amber-500/20"
                  >
                    <span>Next: Profile Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 10: PROFILE REVIEW */}
          {currentStep === 10 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  Step 10 / 12
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Review Your Platform Dossier
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
                  Inspect your completed information before agreeing to terms and creating your verified account.
                </p>
              </div>

              <div className="space-y-4">
                {/* Account & Profile Summary Card */}
                <div className="am-card p-5 am-gold-border space-y-4 bg-[#080b10]">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={avatarUrl} alt="Avatar" className="w-12 h-12 rounded-xl border border-amber-400/40 bg-black/40" />
                      <div>
                        <h3 className="font-bold text-sm text-white">{fullName}</h3>
                        <p className="text-amber-400 text-xs font-medium">{profession}</p>
                        <p className="text-[10px] text-gray-500">@{username} • {email}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigateToStep(3)}
                      className="text-xs text-amber-400 hover:underline font-semibold"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div>
                      <span className="text-gray-500 block">Account Type</span>
                      <span className="text-gray-200 capitalize font-medium">{accountType}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Location</span>
                      <span className="text-gray-200 font-medium">{city ? `${city}, ` : ''}{countryCode}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Rate</span>
                      <span className="text-amber-400 font-bold">${hourlyRate} / hr</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Capacity</span>
                      <span className="text-emerald-400 font-semibold capitalize">{availability.replace('_', ' ')}</span>
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

                {/* Bottom Actions for Step 10 */}
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => navigateToStep(9)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous: Availability</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNextStep(10)}
                    className="px-6 py-2.5 rounded-xl am-btn-primary text-xs font-bold flex items-center gap-2 shadow-md shadow-amber-500/20"
                  >
                    <span>Next: Terms & Conditions</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 11: TERMS & CONDITIONS */}
          {currentStep === 11 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  Step 11 / 12
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Platform Standards & Terms
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
                  Agree to the platform code of conduct, confidential escrow terms, and international standards.
                </p>
              </div>

              <div className="am-card p-6 md:p-8 am-gold-border space-y-6 bg-[#080b10]">
                <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-xs text-gray-300 space-y-3 max-h-48 overflow-y-auto leading-relaxed">
                  <p className="font-semibold text-white">Action = Matter Executive Standards:</p>
                  <p>1. <strong>Confidentiality & IP:</strong> All commissions, project specifications, and proprietary data shared within the Action = Matter ecosystem remain strictly confidential under bilateral non-disclosure provisions.</p>
                  <p>2. <strong>Direct Delivery & Integrity:</strong> Specialists agree to uphold executive-tier delivery standards, prompt communications, and verified code/asset quality.</p>
                  <p>3. <strong>Escrow Settlement:</strong> Official enterprise commissions are conducted via verified milestone escrow protection.</p>
                </div>

                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-white/20 bg-black text-amber-400 focus:ring-amber-400/50"
                  />
                  <span className="text-xs text-gray-300 leading-snug">
                    I have read, understood, and accept the <strong>Action = Matter Terms of Service</strong>, Privacy Policy, and Practitioner Standards.
                  </span>
                </label>

                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => navigateToStep(10)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous: Review</span>
                  </button>
                  <button
                    type="button"
                    disabled={!termsAccepted || isSubmitting}
                    onClick={() => handleNextStep(11)}
                    className="px-8 py-3 rounded-xl am-btn-primary text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/30 hover:scale-[1.01] transition-transform disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    <span>Complete Registration & Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 12: COMPLETE & LAUNCH */}
          {currentStep === 12 && (
            <div className="space-y-6 animate-in fade-in py-8 text-center max-w-xl mx-auto">
              <div className="am-card p-8 md:p-10 am-gold-border space-y-5 bg-[#080b10] shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                    Step 12 / 12 • Completed
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Account Created Successfully!
                  </h1>
                  <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
                    Welcome to <strong>ACTION = MATTER</strong>. Your credentials, professional profile, and {selectedArray.length} specialized skills have been saved to the ecosystem.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs text-amber-300 text-left space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Practitioner:</span>
                    <span className="font-bold text-white">{fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Headline:</span>
                    <span className="text-white">{profession}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Verified Skills:</span>
                    <span className="font-bold text-amber-400">{selectedArray.length} Indexed</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    href="/dashboard"
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl am-btn-primary text-xs font-bold shadow-lg shadow-amber-500/30 hover:scale-[1.01] transition-transform"
                  >
                    <span>Enter Action = Matter Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Suggest Missing Expertise Modal */}
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

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#07090E] flex flex-col items-center justify-center text-center p-6">
          <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm mt-4 font-mono">Loading account registration...</p>
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}

