'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ensureEmployee = async () => {
      setLoading(true);
      try {
        if (pathname === '/employee' || pathname === '/employee/access-denied') {
          setLoading(false);
          return;
        }
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
        if (pathname !== '/employee' && pathname !== '/employee/access-denied') {
          router.replace('/auth/login');
        }
        return;
      } finally {
        setLoading(false);
      }
    };
    ensureEmployee();
  }, [router, pathname]);

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

  if (pathname === '/employee' || pathname === '/employee/access-denied') {
    return <>{children}</>;
  }

  const linkClass = (href: string) =>
    `block px-4 py-2 rounded-md ${pathname === href ? 'bg-[#006666] text-white' : 'text-gray-700 hover:bg-gray-100'}`;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (match admin style) */}
      <aside className="w-64 bg-white border-r">
        <div className="p-4 font-bold text-xl text-black">Employee</div>
        <nav className="space-y-2 px-2">
          <Link href="/employee/dashboard" className={linkClass('/employee/dashboard')}>Dashboard</Link>
          <Link href="/employee/clients" className={linkClass('/employee/clients')}>Assigned Clients</Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
