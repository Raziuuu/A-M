import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { V1_SKILLS, getUserProfileSkills, saveUserProfileSkills } from '@/lib/expertise';

const SaveExpertiseSchema = z.object({
  skill_ids: z.array(z.string().min(1)).max(100),
  metadata: z.record(
    z.string(),
    z.object({
      level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
      years_experience: z.number().int().min(0).max(60).optional(),
      note: z.string().max(300).optional(),
    })
  ).optional(),
});

export async function GET(req: Request) {
  try {
    const authResult = await requireAuth(req);
    if ('response' in authResult) {
      return authResult.response;
    }

    const { user } = authResult;
    const profileSkills = await getUserProfileSkills(user.id);

    return NextResponse.json({
      success: true,
      profileSkills,
    });
  } catch (err) {
    console.error('Error fetching user expertise:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve profile expertise selections.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const authResult = await requireAuth(req);
    if ('response' in authResult) {
      return authResult.response;
    }

    const { user } = authResult;

    // Parse and validate request body
    const body = await req.json();
    const parseResult = SaveExpertiseSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0].message || 'Invalid skill selections format.' },
        { status: 400 }
      );
    }

    const { skill_ids, metadata } = parseResult.data;

    // Validate that every submitted skill ID exists in active V1 catalog and belongs to a valid niche
    const activeSkillIds = new Set(V1_SKILLS.filter(s => s.status === 'active').map(s => s.id));
    for (const id of skill_ids) {
      if (!activeSkillIds.has(id)) {
        return NextResponse.json(
          { error: `Skill ID "${id}" is invalid, inactive, or not part of the active catalog.` },
          { status: 400 }
        );
      }
    }

    // Save profile skills idempotently for authenticated user
    const result = await saveUserProfileSkills(user.id, skill_ids, metadata);

    return NextResponse.json({
      success: true,
      profileSkills: result.profileSkills,
      message: 'Expertise selections saved successfully.',
    });
  } catch (err) {
    console.error('Error saving user expertise:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred while saving your expertise.' },
      { status: 500 }
    );
  }
}
