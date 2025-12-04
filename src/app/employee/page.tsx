"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function EmployeeLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const user = data.user;
      if (!user) throw new Error('Login failed: no user returned');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin, role, is_deleted')
        .eq('id', user.id)
        .single();
      if (profileError) throw profileError;

      if (profile?.is_admin) {
        await supabase.auth.signOut();
        setError('Admins must sign in at /admin');
        return;
      }

      if (profile?.is_deleted) {
        await supabase.auth.signOut();
        setError('Your account has been deleted. Please contact support.');
        return;
      }

      if (profile?.role !== 'employee') {
        await supabase.auth.signOut();
        setError('Only employees can sign in here');
        return;
      }

      router.push('/employee/dashboard');
    } catch (e: any) {
      setError(e?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <Link href="/">
              <Image
                src="/images/logosvg1.jpg"
                alt="Cognitaxes Logo"
                width={150}
                height={50}
                className="w-auto h-12"
              />
            </Link>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Employee Login</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Sign in to the employee portal</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#006666] focus:border-[#006666] focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#006666] focus:border-[#006666] focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#006666] hover:bg-[#004444] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006666]"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          {/* <div className="text-center">
            <Link href="/auth/login" className="text-sm text-[#006666] hover:text-[#004444]">Client Login</Link>
          </div> */}
        </form>
      </div>
    </div>
  );
}
