import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, newPassword, otp } = body;

    if (!userId || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Verify the caller is an admin
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    // Use service role to bypass RLS and update user
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Check if target user is an Admin
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
    }

    // If target is Admin, verify OTP
    if (profile?.is_admin) {
      if (!otp) {
        return NextResponse.json({ error: 'OTP is required for Admin users' }, { status: 403 });
      }

      const bucketName = 'admin-temp-storage';
      const fileName = `otp_${userId}.json`;

      const { data: fileData, error: downloadError } = await supabaseAdmin.storage
        .from(bucketName)
        .download(fileName);

      if (downloadError) {
        console.error('OTP Download Error:', downloadError);
        return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
      }

      const text = await fileData.text();
      const storedData = JSON.parse(text);

      if (storedData.otp !== otp) {
        return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
      }

      if (Date.now() > storedData.expiresAt) {
        return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
      }

      // Cleanup OTP
      await supabaseAdmin.storage.from(bucketName).remove([fileName]);
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    );

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating password:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
