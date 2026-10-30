import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { V1_NICHES, createExpertiseSuggestion } from '@/lib/expertise';

const SuggestionSchema = z.object({
  proposed_name: z
    .string()
    .min(2, 'Skill name must be at least 2 characters.')
    .max(80, 'Skill name must not exceed 80 characters.')
    .trim(),
  niche_id: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const authResult = await requireAuth(req);
    if ('response' in authResult) {
      return authResult.response;
    }

    const { user } = authResult;
    const rawBody = await req.json();
    const parseResult = SuggestionSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0].message || 'Invalid suggestion data.' },
        { status: 400 }
      );
    }

    const { proposed_name, niche_id } = parseResult.data;

    // Validate niche_id if provided
    if (niche_id) {
      const nicheExists = V1_NICHES.some(n => n.id === niche_id);
      if (!nicheExists) {
        return NextResponse.json(
          { error: 'Selected niche is not recognized.' },
          { status: 400 }
        );
      }
    }

    const result = await createExpertiseSuggestion(user.id, proposed_name, niche_id);

    return NextResponse.json({
      success: true,
      suggestion: result.suggestion,
      message: 'Expertise suggestion submitted for review. Thank you for contributing.',
    });
  } catch (err) {
    console.error('Error submitting suggestion:', err);
    return NextResponse.json(
      { error: 'Failed to submit expertise suggestion.' },
      { status: 500 }
    );
  }
}
