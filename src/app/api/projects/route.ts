import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { platformStore } from '@/lib/store';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const workMode = searchParams.get('work_mode');
    const all = searchParams.get('all') === 'true';

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    if (isSupabaseConfigured) {
      const supabase = createAdminClient();
      let query = supabase.from('projects').select('*').order('created_at', { ascending: false });

      if (!all) {
        query = query.in('status', ['published', 'interest_open']);
      }
      if (category) {
        query = query.eq('category', category);
      }
      if (workMode) {
        query = query.eq('work_mode', workMode);
      }

      const { data: projects, error } = await query;
      if (!error && projects) {
        return NextResponse.json({ projects, source: 'supabase' });
      }
      if (error) {
        console.error('Supabase projects query error:', error.message);
      }
    }

    return NextResponse.json({ projects: platformStore.getProjects(), source: 'local' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.title || !body.description || !body.category) {
      return NextResponse.json({ error: 'Title, description, and category are required.' }, { status: 400 });
    }

    const slug = (body.title || 'project')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    if (isSupabaseConfigured) {
      const supabase = createAdminClient();
      const newProj = {
        title: body.title,
        slug,
        description: body.description,
        client_name: body.client_name || 'Action = Matter Client',
        client_company: body.client_company || 'Private Client',
        category: body.category,
        required_skills: Array.isArray(body.required_skills)
          ? body.required_skills
          : (body.required_skills ? body.required_skills.split(',').map((s: string) => s.trim()) : []),
        budget_min: Number(body.budget_min) || 0,
        budget_max: Number(body.budget_max) || 0,
        currency: body.currency || 'EUR',
        is_budget_public: body.is_budget_public ?? true,
        project_type: body.project_type || 'fixed',
        work_mode: body.work_mode || 'remote',
        country: body.country || 'International',
        location: body.location || 'Remote',
        expected_duration: body.expected_duration || '1-3 months',
        deadline: body.deadline || null,
        interest_deadline: body.interest_deadline || null,
        people_required: Number(body.people_required) || 1,
        status: body.status || 'published',
      };

      const { data, error } = await supabase
        .from('projects')
        .insert(newProj)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, project: data });
    }

    // Local fallback
    const created = platformStore.createProject({
      ...body,
      slug,
      required_skills: Array.isArray(body.required_skills)
        ? body.required_skills
        : (body.required_skills ? body.required_skills.split(',').map((s: string) => s.trim()) : []),
      budget_min: Number(body.budget_min) || 0,
      budget_max: Number(body.budget_max) || 0,
      people_required: Number(body.people_required) || 1,
      status: body.status || 'published',
    });

    return NextResponse.json({ success: true, project: created });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create project' }, { status: 500 });
  }
}
