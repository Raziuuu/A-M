import { Niche, Skill, ProfileSkill, ExpertiseSuggestion } from './types';
import { platformStore } from './store';
import { createAdminClient } from './supabase/admin';

// ==========================================================
// V1 NICHES (Stable technical UUIDs)
// ==========================================================
export const V1_NICHES: Niche[] = [
  {
    id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'technology-ai-automation',
    name: 'Technology, AI & Automation',
    description: 'Software engineering, artificial intelligence, system architecture, data pipelines, and workflow automation.',
    status: 'active',
    sort_order: 1,
  },
  {
    id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'film-media-production',
    name: 'Film, Media & Production',
    description: 'Cinematography, directing, sound design, editing, post-production, visual effects, and storytelling.',
    status: 'active',
    sort_order: 2,
  },
  {
    id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'marketing-brand-growth',
    name: 'Marketing, Brand & Growth',
    description: 'Brand architecture, acquisition funnels, performance advertising, content strategy, and creative execution.',
    status: 'active',
    sort_order: 3,
  },
];

// ==========================================================
// V1 SKILLS CATALOG (Deterministic UUIDs & Aliases)
// ==========================================================
export const V1_SKILLS: Skill[] = [
  // ----------------------------------------------------
  // 1. TECHNOLOGY, AI & AUTOMATION
  // ----------------------------------------------------
  // Software & Web Development
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'frontend-development',
    name: 'Frontend Development',
    description: 'Building responsive user interfaces, SPAs, and design systems with React, Vue, Next.js, and modern CSS.',
    subcategory: 'Software & Web Development',
    status: 'active',
    sort_order: 1,
    aliases: ['React', 'Next.js', 'Vue', 'UI Development', 'TypeScript', 'Web Design'],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000002',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'backend-development',
    name: 'Backend Development',
    description: 'Server architecture, microservices, business logic, Node.js, Go, Python, and scalable backend platforms.',
    subcategory: 'Software & Web Development',
    status: 'active',
    sort_order: 2,
    aliases: ['Node.js', 'Go', 'Python', 'FastAPI', 'Express', 'Server-side', 'APIs'],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000003',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'full-stack-development',
    name: 'Full-stack Development',
    description: 'End-to-end web software engineering spanning databases, APIs, and client-facing interfaces.',
    subcategory: 'Software & Web Development',
    status: 'active',
    sort_order: 3,
    aliases: ['Fullstack', 'Full Stack Engineer', 'Web Apps'],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000004',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'api-integration',
    name: 'API Integration',
    description: 'Connecting third-party services, RESTful endpoints, GraphQL, webhooks, and payment gateways.',
    subcategory: 'Software & Web Development',
    status: 'active',
    sort_order: 4,
    aliases: ['REST', 'GraphQL', 'Webhooks', 'SDKs', 'Third-party APIs'],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000005',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'mobile-app-development',
    name: 'Mobile App Development',
    description: 'Native and cross-platform mobile apps using Flutter, React Native, iOS Swift, and Android Kotlin.',
    subcategory: 'Software & Web Development',
    status: 'active',
    sort_order: 5,
    aliases: ['iOS', 'Android', 'Flutter', 'React Native', 'Mobile Apps'],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000006',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'qa-testing',
    name: 'QA & Testing',
    description: 'Automated end-to-end testing, integration tests, unit suites, performance benchmarks, and regression suites.',
    subcategory: 'Software & Web Development',
    status: 'active',
    sort_order: 6,
    aliases: ['Quality Assurance', 'Playwright', 'Cypress', 'Jest', 'Automated Testing'],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000007',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'devops',
    name: 'DevOps',
    description: 'CI/CD pipeline construction, Docker containerization, deployment automation, and site reliability.',
    subcategory: 'Software & Web Development',
    status: 'active',
    sort_order: 7,
    aliases: ['CI/CD', 'Docker', 'Kubernetes', 'GitHub Actions', 'SRE'],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000008',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'cloud-infrastructure',
    name: 'Cloud Infrastructure',
    description: 'Provisioning AWS, GCP, Azure, serverless functions, VPC networking, and Terraform IaC.',
    subcategory: 'Software & Web Development',
    status: 'active',
    sort_order: 8,
    aliases: ['AWS', 'GCP', 'Google Cloud', 'Terraform', 'Azure', 'Cloud Architecture'],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000009',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'database-design',
    name: 'Database Design',
    description: 'Relational schemas, PostgreSQL indexing, query optimization, vector stores, and migrations.',
    subcategory: 'Software & Web Development',
    status: 'active',
    sort_order: 9,
    aliases: ['PostgreSQL', 'SQL', 'Database Schema', 'Prisma', 'Supabase DB', 'Data Modeling'],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000010',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'cybersecurity',
    name: 'Cybersecurity',
    description: 'Application security audits, penetration testing, authentication tokens, encryption, and compliance.',
    subcategory: 'Software & Web Development',
    status: 'active',
    sort_order: 10,
    aliases: ['AppSec', 'Security Audits', 'Zero-Trust', 'Penetration Testing'],
  },

  // AI & Data
  {
    id: 'c1000000-0000-0000-0000-000000000011',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'ai-engineering',
    name: 'AI Engineering',
    description: 'Designing production AI systems, embedding pipelines, retrieval systems, and inference optimization.',
    subcategory: 'AI & Data',
    status: 'active',
    sort_order: 11,
    aliases: ['Artificial Intelligence', 'AI Engineer', 'Deep Learning'],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000012',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'generative-ai',
    name: 'Generative AI',
    description: 'Text, image, audio, and multimodal generative model integration, diffusion models, and fine-tuning.',
    subcategory: 'AI & Data',
    status: 'active',
    sort_order: 12,
    aliases: ['GenAI', 'Generative Models', 'Stable Diffusion', 'Midjourney', 'Multimodal'],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000013',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'llm-applications',
    name: 'LLM Applications',
    description: 'Large language model wrappers, context window management, structured outputs, and RAG architectures.',
    subcategory: 'AI & Data',
    status: 'active',
    sort_order: 13,
    aliases: ['LLM', 'GPT', 'Claude', 'Gemini', 'RAG', 'LangChain', 'LlamaIndex'],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000014',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'ai-agents',
    name: 'AI Agents',
    description: 'Multi-agent orchestration, tool use, autonomous loops, reasoning frameworks, and agentic workflows.',
    subcategory: 'AI & Data',
    status: 'active',
    sort_order: 14,
    aliases: ['Autonomous Agents', 'Agentic Systems', 'AutoGPT', 'CrewAI'],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000015',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'prompt-design',
    name: 'Prompt Design',
    description: 'System prompting, few-shot conditioning, safety guardrails, evaluations, and steering techniques.',
    subcategory: 'AI & Data',
    status: 'active',
    sort_order: 15,
    aliases: ['Prompt Engineering', 'Prompt Tuning', 'System Prompts'],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000016',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'data-analytics',
    name: 'Data Analytics',
    description: 'Business intelligence, cohort analysis, KPI monitoring, exploratory data analysis, and metrics extraction.',
    subcategory: 'AI & Data',
    status: 'active',
    sort_order: 16,
    aliases: ['Analytics', 'BI', 'Data Analysis', 'Metrics', 'SQL Analytics'],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000017',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'data-engineering',
    name: 'Data Engineering',
    description: 'ETL/ELT pipelines, streaming data, BigQuery/Snowflake warehouses, and Apache Kafka/Airflow orchestration.',
    subcategory: 'AI & Data',
    status: 'active',
    sort_order: 17,
    aliases: ['ETL', 'Pipelines', 'BigQuery', 'Snowflake', 'Airflow', 'Data Warehouse'],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000018',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'machine-learning',
    name: 'Machine Learning',
    description: 'Predictive modeling, scikit-learn, PyTorch, feature engineering, cross-validation, and MLOps deployment.',
    subcategory: 'AI & Data',
    status: 'active',
    sort_order: 18,
    aliases: ['ML', 'Machine Learning Models', 'PyTorch', 'TensorFlow', 'Predictive Modeling'],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000019',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'data-visualization',
    name: 'Data Visualization',
    description: 'Interactive dashboards, D3.js charting, Executive KPI views, Tableau, and visual storytelling.',
    subcategory: 'AI & Data',
    status: 'active',
    sort_order: 19,
    aliases: ['Data Viz', 'Dashboards', 'Charts', 'D3.js', 'Looker'],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000020',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'research-evaluation',
    name: 'Research & Evaluation',
    description: 'Scientific validation, hypothesis testing, benchmarking, accuracy audits, and research documentation.',
    subcategory: 'AI & Data',
    status: 'active',
    sort_order: 20,
    aliases: ['Evaluation', 'Benchmarking', 'Research Methods', 'Statistical Testing'],
  },

  // Automation & Systems
  {
    id: 'c1000000-0000-0000-0000-000000000021',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'workflow-automation',
    name: 'Workflow Automation',
    description: 'Multi-step automated workflows with Make.com, n8n, Zapier, and custom webhook triggers.',
    subcategory: 'Automation & Systems',
    status: 'active',
    sort_order: 21,
    aliases: ['Make.com', 'n8n', 'Zapier', 'Automations', 'Webhooks'],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000022',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'no-code-low-code',
    name: 'No-code/Low-code',
    description: 'Rapid product builders, Webflow, Bubble, Retool, Airtable platforms, and hybrid code integration.',
    subcategory: 'Automation & Systems',
    status: 'active',
    sort_order: 22,
    aliases: ['No-Code', 'Low-Code', 'Webflow', 'Bubble', 'Retool', 'Airtable'],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000023',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'crm-automation',
    name: 'CRM Automation',
    description: 'HubSpot, Salesforce, lead capture routing, pipeline stage triggers, and enrichment flows.',
    subcategory: 'Automation & Systems',
    status: 'active',
    sort_order: 23,
    aliases: ['HubSpot', 'Salesforce', 'CRM', 'Lead Automation'],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000024',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'business-process-automation',
    name: 'Business Process Automation',
    description: 'Operations streamlining, document processing, approval chains, and ERP synchronizations.',
    subcategory: 'Automation & Systems',
    status: 'active',
    sort_order: 24,
    aliases: ['BPA', 'Process Automation', 'Operations Automation', 'RPA'],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000025',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'integrations',
    name: 'Integrations',
    description: 'Connecting fragmented software stacks, syncing bidirectional data, and webhook listeners.',
    subcategory: 'Automation & Systems',
    status: 'active',
    sort_order: 25,
    aliases: ['System Integrations', 'Middleware', 'Data Sync'],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000026',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'systems-architecture',
    name: 'Systems Architecture',
    description: 'High-level system design, fault tolerance, message brokers, caching tiers, and scalability plans.',
    subcategory: 'Automation & Systems',
    status: 'active',
    sort_order: 26,
    aliases: ['System Design', 'Enterprise Architecture', 'Scalability'],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000027',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'product-prototyping',
    name: 'Product Prototyping',
    description: 'Rapid MVP engineering, clickable POCs, technical proof-of-concept validation, and interactive pilots.',
    subcategory: 'Automation & Systems',
    status: 'active',
    sort_order: 27,
    aliases: ['MVP', 'POC', 'Proof of Concept', 'Rapid Prototyping'],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000028',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'technical-consulting',
    name: 'Technical Consulting',
    description: 'Strategic tech stack advisement, architectural reviews, due diligence, and vendor assessments.',
    subcategory: 'Automation & Systems',
    status: 'active',
    sort_order: 28,
    aliases: ['Tech Advisory', 'Due Diligence', 'CTO Consulting'],
  },

  // Product & Delivery
  {
    id: 'c1000000-0000-0000-0000-000000000029',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'product-management',
    name: 'Product Management',
    description: 'Roadmap planning, backlog grooming, user story definition, feature prioritization, and launch planning.',
    subcategory: 'Product & Delivery',
    status: 'active',
    sort_order: 29,
    aliases: ['PM', 'Product Owner', 'Roadmapping', 'Agile Product'],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000030',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'technical-project-management',
    name: 'Technical Project Management',
    description: 'Agile sprints, milestone delivery, cross-functional engineering coordination, and dependency tracking.',
    subcategory: 'Product & Delivery',
    status: 'active',
    sort_order: 30,
    aliases: ['TPM', 'Scrum Master', 'Sprint Management', 'Delivery Lead'],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000031',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'ux-engineering',
    name: 'UX Engineering',
    description: 'Translating design tokens, Figma handoffs, interactive prototypes, micro-animations, and accessibility.',
    subcategory: 'Product & Delivery',
    status: 'active',
    sort_order: 31,
    aliases: ['UX/UI', 'Design Systems', 'Micro-interactions', 'Figma to Code'],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000032',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'solution-architecture',
    name: 'Solution Architecture',
    description: 'Translating complex enterprise requirements into cohesive, scalable technical solution plans.',
    subcategory: 'Product & Delivery',
    status: 'active',
    sort_order: 32,
    aliases: ['Solutions Architect', 'Enterprise Solutions', 'System Blueprinting'],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000033',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'technical-documentation',
    name: 'Technical Documentation',
    description: 'API references, architectural blueprints, integration guides, developer documentation, and schemas.',
    subcategory: 'Product & Delivery',
    status: 'active',
    sort_order: 33,
    aliases: ['Tech Writing', 'API Docs', 'Whitepapers', 'Specs'],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000034',
    niche_id: 'b1000000-0000-0000-0000-000000000001',
    slug: 'implementation-support',
    name: 'Implementation & Support',
    description: 'Client onboarding, deployment rollout assistance, troubleshooting, and post-launch maintenance.',
    subcategory: 'Product & Delivery',
    status: 'active',
    sort_order: 34,
    aliases: ['Customer Engineering', 'Rollout Support', 'Post-Launch Support'],
  },

  // ----------------------------------------------------
  // 2. FILM, MEDIA & PRODUCTION
  // ----------------------------------------------------
  {
    id: 'c2000000-0000-0000-0000-000000000001',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'director',
    name: 'Director',
    description: 'Creative and dramatic vision, blocking, actor direction, and cinematic pacing.',
    subcategory: 'Directing & Leadership',
    status: 'active',
    sort_order: 1,
    aliases: ['Film Director', 'Filmmaker', 'Directing'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000002',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'producer',
    name: 'Producer',
    description: 'Project funding, logistical oversight, schedule management, and creative packaging.',
    subcategory: 'Production & Management',
    status: 'active',
    sort_order: 2,
    aliases: ['Film Producer', 'Production'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000003',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'executive-producer',
    name: 'Executive Producer',
    description: 'Financing, business packaging, strategic partnerships, and platform distribution deals.',
    subcategory: 'Production & Management',
    status: 'active',
    sort_order: 3,
    aliases: ['EP', 'Executive Production'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000004',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'line-producer',
    name: 'Line Producer',
    description: 'On-set budget tracking, crew agreements, logistical execution, and daily operations.',
    subcategory: 'Production & Management',
    status: 'active',
    sort_order: 4,
    aliases: ['Line Production', 'Budget Management'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000005',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'production-manager',
    name: 'Production Manager',
    description: 'Managing call sheets, equipment rentals, transportation, catering, and crew scheduling.',
    subcategory: 'Production & Management',
    status: 'active',
    sort_order: 5,
    aliases: ['UPM', 'Unit Production Manager'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000006',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'assistant-director-1st-ad',
    name: 'Assistant Director / 1st AD',
    description: 'Call sheets, shooting schedule, set discipline, safety compliance, and production speed.',
    subcategory: 'Production & Management',
    status: 'active',
    sort_order: 6,
    aliases: ['1st AD', 'First Assistant Director', 'AD'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000007',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'production-coordinator',
    name: 'Production Coordinator',
    description: 'Production office administration, purchase orders, vendor communications, and permits.',
    subcategory: 'Production & Management',
    status: 'active',
    sort_order: 7,
    aliases: ['POC', 'Office Coordinator'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000008',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'production-assistant',
    name: 'Production Assistant',
    description: 'Set assistance, runner duties, gear handling, lockups, and supporting departmental leads.',
    subcategory: 'Production & Management',
    status: 'active',
    sort_order: 8,
    aliases: ['PA', 'Set Runner'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000009',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'director-of-photography',
    name: 'Director of Photography',
    description: 'Visual framing, camera selection, lighting schemas, color temperature, and lens packages.',
    subcategory: 'Camera & Cinematography',
    status: 'active',
    sort_order: 9,
    aliases: ['DP', 'DoP', 'Cinematographer', 'Cinematography'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000010',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'camera-operator',
    name: 'Camera Operator',
    description: 'Physical camera movement, gimbal operation, dolly tracking, and framing during takes.',
    subcategory: 'Camera & Cinematography',
    status: 'active',
    sort_order: 10,
    aliases: ['Cam Op', 'Steadicam Operator', 'Ronin Operator'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000011',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'camera-assistant-1st-ac',
    name: 'Camera Assistant / 1st AC',
    description: 'Focus pulling, lens swaps, camera prep, wireless video feeds, and sensor maintenance.',
    subcategory: 'Camera & Cinematography',
    status: 'active',
    sort_order: 11,
    aliases: ['1st AC', 'Focus Puller', 'First AC'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000012',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: '2nd-ac',
    name: '2nd AC',
    description: 'Clapperboard operation, camera logs, slate marking, media management, and battery charging.',
    subcategory: 'Camera & Cinematography',
    status: 'active',
    sort_order: 12,
    aliases: ['Second AC', 'Clapper Loader', 'Camera Loader'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000013',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'gaffer',
    name: 'Gaffer',
    description: 'Head of electrical and lighting, power distribution, fixtures, and lighting execution.',
    subcategory: 'Lighting & Grip',
    status: 'active',
    sort_order: 13,
    aliases: ['Chief Lighting Technician', 'Lighting Director'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000014',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'best-boy',
    name: 'Best Boy',
    description: 'Assistant to gaffer or key grip, inventory tracking, power routing, and crew staging.',
    subcategory: 'Lighting & Grip',
    status: 'active',
    sort_order: 14,
    aliases: ['Best Boy Electric', 'Best Boy Grip'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000015',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'lighting-technician',
    name: 'Lighting Technician',
    description: 'Rigging lamps, gels, diffusion, DMX boards, LED panels, and studio power systems.',
    subcategory: 'Lighting & Grip',
    status: 'active',
    sort_order: 15,
    aliases: ['Sparks', 'Lighting Crew', 'DMX Lighting'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000016',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'grip',
    name: 'Grip',
    description: 'Non-electrical equipment rigging, flags, diffusers, cranes, dollies, and safety rigging.',
    subcategory: 'Lighting & Grip',
    status: 'active',
    sort_order: 16,
    aliases: ['Key Grip', 'Dolly Grip', 'Rigging'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000017',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'sound-recordist',
    name: 'Sound Recordist',
    description: 'Production audio recording, wireless lavalier transmitters, multitrack mixers, and room tone.',
    subcategory: 'Sound & Audio',
    status: 'active',
    sort_order: 17,
    aliases: ['Location Sound Mixer', 'Audio Engineer', 'Sound Mixer'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000018',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'boom-operator',
    name: 'Boom Operator',
    description: 'Boom pole positioning, microphone angle, shadow avoidance, and actor tracking.',
    subcategory: 'Sound & Audio',
    status: 'active',
    sort_order: 18,
    aliases: ['Boom Op', 'Audio Rigging'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000019',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'sound-designer',
    name: 'Sound Designer',
    description: 'Atmospheres, Foley recording, sound effects (SFX), synthesized textures, and sonic immersion.',
    subcategory: 'Sound & Audio',
    status: 'active',
    sort_order: 19,
    aliases: ['Audio Designer', 'Foley Artist', 'SFX'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000020',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'location-manager',
    name: 'Location Manager',
    description: 'Scouting real-world filming sites, permits, municipal logistics, neighbor notices, and basecamps.',
    subcategory: 'Art & Production Design',
    status: 'active',
    sort_order: 20,
    aliases: ['Location Scout', 'Location Scouting'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000021',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'set-designer',
    name: 'Set Designer',
    description: 'Drafting scenic sets, construction blueprints, studio stage plans, and architectural models.',
    subcategory: 'Art & Production Design',
    status: 'active',
    sort_order: 21,
    aliases: ['Scenic Designer', 'Set Construction'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000022',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'art-director',
    name: 'Art Director',
    description: 'Visual environment consistency, set dressing supervision, color palettes, and prop coordination.',
    subcategory: 'Art & Production Design',
    status: 'active',
    sort_order: 22,
    aliases: ['Production Design Lead', 'Art Direction'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000023',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'props',
    name: 'Props',
    description: 'Hand prop fabrication, sourcing period props, actor safety items, and continuity management.',
    subcategory: 'Art & Production Design',
    status: 'active',
    sort_order: 23,
    aliases: ['Prop Master', 'Prop Making', 'Prop Sourcing'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000024',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'wardrobe-styling',
    name: 'Wardrobe/Styling',
    description: 'Costume design, fitting, character apparel, fabric aging, and garment maintenance.',
    subcategory: 'Art & Production Design',
    status: 'active',
    sort_order: 24,
    aliases: ['Costume Designer', 'Wardrobe', 'Stylist', 'Costumes'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000025',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'hair-make-up',
    name: 'Hair & Make-up',
    description: 'On-camera makeup, SFX prosthetics, continuity touch-ups, hair styling, and skin treatments.',
    subcategory: 'Art & Production Design',
    status: 'active',
    sort_order: 25,
    aliases: ['HMU', 'Makeup Artist', 'MUA', 'Prosthetics'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000026',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'talent-casting',
    name: 'Talent/Casting',
    description: 'Auditions, agent negotiations, SAG-AFTRA clearances, talent scouting, and actor chemistry tests.',
    subcategory: 'Art & Production Design',
    status: 'active',
    sort_order: 26,
    aliases: ['Casting Director', 'Talent Scout', 'Auditions'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000027',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'video-editor',
    name: 'Video Editor',
    description: 'Assembly cuts, pacing, rough cuts, fine cuts in Premiere Pro, DaVinci Resolve, or Final Cut.',
    subcategory: 'Post-Production & VFX',
    status: 'active',
    sort_order: 27,
    aliases: ['Editor', 'Premiere Pro', 'DaVinci Resolve', 'Final Cut'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000028',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'assistant-editor',
    name: 'Assistant Editor',
    description: 'Dailies ingest, syncing dual-system audio, multicar grouping, proxy transcoding, and EDL prep.',
    subcategory: 'Post-Production & VFX',
    status: 'active',
    sort_order: 28,
    aliases: ['AE', 'Ingest Editor', 'Transcoding'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000029',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'colorist',
    name: 'Colorist',
    description: 'Color grading, look creation (LUTs), shot matching, HDR mastery, and color balance in DaVinci Resolve.',
    subcategory: 'Post-Production & VFX',
    status: 'active',
    sort_order: 29,
    aliases: ['Color Grading', 'DaVinci Colorist', 'Look Development'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000030',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'motion-designer',
    name: 'Motion Designer',
    description: 'Kinetic typography, 2D/3D animated titles, logo animations, and After Effects motion graphics.',
    subcategory: 'Post-Production & VFX',
    status: 'active',
    sort_order: 30,
    aliases: ['Motion Graphics', 'Mograph', 'After Effects'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000031',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'vfx-artist',
    name: 'VFX Artist',
    description: 'Green screen compositing, rotoscoping, clean plating, 3D tracking, and digital set extensions.',
    subcategory: 'Post-Production & VFX',
    status: 'active',
    sort_order: 31,
    aliases: ['VFX', 'Compositor', 'Nuke', 'Visual Effects'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000032',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'animator',
    name: 'Animator',
    description: 'Character animation, 3D rigging in Blender/Cinema 4D, keyframe timing, and stylized animation.',
    subcategory: 'Post-Production & VFX',
    status: 'active',
    sort_order: 32,
    aliases: ['3D Animator', '2D Animator', 'Blender', 'Cinema 4D'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000033',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'sound-editor',
    name: 'Sound Editor',
    description: 'Dialogue cleanup with iZotope RX, ADR re-recording, noise reduction, and final 5.1/Dolby mix prep.',
    subcategory: 'Post-Production & VFX',
    status: 'active',
    sort_order: 33,
    aliases: ['Dialogue Editor', 'Audio Post', 'ADR'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000034',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'composer',
    name: 'Composer',
    description: 'Original orchestral and synthesized film score, leitmotifs, emotional timing, and soundtrack production.',
    subcategory: 'Post-Production & VFX',
    status: 'active',
    sort_order: 34,
    aliases: ['Film Score', 'Music Producer', 'Film Composer'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000035',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'subtitling-localization',
    name: 'Subtitling & Localization',
    description: 'Closed captioning, multi-language subtitle translation, dubbing timing, and SRT/VTT packaging.',
    subcategory: 'Post-Production & VFX',
    status: 'active',
    sort_order: 35,
    aliases: ['Captions', 'Localization', 'Translation', 'SRT'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000036',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'content-producer',
    name: 'Content Producer',
    description: 'End-to-end digital showrunning, podcasts, episodic web content, and multi-format studio shoots.',
    subcategory: 'Content & Creative Story',
    status: 'active',
    sort_order: 36,
    aliases: ['Digital Producer', 'Podcast Producer', 'Media Producer'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000037',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'social-video-creator',
    name: 'Social Video Creator',
    description: 'Short-form storytelling for TikTok, Instagram Reels, YouTube Shorts, retention hooks, and fast pacing.',
    subcategory: 'Content & Creative Story',
    status: 'active',
    sort_order: 37,
    aliases: ['Short-Form Video', 'TikTok Creator', 'Reels Editor', 'Shorts'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000038',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'photographer',
    name: 'Photographer',
    description: 'On-set unit stills photography, commercial portraits, editorial shoots, and high-res retouching.',
    subcategory: 'Content & Creative Story',
    status: 'active',
    sort_order: 38,
    aliases: ['Stills Photographer', 'Commercial Photography', 'Portraits'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000039',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'interviewer',
    name: 'Interviewer',
    description: 'Documentary questioning, executive interviews, journalistic inquiries, and natural dialogue elicitation.',
    subcategory: 'Content & Creative Story',
    status: 'active',
    sort_order: 39,
    aliases: ['Journalist', 'Documentary Interviewer', 'Podcast Host'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000040',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'scriptwriter',
    name: 'Scriptwriter',
    description: 'Screenwriting, treatment writing, commercial scripts, dialogue polishing, and three-act narrative design.',
    subcategory: 'Content & Creative Story',
    status: 'active',
    sort_order: 40,
    aliases: ['Screenwriter', 'Writer', 'Scriptwriting'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000041',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'storyboard-artist',
    name: 'Storyboard Artist',
    description: 'Visual scene planning, animatics, shot progression sketches, and camera coverage diagrams.',
    subcategory: 'Content & Creative Story',
    status: 'active',
    sort_order: 41,
    aliases: ['Storyboarding', 'Animatic', 'Pre-visualization'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000042',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'media-planner',
    name: 'Media Planner',
    description: 'Broadcast and digital distribution schedules, audience reach calculations, and media allocations.',
    subcategory: 'Content & Creative Story',
    status: 'active',
    sort_order: 42,
    aliases: ['Media Buying', 'Broadcast Planning'],
  },
  {
    id: 'c2000000-0000-0000-0000-000000000043',
    niche_id: 'b1000000-0000-0000-0000-000000000002',
    slug: 'channel-distribution-management',
    name: 'Channel/Distribution Management',
    description: 'YouTube channel operations, streaming syndication, OTT platform uploads, and copyright management.',
    subcategory: 'Content & Creative Story',
    status: 'active',
    sort_order: 43,
    aliases: ['YouTube Management', 'Distribution', 'Streaming Syndication'],
  },

  // ----------------------------------------------------
  // 3. MARKETING, BRAND & GROWTH
  // ----------------------------------------------------
  {
    id: 'c3000000-0000-0000-0000-000000000001',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'marketing-strategy',
    name: 'Marketing Strategy',
    description: 'Comprehensive omni-channel marketing architecture, resource allocation, and market penetration.',
    subcategory: 'Strategy & Market Intelligence',
    status: 'active',
    sort_order: 1,
    aliases: ['Strategic Marketing', 'Marketing Plan'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000002',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'brand-strategy',
    name: 'Brand Strategy',
    description: 'Core brand pillars, vision, tone of voice, visual identity guidelines, and emotional positioning.',
    subcategory: 'Strategy & Market Intelligence',
    status: 'active',
    sort_order: 2,
    aliases: ['Branding', 'Brand Architecture'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000003',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'positioning',
    name: 'Positioning',
    description: 'Competitive differentiation, unique value propositions (UVP), and market quadrant anchoring.',
    subcategory: 'Strategy & Market Intelligence',
    status: 'active',
    sort_order: 3,
    aliases: ['Market Positioning', 'UVP', 'Value Proposition'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000004',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'market-research',
    name: 'Market Research',
    description: 'Industry competitor intelligence, quantitative market sizing (TAM/SAM/SOM), and pricing elasticity.',
    subcategory: 'Strategy & Market Intelligence',
    status: 'active',
    sort_order: 4,
    aliases: ['Competitor Analysis', 'TAM Analysis'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000005',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'audience-research',
    name: 'Audience Research',
    description: 'Customer persona development, demographic surveys, customer interviews, and behavioral segmenting.',
    subcategory: 'Strategy & Market Intelligence',
    status: 'active',
    sort_order: 5,
    aliases: ['Customer Persona', 'Target Audience', 'User Research'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000006',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'go-to-market-strategy',
    name: 'Go-to-Market Strategy',
    description: 'GTM roadmaps, product launch playbooks, early adopter acquisition, and channel sequencing.',
    subcategory: 'Strategy & Market Intelligence',
    status: 'active',
    sort_order: 6,
    aliases: ['GTM', 'Product Launch', 'Go-To-Market'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000007',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'campaign-strategy',
    name: 'Campaign Strategy',
    description: 'High-impact product campaigns, creative concepts, multi-channel scheduling, and ROI targets.',
    subcategory: 'Strategy & Market Intelligence',
    status: 'active',
    sort_order: 7,
    aliases: ['Ad Campaigns', 'Promotions', 'Integrated Campaigns'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000008',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'creative-direction',
    name: 'Creative Direction',
    description: 'Guiding conceptual vision, visual moodboards, advertising aesthetics, and executive design polish.',
    subcategory: 'Creative & Content',
    status: 'active',
    sort_order: 8,
    aliases: ['Art Direction', 'Creative Director'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000009',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'copywriting',
    name: 'Copywriting',
    description: 'High-converting sales copy, advertising taglines, landing page headlines, and direct-response text.',
    subcategory: 'Creative & Content',
    status: 'active',
    sort_order: 9,
    aliases: ['Copy', 'Sales Copy', 'Direct Response', 'Ad Copy'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000010',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'content-strategy',
    name: 'Content Strategy',
    description: 'Editorial calendar development, SEO topic clusters, content repurposing, and thought leadership.',
    subcategory: 'Creative & Content',
    status: 'active',
    sort_order: 10,
    aliases: ['Content Marketing', 'Editorial Strategy'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000011',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'social-media-management',
    name: 'Social Media Management',
    description: 'Platform distribution across LinkedIn, X, Instagram, post scheduling, and engagement tactics.',
    subcategory: 'Creative & Content',
    status: 'active',
    sort_order: 11,
    aliases: ['SMM', 'Social Media', 'LinkedIn', 'Twitter/X'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000012',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'community-management',
    name: 'Community Management',
    description: 'Managing Discord servers, Telegram groups, community ambassadorship, and developer relations.',
    subcategory: 'Creative & Content',
    status: 'active',
    sort_order: 12,
    aliases: ['Discord', 'Community Building', 'DevRel'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000013',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'email-marketing',
    name: 'Email Marketing',
    description: 'Drip sequences, newsletter design in Klaviyo/Mailchimp, deliverability optimization, and newsletters.',
    subcategory: 'Creative & Content',
    status: 'active',
    sort_order: 13,
    aliases: ['Newsletters', 'Klaviyo', 'Email Drip', 'Mailchimp'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000014',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'pr-communications',
    name: 'PR & Communications',
    description: 'Press releases, media outreach, tech journalist relations, crisis comms, and brand mentions.',
    subcategory: 'Creative & Content',
    status: 'active',
    sort_order: 14,
    aliases: ['Public Relations', 'Press Releases', 'Media Coverage'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000015',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'editorial-planning',
    name: 'Editorial Planning',
    description: 'Publication roadmaps, article syndication pipelines, contributor guidelines, and review cycles.',
    subcategory: 'Creative & Content',
    status: 'active',
    sort_order: 15,
    aliases: ['Editorial Calendar', 'Publishing'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000016',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'storytelling',
    name: 'Storytelling',
    description: 'Narrative arcs, corporate mythology, case study storytelling, and emotional resonance.',
    subcategory: 'Creative & Content',
    status: 'active',
    sort_order: 16,
    aliases: ['Brand Narrative', 'Case Studies'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000017',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'seo',
    name: 'SEO',
    description: 'Technical search optimization, backlink strategies, Core Web Vitals, and keyword dominance.',
    subcategory: 'Performance & Analytics',
    status: 'active',
    sort_order: 17,
    aliases: ['Search Engine Optimization', 'Organic Search', 'Technical SEO'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000018',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'paid-search',
    name: 'Paid Search',
    description: 'Google Ads, intent-targeted keywords, search bidding strategies, negative keyword pruning.',
    subcategory: 'Performance & Analytics',
    status: 'active',
    sort_order: 18,
    aliases: ['Google Ads', 'PPC', 'Search Ads', 'SEM'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000019',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'paid-social',
    name: 'Paid Social',
    description: 'Meta Ads Manager (Facebook/Instagram), LinkedIn Ads, TikTok Ads, ad creative testing, and retargeting.',
    subcategory: 'Performance & Analytics',
    status: 'active',
    sort_order: 19,
    aliases: ['Meta Ads', 'Facebook Ads', 'Instagram Ads', 'LinkedIn Ads', 'Social Ads'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000020',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'performance-marketing',
    name: 'Performance Marketing',
    description: 'ROAS optimization, customer acquisition cost (CAC) reduction, and multi-touch attribution.',
    subcategory: 'Performance & Analytics',
    status: 'active',
    sort_order: 20,
    aliases: ['ROAS', 'Paid Media', 'Direct Response Marketing'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000021',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'conversion-rate-optimization',
    name: 'Conversion Rate Optimization',
    description: 'A/B testing, user session recordings (Hotjar), form optimization, and checkout abandonment reduction.',
    subcategory: 'Performance & Analytics',
    status: 'active',
    sort_order: 21,
    aliases: ['CRO', 'A/B Testing', 'Conversion Optimization', 'Landing Page Testing'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000022',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'analytics-reporting',
    name: 'Analytics & Reporting',
    description: 'Google Analytics 4, Mixpanel event tracking, PostHog funnel analytics, and executive dashboards.',
    subcategory: 'Performance & Analytics',
    status: 'active',
    sort_order: 22,
    aliases: ['GA4', 'Mixpanel', 'PostHog', 'Marketing Analytics'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000023',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'marketing-automation',
    name: 'Marketing Automation',
    description: 'Behavioral triggers, automated lead nurturing, dynamic customer journeys, and webhook actions.',
    subcategory: 'Lifecycle & Automation',
    status: 'active',
    sort_order: 23,
    aliases: ['Customer.io', 'HubSpot Marketing', 'Automated Journeys'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000024',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'crm-lifecycle-marketing',
    name: 'CRM/Lifecycle Marketing',
    description: 'User onboarding flows, reactivation sequences, churn prevention, and VIP tier engagement.',
    subcategory: 'Lifecycle & Automation',
    status: 'active',
    sort_order: 24,
    aliases: ['Lifecycle Marketing', 'Retention', 'CRM Marketing'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000025',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'graphic-design',
    name: 'Graphic Design',
    description: 'Vector graphics, advertising banners, social creative, typography selection, and layout design.',
    subcategory: 'Design & Visual Assets',
    status: 'active',
    sort_order: 25,
    aliases: ['Graphics', 'Visual Design', 'Illustrator', 'Photoshop'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000026',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'brand-identity',
    name: 'Brand Identity',
    description: 'Logo suites, brand marks, iconography, color token systems, and brand guidelines books.',
    subcategory: 'Design & Visual Assets',
    status: 'active',
    sort_order: 26,
    aliases: ['Brand Guidelines', 'Logo Design', 'Visual Identity'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000027',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'web-design',
    name: 'Web Design',
    description: 'High-conversion website layouts, responsive wireframes, Figma UI screens, and interactive prototypes.',
    subcategory: 'Design & Visual Assets',
    status: 'active',
    sort_order: 27,
    aliases: ['UI Design', 'Figma', 'Website Design'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000028',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'landing-pages',
    name: 'Landing Pages',
    description: 'Dedicated campaign landing pages, sales pages, conversion-focused wireframes, and section layout.',
    subcategory: 'Design & Visual Assets',
    status: 'active',
    sort_order: 28,
    aliases: ['Landing Page Design', 'Sales Pages', 'Squeeze Pages'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000029',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'video-marketing',
    name: 'Video Marketing',
    description: 'Product video ads, customer testimonials, explainer videos, brand trailers, and video funnels.',
    subcategory: 'Design & Visual Assets',
    status: 'active',
    sort_order: 29,
    aliases: ['Video Ads', 'Commercials', 'Explainer Videos'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000030',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'marketing-photography',
    name: 'Photography',
    description: 'Commercial product photography, e-commerce catalog imagery, and brand lifestyle shoots.',
    subcategory: 'Design & Visual Assets',
    status: 'active',
    sort_order: 30,
    aliases: ['Commercial Photography', 'Product Shoots'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000031',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'creative-production',
    name: 'Creative Production',
    description: 'Creative asset scaling, multi-format export pipelines, localized variations, and asset management.',
    subcategory: 'Design & Visual Assets',
    status: 'active',
    sort_order: 31,
    aliases: ['Asset Production', 'Ad Variations'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000032',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'presentation-design',
    name: 'Presentation Design',
    description: 'Investor pitch decks, executive keynote slides, sales proposals, and Figma slide systems.',
    subcategory: 'Design & Visual Assets',
    status: 'active',
    sort_order: 32,
    aliases: ['Pitch Decks', 'Keynotes', 'Slide Decks'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000033',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'growth-marketing',
    name: 'Growth Marketing',
    description: 'Viral loops, referral mechanics, product-led growth (PLG) tactics, and growth experimentation.',
    subcategory: 'Growth & Acquisition',
    status: 'active',
    sort_order: 33,
    aliases: ['Growth Hacking', 'PLG', 'Viral Loops'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000034',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'lead-generation',
    name: 'Lead Generation',
    description: 'Inbound lead magnets, gated technical reports, B2B list building, and outbound qualification.',
    subcategory: 'Growth & Acquisition',
    status: 'active',
    sort_order: 34,
    aliases: ['Lead Gen', 'Prospecting', 'Outbound'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000035',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'funnel-design',
    name: 'Funnel Design',
    description: 'Designing end-to-end sales funnels, high-ticket application forms, order bumps, and upsells.',
    subcategory: 'Growth & Acquisition',
    status: 'active',
    sort_order: 35,
    aliases: ['Sales Funnels', 'Acquisition Funnels'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000036',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'partnerships',
    name: 'Partnerships',
    description: 'B2B co-marketing, affiliate alliances, strategic integrations, and channel partner programs.',
    subcategory: 'Growth & Acquisition',
    status: 'active',
    sort_order: 36,
    aliases: ['Affiliates', 'Co-Marketing', 'Channel Partners'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000037',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'influencer-marketing',
    name: 'Influencer Marketing',
    description: 'Creator sponsorships, influencer contract negotiation, usage rights, and affiliate tracking.',
    subcategory: 'Growth & Acquisition',
    status: 'active',
    sort_order: 37,
    aliases: ['Creators', 'Influencer Outreach', 'Sponsorships'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000038',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'event-marketing',
    name: 'Event Marketing',
    description: 'Conference sponsorships, private executive dinners, live webinars, and experiential activations.',
    subcategory: 'Growth & Acquisition',
    status: 'active',
    sort_order: 38,
    aliases: ['Conferences', 'Webinars', 'Activations'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000039',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'customer-acquisition',
    name: 'Customer Acquisition',
    description: 'Scalable paid and organic client acquisition mechanisms, blended CAC modeling, and scaling.',
    subcategory: 'Growth & Acquisition',
    status: 'active',
    sort_order: 39,
    aliases: ['Acquisition', 'CAC Modeling', 'Paid Acquisition'],
  },
  {
    id: 'c3000000-0000-0000-0000-000000000040',
    niche_id: 'b1000000-0000-0000-0000-000000000003',
    slug: 'retention-loyalty',
    name: 'Retention & Loyalty',
    description: 'Net promoter score (NPS) programs, recurring usage incentives, community rewards, and advocacy.',
    subcategory: 'Growth & Acquisition',
    status: 'active',
    sort_order: 40,
    aliases: ['NPS', 'Loyalty Programs', 'Customer Retention'],
  },
];

// In-memory ProfileSkills map: profileId -> ProfileSkill[]
const memoryProfileSkills = new Map<string, ProfileSkill[]>();
const memorySuggestions: ExpertiseSuggestion[] = [];

/**
 * Search helper: Filters catalog by query string and/or niche
 */
export function searchCatalogSkills(query: string = '', nicheId?: string): Skill[] {
  const q = query.trim().toLowerCase();
  return V1_SKILLS.filter(skill => {
    if (skill.status !== 'active') return false;
    if (nicheId && skill.niche_id !== nicheId) return false;
    if (!q) return true;

    // Search against name
    if (skill.name.toLowerCase().includes(q)) return true;
    // Search against slug
    if (skill.slug.toLowerCase().includes(q)) return true;
    // Search against subcategory
    if (skill.subcategory && skill.subcategory.toLowerCase().includes(q)) return true;
    // Search against description
    if (skill.description && skill.description.toLowerCase().includes(q)) return true;
    // Search against aliases
    if (skill.aliases && skill.aliases.some(alias => alias.toLowerCase().includes(q))) return true;

    return false;
  });
}

/**
 * Get profile skills for user (checks Supabase, falls back to memory)
 */
export async function getUserProfileSkills(profileId: string): Promise<ProfileSkill[]> {
  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

  if (isSupabaseConfigured) {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('profile_skills')
        .select('*')
        .eq('profile_id', profileId);

      if (!error && data && data.length > 0) {
        // Hydrate skill objects
        return data.map(ps => ({
          ...ps,
          skill: V1_SKILLS.find(s => s.id === ps.skill_id),
        }));
      }
    } catch (err) {
      console.warn('Supabase profile_skills fetch fallback to memory:', err);
    }
  }

  const inMemory = memoryProfileSkills.get(profileId) || [];
  return inMemory.map(ps => ({
    ...ps,
    skill: V1_SKILLS.find(s => s.id === ps.skill_id),
  }));
}

/**
 * Save / replace profile skills for user idempotently
 */
export async function saveUserProfileSkills(
  profileId: string,
  skillIds: string[],
  metadata?: Record<string, { level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'; years_experience?: number; note?: string }>
): Promise<{ success: boolean; profileSkills: ProfileSkill[] }> {
  // 1. Filter only valid, active skills in V1 catalog
  const distinctIds = Array.from(new Set(skillIds));
  const validSkills = distinctIds
    .map(id => V1_SKILLS.find(s => s.id === id && s.status === 'active'))
    .filter((s): s is Skill => Boolean(s));

  const now = new Date().toISOString();
  const newProfileSkills: ProfileSkill[] = validSkills.map(skill => {
    const meta = metadata?.[skill.id] || {};
    return {
      id: `ps_${profileId.slice(0, 8)}_${skill.id.slice(0, 8)}`,
      profile_id: profileId,
      skill_id: skill.id,
      level: meta.level || 'intermediate',
      years_experience: meta.years_experience || 2,
      note: meta.note || '',
      created_at: now,
      updated_at: now,
      skill,
    };
  });

  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

  if (isSupabaseConfigured) {
    try {
      const supabase = createAdminClient();

      // Transaction-like atomic replace: delete old selections then batch insert
      await supabase.from('profile_skills').delete().eq('profile_id', profileId);

      if (newProfileSkills.length > 0) {
        const rowsToInsert = newProfileSkills.map(ps => ({
          profile_id: ps.profile_id,
          skill_id: ps.skill_id,
          level: ps.level,
          years_experience: ps.years_experience,
          note: ps.note,
          created_at: ps.created_at,
          updated_at: ps.updated_at,
        }));

        const { error: insertErr } = await supabase.from('profile_skills').insert(rowsToInsert);
        if (insertErr) {
          console.error('Supabase profile_skills insert error:', insertErr);
        }
      }

      // Also sync areas_of_expertise to profiles and skill_network_members for backward-compatibility
      const skillNames = validSkills.map(s => s.name);
      await supabase
        .from('skill_network_members')
        .update({
          skills: skillNames,
          areas_of_expertise: skillNames,
          updated_at: now,
        })
        .eq('user_id', profileId);
    } catch (sbErr) {
      console.warn('Supabase profile_skills write fallback to memory:', sbErr);
    }
  }

  // Update memory store
  memoryProfileSkills.set(profileId, newProfileSkills);

  // Sync to local platformStore profile
  const profile = platformStore.getProfileById(profileId);
  if (profile) {
    const skillNames = validSkills.map(s => s.name);
    platformStore.updateProfile(profileId, {
      bio: profile.bio || `Specialist in ${skillNames.slice(0, 3).join(', ')}.`,
    });

    // Also sync skill member if exists
    const member = platformStore.getAllSkillMembersForAdmin().find(m => m.user_id === profileId);
    if (member) {
      member.skills = skillNames;
      member.areas_of_expertise = skillNames;
    }
  }

  platformStore.addAuditLog('PROFILE_SKILLS_UPDATED', 'profile_skills', profileId, {
    skillCount: validSkills.length,
    skills: validSkills.map(s => s.name),
  });

  return { success: true, profileSkills: newProfileSkills };
}

/**
 * Create a new expertise suggestion
 */
export async function createExpertiseSuggestion(
  profileId: string,
  proposedName: string,
  nicheId?: string
): Promise<{ success: boolean; suggestion: ExpertiseSuggestion }> {
  const now = new Date().toISOString();
  const suggestion: ExpertiseSuggestion = {
    id: `sug_${Date.now()}`,
    profile_id: profileId,
    proposed_name: proposedName.trim(),
    niche_id: nicheId,
    status: 'pending',
    created_at: now,
  };

  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

  if (isSupabaseConfigured) {
    try {
      const supabase = createAdminClient();
      await supabase.from('expertise_suggestions').insert({
        profile_id: profileId,
        proposed_name: proposedName.trim(),
        niche_id: nicheId || null,
        status: 'pending',
        created_at: now,
      });
    } catch (err) {
      console.warn('Supabase expertise_suggestions insert fallback:', err);
    }
  }

  memorySuggestions.push(suggestion);
  platformStore.addAuditLog('EXPERTISE_SUGGESTION_SUBMITTED', 'expertise_suggestions', suggestion.id, {
    proposed_name: proposedName,
    niche_id: nicheId,
  });

  return { success: true, suggestion };
}
