import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { platformStore } from '@/lib/store';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');
  const userId = searchParams.get('userId');

  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

  if (isSupabaseConfigured) {
    const supabase = createAdminClient();
    let query = supabase.from('project_interests').select(`
      *,
      project:projects(*),
      user:profiles(*)
    `).order('submitted_at', { ascending: false });

    if (projectId) query = query.eq('project_id', projectId);
    if (userId) query = query.eq('user_id', userId);

    const { data: interests, error } = await query;
    if (!error && interests) {
      return NextResponse.json({ interests, source: 'supabase' });
    }
  }

  if (userId) {
    const userInterests = platformStore.getUserInterests(userId);
    return NextResponse.json({ interests: userInterests, source: 'local' });
  }

  const interests = platformStore.getProjectInterests(projectId || undefined);
  return NextResponse.json({ interests, source: 'local' });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const projectId = body.projectId || body.project_id;
    const message = body.message || body.proposal;
    const userId = body.userId || body.user_id;

    if (!projectId || !message) {
      return NextResponse.json({ error: 'Project ID and proposal/message are required.' }, { status: 400 });
    }

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    if (isSupabaseConfigured && userId) {
      const supabase = createAdminClient();

      // Check if user is premium
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (!profile || (profile.role === 'free_user' && profile.membership_status !== 'active')) {
        return NextResponse.json(
          { error: 'Skill Network membership required. Please upgrade to Premium to express interest in projects.' },
          { status: 403 }
        );
      }

      // Check existing interest
      const { data: existing } = await supabase
        .from('project_interests')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        return NextResponse.json({ error: 'You have already submitted an expression of interest for this project.' }, { status: 400 });
      }

      const { data: interest, error } = await supabase
        .from('project_interests')
        .insert({
          project_id: projectId,
          user_id: userId,
          message,
          status: 'submitted',
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        interest,
        message: 'Your expression of interest has been submitted to the Action = Matter team.',
      });
    }

    const currentUser = platformStore.getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const result = platformStore.submitProjectInterest(projectId, currentUser.id, message);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      interest: result.interest,
      message: 'Your expression of interest has been submitted to the Action = Matter team.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to submit expression of interest.' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { interestId, status, adminNotes, agreedCompensation } = await req.json();

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    if (isSupabaseConfigured) {
      const supabase = createAdminClient();
      const updates: Record<string, any> = {
        updated_at: new Date().toISOString()
      };
      if (status) updates.status = status;
      if (adminNotes !== undefined) updates.admin_notes = adminNotes;
      if (agreedCompensation !== undefined) updates.agreed_compensation = agreedCompensation;

      const { data, error } = await supabase
        .from('project_interests')
        .update(updates)
        .eq('id', interestId)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, interest: data });
    }

    const updated = platformStore.updateInterestStatus(interestId, status, adminNotes, agreedCompensation);
    return NextResponse.json({ success: true, interest: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update interest status.' }, { status: 500 });
  }
}
