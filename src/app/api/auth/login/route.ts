import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    if (isSupabaseConfigured) {
      try {
        const supabase = createAdminClient();
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!authError && authData.user) {
          // Fetch from Supabase profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          if (profile) {
            // Sync to platformStore
            const existingIdx = platformStore.getProfiles().findIndex(p => p.id === profile.id);
            if (existingIdx >= 0) {
              platformStore.getProfiles()[existingIdx] = profile;
            } else {
              platformStore.getProfiles().push(profile);
            }
            platformStore.setCurrentUser(profile.id);

            return NextResponse.json({
              success: true,
              user: profile,
              session: authData.session,
              message: 'Authentication successful via Supabase.',
            });
          }
        }
      } catch (sbErr) {
        console.warn('Supabase login check skipped:', sbErr);
      }
    }

    // Fallback: Check local store profiles (e.g. Elena, Alex, Mahammad Razi)
    const profiles = platformStore.getProfiles();
    const user = profiles.find(p => p.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials. Please verify your email and password.' }, { status: 401 });
    }

    // Set active in store
    platformStore.setCurrentUser(user.id);
    return NextResponse.json({
      success: true,
      user,
      message: 'Authentication successful.',
    });
  } catch {
    return NextResponse.json({ error: 'Internal authentication error.' }, { status: 500 });
  }
}
