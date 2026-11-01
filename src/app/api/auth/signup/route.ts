import { NextResponse } from 'next/server';
import { z } from 'zod';
import { platformStore } from '@/lib/store';
import { Profile } from '@/lib/types';
import { getCountryByCode } from '@/lib/countries';
import { createAdminClient } from '@/lib/supabase/admin';
import { SESSION_COOKIE_NAME } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { V1_SKILLS } from '@/lib/expertise';

const SelectedSkillSchema = z.object({
  skill_id: z.string().uuid(),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  years_experience: z.number().min(0).max(50).optional(),
  note: z.string().max(300).optional(),
});

const CompleteSignupSchema = z.object({
  // Step 2: Type of account
  account_type: z.enum(['specialist', 'client', 'agency', 'consultant']).default('specialist'),

  // Step 3: Personal Information
  full_name: z.string().min(2, 'Full name must be at least 2 characters').max(80),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30).regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain alphanumeric characters, underscores, and dashes'),
  email: z.string().email('Invalid email address format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),

  // Step 4: Profile Details
  profession: z.string().min(2, 'Professional headline is required').max(100),
  avatar_url: z.string().url().optional().or(z.literal('')),
  bio: z.string().optional().or(z.literal('')),
  experience_years: z.number().min(0).max(50).default(3),
  website: z.string().optional().or(z.literal('')),
  linkedin: z.string().optional().or(z.literal('')),
  github: z.string().optional().or(z.literal('')),

  // Step 5: Goals & Preferences
  goals: z.array(z.string()).default([]),

  // Step 6: Location
  country_code: z.string().min(2).max(3).default('US'),
  city: z.string().optional().or(z.literal('')),
  timezone: z.string().optional().or(z.literal('')),

  // Step 7: Your Expertise (117 Standardized Skills)
  selected_skills: z.array(SelectedSkillSchema).default([]),

  // Step 8: Interests
  interests: z.array(z.string()).default([]),

  // Step 9: Availability & Rates
  availability: z.enum(['available', 'part_time', 'full_time', 'busy', 'unavailable']).default('available'),
  hourly_rate: z.number().min(0).max(5000).default(120),
  currency: z.string().default('USD'),

  // Step 11: Terms & Conditions
  terms_accepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions to complete registration.',
  }),
}).refine(data => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting: 5 signups per IP per 10 minutes
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`signup:${ip}`, { windowMs: 600000, max: 10 });
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many registration requests. Please wait and try again.' },
        { status: 429 }
      );
    }

    // 2. Strict Input Validation
    const rawBody = await req.json();
    const parseResult = CompleteSignupSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const country = getCountryByCode(data.country_code);

    const avatarUrl =
      data.avatar_url && data.avatar_url.trim() !== ''
        ? data.avatar_url.trim()
        : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.full_name)}&backgroundColor=080b10&textColor=dfaf4b`;

    const bioText =
      data.bio && data.bio.trim() !== ''
        ? data.bio.trim()
        : `${data.profession} with ${data.experience_years} years of experience in the international ecosystem.`;

    let userId = `usr_${Date.now()}`;
    let sessionToken = '';

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    if (isSupabaseConfigured) {
      try {
        const supabase = createAdminClient();

        // Check if email or username already exists in Supabase profiles
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('id')
          .or(`email.eq.${data.email.toLowerCase()},username.eq.${data.username.toLowerCase()}`)
          .maybeSingle();

        if (existingUser) {
          return NextResponse.json(
            { error: 'An account with that email or username already exists.' },
            { status: 409 }
          );
        }

        // 1. Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: data.email.trim().toLowerCase(),
          password: data.password,
          email_confirm: true,
          user_metadata: {
            full_name: data.full_name,
            username: data.username,
            account_type: data.account_type,
          },
        });

        if (authError) {
          if (authError.message.toLowerCase().includes('already registered') || authError.message.toLowerCase().includes('already exists')) {
            const { data: listData } = await supabase.auth.admin.listUsers({ page: 1, perPage: 100 });
            const existingAuthUser = listData?.users?.find(
              u => u.email?.toLowerCase() === data.email.trim().toLowerCase()
            );

            if (existingAuthUser) {
              // User exists in auth but may not have profile; update password & metadata
              await supabase.auth.admin.updateUserById(existingAuthUser.id, {
                password: data.password,
                email_confirm: true,
                user_metadata: {
                  full_name: data.full_name,
                  username: data.username,
                  account_type: data.account_type,
                },
              });
              userId = existingAuthUser.id;
            } else {
              return NextResponse.json(
                { error: 'An account with that email or username already exists.' },
                { status: 409 }
              );
            }
          } else {
            return NextResponse.json({ error: authError.message }, { status: 400 });
          }
        } else if (authData.user) {
          userId = authData.user.id;
        }

        // 2. Insert Profile record in Supabase
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: userId,
          email: data.email.trim().toLowerCase(),
          full_name: data.full_name,
          username: data.username.trim().toLowerCase(),
          avatar_url: avatarUrl,
          country_code: country.code,
          country_name: country.name,
          city: data.city || country.name,
          timezone: data.timezone || country.timezone,
          locale: country.locale,
          profession: data.profession,
          bio: bioText,
          website: data.website || null,
          linkedin: data.linkedin || null,
          github: data.github || null,
          role: 'premium_member',
          membership_status: 'active',
          membership_tier: 'annual',
          cancel_at_period_end: false,
          updated_at: new Date().toISOString(),
        });

        if (profileError) {
          console.error('Supabase profile creation error:', profileError);
        }

        // 3. Resolve skill names for Skill Network directory
        const validSkillMap = new Map<string, string>();
        V1_SKILLS.forEach(s => validSkillMap.set(s.id, s.name));
        const skillNames = data.selected_skills
          .map(s => validSkillMap.get(s.skill_id))
          .filter((n): n is string => Boolean(n));

        // 4. Create Skill Network Member Profile
        const { error: memberError } = await supabase.from('skill_network_members').upsert({
          user_id: userId,
          title: data.profession,
          industry: data.account_type,
          experience_years: data.experience_years,
          hourly_rate: data.hourly_rate,
          currency: data.currency,
          availability: data.availability,
          skills: skillNames,
          areas_of_expertise: [...data.goals, ...data.interests],
          is_active: true,
          is_approved: false,
          verification_status: 'pending',
          updated_at: new Date().toISOString(),
        });

        if (memberError) {
          console.error('Supabase skill_network_members creation error:', memberError);
        }

        // 5. Insert Step 7 Standardized Skills relationally into profile_skills
        if (data.selected_skills.length > 0) {
          const profileSkillRows = data.selected_skills.map(s => ({
            profile_id: userId,
            skill_id: s.skill_id,
            level: s.level || 'intermediate',
            years_experience: s.years_experience || 2,
            note: s.note || '',
            updated_at: new Date().toISOString(),
          }));

          const { error: skillsError } = await supabase
            .from('profile_skills')
            .upsert(profileSkillRows, { onConflict: 'profile_id,skill_id' });

          if (skillsError) {
            console.error('Supabase profile_skills error:', skillsError.message);
          }
        }

        // 6. Sign in user to retrieve live session access token
        try {
          const { data: loginData } = await supabase.auth.signInWithPassword({
            email: data.email.trim().toLowerCase(),
            password: data.password,
          });

          if (loginData?.session?.access_token) {
            sessionToken = loginData.session.access_token;
          }
        } catch {
          // ignore
        }
      } catch (sbError) {
        console.error('Supabase signup dispatch error:', sbError);
      }
    }

    const newProfile: Profile = {
      id: userId,
      email: data.email.trim().toLowerCase(),
      full_name: data.full_name,
      username: data.username.trim().toLowerCase(),
      avatar_url: avatarUrl,
      country_code: country.code,
      country_name: country.name,
      city: data.city || country.name,
      timezone: data.timezone || country.timezone,
      locale: country.locale,
      profession: data.profession,
      bio: bioText,
      website: data.website || undefined,
      linkedin: data.linkedin || undefined,
      github: data.github || undefined,
      role: 'free_user',
      membership_status: 'active',
      membership_tier: 'free',
      cancel_at_period_end: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    platformStore.getProfiles().push(newProfile);
    platformStore.addAuditLog('USER_REGISTERED', 'profiles', newProfile.id, {
      email: newProfile.email,
      role: 'free_user',
      supabase_synced: isSupabaseConfigured,
      skills_count: data.selected_skills.length,
    });

    const response = NextResponse.json({
      success: true,
      user: newProfile,
      message: 'Account created successfully with full credentials. Welcome to Action = Matter.',
    });

    // Set HttpOnly session cookie
    const tokenVal = sessionToken || (newProfile.id.startsWith('usr_') ? newProfile.id : `usr_${newProfile.id}`);
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: tokenVal,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: unknown) {
    console.error('Complete signup error:', err);
    const msg = err instanceof Error ? err.message : 'Registration failed. Please check inputs.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
