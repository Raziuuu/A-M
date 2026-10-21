import {
  Profile,
  SkillNetworkMember,
  Project,
  ProjectRequest,
  ProjectInterest,
  Coupon,
  Subscription,
  Invoice,
  Message,
  MessageThread,
  Event,
  Hub,
  AuditLog,
  SupportedCurrency
} from './types';
import { REGIONAL_PRICING } from './countries';

// Seed Initial Profiles
export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'usr_ceo_001',
    email: 'ceo@actionismatter.com',
    full_name: 'Mahammad Razi',
    username: 'razi_ceo',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    country_code: 'NL',
    country_name: 'Netherlands',
    city: 'Amsterdam',
    timezone: 'Europe/Amsterdam',
    locale: 'en-US',
    profession: 'CEO & Founder',
    bio: 'Founder at Action = Matter. Building an international network where high-caliber ideas turn into real action.',
    website: 'https://actionismatter.com',
    linkedin: 'https://linkedin.com',
    role: 'ceo',
    membership_status: 'active',
    membership_tier: 'annual',
    cancel_at_period_end: false,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'usr_admin_001',
    email: 'admin@actionismatter.com',
    full_name: 'Sarah Jenkins',
    username: 'sjenkins',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    country_code: 'GB',
    country_name: 'United Kingdom',
    city: 'London',
    timezone: 'Europe/London',
    locale: 'en-GB',
    profession: 'Operations Director',
    bio: 'Overseeing global project matching, member approvals, and international operations for Action = Matter.',
    role: 'admin',
    membership_status: 'active',
    membership_tier: 'annual',
    cancel_at_period_end: false,
    created_at: '2026-01-10T00:00:00Z',
    updated_at: '2026-01-10T00:00:00Z'
  },
  {
    id: 'usr_premium_001',
    email: 'elena@actionismatter.com',
    full_name: 'Elena Rostova',
    username: 'erostova',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    country_code: 'DE',
    country_name: 'Germany',
    city: 'Berlin',
    timezone: 'Europe/Berlin',
    locale: 'de-DE',
    profession: 'AI & Computer Vision Engineer',
    bio: 'Specializing in edge AI deployment, multi-modal perception models, and real-time inference optimization.',
    website: 'https://elena-ai.dev',
    linkedin: 'https://linkedin.com/in/elena-rostova',
    github: 'https://github.com/erostova',
    role: 'premium_member',
    membership_status: 'active',
    membership_tier: 'annual',
    subscription_period_end: '2027-02-15T00:00:00Z',
    cancel_at_period_end: false,
    created_at: '2026-02-01T00:00:00Z',
    updated_at: '2026-02-01T00:00:00Z'
  },
  {
    id: 'usr_premium_002',
    email: 'marcus@actionismatter.com',
    full_name: 'Marcus Vance',
    username: 'marcusv',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    country_code: 'US',
    country_name: 'United States',
    city: 'San Francisco',
    timezone: 'America/Los_Angeles',
    locale: 'en-US',
    profession: 'Senior Full-Stack Architect',
    bio: '10+ years engineering high-load distributed SaaS platforms, Next.js applications, and resilient cloud architectures.',
    website: 'https://marcusvance.tech',
    linkedin: 'https://linkedin.com/in/marcusvance',
    github: 'https://github.com/marcusvance',
    role: 'premium_member',
    membership_status: 'active',
    membership_tier: 'monthly',
    subscription_period_end: '2026-11-20T00:00:00Z',
    cancel_at_period_end: false,
    created_at: '2026-02-10T00:00:00Z',
    updated_at: '2026-02-10T00:00:00Z'
  },
  {
    id: 'usr_premium_003',
    email: 'sophia@actionismatter.com',
    full_name: 'Sophia Chen',
    username: 'sophiadesign',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    country_code: 'SG',
    country_name: 'Singapore',
    city: 'Singapore',
    timezone: 'Asia/Singapore',
    locale: 'en-SG',
    profession: 'Principal Product Designer',
    bio: 'Crafting luxury, high-conversion digital experiences, design systems, and accessible interfaces for enterprise scale.',
    website: 'https://sophiachen.design',
    linkedin: 'https://linkedin.com/in/sophiachen',
    role: 'premium_member',
    membership_status: 'active',
    membership_tier: 'annual',
    subscription_period_end: '2027-01-10T00:00:00Z',
    cancel_at_period_end: false,
    created_at: '2026-02-15T00:00:00Z',
    updated_at: '2026-02-15T00:00:00Z'
  },
  {
    id: 'usr_free_001',
    email: 'free@actionismatter.com',
    full_name: 'Alex Rivera',
    username: 'alexrivera',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    country_code: 'ES',
    country_name: 'Spain',
    city: 'Barcelona',
    timezone: 'Europe/Madrid',
    locale: 'es-ES',
    profession: 'Junior Frontend Developer',
    bio: 'Aspiring engineer enthusiastic about React, TypeScript, and modern web application development.',
    role: 'free_user',
    membership_status: 'inactive',
    membership_tier: 'free',
    cancel_at_period_end: false,
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-03-01T00:00:00Z'
  }
];

