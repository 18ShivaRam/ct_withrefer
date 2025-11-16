"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function EmployeePortalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ensureEmployee = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: auth } = await supabase.auth.getUser();
        const user = auth.user;
        if (!user) {
          router.replace('/auth/login');
          return;
        }
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin, role, full_name')
          .eq('id', user.id)
          .single();
        if (profileError) throw profileError;
        if (profile?.is_admin) {
          router.replace('/admin');
          return;
        }
        if (profile?.role !== 'employee') {
          router.replace('/dashboard');
          return;
        }
        // Redirect to employee dashboard by default
        router.replace('/employee/dashboard');
        return;
      } catch (e: any) {
        setError(e.message || 'Unable to load employee portal');
      } finally {
        setLoading(false);
      }
    };
    ensureEmployee();
  }, [router]);

  if (loading) {
    return <div className="text-gray-700">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return null;
}