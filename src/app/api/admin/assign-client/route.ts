import { NextRequest, NextResponse } from 'next/server';
import { createServiceSupabase } from '@/lib/supabaseService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientId, employeeId } = body || {};

    if (!clientId || !employeeId) {
      return NextResponse.json({ error: 'Missing clientId or employeeId' }, { status: 400 });
    }

    const supabase = createServiceSupabase();

    const { error: delError } = await supabase
      .from('client_employee_assignments')
      .delete()
      .eq('client_id', clientId);

    if (delError) {
      return NextResponse.json({ error: delError.message }, { status: 500 });
    }

    const { error: insError } = await supabase
      .from('client_employee_assignments')
      .insert({ client_id: clientId, employee_id: employeeId });

    if (insError) {
      return NextResponse.json({ error: insError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 });
  }
}
