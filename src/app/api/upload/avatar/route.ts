import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Validate mime type
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file format. Please upload JPG, PNG, or WebP.' },
        { status: 400 }
      );
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image size exceeds 5MB limit.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.type.split('/')[1] || 'png';
    const filename = `avatar_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    if (isSupabaseConfigured) {
      const supabase = createAdminClient();

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filename, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (!error && data) {
        const { data: pubUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filename);

        return NextResponse.json({
          success: true,
          url: pubUrlData.publicUrl,
        });
      }

      console.warn('Supabase storage upload error:', error?.message);
    }

    // Fallback: Base64 data URL
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
    return NextResponse.json({
      success: true,
      url: base64,
    });
  } catch (err: unknown) {
    console.error('Avatar upload exception:', err);
    const msg = err instanceof Error ? err.message : 'Upload failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