// Seed Skill Network Members
export const INITIAL_SKILL_MEMBERS: SkillNetworkMember[] = [
  {
    id: 'snm_001',
    user_id: 'usr_premium_001',
    title: 'Staff AI & Machine Learning Specialist',
    industry: 'Artificial Intelligence & Robotics',
    experience_years: 8,
    hourly_rate: 140,
    currency: 'EUR',
    availability: 'available',
    languages: ['English', 'German', 'Russian'],
    skills: ['Python', 'PyTorch', 'Computer Vision', 'CUDA', 'FastAPI', 'Docker', 'TensorRT'],
    areas_of_expertise: ['Edge AI Acceleration', 'Vision-Language Models', 'Autonomous Robotics', 'Real-Time Inference'],
    portfolio_items: [
      {
        id: 'port_1',
        title: 'Autonomous Industrial Vision Inspector',
        description: 'Sub-millimeter defect detection engine running at 120 FPS on edge hardware.',
        url: 'https://example.com/project-1',
        tags: ['PyTorch', 'TensorRT', 'C++']
      },
      {
        id: 'port_2',
        title: 'Multi-Modal Reasoning Assistant',
        description: 'Integrated vision and language reasoning model for medical imaging assistance.',
        url: 'https://example.com/project-2',
        tags: ['Transformers', 'FastAPI', 'Python']
      }
    ],
    experiences: [
      {
        id: 'exp_1',
        role: 'Lead ML Engineer',
        company: 'Vanguard Robotics (Berlin)',
        period: '2023 - Present',
        description: 'Directed the edge perception team, reducing compute latency by 45%.'
      }
    ],
    certifications: ['NVIDIA Certified Deep Learning Professional', 'AWS Certified Machine Learning - Specialty'],
    verification_status: 'verified',
    is_approved: true,
    is_featured: true,
    is_active: true,
    badges: ['Skill Network Member', 'Verified', 'Featured', 'Top Skill', 'Available'],
    created_at: '2026-02-01T00:00:00Z',
    updated_at: '2026-02-01T00:00:00Z',
    profile: INITIAL_PROFILES[2]
  },
  {
    id: 'snm_002',
    user_id: 'usr_premium_002',
    title: 'Principal Cloud & Full-Stack Architect',
    industry: 'Enterprise Software & FinTech',
    experience_years: 11,
    hourly_rate: 165,
    currency: 'USD',
    availability: 'part_time',
    languages: ['English', 'Spanish'],
    skills: ['TypeScript', 'Next.js', 'PostgreSQL', 'Go', 'Kubernetes', 'AWS', 'GraphQL', 'TailwindCSS'],
    areas_of_expertise: ['Multi-Tenant Systems', 'Distributed Transactions', 'API Performance', 'High Availability'],
    portfolio_items: [
      {
        id: 'port_3',
        title: 'Real-Time FX Clearinghouse Platform',
        description: 'Engineered high-frequency settlement gateway handling $40M daily volume.',
        url: 'https://example.com/fx',
        tags: ['Go', 'PostgreSQL', 'Kafka']
      }
    ],
    experiences: [
      {
        id: 'exp_2',
        role: 'VP of Technology',
        company: 'NovaStack Labs (San Francisco)',
        period: '2022 - 2025',
        description: 'Led architecture across 14 engineers, scaling microservices to 5M daily requests.'
      }
    ],
    certifications: ['AWS Solutions Architect Professional', 'CKA: Certified Kubernetes Administrator'],
    verification_status: 'verified',
    is_approved: true,
    is_featured: true,
    is_active: true,
    badges: ['Skill Network Member', 'Verified', 'Project Contributor'],
    created_at: '2026-02-10T00:00:00Z',
    updated_at: '2026-02-10T00:00:00Z',
    profile: INITIAL_PROFILES[3]
  },
  {
    id: 'snm_003',
    user_id: 'usr_premium_003',
    title: 'Lead Product & Design Systems Designer',
    industry: 'Product Design & Creative Direction',
    experience_years: 7,
    hourly_rate: 110,
    currency: 'USD',
    availability: 'available',
    languages: ['English', 'Mandarin'],
    skills: ['UI/UX Design', 'Design Systems', 'Figma', 'Prototyping', 'User Research', 'Design Tokens'],
    areas_of_expertise: ['FinTech Design', 'B2B SaaS Workflows', 'Design-to-Code Pipelines', 'Micro-Interactions'],
    portfolio_items: [
      {
        id: 'port_4',
        title: 'Aura Enterprise Design System',
        description: 'Comprehensive tokenized UI system powering 18 web and mobile applications.',
        url: 'https://example.com/aura',
        tags: ['Figma', 'Tokens', 'Accessibility']
      }
    ],
    experiences: [
      {
        id: 'exp_3',
        role: 'Design Lead',
        company: 'Vertex Studio (Singapore)',
        period: '2023 - Present',
        description: 'Spearheaded human-centered design strategy for global tier-1 banking clients.'
      }
    ],
    certifications: ['Nielsen Norman Group UX Master Certified'],
    verification_status: 'verified',
    is_approved: true,
    is_featured: false,
    is_active: true,
    badges: ['Skill Network Member', 'Verified', 'Top Skill', 'Available'],
    created_at: '2026-02-15T00:00:00Z',
    updated_at: '2026-02-15T00:00:00Z',
    profile: INITIAL_PROFILES[4]
  }
];

