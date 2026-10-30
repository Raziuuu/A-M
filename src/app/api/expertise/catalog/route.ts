import { NextResponse } from 'next/server';
import { V1_NICHES, V1_SKILLS, searchCatalogSkills } from '@/lib/expertise';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const nicheId = searchParams.get('niche') || undefined;

    const filteredSkills = (query || nicheId)
      ? searchCatalogSkills(query, nicheId)
      : V1_SKILLS.filter(s => s.status === 'active');

    return NextResponse.json({
      success: true,
      niches: V1_NICHES,
      skills: filteredSkills,
      totalCount: filteredSkills.length,
    });
  } catch (err) {
    console.error('Catalog fetch error:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve expertise catalog.' },
      { status: 500 }
    );
  }
}
