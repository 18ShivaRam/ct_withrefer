'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      // Allow the login page to render without guard
      if (pathname === '/admin/login') {
        setLoading(false);
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        // Stop showing the spinner on the login page
        setLoading(false);
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();
      if (!profile?.is_admin) {
        await supabase.auth.signOut();
        router.push('/admin/login');
        setLoading(false);
        return;
      }
      setIsAdmin(true);
      setLoading(false);
    };
    checkAdmin();
  }, [router, pathname]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const linkClass = (href: string) =>
    `block px-4 py-2 rounded-md ${pathname === href ? 'bg-[#006666] text-white' : 'text-gray-700 hover:bg-gray-100'}`;

  // Render login page without admin chrome
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="p-4 font-bold text-xl text-black">Admin</div>
        <nav className="space-y-2 px-2">
          <Link href="/admin" className={linkClass('/admin')}>Dashboard</Link>
          <Link href="/admin/clients" className={linkClass('/admin/clients')}>Clients</Link>
          <Link href="/admin/employees" className={linkClass('/admin/employees')}>Employees</Link>
          <Link href="/admin/referrals" className={linkClass('/admin/referrals')}>Referrals</Link>
          <Link href="/admin/consultations" className={linkClass('/admin/consultations')}>Consultations</Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}