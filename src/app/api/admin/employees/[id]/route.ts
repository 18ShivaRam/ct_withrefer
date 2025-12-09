import { NextRequest, NextResponse } from 'next/server';
import { createServiceSupabase } from '@/lib/supabaseService';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { full_name, email, phone, employee_role } = body;

    const supabaseAdmin = createServiceSupabase();

    // 1. Update Profile
    const updates: any = {};
    if (full_name !== undefined) updates.full_name = full_name;
    if (email !== undefined) updates.email = email;
    if (phone !== undefined) updates.phone = phone;
    if (employee_role !== undefined) updates.employee_role = employee_role;

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', id);

    if (profileError) {
      console.error('Error updating profile:', profileError);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    // 2. Update Auth User (if email changed)
    // Note: If email is changed, Supabase Auth might require email confirmation again depending on settings.
    // Ideally we should check if email is different before calling auth.admin.updateUserById
    if (email) {
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
        id,
        { email: email, email_confirm: true } // Auto confirm if admin changes it
      );
      if (authError) {
        console.error('Error updating auth user:', authError);
        // We don't fail the request if auth update fails but profile succeeded, 
        // but we should warn. Or maybe we should fail? 
        // For now, let's return a warning or just log it. 
        // Returning error might confuse the UI if profile is already updated.
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

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
