import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';

export async function GET() {
  const currentUser = platformStore.getCurrentUser();
  if (currentUser.role !== 'admin' && currentUser.role !== 'ceo') {
    return NextResponse.json({ error: 'Administrative privileges required.' }, { status: 403 });
  }

  const requests = platformStore.getProjectRequests();
  return NextResponse.json({ requests });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.client_name || !data.client_email || !data.title || !data.description) {
      return NextResponse.json({ error: 'Name, email, project title, and description are required.' }, { status: 400 });
    }

    const created = platformStore.submitProjectRequest({
      client_name: data.client_name,
      client_email: data.client_email,
      client_company: data.client_company,
      country: data.country || 'International',
      title: data.title,
      description: data.description,
      required_skills: Array.isArray(data.required_skills) ? data.required_skills : (data.required_skills ? data.required_skills.split(',').map((s: string) => s.trim()) : []),
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
  } catch {
    return NextResponse.json({ error: 'Failed to submit project request.' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const requestId = body.requestId || body.id;
    const action = body.action || (body.status === 'converted' ? 'convert' : body.status);

    const currentUser = platformStore.getCurrentUser();
    if (currentUser.role !== 'admin' && currentUser.role !== 'ceo') {
      return NextResponse.json({ error: 'Administrative privileges required.' }, { status: 403 });
    }

    if (action === 'convert') {
      const project = platformStore.convertRequestToProject(requestId);
      if (!project) {
        return NextResponse.json({ error: 'Failed to convert request to project.' }, { status: 400 });
      }
      return NextResponse.json({ success: true, project, message: 'Request converted and published as a live project.' });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Server error processing request.' }, { status: 500 });
  }
}