// Seed Projects
export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_001',
    title: 'Next-Gen Autonomous Agent Orchestration Platform',
    slug: 'autonomous-agent-orchestration-platform',
    description: 'We require a senior AI engineer and systems architect to develop a high-throughput multi-agent execution framework. The engine must support deterministic tool calling, state checkpoints, and real-time streaming output across distributed workers.',
    client_name: 'Synthetix Global',
    client_company: 'Synthetix AI Labs (Zurich)',
    category: 'Artificial Intelligence & Systems',
    required_skills: ['Python', 'PyTorch', 'FastAPI', 'Distributed Systems', 'Docker'],
    budget_min: 18000,
    budget_max: 25000,
    currency: 'EUR',
    is_budget_public: true,
    project_type: 'fixed',
    work_mode: 'remote',
    country: 'Switzerland',
    location: 'Zurich / Remote',
    expected_duration: '3 - 4 months',
    deadline: '2026-12-15T00:00:00Z',
    interest_deadline: '2026-11-10T00:00:00Z',
    people_required: 2,
    status: 'published',
    created_by: 'usr_ceo_001',
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-03-01T00:00:00Z',
    interest_count: 4
  },
  {
    id: 'proj_002',
    title: 'International Multi-Currency B2B Treasury Portal',
    slug: 'international-multi-currency-treasury-portal',
    description: 'Action = Matter has been commissioned by an international trade consortium to build a secure, real-time treasury management dashboard. Key milestones include automated reconciliation, localized bank integrations, and ISO 20022 compliance.',
    client_name: 'Atlas Capital Group',
    client_company: 'Atlas Capital Partners (London)',
    category: 'FinTech & Web Architecture',
    required_skills: ['TypeScript', 'Next.js', 'PostgreSQL', 'Security Auditing', 'TailwindCSS'],
    budget_min: 22000,
    budget_max: 30000,
    currency: 'USD',
    is_budget_public: true,
    project_type: 'fixed',
    work_mode: 'remote',
    country: 'United Kingdom',
    location: 'London / Remote',
    expected_duration: '4 months',
    deadline: '2027-01-20T00:00:00Z',
    interest_deadline: '2026-11-15T00:00:00Z',
    people_required: 3,
    status: 'published',
    created_by: 'usr_ceo_001',
    created_at: '2026-03-05T00:00:00Z',
    updated_at: '2026-03-05T00:00:00Z',
    interest_count: 6
  },
  {
    id: 'proj_003',
    title: 'Cross-Platform Medical Diagnostics Telemetry Suite',
    slug: 'cross-platform-medical-telemetry-suite',
    description: 'Designing and deploying an intuitive clinical telemetry monitoring suite for hospitals in Western Europe. Needs rock-solid UX for clinicians and sub-second signal processing for high-risk monitoring equipment.',
    client_name: 'MedBio European Consortium',
    client_company: 'MedBio Systems (Amsterdam)',
    category: 'Healthcare & UI/UX',
    required_skills: ['UI/UX Design', 'Design Systems', 'TypeScript', 'WebSockets'],
    budget_min: 14000,
    budget_max: 19000,
    currency: 'EUR',
    is_budget_public: true,
    project_type: 'fixed',
    work_mode: 'hybrid',
    country: 'Netherlands',
    location: 'Amsterdam',
    expected_duration: '2 - 3 months',
    deadline: '2026-12-30T00:00:00Z',
    interest_deadline: '2026-11-05T00:00:00Z',
    people_required: 2,
    status: 'published',
    created_by: 'usr_ceo_001',
    created_at: '2026-03-10T00:00:00Z',
    updated_at: '2026-03-10T00:00:00Z',
    interest_count: 2
  }
];

// Seed Project Requests
export const INITIAL_PROJECT_REQUESTS: ProjectRequest[] = [
  {
    id: 'preq_001',
    client_name: 'Henrik Lindqvist',
    client_email: 'henrik@nordiclogistics.se',
    client_company: 'Nordic Logistics AB',
    country: 'Sweden',
    title: 'Automated Fleet Telemetry & Predictive Routing Engine',
    description: 'We operate 450 freight carriers across Scandinavia. We seek Action = Matter to architect a real-time dispatch and carbon-optimized route calculation engine.',
    required_skills: ['Go', 'Python', 'GIS / Map APIs', 'Cloud Architecture'],
    budget_range: '€30,000 - €50,000',
    currency: 'EUR',
    timeline: 'Within 60 days',
    work_mode: 'remote',
    additional_requirements: 'Must comply with EU transport data regulations.',
    status: 'pending_review',
    created_at: '2026-03-12T10:00:00Z',
    updated_at: '2026-03-12T10:00:00Z'
  }
];

// Seed Project Interests
export const INITIAL_PROJECT_INTERESTS: ProjectInterest[] = [
  {
    id: 'pint_001',
    project_id: 'proj_001',
    user_id: 'usr_premium_001',
    status: 'shortlisted',
    message: 'I have developed distributed multi-agent inference pipelines at Vanguard Robotics and can immediately take ownership of the deterministic tool-calling engine.',
    agreed_compensation: 12500,
    currency: 'EUR',
    payment_status: 'pending',
    admin_notes: 'Exceptional background in PyTorch and CUDA; top candidate for lead engineer role.',
    reviewed_by: 'usr_ceo_001',
    reviewed_at: '2026-03-04T12:00:00Z',
    submitted_at: '2026-03-02T15:30:00Z',
    updated_at: '2026-03-04T12:00:00Z',
    profile: INITIAL_PROFILES[2],
    project: INITIAL_PROJECTS[0]
  }
];

