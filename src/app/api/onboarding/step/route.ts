import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { platformStore } from '@/lib/store';

// Helper to determine the highest step a user has unlocked based on completed profile fields
function computeMaxStep(profile: any, member: any, skillCount: number): number {
  let step = 1;

  // Step 1: Account (always completed if authenticated)
  if (profile?.email && profile?.username) {
    step = Math.max(step, 2);
  }

  // Step 2: Profile details
  if (profile?.profession) {
    step = Math.max(step, 3);
  }

  // Step 3: Region
  if (profile?.country_code && (profile?.city || profile?.timezone)) {
    step = Math.max(step, 4);
  }

  // Step 4: Bio & Experience
  if (profile?.bio && profile.bio.trim().length >= 10) {
    step = Math.max(step, 5);
  }

  // Step 5: Preferences (Availability)
  if (member?.availability) {
    step = Math.max(step, 6);
  }

  // Step 6: Rates
  if (member?.hourly_rate && Number(member.hourly_rate) > 0) {
    step = Math.max(step, 7);
  }

  // Step 7: Expertise
  if (skillCount > 0) {
    step = Math.max(step, 8);
  }

  return step;
}

export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    let memberData: any = null;
    let skillCount = 0;

    if (isSupabaseConfigured) {
      const supabase = createAdminClient();

      const [memberRes, skillRes] = await Promise.all([
        supabase.from('skill_network_members').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('profile_skills').select('id', { count: 'exact', head: true }).eq('profile_id', user.id),
      ]);

      memberData = memberRes.data;
      skillCount = skillRes.count || 0;
    } else {
      const mems = platformStore.getSkillMembers();
      memberData = mems.find(m => m.user_id === user.id) || null;
      skillCount = (user as any).skills?.length || 0;
    }

    const maxStep = computeMaxStep(user, memberData, skillCount);

    return NextResponse.json({
      user,
      member: memberData,
      skillCount,
      maxStepReached: maxStep,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch onboarding state';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { step, data } = body;

    if (!step || typeof step !== 'number' || step < 1 || step > 8) {
      return NextResponse.json({ error: 'Invalid step number' }, { status: 400 });
    }

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    const supabase = isSupabaseConfigured ? createAdminClient() : null;

    // Handle updates by step
    if (step === 1) {
      // Step 1: Account Details (Full name, Username)
      const { full_name, username } = data || {};
      if (!full_name || !username) {
        return NextResponse.json({ error: 'Full name and username are required' }, { status: 400 });
      }

      if (supabase) {
        await supabase
          .from('profiles')
          .update({
            full_name: full_name.trim(),
            username: username.trim().toLowerCase(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
      }
    } else if (step === 2) {
      // Step 2: Profile (Profession, Avatar)
      const { profession, avatar_url } = data || {};
      if (!profession || !profession.trim()) {
        return NextResponse.json({ error: 'Professional title / headline is required' }, { status: 400 });
      }

      if (supabase) {
        await supabase
          .from('profiles')
          .update({
            profession: profession.trim(),
            avatar_url: avatar_url || user.avatar_url || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
      }
    } else if (step === 3) {
      // Step 3: Region (Country, City, Timezone)
      const { country_code, country_name, city, timezone } = data || {};
      if (!country_code) {
        return NextResponse.json({ error: 'Country selection is required' }, { status: 400 });
      }

      if (supabase) {
        await supabase
          .from('profiles')
          .update({
            country_code,
            country_name: country_name || 'United States',
            city: city?.trim() || null,
            timezone: timezone || 'UTC',
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
      }
    } else if (step === 4) {
      // Step 4: Bio & Experience
      const { bio, experience_years, website, linkedin, github } = data || {};
      if (!bio || bio.trim().length < 10) {
        return NextResponse.json({ error: 'Please provide a bio of at least 10 characters' }, { status: 400 });
      }

      if (supabase) {
        await supabase
          .from('profiles')
          .update({
            bio: bio.trim(),
            website: website?.trim() || null,
            linkedin: linkedin?.trim() || null,
            github: github?.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        // Also ensure member record exists
        const { data: existingMember } = await supabase
          .from('skill_network_members')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (existingMember) {
          await supabase
            .from('skill_network_members')
            .update({
              title: user.profession || 'Specialist',
              experience_years: Number(experience_years) || 1,
            })
            .eq('id', existingMember.id);
        } else {
          await supabase
            .from('skill_network_members')
            .insert({
              user_id: user.id,
              title: user.profession || 'Specialist',
              experience_years: Number(experience_years) || 1,
            });
        }
      }
    } else if (step === 5) {
      // Step 5: Preferences (Availability)
      const { availability } = data || {};
      const validAvailability = ['available', 'part_time', 'full_time', 'busy', 'unavailable'];
      const chosenAvailability = validAvailability.includes(availability) ? availability : 'available';

      if (supabase) {
        const { data: existingMember } = await supabase
          .from('skill_network_members')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (existingMember) {
          await supabase
            .from('skill_network_members')
            .update({
              availability: chosenAvailability,
            })
            .eq('id', existingMember.id);
        } else {
          await supabase
            .from('skill_network_members')
            .insert({
              user_id: user.id,
              title: user.profession || 'Specialist',
              availability: chosenAvailability,
            });
        }
      }
    } else if (step === 6) {
      // Step 6: Rates (Hourly rate, Currency)
      const { hourly_rate, currency } = data || {};
      const rateNum = Number(hourly_rate);
      if (isNaN(rateNum) || rateNum <= 0) {
        return NextResponse.json({ error: 'Please enter a valid hourly rate greater than 0' }, { status: 400 });
      }

      if (supabase) {
        const { data: existingMember } = await supabase
          .from('skill_network_members')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (existingMember) {
          await supabase
            .from('skill_network_members')
            .update({
              hourly_rate: rateNum,
              currency: currency || 'USD',
            })
            .eq('id', existingMember.id);
        } else {
          await supabase
            .from('skill_network_members')
            .insert({
              user_id: user.id,
              title: user.profession || 'Specialist',
              hourly_rate: rateNum,
              currency: currency || 'USD',
            });
        }
      }
    } else if (step === 8) {
      // Step 8: Launch & Complete Onboarding
      if (supabase) {
        await supabase
          .from('profiles')
          .update({
            membership_status: 'active',
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        await supabase
          .from('skill_network_members')
          .update({
            is_active: true,
          })
          .eq('user_id', user.id);
      }
    }

    return NextResponse.json({
      success: true,
      nextStep: Math.min(step + 1, 8),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to save onboarding step';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
