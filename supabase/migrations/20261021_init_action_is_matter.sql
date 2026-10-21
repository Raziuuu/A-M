-- ==========================================================
-- ACTION = MATTER PostgreSQL Database Schema & Migrations
-- Production Schema with RBAC, RLS, Indexes, Triggers, & Seeds
-- ==========================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    country_code VARCHAR(3) DEFAULT 'US',
    country_name TEXT DEFAULT 'United States',
    city TEXT,
    timezone TEXT DEFAULT 'UTC',
    locale TEXT DEFAULT 'en-US',
    profession TEXT,
    bio TEXT,
    website TEXT,
    linkedin TEXT,
    github TEXT,
    twitter TEXT,
    role VARCHAR(30) NOT NULL DEFAULT 'free_user' CHECK (role IN ('guest', 'free_user', 'premium_member', 'admin', 'ceo')),
    membership_status VARCHAR(30) NOT NULL DEFAULT 'inactive' CHECK (membership_status IN ('inactive', 'active', 'trialing', 'past_due', 'cancelled', 'expired', 'payment_failed')),
    membership_tier VARCHAR(20) DEFAULT 'free' CHECK (membership_tier IN ('free', 'monthly', 'annual')),
    subscription_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. SKILL NETWORK PROFILES (Official Directory)
CREATE TABLE IF NOT EXISTS public.skill_network_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    title TEXT NOT NULL,
    industry TEXT,
    experience_years INT DEFAULT 1,
    hourly_rate NUMERIC(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    availability VARCHAR(30) DEFAULT 'available' CHECK (availability IN ('available', 'busy', 'part_time', 'full_time', 'unavailable')),
    languages TEXT[] DEFAULT ARRAY['English'],
    skills TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    areas_of_expertise TEXT[] DEFAULT ARRAY[]::TEXT[],
    portfolio_items JSONB DEFAULT '[]'::JSONB,
    experiences JSONB DEFAULT '[]'::JSONB,
    certifications JSONB DEFAULT '[]'::JSONB,
    verification_status VARCHAR(30) DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified')),
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    approved_by UUID REFERENCES public.profiles(id),
    approved_at TIMESTAMPTZ,
    badges TEXT[] DEFAULT ARRAY['Skill Network Member']::TEXT[],
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PROJECTS (Marketplace opportunities managed by Admin/CEO)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_company TEXT,
    category TEXT NOT NULL,
    required_skills TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    budget_min NUMERIC(10, 2),
    budget_max NUMERIC(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    is_budget_public BOOLEAN DEFAULT TRUE,
    project_type VARCHAR(20) DEFAULT 'fixed' CHECK (project_type IN ('fixed', 'hourly', 'retainer')),
    work_mode VARCHAR(20) DEFAULT 'remote' CHECK (work_mode IN ('remote', 'onsite', 'hybrid')),
    country TEXT,
    location TEXT,
    expected_duration TEXT,
    deadline TIMESTAMPTZ,
    interest_deadline TIMESTAMPTZ,
    people_required INT DEFAULT 1,
    status VARCHAR(30) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'pending_review', 'published', 'interest_open', 'selection', 'in_progress', 'completed', 'cancelled', 'archived')),
    attachments JSONB DEFAULT '[]'::JSONB,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PROJECT REQUESTS (Public client project inquiry)
CREATE TABLE IF NOT EXISTS public.project_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_company TEXT,
    country TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    required_skills TEXT[] DEFAULT ARRAY[]::TEXT[],
    budget_range TEXT,
    currency VARCHAR(3) DEFAULT 'USD',
    timeline TEXT,
    work_mode VARCHAR(20) DEFAULT 'remote',
    additional_requirements TEXT,
    attachments JSONB DEFAULT '[]'::JSONB,
    status VARCHAR(30) NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'under_review', 'converted', 'rejected', 'archived')),
    converted_project_id UUID REFERENCES public.projects(id),
    admin_notes TEXT,
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PROJECT INTERESTS (Expressions of interest from Premium Members)
CREATE TABLE IF NOT EXISTS public.project_interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewing', 'shortlisted', 'selected', 'rejected', 'withdrawn')),
    message TEXT NOT NULL,
    agreed_compensation NUMERIC(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    payment_status VARCHAR(30) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'approved', 'processing', 'paid', 'cancelled')),
    payment_date TIMESTAMPTZ,
    admin_notes TEXT,
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- 6. COUPONS
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    max_uses INT DEFAULT 1000,
    current_uses INT DEFAULT 0,
    max_uses_per_user INT DEFAULT 1,
    applicable_plans TEXT[] DEFAULT ARRAY['monthly', 'annual'],
    starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    provider VARCHAR(30) NOT NULL CHECK (provider IN ('stripe', 'razorpay', 'manual', 'demo')),
    provider_customer_id TEXT,
    provider_subscription_id TEXT UNIQUE,
    plan_id VARCHAR(30) NOT NULL CHECK (plan_id IN ('monthly', 'annual')),
    status VARCHAR(30) NOT NULL CHECK (status IN ('active', 'past_due', 'cancelled', 'expired', 'trialing')),
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    cancelled_at TIMESTAMPTZ,
    coupon_id UUID REFERENCES public.coupons(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. INVOICES
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.subscriptions(id),
    plan_name TEXT NOT NULL,
    billing_period TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) DEFAULT 0,
    tax_amount NUMERIC(10, 2) DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    payment_provider VARCHAR(30) NOT NULL,
    provider_transaction_id TEXT,
    payment_status VARCHAR(30) DEFAULT 'paid' CHECK (payment_status IN ('paid', 'pending', 'failed', 'refunded')),
    billing_name TEXT NOT NULL,
    billing_email TEXT NOT NULL,
    billing_country TEXT,
    billing_address TEXT,
    invoice_pdf_url TEXT,
    paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. COUPON REDEMPTIONS
