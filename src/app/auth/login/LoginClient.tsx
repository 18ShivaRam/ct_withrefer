'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      const user = data.user;
      if (!user) {
        throw new Error('Login failed: no user returned');
      }

      // Fetch profile to determine role and admin flag
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin, role, is_deleted')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      // Admins are not allowed to log in here (use /admin/login)
      if (profile?.is_admin) {
        await supabase.auth.signOut();
        setError('Unauthorized Access');
        return;
      }

      // Block soft-deleted accounts
      if (profile?.is_deleted) {
        await supabase.auth.signOut();
        setError('Your account has been deleted. Please contact support.');
        return;
      }

      // Redirect by role
      if (profile?.role === 'client') {
        router.push('/dashboard');
        return;
      }

      if (profile?.role === 'employee') {
        router.push('/employee');
        return;
      }

      // Fallback: go to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-[0_0_50px_0_rgba(0,0,0,0.1)] relative overflow-hidden">
      {/* Decorative gradient border */}
      <div className="absolute inset-0  rounded-2xl" style={{ margin: '-1px' }}></div>
      
      <div className="relative z-10">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/auth/register" className="font-medium text-[#006666] hover:text-[#087830]">
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087830] focus:border-transparent transition-all duration-300"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087830] focus:border-transparent transition-all duration-300"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-700 p-4 rounded-lg text-center"
            >
              {error}
            </motion.div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-green border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <Link href="/auth/forgot-password" className="text-sm font-medium text-[#006666] hover:text-[#087830]">
              Forgot your password?
            </Link>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#006666] hover:bg-[#087830] focus:outline-none focus:ring-2 focus:ring-offset-2  disabled:cursor-not-allowed transition-all duration-300"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </motion.button>
        </form>
      </div>
    </div>
  );
}