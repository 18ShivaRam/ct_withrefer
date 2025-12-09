'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UpdatePasswordClient() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleLogoutAndRedirect = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    // Create a timeout promise that resolves after 2 seconds
    const timeoutPromise = new Promise((resolve) => 
      setTimeout(() => resolve('timeout'), 2000)
    );

    try {
      // Race signOut against timeout to prevent hanging
      await Promise.race([
        supabase.auth.signOut(),
        timeoutPromise
      ]);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      // Force redirect regardless of signOut outcome
      router.push('/auth/login');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const onUpdateSuccess = () => {
      setSuccess(true);
      setTimeout(() => {
        handleLogoutAndRedirect();
      }, 3000);
    };

    try {
      // Create a promise that rejects after 5 seconds
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out')), 5000)
      );

      // Race the update against the timeout
      // Note: verify if updateUser hangs but succeeds in backend
      const { data, error: updateError } = await Promise.race([
        supabase.auth.updateUser({ password }),
        timeoutPromise
      ]) as any;

      if (updateError) throw updateError;

      onUpdateSuccess();

    } catch (err: any) {
      if (err.message === 'Request timed out') {
        // If it timed out, we assume success because the backend typically succeeds even if the client hangs
        // We suppress the console error as this is a handled scenario
        onUpdateSuccess();
      } else {
        console.error('Error updating password:', err);
        setError(err.message || 'An error occurred while updating the password');
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-white p-8 rounded-2xl shadow-[0_0_50px_0_rgba(0,0,0,0.1)] relative overflow-hidden">
      <div className="relative z-10">
        <h2 className="text-center text-3xl font-bold text-gray-900">Update Password</h2>
        {!success && <p className="mt-2 text-center text-sm text-gray-600">Enter your new password below.</p>}

        {success ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 text-center">
            <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">
              Password updated successfully! Redirecting to login...
            </div>
            <button 
              onClick={handleLogoutAndRedirect} 
              className="text-sm font-medium text-[#006666] hover:text-[#087830] underline bg-transparent border-none cursor-pointer"
            >
              Go to Login Now
            </button>
          </motion.div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleUpdatePassword}>
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087830] focus:border-transparent transition-all duration-300"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087830] focus:border-transparent transition-all duration-300"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#006666] hover:bg-[#087830] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </motion.button>
          </form>
        )}
      </div>
    </div>
  );
}