// Seed Coupons
export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup_001',
    code: 'ACTION50',
    discount_type: 'percentage',
    discount_value: 50,
    max_uses: 500,
    current_uses: 48,
    max_uses_per_user: 1,
    applicable_plans: ['monthly', 'annual'],
    starts_at: '2026-01-01T00:00:00Z',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'coup_002',
    code: 'WELCOME20',
    discount_type: 'percentage',
    discount_value: 20,
    max_uses: 1000,
    current_uses: 124,
    max_uses_per_user: 1,
    applicable_plans: ['monthly', 'annual'],
    starts_at: '2026-01-01T00:00:00Z',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'coup_003',
    code: 'ANNUAL10',
    discount_type: 'percentage',
    discount_value: 10,
    max_uses: 200,
    current_uses: 19,
    max_uses_per_user: 1,
    applicable_plans: ['annual'],
    starts_at: '2026-01-01T00:00:00Z',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  }
];

// Seed Invoices
export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv_001',
    invoice_number: 'INV-2026-849201',
    user_id: 'usr_premium_001',
    plan_name: 'Skill Network Annual Membership',
    billing_period: 'Feb 15, 2026 - Feb 15, 2027',
    amount: 90,
    discount_amount: 18,
    tax_amount: 0,
    total_amount: 72,
    currency: 'EUR',
    payment_provider: 'stripe',
    provider_transaction_id: 'ch_stripe_8349285',
    payment_status: 'paid',
    billing_name: 'Elena Rostova',
    billing_email: 'elena@actionismatter.com',
    billing_country: 'Germany',
    billing_address: 'Friedrichstraße 44, 10117 Berlin',
    paid_at: '2026-02-15T14:30:00Z',
    created_at: '2026-02-15T14:30:00Z'
  },
  {
    id: 'inv_002',
    invoice_number: 'INV-2026-928172',
    user_id: 'usr_premium_002',
    plan_name: 'Skill Network Monthly Membership',
    billing_period: 'Oct 20, 2026 - Nov 20, 2026',
    amount: 10,
    discount_amount: 0,
    tax_amount: 0,
    total_amount: 10,
    currency: 'USD',
    payment_provider: 'stripe',
    provider_transaction_id: 'ch_stripe_1928472',
    payment_status: 'paid',
    billing_name: 'Marcus Vance',
    billing_email: 'marcus@actionismatter.com',
    billing_country: 'United States',
    billing_address: '450 Mission St, San Francisco, CA 94105',
    paid_at: '2026-10-20T11:00:00Z',
    created_at: '2026-10-20T11:00:00Z'
  }
];

// Seed Events (Events & Hubs - Visual specification: Upcoming Events, City Hubs, Past Events, My Events)
export const INITIAL_EVENTS: Event[] = [
  {
    id: 'evt_001',
    title: 'Global AI & Real-World Engineering Summit 2026',
    description: 'An exclusive international summit bringing together top machine learning architects, enterprise founders, and elite Skill Network contributors to explore practical autonomous agents.',
    event_type: 'Conference',
    date: '2026-11-18',
    start_time: '14:00',
    end_time: '18:30',
    timezone: 'Europe/Amsterdam',
    location: 'Akerkhof 22, Amsterdam & Virtual Stream',
    is_online: false,
    host: 'Action = Matter Executive Team',
    capacity: 250,
    topics: ['Artificial Intelligence', 'Agent Systems', 'Distributed Scale'],
    attendees_count: 184,
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    status: 'upcoming'
  },
  {
    id: 'evt_002',
    title: 'Founders & Builders Roundtable: Turning Ideas into Execution',
    description: 'Interactive session exploring how venture builders and international specialists align on deliverables, project scopes, and project compensation.',
    event_type: 'Workshop',
    date: '2026-11-25',
    start_time: '17:00',
    end_time: '19:00',
    timezone: 'Europe/London',
    location: 'Online Live Masterclass',
    is_online: true,
    host: 'Mahammad Razi (CEO)',
    capacity: 100,
    topics: ['Entrepreneurship', 'Project Scoping', 'Skill Network'],
    attendees_count: 82,
    image_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
    status: 'upcoming'
  },
  {
    id: 'evt_003',
    title: 'High-Performance Web & Real-Time Financial Protocols',
    description: 'Deep dive into zero-downtime architecture, resilient payment webhooks, and sub-millisecond data pipes.',
    event_type: 'Webinar',
    date: '2026-10-05',
    start_time: '15:00',
    end_time: '17:00',
    timezone: 'UTC',
    location: 'Virtual Archive Available',
    is_online: true,
    host: 'Marcus Vance & Guests',
    capacity: 300,
    topics: ['Next.js', 'FinTech', 'WebSockets'],
    attendees_count: 240,
    image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    status: 'past'
  }
];

