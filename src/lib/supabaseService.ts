import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !serviceKey) {
  // Do not throw at import-time to avoid crashing client code paths
  // Routes that need the service client should validate and respond gracefully
}

export const createServiceSupabase = () => {
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing Supabase service role configuration');
  }
  return createClient(supabaseUrl, serviceKey);
};