CREATE TABLE IF NOT EXISTS public.coupon_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID NOT NULL REFERENCES public.coupons(id),
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    subscription_id UUID REFERENCES public.subscriptions(id),
    invoice_id UUID REFERENCES public.invoices(id),
    redeemed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. MESSAGES & THREADS
CREATE TABLE IF NOT EXISTS public.message_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_ids UUID[] NOT NULL,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES public.message_threads(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    attachments JSONB DEFAULT '[]'::JSONB,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. EVENTS & HUBS
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    event_type VARCHAR(30) NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    timezone VARCHAR(50) DEFAULT 'UTC',
    location TEXT NOT NULL,
    is_online BOOLEAN DEFAULT FALSE,
    host TEXT NOT NULL,
    capacity INT,
    topics TEXT[] DEFAULT ARRAY[]::TEXT[],
    attendees_count INT DEFAULT 0,
    image_url TEXT,
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'in_progress', 'past', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.event_attendees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.hubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('city', 'industry', 'skill', 'community')),
    city TEXT,
    country TEXT,
    description TEXT NOT NULL,
    icon TEXT,
    member_count INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hub_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id UUID NOT NULL REFERENCES public.hubs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(hub_id, user_id)
);

-- 12. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT,
    metadata JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. CMS CONTENT
CREATE TABLE IF NOT EXISTS public.cms_content (
    key VARCHAR(100) PRIMARY KEY,
    section VARCHAR(50) NOT NULL,
    content JSONB NOT NULL,
    updated_by UUID REFERENCES public.profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_membership ON public.profiles(membership_status);
CREATE INDEX IF NOT EXISTS idx_skill_members_active ON public.skill_network_members(is_active, is_approved);
CREATE INDEX IF NOT EXISTS idx_skill_members_skills ON public.skill_network_members USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_skills ON public.projects USING GIN(required_skills);
CREATE INDEX IF NOT EXISTS idx_project_interests_project ON public.project_interests(project_id);
CREATE INDEX IF NOT EXISTS idx_project_interests_user ON public.project_interests(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_thread ON public.messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON public.messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_network_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hub_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;

-- Helper function: Is Admin or CEO
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'ceo')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Is Premium Member
CREATE OR REPLACE FUNCTION public.is_premium()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND (role IN ('premium_member', 'admin', 'ceo') OR membership_status = 'active')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES Policies
CREATE POLICY "Public profiles are readable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins have full access to profiles"
ON public.profiles FOR ALL
USING (public.is_admin());

-- SKILL NETWORK MEMBERS Policies
CREATE POLICY "Approved active members visible to everyone"
ON public.skill_network_members FOR SELECT
USING (is_approved = true AND is_active = true);

CREATE POLICY "Members can view and update their own skill profile"
ON public.skill_network_members FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Admins have full control over skill network"
ON public.skill_network_members FOR ALL
USING (public.is_admin());

-- PROJECTS Policies
CREATE POLICY "Projects published are readable by authenticated users"
ON public.projects FOR SELECT
USING (status IN ('published', 'interest_open', 'selection', 'in_progress', 'completed') AND auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to projects"
ON public.projects FOR ALL
USING (public.is_admin());

-- PROJECT INTERESTS Policies
CREATE POLICY "Premium users can insert project interests"
ON public.project_interests FOR INSERT
WITH CHECK (auth.uid() = user_id AND public.is_premium());

CREATE POLICY "Users can view their own interests"
ON public.project_interests FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view and manage all interests"
ON public.project_interests FOR ALL
USING (public.is_admin());

-- PROJECT REQUESTS Policies
CREATE POLICY "Anyone can create a project request"
ON public.project_requests FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view and manage project requests"
ON public.project_requests FOR ALL
USING (public.is_admin());

-- INVOICES & SUBSCRIPTIONS
CREATE POLICY "Users can view own invoices"
ON public.invoices FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view own subscriptions"
ON public.subscriptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins have full access to invoices and subscriptions"
ON public.invoices FOR ALL
USING (public.is_admin());

CREATE POLICY "Admins have full access to subscriptions"
ON public.subscriptions FOR ALL
USING (public.is_admin());

-- MESSAGES Policies
CREATE POLICY "Users can view messages they sent or received"
ON public.messages FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Premium users can send messages"
ON public.messages FOR INSERT
WITH CHECK (auth.uid() = sender_id AND public.is_premium());

CREATE POLICY "Users can update their received message status"
ON public.messages FOR UPDATE
USING (auth.uid() = recipient_id);

-- EVENTS & HUBS
CREATE POLICY "Events are viewable by all"
ON public.events FOR SELECT
USING (true);

CREATE POLICY "Hubs are viewable by all"
ON public.hubs FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can join events"
ON public.event_attendees FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can join hubs"
ON public.hub_members FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Admins manage events and hubs"
ON public.events FOR ALL
USING (public.is_admin());

CREATE POLICY "Admins manage hubs"
ON public.hubs FOR ALL
USING (public.is_admin());

-- AUDIT LOGS Policies
CREATE POLICY "Admins can view audit logs"
ON public.audit_logs FOR SELECT
USING (public.is_admin());

-- CMS Policies
CREATE POLICY "CMS is readable by all"
ON public.cms_content FOR SELECT
USING (true);

CREATE POLICY "Admins manage CMS"
ON public.cms_content FOR ALL
USING (public.is_admin());