// Seed Hubs (City Hubs & Industry Hubs)
export const INITIAL_HUBS: Hub[] = [
  {
    id: 'hub_ams',
    name: 'Amsterdam City Hub',
    slug: 'amsterdam',
    type: 'city',
    city: 'Amsterdam',
    country: 'Netherlands',
    description: 'The primary European headquarters hub connecting Netherlands-based engineers, tech leads, and venture innovators.',
    icon: 'Building2',
    member_count: 320,
    is_member: true
  },
  {
    id: 'hub_utr',
    name: 'Utrecht City Hub',
    slug: 'utrecht',
    type: 'city',
    city: 'Utrecht',
    country: 'Netherlands',
    description: 'A thriving community of Dutch researchers, health-tech engineers, and software specialists.',
    icon: 'MapPin',
    member_count: 145,
    is_member: false
  },
  {
    id: 'hub_rot',
    name: 'Rotterdam City Hub',
    slug: 'rotterdam',
    type: 'city',
    city: 'Rotterdam',
    country: 'Netherlands',
    description: 'Focusing on maritime logistics technology, industrial engineering, and sustainability platforms.',
    icon: 'Anchor',
    member_count: 118,
    is_member: false
  },
  {
    id: 'hub_ai',
    name: 'Artificial Intelligence & Robotics Hub',
    slug: 'ai-robotics',
    type: 'industry',
    description: 'Specialists building autonomous systems, deep learning models, LLM agents, and vision pipelines.',
    icon: 'Cpu',
    member_count: 512,
    is_member: true
  },
  {
    id: 'hub_tech',
    name: 'Distributed Systems & Cloud Hub',
    slug: 'cloud-systems',
    type: 'industry',
    description: 'Architects of high-throughput databases, microservices, container orchestration, and multi-cloud resilience.',
    icon: 'Server',
    member_count: 420,
    is_member: false
  }
];

// Seed Messages
export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg_001',
    thread_id: 'th_001',
    sender_id: 'usr_ceo_001',
    recipient_id: 'usr_premium_001',
    content: 'Hi Elena, we reviewed your profile for the Autonomous Agent Orchestration project. Your PyTorch and TensorRT track record aligns directly with what Synthetix needs. Can you share your current availability?',
    is_read: true,
    read_at: '2026-03-03T10:00:00Z',
    created_at: '2026-03-03T09:45:00Z'
  },
  {
    id: 'msg_002',
    thread_id: 'th_001',
    sender_id: 'usr_premium_001',
    recipient_id: 'usr_ceo_001',
    content: 'Hello Razi, thank you! Yes, I am currently available for 30-35 hours/week and can begin sprint zero as early as next Monday. Looking forward to reviewing the technical specifications.',
    is_read: true,
    read_at: '2026-03-03T10:15:00Z',
    created_at: '2026-03-03T10:10:00Z'
  }
];

export const INITIAL_THREADS: MessageThread[] = [
  {
    id: 'th_001',
    participant_ids: ['usr_ceo_001', 'usr_premium_001'],
    last_message_at: '2026-03-03T10:10:00Z',
    created_at: '2026-03-03T09:45:00Z',
    last_message: INITIAL_MESSAGES[1],
    other_participant: INITIAL_PROFILES[0],
    unread_count: 0
  }
];

// Seed Audit Logs
export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud_001',
    actor_id: 'usr_ceo_001',
    actor_name: 'Mahammad Razi (CEO)',
    action: 'MEMBER_APPROVED',
    entity: 'skill_network_members',
    entity_id: 'snm_001',
    metadata: { member: 'Elena Rostova', badge: 'Verified Top Skill' },
    ip_address: '82.161.42.10',
    created_at: '2026-02-01T10:00:00Z'
  },
  {
    id: 'aud_002',
    actor_id: 'usr_ceo_001',
    actor_name: 'Mahammad Razi (CEO)',
    action: 'PROJECT_PUBLISHED',
    entity: 'projects',
    entity_id: 'proj_001',
    metadata: { title: 'Autonomous Agent Orchestration Platform', budget: '€25,000' },
    ip_address: '82.161.42.10',
    created_at: '2026-03-01T11:00:00Z'
  },
  {
    id: 'aud_003',
    actor_id: 'usr_admin_001',
    actor_name: 'Sarah Jenkins (Admin)',
    action: 'COUPON_CREATED',
    entity: 'coupons',
    entity_id: 'coup_001',
    metadata: { code: 'ACTION50', discount: '50%' },
    ip_address: '185.86.151.20',
    created_at: '2026-01-01T09:00:00Z'
  }
];

