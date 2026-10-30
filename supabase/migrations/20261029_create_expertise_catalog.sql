-- ==========================================================
-- ACTION = MATTER Database Migration: Expertise Taxonomy & Catalog
-- Niches, Skills, Aliases, ProfileSkills & Suggestions
-- ==========================================================

-- 1. NICHES TABLE
CREATE TABLE IF NOT EXISTS public.niches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    niche_id UUID NOT NULL REFERENCES public.niches(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    subcategory TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. SKILL ALIASES TABLE (For search enhancement & synonyms)
CREATE TABLE IF NOT EXISTS public.skill_aliases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    alias TEXT NOT NULL,
    locale VARCHAR(10) NOT NULL DEFAULT 'en',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PROFILE SKILLS TABLE (User selections with optional depth)
CREATE TABLE IF NOT EXISTS public.profile_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    level VARCHAR(20) CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    years_experience INT,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_profile_skill UNIQUE (profile_id, skill_id)
);

-- 5. EXPERTISE SUGGESTIONS TABLE (Community proposed skills)
CREATE TABLE IF NOT EXISTS public.expertise_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    proposed_name TEXT NOT NULL,
    niche_id UUID REFERENCES public.niches(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for lightning-fast search and foreign keys
CREATE INDEX IF NOT EXISTS idx_skills_niche_id ON public.skills(niche_id);
CREATE INDEX IF NOT EXISTS idx_skills_slug ON public.skills(slug);
CREATE INDEX IF NOT EXISTS idx_skills_status ON public.skills(status);
CREATE INDEX IF NOT EXISTS idx_skills_name ON public.skills(name);
CREATE INDEX IF NOT EXISTS idx_profile_skills_profile_id ON public.profile_skills(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_skills_skill_id ON public.profile_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_aliases_skill_id ON public.skill_aliases(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_aliases_alias ON public.skill_aliases(alias);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.niches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expertise_suggestions ENABLE ROW LEVEL SECURITY;

-- Niches: anyone can read active niches
DROP POLICY IF EXISTS "Public can view active niches" ON public.niches;
CREATE POLICY "Public can view active niches" ON public.niches
    FOR SELECT USING (status = 'active');

-- Skills: anyone can read active skills
DROP POLICY IF EXISTS "Public can view active skills" ON public.skills;
CREATE POLICY "Public can view active skills" ON public.skills
    FOR SELECT USING (status = 'active');

-- Skill Aliases: anyone can read
DROP POLICY IF EXISTS "Public can view skill aliases" ON public.skill_aliases;
CREATE POLICY "Public can view skill aliases" ON public.skill_aliases
    FOR SELECT USING (true);

-- Profile Skills: public/authenticated can view; owner can insert, update, delete
DROP POLICY IF EXISTS "Anyone can view profile skills" ON public.profile_skills;
CREATE POLICY "Anyone can view profile skills" ON public.profile_skills
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own profile skills" ON public.profile_skills;
CREATE POLICY "Users can insert own profile skills" ON public.profile_skills
    FOR INSERT WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Users can update own profile skills" ON public.profile_skills;
CREATE POLICY "Users can update own profile skills" ON public.profile_skills
    FOR UPDATE USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Users can delete own profile skills" ON public.profile_skills;
CREATE POLICY "Users can delete own profile skills" ON public.profile_skills
    FOR DELETE USING (auth.uid() = profile_id);

-- Expertise Suggestions: owner and admin can view; authenticated user can insert
DROP POLICY IF EXISTS "Users can view own suggestions" ON public.expertise_suggestions;
CREATE POLICY "Users can view own suggestions" ON public.expertise_suggestions
    FOR SELECT USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Users can submit suggestions" ON public.expertise_suggestions;
CREATE POLICY "Users can submit suggestions" ON public.expertise_suggestions
    FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- ==========================================================
-- REPEATABLE SEED DATA: 3 NICHES & V1 EXPERTISE CATALOG
-- ==========================================================

-- Insert Niches with Deterministic UUIDs
INSERT INTO public.niches (id, slug, name, description, status, sort_order)
VALUES
    ('b1000000-0000-0000-0000-000000000001', 'technology-ai-automation', 'Technology, AI & Automation', 'Software engineering, artificial intelligence, system architecture, data pipelines, and workflow automation.', 'active', 1),
    ('b1000000-0000-0000-0000-000000000002', 'film-media-production', 'Film, Media & Production', 'Cinematography, directing, sound design, editing, post-production, visual effects, and storytelling.', 'active', 2),
    ('b1000000-0000-0000-0000-000000000003', 'marketing-brand-growth', 'Marketing, Brand & Growth', 'Brand architecture, acquisition funnels, performance advertising, content strategy, and creative execution.', 'active', 3)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    sort_order = EXCLUDED.sort_order;

-- Insert Skills for Niche 1: Technology, AI & Automation
INSERT INTO public.skills (id, niche_id, slug, name, subcategory, status, sort_order)
VALUES
    -- Software & Web Development
    ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'frontend-development', 'Frontend Development', 'Software & Web Development', 'active', 1),
    ('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'backend-development', 'Backend Development', 'Software & Web Development', 'active', 2),
    ('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001', 'full-stack-development', 'Full-stack Development', 'Software & Web Development', 'active', 3),
    ('c1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000001', 'api-integration', 'API Integration', 'Software & Web Development', 'active', 4),
    ('c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000001', 'mobile-app-development', 'Mobile App Development', 'Software & Web Development', 'active', 5),
    ('c1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000001', 'qa-testing', 'QA & Testing', 'Software & Web Development', 'active', 6),
    ('c1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000001', 'devops', 'DevOps', 'Software & Web Development', 'active', 7),
    ('c1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000001', 'cloud-infrastructure', 'Cloud Infrastructure', 'Software & Web Development', 'active', 8),
    ('c1000000-0000-0000-0000-000000000009', 'b1000000-0000-0000-0000-000000000001', 'database-design', 'Database Design', 'Software & Web Development', 'active', 9),
    ('c1000000-0000-0000-0000-000000000010', 'b1000000-0000-0000-0000-000000000001', 'cybersecurity', 'Cybersecurity', 'Software & Web Development', 'active', 10),

    -- AI & Data
    ('c1000000-0000-0000-0000-000000000011', 'b1000000-0000-0000-0000-000000000001', 'ai-engineering', 'AI Engineering', 'AI & Data', 'active', 11),
    ('c1000000-0000-0000-0000-000000000012', 'b1000000-0000-0000-0000-000000000001', 'generative-ai', 'Generative AI', 'AI & Data', 'active', 12),
    ('c1000000-0000-0000-0000-000000000013', 'b1000000-0000-0000-0000-000000000001', 'llm-applications', 'LLM Applications', 'AI & Data', 'active', 13),
    ('c1000000-0000-0000-0000-000000000014', 'b1000000-0000-0000-0000-000000000001', 'ai-agents', 'AI Agents', 'AI & Data', 'active', 14),
    ('c1000000-0000-0000-0000-000000000015', 'b1000000-0000-0000-0000-000000000001', 'prompt-design', 'Prompt Design', 'AI & Data', 'active', 15),
    ('c1000000-0000-0000-0000-000000000016', 'b1000000-0000-0000-0000-000000000001', 'data-analytics', 'Data Analytics', 'AI & Data', 'active', 16),
    ('c1000000-0000-0000-0000-000000000017', 'b1000000-0000-0000-0000-000000000001', 'data-engineering', 'Data Engineering', 'AI & Data', 'active', 17),
    ('c1000000-0000-0000-0000-000000000018', 'b1000000-0000-0000-0000-000000000001', 'machine-learning', 'Machine Learning', 'AI & Data', 'active', 18),
    ('c1000000-0000-0000-0000-000000000019', 'b1000000-0000-0000-0000-000000000001', 'data-visualization', 'Data Visualization', 'AI & Data', 'active', 19),
    ('c1000000-0000-0000-0000-000000000020', 'b1000000-0000-0000-0000-000000000001', 'research-evaluation', 'Research & Evaluation', 'AI & Data', 'active', 20),

    -- Automation & Systems
    ('c1000000-0000-0000-0000-000000000021', 'b1000000-0000-0000-0000-000000000001', 'workflow-automation', 'Workflow Automation', 'Automation & Systems', 'active', 21),
    ('c1000000-0000-0000-0000-000000000022', 'b1000000-0000-0000-0000-000000000001', 'no-code-low-code', 'No-code/Low-code', 'Automation & Systems', 'active', 22),
    ('c1000000-0000-0000-0000-000000000023', 'b1000000-0000-0000-0000-000000000001', 'crm-automation', 'CRM Automation', 'Automation & Systems', 'active', 23),
    ('c1000000-0000-0000-0000-000000000024', 'b1000000-0000-0000-0000-000000000001', 'business-process-automation', 'Business Process Automation', 'Automation & Systems', 'active', 24),
    ('c1000000-0000-0000-0000-000000000025', 'b1000000-0000-0000-0000-000000000001', 'integrations', 'Integrations', 'Automation & Systems', 'active', 25),
    ('c1000000-0000-0000-0000-000000000026', 'b1000000-0000-0000-0000-000000000001', 'systems-architecture', 'Systems Architecture', 'Automation & Systems', 'active', 26),
    ('c1000000-0000-0000-0000-000000000027', 'b1000000-0000-0000-0000-000000000001', 'product-prototyping', 'Product Prototyping', 'Automation & Systems', 'active', 27),
    ('c1000000-0000-0000-0000-000000000028', 'b1000000-0000-0000-0000-000000000001', 'technical-consulting', 'Technical Consulting', 'Automation & Systems', 'active', 28),

    -- Product & Delivery
    ('c1000000-0000-0000-0000-000000000029', 'b1000000-0000-0000-0000-000000000001', 'product-management', 'Product Management', 'Product & Delivery', 'active', 29),
    ('c1000000-0000-0000-0000-000000000030', 'b1000000-0000-0000-0000-000000000001', 'technical-project-management', 'Technical Project Management', 'Product & Delivery', 'active', 30),
    ('c1000000-0000-0000-0000-000000000031', 'b1000000-0000-0000-0000-000000000001', 'ux-engineering', 'UX Engineering', 'Product & Delivery', 'active', 31),
    ('c1000000-0000-0000-0000-000000000032', 'b1000000-0000-0000-0000-000000000001', 'solution-architecture', 'Solution Architecture', 'Product & Delivery', 'active', 32),
    ('c1000000-0000-0000-0000-000000000033', 'b1000000-0000-0000-0000-000000000001', 'technical-documentation', 'Technical Documentation', 'Product & Delivery', 'active', 33),
    ('c1000000-0000-0000-0000-000000000034', 'b1000000-0000-0000-0000-000000000001', 'implementation-support', 'Implementation & Support', 'Product & Delivery', 'active', 34)
ON CONFLICT (slug) DO UPDATE SET
    niche_id = EXCLUDED.niche_id,
    name = EXCLUDED.name,
    subcategory = EXCLUDED.subcategory,
    status = EXCLUDED.status,
    sort_order = EXCLUDED.sort_order;

-- Insert Skills for Niche 2: Film, Media & Production
INSERT INTO public.skills (id, niche_id, slug, name, subcategory, status, sort_order)
VALUES
    ('c2000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 'director', 'Director', 'Directing & Leadership', 'active', 1),
    ('c2000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', 'producer', 'Producer', 'Production & Management', 'active', 2),
    ('c2000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000002', 'executive-producer', 'Executive Producer', 'Production & Management', 'active', 3),
    ('c2000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000002', 'line-producer', 'Line Producer', 'Production & Management', 'active', 4),
    ('c2000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000002', 'production-manager', 'Production Manager', 'Production & Management', 'active', 5),
    ('c2000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000002', 'assistant-director-1st-ad', 'Assistant Director / 1st AD', 'Production & Management', 'active', 6),
    ('c2000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000002', 'production-coordinator', 'Production Coordinator', 'Production & Management', 'active', 7),
    ('c2000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000002', 'production-assistant', 'Production Assistant', 'Production & Management', 'active', 8),
    ('c2000000-0000-0000-0000-000000000009', 'b1000000-0000-0000-0000-000000000002', 'director-of-photography', 'Director of Photography', 'Camera & Cinematography', 'active', 9),
    ('c2000000-0000-0000-0000-000000000010', 'b1000000-0000-0000-0000-000000000002', 'camera-operator', 'Camera Operator', 'Camera & Cinematography', 'active', 10),
    ('c2000000-0000-0000-0000-000000000011', 'b1000000-0000-0000-0000-000000000002', 'camera-assistant-1st-ac', 'Camera Assistant / 1st AC', 'Camera & Cinematography', 'active', 11),
    ('c2000000-0000-0000-0000-000000000012', 'b1000000-0000-0000-0000-000000000002', '2nd-ac', '2nd AC', 'Camera & Cinematography', 'active', 12),
    ('c2000000-0000-0000-0000-000000000013', 'b1000000-0000-0000-0000-000000000002', 'gaffer', 'Gaffer', 'Lighting & Grip', 'active', 13),
    ('c2000000-0000-0000-0000-000000000014', 'b1000000-0000-0000-0000-000000000002', 'best-boy', 'Best Boy', 'Lighting & Grip', 'active', 14),
    ('c2000000-0000-0000-0000-000000000015', 'b1000000-0000-0000-0000-000000000002', 'lighting-technician', 'Lighting Technician', 'Lighting & Grip', 'active', 15),
    ('c2000000-0000-0000-0000-000000000016', 'b1000000-0000-0000-0000-000000000002', 'grip', 'Grip', 'Lighting & Grip', 'active', 16),
    ('c2000000-0000-0000-0000-000000000017', 'b1000000-0000-0000-0000-000000000002', 'sound-recordist', 'Sound Recordist', 'Sound & Audio', 'active', 17),
    ('c2000000-0000-0000-0000-000000000018', 'b1000000-0000-0000-0000-000000000002', 'boom-operator', 'Boom Operator', 'Sound & Audio', 'active', 18),
    ('c2000000-0000-0000-0000-000000000019', 'b1000000-0000-0000-0000-000000000002', 'sound-designer', 'Sound Designer', 'Sound & Audio', 'active', 19),
    ('c2000000-0000-0000-0000-000000000020', 'b1000000-0000-0000-0000-000000000002', 'location-manager', 'Location Manager', 'Art & Production Design', 'active', 20),
    ('c2000000-0000-0000-0000-000000000021', 'b1000000-0000-0000-0000-000000000002', 'set-designer', 'Set Designer', 'Art & Production Design', 'active', 21),
    ('c2000000-0000-0000-0000-000000000022', 'b1000000-0000-0000-0000-000000000002', 'art-director', 'Art Director', 'Art & Production Design', 'active', 22),
    ('c2000000-0000-0000-0000-000000000023', 'b1000000-0000-0000-0000-000000000002', 'props', 'Props', 'Art & Production Design', 'active', 23),
    ('c2000000-0000-0000-0000-000000000024', 'b1000000-0000-0000-0000-000000000002', 'wardrobe-styling', 'Wardrobe/Styling', 'Art & Production Design', 'active', 24),
    ('c2000000-0000-0000-0000-000000000025', 'b1000000-0000-0000-0000-000000000002', 'hair-make-up', 'Hair & Make-up', 'Art & Production Design', 'active', 25),
    ('c2000000-0000-0000-0000-000000000026', 'b1000000-0000-0000-0000-000000000002', 'talent-casting', 'Talent/Casting', 'Art & Production Design', 'active', 26),
    ('c2000000-0000-0000-0000-000000000027', 'b1000000-0000-0000-0000-000000000002', 'video-editor', 'Video Editor', 'Post-Production & VFX', 'active', 27),
    ('c2000000-0000-0000-0000-000000000028', 'b1000000-0000-0000-0000-000000000002', 'assistant-editor', 'Assistant Editor', 'Post-Production & VFX', 'active', 28),
    ('c2000000-0000-0000-0000-000000000029', 'b1000000-0000-0000-0000-000000000002', 'colorist', 'Colorist', 'Post-Production & VFX', 'active', 29),
    ('c2000000-0000-0000-0000-000000000030', 'b1000000-0000-0000-0000-000000000002', 'motion-designer', 'Motion Designer', 'Post-Production & VFX', 'active', 30),
    ('c2000000-0000-0000-0000-000000000031', 'b1000000-0000-0000-0000-000000000002', 'vfx-artist', 'VFX Artist', 'Post-Production & VFX', 'active', 31),
    ('c2000000-0000-0000-0000-000000000032', 'b1000000-0000-0000-0000-000000000002', 'animator', 'Animator', 'Post-Production & VFX', 'active', 32),
    ('c2000000-0000-0000-0000-000000000033', 'b1000000-0000-0000-0000-000000000002', 'sound-editor', 'Sound Editor', 'Post-Production & VFX', 'active', 33),
    ('c2000000-0000-0000-0000-000000000034', 'b1000000-0000-0000-0000-000000000002', 'composer', 'Composer', 'Post-Production & VFX', 'active', 34),
    ('c2000000-0000-0000-0000-000000000035', 'b1000000-0000-0000-0000-000000000002', 'subtitling-localization', 'Subtitling & Localization', 'Post-Production & VFX', 'active', 35),
    ('c2000000-0000-0000-0000-000000000036', 'b1000000-0000-0000-0000-000000000002', 'content-producer', 'Content Producer', 'Content & Creative Story', 'active', 36),
    ('c2000000-0000-0000-0000-000000000037', 'b1000000-0000-0000-0000-000000000002', 'social-video-creator', 'Social Video Creator', 'Content & Creative Story', 'active', 37),
    ('c2000000-0000-0000-0000-000000000038', 'b1000000-0000-0000-0000-000000000002', 'photographer', 'Photographer', 'Content & Creative Story', 'active', 38),
    ('c2000000-0000-0000-0000-000000000039', 'b1000000-0000-0000-0000-000000000002', 'interviewer', 'Interviewer', 'Content & Creative Story', 'active', 39),
    ('c2000000-0000-0000-0000-000000000040', 'b1000000-0000-0000-0000-000000000002', 'scriptwriter', 'Scriptwriter', 'Content & Creative Story', 'active', 40),
    ('c2000000-0000-0000-0000-000000000041', 'b1000000-0000-0000-0000-000000000002', 'storyboard-artist', 'Storyboard Artist', 'Content & Creative Story', 'active', 41),
    ('c2000000-0000-0000-0000-000000000042', 'b1000000-0000-0000-0000-000000000002', 'media-planner', 'Media Planner', 'Content & Creative Story', 'active', 42),
    ('c2000000-0000-0000-0000-000000000043', 'b1000000-0000-0000-0000-000000000002', 'channel-distribution-management', 'Channel/Distribution Management', 'Content & Creative Story', 'active', 43)
ON CONFLICT (slug) DO UPDATE SET
    niche_id = EXCLUDED.niche_id,
    name = EXCLUDED.name,
    subcategory = EXCLUDED.subcategory,
    status = EXCLUDED.status,
    sort_order = EXCLUDED.sort_order;

-- Insert Skills for Niche 3: Marketing, Brand & Growth
INSERT INTO public.skills (id, niche_id, slug, name, subcategory, status, sort_order)
VALUES
    ('c3000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000003', 'marketing-strategy', 'Marketing Strategy', 'Strategy & Market Intelligence', 'active', 1),
    ('c3000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000003', 'brand-strategy', 'Brand Strategy', 'Strategy & Market Intelligence', 'active', 2),
    ('c3000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000003', 'positioning', 'Positioning', 'Strategy & Market Intelligence', 'active', 3),
    ('c3000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000003', 'market-research', 'Market Research', 'Strategy & Market Intelligence', 'active', 4),
    ('c3000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000003', 'audience-research', 'Audience Research', 'Strategy & Market Intelligence', 'active', 5),
    ('c3000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000003', 'go-to-market-strategy', 'Go-to-Market Strategy', 'Strategy & Market Intelligence', 'active', 6),
    ('c3000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000003', 'campaign-strategy', 'Campaign Strategy', 'Strategy & Market Intelligence', 'active', 7),
    ('c3000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000003', 'creative-direction', 'Creative Direction', 'Creative & Content', 'active', 8),
    ('c3000000-0000-0000-0000-000000000009', 'b1000000-0000-0000-0000-000000000003', 'copywriting', 'Copywriting', 'Creative & Content', 'active', 9),
    ('c3000000-0000-0000-0000-000000000010', 'b1000000-0000-0000-0000-000000000003', 'content-strategy', 'Content Strategy', 'Creative & Content', 'active', 10),
    ('c3000000-0000-0000-0000-000000000011', 'b1000000-0000-0000-0000-000000000003', 'social-media-management', 'Social Media Management', 'Creative & Content', 'active', 11),
    ('c3000000-0000-0000-0000-000000000012', 'b1000000-0000-0000-0000-000000000003', 'community-management', 'Community Management', 'Creative & Content', 'active', 12),
    ('c3000000-0000-0000-0000-000000000013', 'b1000000-0000-0000-0000-000000000003', 'email-marketing', 'Email Marketing', 'Creative & Content', 'active', 13),
    ('c3000000-0000-0000-0000-000000000014', 'b1000000-0000-0000-0000-000000000003', 'pr-communications', 'PR & Communications', 'Creative & Content', 'active', 14),
    ('c3000000-0000-0000-0000-000000000015', 'b1000000-0000-0000-0000-000000000003', 'editorial-planning', 'Editorial Planning', 'Creative & Content', 'active', 15),
    ('c3000000-0000-0000-0000-000000000016', 'b1000000-0000-0000-0000-000000000003', 'storytelling', 'Storytelling', 'Creative & Content', 'active', 16),
    ('c3000000-0000-0000-0000-000000000017', 'b1000000-0000-0000-0000-000000000003', 'seo', 'SEO', 'Performance & Analytics', 'active', 17),
    ('c3000000-0000-0000-0000-000000000018', 'b1000000-0000-0000-0000-000000000003', 'paid-search', 'Paid Search', 'Performance & Analytics', 'active', 18),
    ('c3000000-0000-0000-0000-000000000019', 'b1000000-0000-0000-0000-000000000003', 'paid-social', 'Paid Social', 'Performance & Analytics', 'active', 19),
    ('c3000000-0000-0000-0000-000000000020', 'b1000000-0000-0000-0000-000000000003', 'performance-marketing', 'Performance Marketing', 'Performance & Analytics', 'active', 20),
    ('c3000000-0000-0000-0000-000000000021', 'b1000000-0000-0000-0000-000000000003', 'conversion-rate-optimization', 'Conversion Rate Optimization', 'Performance & Analytics', 'active', 21),
    ('c3000000-0000-0000-0000-000000000022', 'b1000000-0000-0000-0000-000000000003', 'analytics-reporting', 'Analytics & Reporting', 'Performance & Analytics', 'active', 22),
    ('c3000000-0000-0000-0000-000000000023', 'b1000000-0000-0000-0000-000000000003', 'marketing-automation', 'Marketing Automation', 'Lifecycle & Automation', 'active', 23),
    ('c3000000-0000-0000-0000-000000000024', 'b1000000-0000-0000-0000-000000000003', 'crm-lifecycle-marketing', 'CRM/Lifecycle Marketing', 'Lifecycle & Automation', 'active', 24),
    ('c3000000-0000-0000-0000-000000000025', 'b1000000-0000-0000-0000-000000000003', 'graphic-design', 'Graphic Design', 'Design & Visual Assets', 'active', 25),
    ('c3000000-0000-0000-0000-000000000026', 'b1000000-0000-0000-0000-000000000003', 'brand-identity', 'Brand Identity', 'Design & Visual Assets', 'active', 26),
    ('c3000000-0000-0000-0000-000000000027', 'b1000000-0000-0000-0000-000000000003', 'web-design', 'Web Design', 'Design & Visual Assets', 'active', 27),
    ('c3000000-0000-0000-0000-000000000028', 'b1000000-0000-0000-0000-000000000003', 'landing-pages', 'Landing Pages', 'Design & Visual Assets', 'active', 28),
    ('c3000000-0000-0000-0000-000000000029', 'b1000000-0000-0000-0000-000000000003', 'video-marketing', 'Video Marketing', 'Design & Visual Assets', 'active', 29),
    ('c3000000-0000-0000-0000-000000000030', 'b1000000-0000-0000-0000-000000000003', 'marketing-photography', 'Photography', 'Design & Visual Assets', 'active', 30),
    ('c3000000-0000-0000-0000-000000000031', 'b1000000-0000-0000-0000-000000000003', 'creative-production', 'Creative Production', 'Design & Visual Assets', 'active', 31),
    ('c3000000-0000-0000-0000-000000000032', 'b1000000-0000-0000-0000-000000000003', 'presentation-design', 'Presentation Design', 'Design & Visual Assets', 'active', 32),
    ('c3000000-0000-0000-0000-000000000033', 'b1000000-0000-0000-0000-000000000003', 'growth-marketing', 'Growth Marketing', 'Growth & Acquisition', 'active', 33),
    ('c3000000-0000-0000-0000-000000000034', 'b1000000-0000-0000-0000-000000000003', 'lead-generation', 'Lead Generation', 'Growth & Acquisition', 'active', 34),
    ('c3000000-0000-0000-0000-000000000035', 'b1000000-0000-0000-0000-000000000003', 'funnel-design', 'Funnel Design', 'Growth & Acquisition', 'active', 35),
    ('c3000000-0000-0000-0000-000000000036', 'b1000000-0000-0000-0000-000000000003', 'partnerships', 'Partnerships', 'Growth & Acquisition', 'active', 36),
    ('c3000000-0000-0000-0000-000000000037', 'b1000000-0000-0000-0000-000000000003', 'influencer-marketing', 'Influencer Marketing', 'Growth & Acquisition', 'active', 37),
    ('c3000000-0000-0000-0000-000000000038', 'b1000000-0000-0000-0000-000000000003', 'event-marketing', 'Event Marketing', 'Growth & Acquisition', 'active', 38),
    ('c3000000-0000-0000-0000-000000000039', 'b1000000-0000-0000-0000-000000000003', 'customer-acquisition', 'Customer Acquisition', 'Growth & Acquisition', 'active', 39),
    ('c3000000-0000-0000-0000-000000000040', 'b1000000-0000-0000-0000-000000000003', 'retention-loyalty', 'Retention & Loyalty', 'Growth & Acquisition', 'active', 40)
ON CONFLICT (slug) DO UPDATE SET
    niche_id = EXCLUDED.niche_id,
    name = EXCLUDED.name,
    subcategory = EXCLUDED.subcategory,
    status = EXCLUDED.status,
    sort_order = EXCLUDED.sort_order;

-- Skill Aliases for enhanced search
INSERT INTO public.skill_aliases (skill_id, alias, locale)
VALUES
    ('c1000000-0000-0000-0000-000000000001', 'React', 'en'),
    ('c1000000-0000-0000-0000-000000000001', 'Next.js', 'en'),
    ('c1000000-0000-0000-0000-000000000001', 'UI Development', 'en'),
    ('c1000000-0000-0000-0000-000000000002', 'Node.js', 'en'),
    ('c1000000-0000-0000-0000-000000000002', 'PostgreSQL', 'en'),
    ('c1000000-0000-0000-0000-000000000002', 'Server-side', 'en'),
    ('c1000000-0000-0000-0000-000000000011', 'AI Engineer', 'en'),
    ('c1000000-0000-0000-0000-000000000011', 'Artificial Intelligence', 'en'),
    ('c1000000-0000-0000-0000-000000000012', 'GenAI', 'en'),
    ('c1000000-0000-0000-0000-000000000012', 'Generative Artificial Intelligence', 'en'),
    ('c1000000-0000-0000-0000-000000000013', 'Large Language Models', 'en'),
    ('c1000000-0000-0000-0000-000000000013', 'GPT', 'en'),
    ('c1000000-0000-0000-0000-000000000014', 'Autonomous Agents', 'en'),
    ('c1000000-0000-0000-0000-000000000018', 'ML', 'en'),
    ('c1000000-0000-0000-0000-000000000018', 'Deep Learning', 'en'),
    ('c2000000-0000-0000-0000-000000000009', 'DP', 'en'),
    ('c2000000-0000-0000-0000-000000000009', 'Cinematographer', 'en'),
    ('c2000000-0000-0000-0000-000000000027', 'Premiere Pro', 'en'),
    ('c2000000-0000-0000-0000-000000000027', 'DaVinci Resolve', 'en'),
    ('c3000000-0000-0000-0000-000000000017', 'Search Engine Optimization', 'en'),
    ('c3000000-0000-0000-0000-000000000021', 'CRO', 'en')
ON CONFLICT DO NOTHING;
