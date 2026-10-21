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

// Initial Founder / Owner Profile
export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'usr_ceo_001',
    email: 'ceo@actionismatter.com',
    full_name: 'Mahammad Razi',
    username: 'razi',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    country_code: 'NL',
    country_name: 'Netherlands',
    city: 'Amsterdam',
    timezone: 'Europe/Amsterdam',
    locale: 'en-US',
    profession: 'Founder & CEO',
    bio: 'Founder at ACTION = MATTER. Where Ideas Turn Into Action.',
    website: 'https://actionismatter.com',
    linkedin: 'https://linkedin.com',
    role: 'ceo',
    membership_status: 'active',
    membership_tier: 'annual',
    cancel_at_period_end: false,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  }
];

export const INITIAL_SKILL_MEMBERS: SkillNetworkMember[] = [];
export const INITIAL_PROJECTS: Project[] = [];
export const INITIAL_PROJECT_REQUESTS: ProjectRequest[] = [];
export const INITIAL_PROJECT_INTERESTS: ProjectInterest[] = [];
export const INITIAL_SUBSCRIPTIONS: Subscription[] = [];

// System Coupons for Checkout Discounts
export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup_001',
    code: 'ACTION50',
    discount_type: 'percentage',
    discount_value: 50,
    max_uses: 500,
    current_uses: 0,
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
    current_uses: 0,
    max_uses_per_user: 1,
    applicable_plans: ['monthly', 'annual'],
    starts_at: '2026-01-01T00:00:00Z',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  }
];

export const INITIAL_INVOICES: Invoice[] = [];
export const INITIAL_EVENTS: Event[] = [];

// Official Action = Matter Regional Chapters
export const INITIAL_HUBS: Hub[] = [
  {
    id: 'hub_ams',
    name: 'Amsterdam City Hub',
    slug: 'amsterdam',
    type: 'city',
    city: 'Amsterdam',
    country: 'Netherlands',
    description: 'European headquarters hub connecting Netherlands-based engineers, tech leads, and venture innovators.',
    icon: 'Building2',
    member_count: 0,
    is_member: false
  },
  {
    id: 'hub_lon',
    name: 'London City Hub',
    slug: 'london',
    type: 'city',
    city: 'London',
    country: 'United Kingdom',
    description: 'Connecting financial technology architects, quantitative developers, and systems specialists.',
    icon: 'Building',
    member_count: 0,
    is_member: false
  },
  {
    id: 'hub_nyc',
    name: 'New York City Hub',
    slug: 'new-york',
    type: 'city',
    city: 'New York',
    country: 'United States',
    description: 'Connecting North American engineering leaders, venture founders, and autonomous systems builders.',
    icon: 'Compass',
    member_count: 0,
    is_member: false
  },
  {
    id: 'hub_blr',
    name: 'Bengaluru Tech Hub',
    slug: 'bengaluru',
    type: 'city',
    city: 'Bengaluru',
    country: 'India',
    description: 'Premier technology and engineering community for elite full-stack and cloud architects.',
    icon: 'Cpu',
    member_count: 0,
    is_member: false
  }
];

export const INITIAL_MESSAGES: Message[] = [];
export const INITIAL_THREADS: MessageThread[] = [];
export const INITIAL_AUDIT_LOGS: AuditLog[] = [];

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
  private currentUserId: string = 'usr_ceo_001';

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
