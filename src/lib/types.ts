export type UserRole = 'guest' | 'free_user' | 'premium_member' | 'admin' | 'ceo';

export type MembershipStatus =
  | 'inactive'
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'cancelled'
  | 'expired'
  | 'payment_failed';

export type MembershipTier = 'free' | 'monthly' | 'annual';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  username: string;
  avatar_url?: string;
  country_code: string;
  country_name: string;
  city?: string;
  timezone: string;
  locale: string;
  profession?: string;
  bio?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  role: UserRole;
  membership_status: MembershipStatus;
  membership_tier: MembershipTier;
  subscription_period_end?: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export type AvailabilityStatus = 'available' | 'busy' | 'part_time' | 'full_time' | 'unavailable';
export type VerificationStatus = 'unverified' | 'pending' | 'verified';

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  url?: string;
  image_url?: string;
  tags: string[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface SkillNetworkMember {
  id: string;
  user_id: string;
  title: string;
  industry?: string;
  experience_years: number;
  hourly_rate?: number;
  currency: string;
  availability: AvailabilityStatus;
  languages: string[];
  skills: string[];
  areas_of_expertise: string[];
  portfolio_items: PortfolioItem[];
  experiences: ExperienceItem[];
  certifications: string[];
  verification_status: VerificationStatus;
  is_approved: boolean;
  is_featured: boolean;
  is_active: boolean;
  approved_by?: string;
  approved_at?: string;
  badges: string[];
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export type ProjectStatus =
  | 'draft'
  | 'pending_review'
  | 'published'
  | 'interest_open'
  | 'selection'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'archived';

export type ProjectType = 'fixed' | 'hourly' | 'retainer';
export type WorkMode = 'remote' | 'onsite' | 'hybrid';

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  client_name: string;
  client_company?: string;
  category: string;
  required_skills: string[];
  budget_min?: number;
  budget_max?: number;
  currency: string;
  is_budget_public: boolean;
  project_type: ProjectType;
  work_mode: WorkMode;
  country?: string;
  location?: string;
  expected_duration?: string;
  deadline?: string;
  interest_deadline?: string;
  people_required: number;
  status: ProjectStatus;
  attachments?: string[];
  created_by?: string;
  created_at: string;
  updated_at: string;
  interest_count?: number;
  user_has_interested?: boolean;
}

export type ProjectRequestStatus =
  | 'pending_review'
  | 'under_review'
  | 'converted'
  | 'rejected'
  | 'archived';

export interface ProjectRequest {
  id: string;
  client_name: string;
  client_email: string;
  client_company?: string;
  country?: string;
  title: string;
  description: string;
  required_skills: string[];
  budget_range?: string;
  currency: string;
  timeline?: string;
  work_mode: string;
  additional_requirements?: string;
  attachments?: string[];
  status: ProjectRequestStatus;
  converted_project_id?: string;
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export type ProjectInterestStatus =
  | 'submitted'
  | 'reviewing'
  | 'shortlisted'
  | 'selected'
  | 'rejected'
  | 'withdrawn';

export interface ProjectInterest {
  id: string;
  project_id: string;
  user_id: string;
  status: ProjectInterestStatus;
  message: string;
  agreed_compensation?: number;
  currency?: string;
  payment_status?: 'pending' | 'approved' | 'processing' | 'paid' | 'cancelled';
  payment_date?: string;
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  submitted_at: string;
  updated_at: string;
  profile?: Profile;
  project?: Project;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  currency?: string;
  max_uses: number;
  current_uses: number;
  max_uses_per_user: number;
  applicable_plans: string[];
  starts_at: string;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  provider: 'stripe' | 'razorpay' | 'manual' | 'demo';
  provider_customer_id?: string;
  provider_subscription_id?: string;
  plan_id: 'monthly' | 'annual';
  status: 'active' | 'past_due' | 'cancelled' | 'expired' | 'trialing';
  amount: number;
  currency: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  cancelled_at?: string;
  coupon_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  user_id: string;
  subscription_id?: string;
  plan_name: string;
  billing_period: string;
  amount: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  payment_provider: string;
  provider_transaction_id?: string;
  payment_status: 'paid' | 'pending' | 'failed' | 'refunded';
  billing_name: string;
  billing_email: string;
  billing_country?: string;
  billing_address?: string;
  invoice_pdf_url?: string;
  paid_at: string;
  created_at: string;
}

export interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  attachments?: { name: string; url: string; size?: number }[];
  is_read: boolean;
  read_at?: string;
  created_at: string;
  sender?: Profile;
}

export interface MessageThread {
  id: string;
  participant_ids: string[];
  last_message_at: string;
  created_at: string;
  last_message?: Message;
  other_participant?: Profile;
  unread_count?: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  event_type: 'Networking' | 'Workshop' | 'Conference' | 'Webinar' | 'Meetup' | 'Community' | 'Business' | 'Technology';
  date: string;
  start_time: string;
  end_time: string;
  timezone: string;
  location: string;
  is_online: boolean;
  host: string;
  capacity?: number;
  topics: string[];
  attendees_count: number;
  image_url?: string;
  status: 'upcoming' | 'in_progress' | 'past' | 'cancelled';
  is_registered?: boolean;
}

export interface Hub {
  id: string;
  name: string;
  slug: string;
  type: 'city' | 'industry' | 'skill' | 'community';
  city?: string;
  country?: string;
  description: string;
  icon?: string;
  member_count: number;
  is_member?: boolean;
}

export interface AuditLog {
  id: string;
  actor_id?: string;
  actor_name?: string;
  action: string;
  entity: string;
  entity_id?: string;
  metadata?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}

export type SupportedCurrency = 'EUR' | 'USD' | 'INR';

export interface PlanPricing {
  currency: SupportedCurrency;
  symbol: string;
  monthly: number;
  annual: number;
  formattedMonthly: string;
  formattedAnnual: string;
  taxNote: string;
}
