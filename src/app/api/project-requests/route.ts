import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { platformStore } from '@/lib/store';

export async function GET() {
  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

  if (isSupabaseConfigured) {
    const supabase = createAdminClient();
    const { data: requests, error } = await supabase
      .from('project_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && requests) {
      return NextResponse.json({ requests, source: 'supabase' });
    }
  }

  const requests = platformStore.getProjectRequests();
  return NextResponse.json({ requests, source: 'local' });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.client_name || !data.client_email || !data.title || !data.description) {
      return NextResponse.json({ error: 'Name, email, project title, and description are required.' }, { status: 400 });
    }

    const skills = Array.isArray(data.required_skills)
      ? data.required_skills
      : (data.required_skills ? data.required_skills.split(',').map((s: string) => s.trim()) : []);

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    if (isSupabaseConfigured) {
      const supabase = createAdminClient();
      const newRequest = {
        client_name: data.client_name,
        client_email: data.client_email,
        client_company: data.client_company || null,
        country: data.country || 'International',
        title: data.title,
        description: data.description,
        required_skills: skills,
        budget_range: data.budget_range || null,
        currency: data.currency || 'USD',
        timeline: data.timeline || null,
        work_mode: data.work_mode || 'remote',
        additional_requirements: data.additional_requirements || null,
        status: 'pending_review'
      };

      const { data: inserted, error } = await supabase
        .from('project_requests')
        .insert(newRequest)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        request: inserted,
        message: 'Your project requirements have been received. The Action = Matter team will review and contact you.',
      });
    }

    const created = platformStore.submitProjectRequest({
      client_name: data.client_name,
      client_email: data.client_email,
      client_company: data.client_company,
      country: data.country || 'International',
      title: data.title,
      description: data.description,
      required_skills: skills,
      budget_range: data.budget_range,
      currency: data.currency || 'USD',
      timeline: data.timeline,
      work_mode: data.work_mode || 'remote',
      additional_requirements: data.additional_requirements,
    });

    return NextResponse.json({
      success: true,
      request: created,
      message: 'Your project requirements have been received. The Action = Matter team will review and contact you.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to submit project request.' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const requestId = body.requestId || body.id;
    const action = body.action || (body.status === 'converted' ? 'convert' : body.status);

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    if (isSupabaseConfigured) {
      const supabase = createAdminClient();
      if (action === 'convert') {
        // Fetch request
        const { data: request } = await supabase
          .from('project_requests')
          .select('*')
          .eq('id', requestId)
          .single();

        if (request) {
          const slug = request.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
          const { data: project } = await supabase
            .from('projects')
            .insert({
              title: request.title,
              slug,
              description: request.description,
              client_name: request.client_name,
              client_company: request.client_company || 'Private Client',
              category: 'Client Commission',
              required_skills: request.required_skills || [],
              currency: request.currency || 'USD',
              work_mode: request.work_mode || 'remote',
              status: 'published'
            })
            .select()
            .single();

          await supabase
            .from('project_requests')
            .update({ status: 'converted', converted_project_id: project?.id })
            .eq('id', requestId);

          return NextResponse.json({ success: true, project });
        }
      } else {
        await supabase
          .from('project_requests')
          .update({ status: body.status || 'under_review', admin_notes: body.notes })
          .eq('id', requestId);

        return NextResponse.json({ success: true });
      }
    }

    if (action === 'convert') {
      const project = platformStore.convertRequestToProject(requestId);
      return NextResponse.json({ success: true, project });
    }

    platformStore.updateProjectRequest(requestId, { status: body.status });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to process request.' }, { status: 500 });
  }
}
