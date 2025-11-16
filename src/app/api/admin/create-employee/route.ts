import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, employeeRole, password } = body || {};

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Validate employeeRole to match enum values in DB; otherwise omit
    const allowedEmployeeRoles = ['caller', 'reviewer', 'preparer'] as const;
    const normalizedEmployeeRole = allowedEmployeeRoles.includes((employeeRole || '').toLowerCase() as any)
      ? (employeeRole || '').toLowerCase()
      : null;

    // Create user via admin API so they can login
    const { data: created, error: createErr } = await (supabaseAdmin as any).auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        first_name: fullName?.split(' ')[0] || fullName,
        phone_number: phone || null,
        role: 'employee',
        employee_role: normalizedEmployeeRole,
      },
    });

    if (createErr) {
      // Duplicate email gets a clearer response
      const msg = (createErr as any)?.message || '';
      const code = (createErr as any)?.code;
      const status = (createErr as any)?.status;

      console.error('create user error', { message: msg, code, status, raw: createErr });

      if (msg?.toLowerCase().includes('already') || code === 'email_exists') {
        return NextResponse.json(
          { error: 'Email already registered', details: { message: msg, code, status } },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          error: 'Create user failed',
          details: {
            message: msg,
            code,
            status,
          }
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ user: created.user }, { status: 200 });
  } catch (e: any) {
    console.error('create employee api error', e);
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 });
  }
}