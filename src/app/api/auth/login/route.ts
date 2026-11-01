import { NextResponse } from 'next/server';
import { z } from 'zod';
import { platformStore } from '@/lib/store';
import { createAdminClient } from '@/lib/supabase/admin';
import { SESSION_COOKIE_NAME } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { Profile } from '@/lib/types';

const LoginSchema = z.object({
  email: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(req: Request) {
  try {
    // 1. Rate limiting: 20 login attempts per IP per minute
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`login:${ip}`, { windowMs: 60000, max: 20 });
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    // 2. Input validation
    const rawBody = await req.json();
    const parseResult = LoginSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email: inputIdentifier, password } = parseResult.data;
    let loginEmail = inputIdentifier.trim().toLowerCase();

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    if (isSupabaseConfigured) {
      try {
        const supabase = createAdminClient();

        // If identifier does not have '@', treat as username and resolve email
        if (!loginEmail.includes('@')) {
          const { data: matchedProfile } = await supabase
            .from('profiles')
            .select('email')
            .ilike('username', loginEmail)
            .maybeSingle();

          if (matchedProfile?.email) {
            loginEmail = matchedProfile.email.toLowerCase();
          } else {
            // Also search auth users metadata for username match
            const { data: listData } = await supabase.auth.admin.listUsers({ page: 1, perPage: 100 });
            const foundUser = listData?.users?.find(
              u => u.user_metadata?.username?.toLowerCase() === loginEmail
            );
            if (foundUser?.email) {
              loginEmail = foundUser.email.toLowerCase();
            }
          }
        }

        // Attempt Supabase password sign-in
        let { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password,
        });

        // If email not confirmed, auto-confirm and retry
        if (authError && authError.message.toLowerCase().includes('email not confirmed')) {
          const { data: listData } = await supabase.auth.admin.listUsers({ page: 1, perPage: 100 });
          const userToConfirm = listData?.users?.find(u => u.email?.toLowerCase() === loginEmail);
          if (userToConfirm) {
            await supabase.auth.admin.updateUserById(userToConfirm.id, { email_confirm: true });
            const retryAuth = await supabase.auth.signInWithPassword({
              email: loginEmail,
              password,
            });
            authData = retryAuth.data;
            authError = retryAuth.error;
          }
        }

        if (authError || !authData?.user) {
          // If Supabase authentication returned error, verify if user exists in local store
          const localProfiles = platformStore.getProfiles();
          const localUser = localProfiles.find(
            p => p.email.toLowerCase() === loginEmail || p.username.toLowerCase() === loginEmail
          );

          if (!localUser) {
            return NextResponse.json(
              { error: 'Invalid email, username, or password.' },
              { status: 401 }
            );
          }
        }

        if (authData?.user) {
          // Fetch or auto-heal profile in Supabase profiles table
          let { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .maybeSingle();

          if (!profile) {
            // Auto-heal missing profile row
            const meta = authData.user.user_metadata || {};
            const createdProfile: Profile = {
              id: authData.user.id,
              email: authData.user.email || loginEmail,
              full_name: meta.full_name || loginEmail.split('@')[0],
              username: meta.username || loginEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '') || `user_${authData.user.id.slice(0, 8)}`,
              avatar_url: meta.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(meta.full_name || loginEmail)}&backgroundColor=080b10&textColor=dfaf4b`,
              country_code: 'US',
              country_name: 'United States',
              city: 'New York',
              timezone: 'UTC',
              locale: 'en-US',
              profession: meta.account_type ? `${meta.account_type} Specialist` : 'Platform Specialist',
              bio: 'Verified ecosystem member.',
              role: 'premium_member',
              membership_status: 'active',
              membership_tier: 'annual',
              subscription_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
              cancel_at_period_end: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };

            await supabase.from('profiles').upsert(createdProfile);
            profile = createdProfile;
          }

          // Sync in-memory platform store
          const existingIdx = platformStore.getProfiles().findIndex(p => p.id === profile.id);
          if (existingIdx >= 0) {
            platformStore.getProfiles()[existingIdx] = profile;
          } else {
            platformStore.getProfiles().push(profile);
          }

          const response = NextResponse.json({
            success: true,
            user: profile,
            message: 'Authentication successful.',
          });

          const sessionToken = authData.session?.access_token || `usr_${profile.id}`;

          response.cookies.set({
            name: SESSION_COOKIE_NAME,
            value: sessionToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
          });

          return response;
        }
      } catch (sbErr) {
        console.error('Supabase authentication error:', sbErr);
      }
    }

    // Fallback: local store authentication
    const profiles = platformStore.getProfiles();
    const user = profiles.find(
      p => p.email.toLowerCase() === loginEmail || p.username.toLowerCase() === loginEmail
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email, username, or password.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user,
      message: 'Authentication successful.',
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: `usr_${user.id}`,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Internal authentication error.' }, { status: 500 });
  }
}
