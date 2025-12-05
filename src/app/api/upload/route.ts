import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Validate server environment before creating client
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      return NextResponse.json(
        {
          error: 'Server misconfiguration',
          details: {
            missingSupabaseUrl: !SUPABASE_URL,
            missingServiceRoleKey: !SERVICE_ROLE_KEY
          }
        },
        { status: 500 }
      );
    }

    // Create a Supabase client with the service role key for admin access
    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const userId = formData.get('userId') as string | null;
    const financialYear = formData.get('financialYear') as string | null;
    
    // Validate inputs
    if (!file || !userId || !financialYear) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify the user exists in the database
    const { data: userExists, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (userError || !userExists) {
      console.error('User verification failed:', userError);
      return NextResponse.json(
        { error: 'User verification failed' },
        { status: 401 }
      );
    }

    // Create a path grouped by financial year
    const path = `${userId}/${financialYear}/${Date.now()}_${file.name}`;
    
    // Upload the file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from('user-documents')
      .upload(path, file, { 
        cacheControl: '3600', 
        upsert: false,
        contentType: (file as any).type || 'application/octet-stream'
      });

    if (uploadError) {
      console.error('File upload failed:', uploadError);
      return NextResponse.json(
        { error: 'File upload failed', details: uploadError },
        { status: 500 }
      );
    }

    // Get the public URL for the uploaded file
    const { data: publicUrlData } = supabaseAdmin
      .storage
      .from('user-documents')
      .getPublicUrl(path);

    const fileUrl = publicUrlData?.publicUrl || '';

    // Extract optional admin flag from formData (for admin uploads)
    const uploadedByAdminRaw = formData.get('uploadedByAdmin');
    const uploadedByAdmin = uploadedByAdminRaw === 'true';

    // Prepare insert payloads (full and minimal) using const without mutation
    const fullPayload: Record<string, any> = {
      user_id: userId,
      file_name: file.name,
      file_url: fileUrl,
      file_path: path,
      financial_year: Number(financialYear),
      upload_date: new Date().toISOString(),
      ...(uploadedByAdmin ? { uploaded_by_admin: true } : {})
    };

    const minimalPayload: Record<string, any> = {
      user_id: userId,
      file_name: file.name,
      file_url: fileUrl,
      financial_year: Number(financialYear),
      upload_date: new Date().toISOString(),
      ...(uploadedByAdmin ? { uploaded_by_admin: true } : {})
    };

    // Try insert; if schema complains about unknown columns, retry with minimal payload
    let { data: insertData, error: insertError } = await supabaseAdmin
      .from('uploaded_documents')
      .insert([fullPayload])
      .select();

    if (insertError && insertError.code === 'PGRST204') {
      const retry = await supabaseAdmin
        .from('uploaded_documents')
        .insert([minimalPayload])
        .select();
      insertData = retry.data;
      insertError = retry.error as any;
    }

    if (insertError) {
      console.error('Database insert failed:', insertError);
      return NextResponse.json(
        { error: 'Database insert failed', details: insertError },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      file: {
        name: file.name,
        url: fileUrl,
        id: insertData?.[0]?.id ?? null
      }
    });
    
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Server error', details: (error as any)?.message || error },
      { status: 500 }
    );
  }
}