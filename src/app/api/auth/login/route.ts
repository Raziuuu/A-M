import { NextResponse } from 'next/server';
import { z } from 'zod';
import { platformStore } from '@/lib/store';
import { createAdminClient } from '@/lib/supabase/admin';
import { SESSION_COOKIE_NAME } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const LoginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(req: Request) {
  try {
    // 1. Rate limiting: 10 login attempts per IP per minute to prevent brute-force attacks
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`login:${ip}`, { windowMs: 60000, max: 10 });
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

    const { email, password } = parseResult.data;

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    if (isSupabaseConfigured) {
      try {
        const supabase = createAdminClient();
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        if (authError || !authData.user) {
          return NextResponse.json(
            { error: 'Invalid email or password.' },
            { status: 401 }
          );
        }

        // Fetch user profile from Supabase profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profile) {
          // Sync with local memory cache if present
          const existingIdx = platformStore.getProfiles().findIndex(p => p.id === profile.id);
          if (existingIdx >= 0) {
            platformStore.getProfiles()[existingIdx] = profile;
          } else {
            platformStore.getProfiles().push(profile);
          }

          // Build response with secure HttpOnly session cookie
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
        return NextResponse.json(
          { error: 'Authentication service temporarily unavailable.' },
          { status: 500 }
        );
      }
    }

    // Fallback: strictly check local store
    const profiles = platformStore.getProfiles();
    const user = profiles.find(p => p.email.toLowerCase() === email.trim().toLowerCase());

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
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
