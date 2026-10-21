import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');
  const userId = searchParams.get('userId');

  if (userId) {
    const userInterests = platformStore.getUserInterests(userId);
    return NextResponse.json({ interests: userInterests });
  }

  const interests = platformStore.getProjectInterests(projectId || undefined);
  return NextResponse.json({ interests });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const projectId = body.projectId || body.project_id;
    const message = body.message || body.proposal;

    if (!projectId || !message) {
      return NextResponse.json({ error: 'Project ID and proposal/message are required.' }, { status: 400 });
    }

    const currentUser = platformStore.getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    // Role gate: Free users CANNOT express interest
    if (currentUser.role === 'free_user' || (currentUser.role !== 'admin' && currentUser.role !== 'ceo' && currentUser.membership_status !== 'active')) {
      return NextResponse.json(
        { error: 'Skill Network membership required. Please upgrade to Premium to express interest in projects.' },
        { status: 403 }
      );
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
  } catch {
    return NextResponse.json({ error: 'Failed to submit expression of interest.' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { interestId, status, adminNotes, agreedCompensation } = await req.json();

    const currentUser = platformStore.getCurrentUser();
    if (currentUser.role !== 'admin' && currentUser.role !== 'ceo') {
      return NextResponse.json({ error: 'Administrative privileges required.' }, { status: 403 });
    }

    const updated = platformStore.updateInterestStatus(interestId, status, adminNotes, agreedCompensation);
    if (!updated) {
      return NextResponse.json({ error: 'Interest record not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, interest: updated });
  } catch {
    return NextResponse.json({ error: 'Failed to update interest status.' }, { status: 500 });
  }
}
