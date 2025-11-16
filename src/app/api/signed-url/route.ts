import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  // Next.js Route handler runs at build; we still export a handler but will return 500 if keys missing
  console.warn('Supabase service role key or URL missing for signed-url route');
}

const supabaseAdmin = createClient(SUPABASE_URL || '', SUPABASE_SERVICE_ROLE_KEY || '');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const path = body?.path;
    if (!path) return NextResponse.json({ error: 'path required' }, { status: 400 });

    // bucket name used in this project
    const bucket = 'user-documents';

    // create signed url (expires in 60 seconds)
    const { data, error } = await supabaseAdmin.storage.from(bucket).createSignedUrl(path, 60);
    if (error) {
      console.error('createSignedUrl error', error);
      return NextResponse.json({ error: error.message || 'createSignedUrl failed' }, { status: 500 });
    }
    return NextResponse.json({ signedUrl: data.signedUrl });
  } catch (err: any) {
    console.error('signed-url handler error', err);
    return NextResponse.json({ error: err?.message || 'internal error' }, { status: 500 });
  }
}
