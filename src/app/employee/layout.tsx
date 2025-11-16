'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  useEffect(() => {
    const ensureEmployee = async () => {
      setLoading(true);
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
      } catch (e) {
        console.error('ensureEmployee error', e);
        router.replace('/auth/login');
        return;
      } finally {
        setLoading(false);
      }
    };
    ensureEmployee();
  }, [router]);

  const handleSignOut = async () => {
    setSigningOut(true);
    setSignOutError(null);
    try {
      await supabase.auth.signOut();
      router.push('/auth/login');
    } catch (e: any) {
      console.error('Error signing out:', e);
      setSignOutError(e?.message || 'Error signing out');
    } finally {
      setSigningOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#006666] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading employee portal...</p>
        </div>
      </div>
    );
  }

  const linkClass = (href: string) =>
    `px-3 py-2 rounded ${pathname === href ? 'bg-white text-[#006666]' : 'text-white hover:bg-[#005a5a]'} `;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with navigation following client portal style */}
      <div className="bg-[#006666] text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="font-bold text-lg">Employee Portal</div>
              <nav className="flex items-center space-x-2">
                <Link href="/employee/dashboard" className={linkClass('/employee/dashboard')}>Dashboard</Link>
                <Link href="/employee/clients" className={linkClass('/employee/clients')}>Assigned Clients</Link>
              </nav>
            </div>
          
          </div>
          {signOutError && (
            <div className="mt-2 bg-red-50 text-red-700 text-sm rounded px-3 py-2 inline-block">{signOutError}</div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
}