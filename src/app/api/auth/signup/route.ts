import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';
import { Profile } from '@/lib/types';
import { getCountryByCode } from '@/lib/countries';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const { full_name, username, email, password, confirm_password, country_code, profession, skills } = await req.json();

    if (!full_name || !username || !email || !password || !country_code || !profession) {
      return NextResponse.json({ error: 'Please provide all required fields.' }, { status: 400 });
    }

    if (password !== confirm_password) {
      return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    // Check unique username & email in memory
    const existing = platformStore.getProfiles().find(
      p => p.email.toLowerCase() === email.toLowerCase() || p.username.toLowerCase() === username.toLowerCase()
    );

    if (existing) {
      return NextResponse.json({ error: 'An account with that email or username already exists.' }, { status: 409 });
    }

    const country = getCountryByCode(country_code);
    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(full_name)}&backgroundColor=080b10&textColor=dfaf4b`;
    const bioText = `Skilled professional specializing in ${profession}. Skills: ${Array.isArray(skills) ? skills.join(', ') : skills}.`;

    let userId = `usr_${Date.now()}`;

    // 1. Direct Supabase Integration (auth.users + public.profiles)
    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    if (isSupabaseConfigured) {
      try {
        const supabase = createAdminClient();
        
        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            full_name,
            username,
          },
        });

        if (authError) {
          // If already registered in Supabase
          if (authError.message.includes('already registered')) {
            return NextResponse.json({ error: 'A user with this email address already exists in Supabase.' }, { status: 409 });
          }
          console.warn('Supabase Auth warning:', authError.message);
        } else if (authData.user) {
          userId = authData.user.id;

          // Insert into public.profiles in Supabase
          const { error: profileError } = await supabase.from('profiles').upsert({
            id: authData.user.id,
            email,
            full_name,
            username,
            avatar_url: avatarUrl,
            country_code: country.code,
            country_name: country.name,
            city: country.name,
            timezone: country.timezone,
            locale: country.locale,
            profession,
            bio: bioText,
            role: 'free_user',
            membership_status: 'inactive',
            membership_tier: 'free',
            updated_at: new Date().toISOString(),
          });

          if (profileError) {
            console.error('Supabase profile insert error:', profileError);
          } else {
            console.log(`User profile persisted to Supabase database for: ${email} (${userId})`);
          }
        }
      } catch (sbError) {
        console.error('Supabase signup dispatch error:', sbError);
      }
    }

    const newProfile: Profile = {
      id: userId,
      email,
      full_name,
      username,
      avatar_url: avatarUrl,
      country_code: country.code,
      country_name: country.name,
      timezone: country.timezone,
      locale: country.locale,
      profession,
      bio: bioText,
      role: 'free_user',
      membership_status: 'inactive',
      membership_tier: 'free',
      cancel_at_period_end: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add to active session store
    platformStore.getProfiles().push(newProfile);
    platformStore.setCurrentUser(newProfile.id);
    platformStore.addAuditLog('USER_REGISTERED', 'profiles', newProfile.id, { email, role: 'free_user', supabase_synced: isSupabaseConfigured });

    return NextResponse.json({
      success: true,
      user: newProfile,
      message: 'Account created successfully. Welcome to Action = Matter.',
    });
  } catch {
    return NextResponse.json({ error: 'Registration failed. Please check inputs.' }, { status: 500 });
  }
}