// IN-MEMORY / LOCAL STORAGE STATE CONTROLLER
class PlatformStore {
  private profiles: Profile[] = [...INITIAL_PROFILES];
  private skillMembers: SkillNetworkMember[] = [...INITIAL_SKILL_MEMBERS];
  private projects: Project[] = [...INITIAL_PROJECTS];
  private projectRequests: ProjectRequest[] = [...INITIAL_PROJECT_REQUESTS];
  private projectInterests: ProjectInterest[] = [...INITIAL_PROJECT_INTERESTS];
  private coupons: Coupon[] = [...INITIAL_COUPONS];
  private invoices: Invoice[] = [...INITIAL_INVOICES];
  private events: Event[] = [...INITIAL_EVENTS];
  private hubs: Hub[] = [...INITIAL_HUBS];
  private messages: Message[] = [...INITIAL_MESSAGES];
  private threads: MessageThread[] = [...INITIAL_THREADS];
  private auditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];

  // Active user session simulation (defaulting to Elena - Premium, but switchable on demand to Free or CEO)
  private currentUserId: string = 'usr_premium_001';

  getCurrentUser(): Profile {
    return this.profiles.find(p => p.id === this.currentUserId) || this.profiles[0];
  }

  setCurrentUser(userId: string): Profile | null {
    const user = this.profiles.find(p => p.id === userId);
    if (user) {
      this.currentUserId = user.id;
      return user;
    }
    return null;
  }

  getProfiles(): Profile[] {
    return this.profiles;
  }

  getProfileById(id: string): Profile | undefined {
    return this.profiles.find(p => p.id === id);
  }

  updateProfile(id: string, updates: Partial<Profile>): Profile | null {
    const idx = this.profiles.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.profiles[idx] = { ...this.profiles[idx], ...updates, updated_at: new Date().toISOString() };
    return this.profiles[idx];
  }

  // Skill Network
  getSkillMembers(query?: string, skill?: string, country?: string): SkillNetworkMember[] {
    return this.skillMembers.filter(m => {
      if (!m.is_approved || !m.is_active) return false;
      if (skill && !m.skills.some(s => s.toLowerCase() === skill.toLowerCase())) return false;
      if (country && m.profile?.country_code !== country) return false;
      if (query) {
        const q = query.toLowerCase();
        const matchesName = m.profile?.full_name.toLowerCase().includes(q);
        const matchesTitle = m.title.toLowerCase().includes(q);
        const matchesSkill = m.skills.some(s => s.toLowerCase().includes(q));
        if (!matchesName && !matchesTitle && !matchesSkill) return false;
      }
      return true;
    });
  }

  getAllSkillMembersForAdmin(): SkillNetworkMember[] {
    return this.skillMembers;
  }

  getMemberByUsername(username: string): SkillNetworkMember | undefined {
    return this.skillMembers.find(m => m.profile?.username.toLowerCase() === username.toLowerCase());
  }

  updateMemberStatus(id: string, updates: Partial<SkillNetworkMember>): SkillNetworkMember | null {
    const idx = this.skillMembers.findIndex(m => m.id === id);
    if (idx === -1) return null;
    this.skillMembers[idx] = { ...this.skillMembers[idx], ...updates, updated_at: new Date().toISOString() };
    return this.skillMembers[idx];
  }

  // Projects
  getProjects(query?: string, category?: string, skill?: string): Project[] {
    return this.projects.filter(p => {
      if (p.status !== 'published') return false;
      if (category && p.category !== category) return false;
      if (skill && !p.required_skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))) return false;
      if (query) {
        const q = query.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesSkill = p.required_skills.some(s => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesSkill) return false;
      }
      return true;
    });
  }

  getAllProjectsForAdmin(): Project[] {
    return this.projects;
  }

  getProjectById(id: string): Project | undefined {
    return this.projects.find(p => p.id === id || p.slug === id);
  }

  createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Project {
    const newProj: Project = {
      ...project,
      id: `proj_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.projects.unshift(newProj);
    this.addAuditLog('PROJECT_CREATED', 'projects', newProj.id, { title: newProj.title });
    return newProj;
  }

  updateProject(id: string, updates: Partial<Project>): Project | null {
    const idx = this.projects.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.projects[idx] = { ...this.projects[idx], ...updates, updated_at: new Date().toISOString() };
    return this.projects[idx];
  }

  // Project Interests
  getProjectInterests(projectId?: string): ProjectInterest[] {
    if (projectId) {
      return this.projectInterests.filter(i => i.project_id === projectId);
    }
    return this.projectInterests;
  }

  getUserInterests(userId: string): ProjectInterest[] {
    return this.projectInterests.filter(i => i.user_id === userId);
  }

  submitProjectInterest(projectId: string, userId: string, message: string): { success: boolean; interest?: ProjectInterest; error?: string } {
    const user = this.getProfileById(userId);
    if (!user || (user.role !== 'premium_member' && user.role !== 'admin' && user.role !== 'ceo' && user.membership_status !== 'active')) {
      return { success: false, error: 'Only Premium Skill Network members can express interest in projects.' };
    }

    const existing = this.projectInterests.find(i => i.project_id === projectId && i.user_id === userId);
    if (existing) {
      return { success: false, error: 'You have already submitted an expression of interest for this project.' };
    }

    const project = this.getProjectById(projectId);
    const newInterest: ProjectInterest = {
      id: `pint_${Date.now()}`,
      project_id: projectId,
      user_id: userId,
      status: 'submitted',
      message,
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      profile: user,
      project
    };

    this.projectInterests.unshift(newInterest);
    if (project) {
      project.interest_count = (project.interest_count || 0) + 1;
    }
    this.addAuditLog('INTEREST_SUBMITTED', 'project_interests', newInterest.id, { projectId, userId });
    return { success: true, interest: newInterest };
  }

  updateInterestStatus(id: string, status: ProjectInterest['status'], adminNotes?: string, compensation?: number): ProjectInterest | null {
    const idx = this.projectInterests.findIndex(i => i.id === id);
    if (idx === -1) return null;
    this.projectInterests[idx] = {
      ...this.projectInterests[idx],
      status,
      admin_notes: adminNotes || this.projectInterests[idx].admin_notes,
      agreed_compensation: compensation ?? this.projectInterests[idx].agreed_compensation,
      reviewed_by: this.currentUserId,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.addAuditLog('INTEREST_UPDATED', 'project_interests', id, { status, compensation });
    return this.projectInterests[idx];
  }

  // Client Project Requests
  getProjectRequests(): ProjectRequest[] {
    return this.projectRequests;
  }

  submitProjectRequest(request: Omit<ProjectRequest, 'id' | 'status' | 'created_at' | 'updated_at'>): ProjectRequest {
    const newReq: ProjectRequest = {
      ...request,
      id: `preq_${Date.now()}`,
      status: 'pending_review',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.projectRequests.unshift(newReq);
    this.addAuditLog('CLIENT_REQUEST_SUBMITTED', 'project_requests', newReq.id, { client: newReq.client_name, title: newReq.title });
    return newReq;
  }

  convertRequestToProject(requestId: string): Project | null {
    const req = this.projectRequests.find(r => r.id === requestId);
    if (!req) return null;

    const newProject = this.createProject({
      title: req.title,
      slug: req.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      description: req.description,
      client_name: req.client_name,
      client_company: req.client_company,
      category: 'Client Commission',
      required_skills: req.required_skills || ['Software Architecture'],
      currency: req.currency || 'USD',
      is_budget_public: true,
      project_type: 'fixed',
      work_mode: (req.work_mode as Project['work_mode']) || 'remote',
      country: req.country,
      people_required: 1,
      status: 'published',
      created_by: this.currentUserId
    });

    req.status = 'converted';
    req.converted_project_id = newProject.id;
    req.updated_at = new Date().toISOString();
    return newProject;
  }

  // Membership & Payments
  activatePremium(userId: string, planId: 'monthly' | 'annual', currency: SupportedCurrency, couponCode?: string, provider: 'stripe' | 'razorpay' | 'demo' = 'stripe'): { subscription: Subscription; invoice: Invoice } {
    const user = this.getProfileById(userId);
    if (!user) throw new Error('User not found');

    const pricing = REGIONAL_PRICING[currency];
    const baseAmount = planId === 'monthly' ? pricing.monthly : pricing.annual;
    let discount = 0;

    if (couponCode) {
      const coupon = this.validateCoupon(couponCode, planId);
      if (coupon.valid && coupon.coupon) {
        if (coupon.coupon.discount_type === 'percentage') {
          discount = (baseAmount * coupon.coupon.discount_value) / 100;
        } else {
          discount = coupon.coupon.discount_value;
        }
        coupon.coupon.current_uses += 1;
      }
    }

    const totalAmount = Math.max(0, baseAmount - discount);
    const now = new Date();
    const periodEnd = new Date(now);
    if (planId === 'monthly') {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    // 1. Create Subscription
    const subscription: Subscription = {
      id: `sub_${Date.now()}`,
      user_id: userId,
      provider,
      provider_customer_id: `cus_${userId.slice(0, 8)}`,
      provider_subscription_id: `sub_prov_${Date.now()}`,
      plan_id: planId,
      status: 'active',
      amount: totalAmount,
      currency,
      current_period_start: now.toISOString(),
      current_period_end: periodEnd.toISOString(),
      cancel_at_period_end: false,
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    };

    // 2. Create Invoice
    const year = now.getFullYear();
    const rand = Math.floor(100000 + Math.random() * 900000);
    const invoice: Invoice = {
      id: `inv_${Date.now()}`,
      invoice_number: `INV-${year}-${rand}`,
      user_id: userId,
      subscription_id: subscription.id,
      plan_name: `Skill Network ${planId === 'monthly' ? 'Monthly' : 'Annual'} Membership`,
      billing_period: `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${periodEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      amount: baseAmount,
      discount_amount: discount,
      tax_amount: 0,
      total_amount: totalAmount,
      currency,
      payment_provider: provider,
      provider_transaction_id: `txn_${Date.now()}`,
      payment_status: 'paid',
      billing_name: user.full_name,
      billing_email: user.email,
      billing_country: user.country_name,
      paid_at: now.toISOString(),
      created_at: now.toISOString()
    };

    this.invoices.unshift(invoice);

    // 3. Update User Profile
    user.role = 'premium_member';
    user.membership_status = 'active';
    user.membership_tier = planId;
    user.subscription_period_end = periodEnd.toISOString();
    user.updated_at = now.toISOString();

    // 4. Ensure Skill Network Member Record Exists & is Active
    const existingMember = this.skillMembers.find(m => m.user_id === userId);
    if (existingMember) {
      existingMember.is_active = true;
      existingMember.is_approved = true;
    } else {
      const newMember: SkillNetworkMember = {
        id: `snm_${Date.now()}`,
        user_id: userId,
        title: user.profession || 'Skill Network Specialist',
        experience_years: 3,
        currency,
        availability: 'available',
        languages: ['English'],
        skills: ['Software Engineering', 'System Architecture'],
        areas_of_expertise: ['Agile Execution', 'Technical Delivery'],
        portfolio_items: [],
        experiences: [],
        certifications: [],
        verification_status: 'pending',
        is_approved: true, // Activated on payment per business rules
        is_featured: false,
        is_active: true,
        badges: ['Skill Network Member'],
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        profile: user
      };
      this.skillMembers.push(newMember);
    }

    this.addAuditLog('PREMIUM_ACTIVATED', 'subscriptions', subscription.id, {
      userId,
      planId,
      amount: totalAmount,
      currency
    });

    return { subscription, invoice };
  }

  cancelSubscription(userId: string): { success: boolean; message: string } {
    const user = this.getProfileById(userId);
    if (!user) return { success: false, message: 'User not found' };

    user.cancel_at_period_end = true;
    user.updated_at = new Date().toISOString();
    this.addAuditLog('SUBSCRIPTION_CANCELLED', 'profiles', user.id, { effectiveUntil: user.subscription_period_end });
    return {
      success: true,
      message: `Your subscription has been cancelled. You retain full Premium access until ${new Date(user.subscription_period_end || '').toLocaleDateString()}.`
    };
  }

  // Coupons
  getCoupons(): Coupon[] {
    return this.coupons;
  }

  validateCoupon(code: string, planId: 'monthly' | 'annual'): { valid: boolean; message: string; coupon?: Coupon } {
    const cleanCode = code.trim().toUpperCase();
    const coupon = this.coupons.find(c => c.code.toUpperCase() === cleanCode);
    if (!coupon) {
      return { valid: false, message: 'Invalid coupon code.' };
    }
    if (!coupon.is_active) {
      return { valid: false, message: 'This coupon is no longer active.' };
    }
    if (coupon.current_uses >= coupon.max_uses) {
      return { valid: false, message: 'This coupon has reached its maximum redemptions.' };
    }
    if (!coupon.applicable_plans.includes(planId)) {
      return { valid: false, message: `This coupon only applies to ${coupon.applicable_plans.join(', ')} plans.` };
    }
    return { valid: true, message: `Coupon applied: ${coupon.discount_value}${coupon.discount_type === 'percentage' ? '%' : ''} discount.`, coupon };
  }

  createCoupon(coupon: Omit<Coupon, 'id' | 'current_uses' | 'created_at'>): Coupon {
    const newCoupon: Coupon = {
      ...coupon,
      id: `coup_${Date.now()}`,
      current_uses: 0,
      created_at: new Date().toISOString()
    };
    this.coupons.unshift(newCoupon);
    this.addAuditLog('COUPON_CREATED', 'coupons', newCoupon.id, { code: newCoupon.code, discount: newCoupon.discount_value });
    return newCoupon;
  }

  // Invoices
  getInvoices(userId?: string): Invoice[] {
    if (userId) {
      return this.invoices.filter(inv => inv.user_id === userId);
    }
    return this.invoices;
  }

  getInvoiceById(id: string): Invoice | undefined {
    return this.invoices.find(inv => inv.id === id || inv.invoice_number === id);
  }

  // Messages
  getThreads(userId: string): MessageThread[] {
    return this.threads.filter(t => t.participant_ids.includes(userId));
  }

  getThreadMessages(threadId: string): Message[] {
    return this.messages.filter(m => m.thread_id === threadId).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  sendMessage(senderId: string, recipientId: string, content: string): Message {
    let thread = this.threads.find(t => t.participant_ids.includes(senderId) && t.participant_ids.includes(recipientId));
    if (!thread) {
      thread = {
        id: `th_${Date.now()}`,
        participant_ids: [senderId, recipientId],
        last_message_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      };
      this.threads.unshift(thread);
    }

    const message: Message = {
      id: `msg_${Date.now()}`,
      thread_id: thread.id,
      sender_id: senderId,
      recipient_id: recipientId,
      content,
      is_read: false,
      created_at: new Date().toISOString(),
      sender: this.getProfileById(senderId)
    };

    this.messages.push(message);
    thread.last_message_at = message.created_at;
    thread.last_message = message;
    return message;
  }

  // Events & Hubs
  getEvents(filter?: 'upcoming' | 'past' | 'my'): Event[] {
    const now = new Date().toISOString().split('T')[0];
    if (filter === 'upcoming') {
      return this.events.filter(e => e.date >= now);
    }
    if (filter === 'past') {
      return this.events.filter(e => e.date < now);
    }
    if (filter === 'my') {
      return this.events.filter(e => e.is_registered);
    }
    return this.events;
  }

  registerForEvent(eventId: string): boolean {
    const event = this.events.find(e => e.id === eventId);
    if (!event) return false;
    event.is_registered = true;
    event.attendees_count += 1;
    return true;
  }

  getHubs(): Hub[] {
    return this.hubs;
  }

  toggleHubMembership(hubId: string): boolean {
    const hub = this.hubs.find(h => h.id === hubId);
    if (!hub) return false;
    hub.is_member = !hub.is_member;
    hub.member_count += hub.is_member ? 1 : -1;
    return hub.is_member;
  }

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }

  addAuditLog(action: string, entity: string, entity_id?: string, metadata?: Record<string, unknown>) {
    const currentUser = this.getCurrentUser();
    this.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      actor_id: currentUser.id,
      actor_name: `${currentUser.full_name} (${currentUser.role})`,
      action,
      entity,
      entity_id,
      metadata,
      ip_address: '127.0.0.1',
      created_at: new Date().toISOString()
    });
  }
}

export const platformStore = new PlatformStore();
