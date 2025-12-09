import { NextRequest, NextResponse } from 'next/server';
import { createServiceSupabase } from '@/lib/supabaseService';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabaseAdmin = createServiceSupabase();

    // Delete user from auth.users
    // Note: This triggers ON DELETE CASCADE for public.profiles and related tables
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
      console.error('Error deleting auth user:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
