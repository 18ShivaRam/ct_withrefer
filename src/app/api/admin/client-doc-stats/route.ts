import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { clientIds } = await req.json();

    if (!clientIds || !Array.isArray(clientIds)) {
      return NextResponse.json({ error: 'Invalid clientIds' }, { status: 400 });
    }

    if (clientIds.length === 0) {
        return NextResponse.json({ stats: {} });
    }

    // Initialize Supabase client with Service Role Key
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Fetch document stats for the given clients
    const { data, error } = await supabaseAdmin
      .from('uploaded_documents')
      .select('user_id, uploaded_by_admin, upload_date')
      .in('user_id', clientIds);

    if (error) {
      console.error('Error fetching document stats:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Process stats
    const stats: Record<string, { 
      clientUploads: number, 
      adminUploads: number, 
      totalUploads: number,
      uploadsToday: number 
    }> = {};

    // Initialize stats for all requested clients
    clientIds.forEach(id => {
      stats[id] = { clientUploads: 0, adminUploads: 0, totalUploads: 0, uploadsToday: 0 };
    });

    const today = new Date().toISOString().split('T')[0];

    data?.forEach((doc: any) => {
      if (stats[doc.user_id]) {
        const isToday = doc.upload_date?.startsWith(today);
        
        stats[doc.user_id].totalUploads++;
        
        if (doc.uploaded_by_admin) {
          stats[doc.user_id].adminUploads++;
        } else {
          stats[doc.user_id].clientUploads++;
        }

        if (isToday) {
            stats[doc.user_id].uploadsToday++;
        }
      }
    });

    return NextResponse.json({ stats });
  } catch (err: any) {
    console.error('Unexpected error fetching stats:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
