'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function PasswordManagementClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch users who are admins or employees
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, is_admin, employee_role')
        .or('is_admin.eq.true,role.eq.employee')
        .eq('is_deleted', false)
        .order('full_name');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage({ type: 'error', text: 'Failed to fetch users' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !newPassword) return;
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }

    // Admin Protection: Require OTP
    if (selectedUser.is_admin && !showOtpInput) {
      setUpdating(true);
      setMessage(null);
      try {
        const res = await fetch('/api/admin/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: selectedUser.id, action: 'update_password' })
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to send OTP');
        
        setShowOtpInput(true);
        setMessage({ type: 'success', text: `OTP sent to deepthi@cognitaxes.com. Please verify.` });
      } catch (err: any) {
        console.error(err);
        setMessage({ type: 'error', text: err.message });
      } finally {
        setUpdating(false);
      }
      return;
    }

    if (selectedUser.is_admin && !otp) {
      setMessage({ type: 'error', text: 'Please enter the OTP' });
      return;
    }

    setUpdating(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/update-user-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          newPassword: newPassword,
          otp: selectedUser.is_admin ? otp : undefined
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update password');
      }

      // Check if the current user updated their own password
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id === selectedUser.id) {
        setMessage({ type: 'success', text: 'Password updated successfully. Logging out...' });
        setTimeout(async () => {
          await supabase.auth.signOut();
          router.push('/admin/login');
        }, 1500);
      } else {
        setMessage({ type: 'success', text: `Password updated successfully for ${selectedUser.full_name}` });
        setNewPassword('');
        setOtp('');
        setShowOtpInput(false);
        setSelectedUser(null);
      }
    } catch (error: any) {
      console.error('Error updating password:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update password' });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Password Management</h1>
      <p className="text-gray-600">Update passwords for Administrators and Employees.</p>

      {message && (
        <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className='text-black'>Loading users...</div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-black">Select User</label>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-black border-gray-300 focus:outline-none focus:ring-[#006666] focus:border-[#006666] sm:text-sm rounded-md border"
              value={selectedUser?.id || ''}
              onChange={(e) => {
                const user = users.find(u => u.id === e.target.value);
                setSelectedUser(user || null);
                setShowOtpInput(false);
                setOtp('');
                setMessage(null);
              }}
            >
              <option value="">-- Select a user --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.full_name} ({user.email}) - {user.is_admin ? 'Admin' : `Employee (${user.employee_role})`}
                </option>
              ))}
            </select>
          </div>

          {selectedUser && (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black">New Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full border text-black border-gray-300 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-[#006666] focus:border-[#006666] sm:text-sm"
                    placeholder="Enter new password"
                    required
                    minLength={6}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                  </div>
                </div>
                <p className="mt-1 text-xs text-black">Must be at least 6 characters long.</p>
              </div>

              {showOtpInput && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-medium text-black">
                    Enter Verification OTP (Sent to Admin Email)
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="block w-full border text-black border-gray-300 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-[#006666] focus:border-[#006666] sm:text-sm"
                    placeholder="Enter 6-digit OTP"
                    required
                    maxLength={6}
                  />
                </motion.div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={updating}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#006666] hover:bg-[#087830] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006666] disabled:opacity-50"
                >
                  {updating ? 'Processing...' : (showOtpInput ? 'Verify & Update' : (selectedUser.is_admin ? 'Send OTP & Update' : 'Update Password'))}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
