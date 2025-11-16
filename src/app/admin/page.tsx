'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { FaEye, FaSignOutAlt, FaUser, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [navigatingUserId, setNavigatingUserId] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalClients, setTotalClients] = useState<number | null>(null);
  const [totalEmployees, setTotalEmployees] = useState<number | null>(null);
  const [totalUploads, setTotalUploads] = useState<number | null>(null);
  const [employeeReferrals, setEmployeeReferrals] = useState<number | null>(null);

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/admin/login');
        return;
      }

      const { data: userData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (!userData || !userData.is_admin) {
        // Sign out and redirect to admin login with error
        await supabase.auth.signOut();
        router.push('/admin/login');
        return;
      }

      setAdminUser(userData);
      fetchUsers();
      fetchCounts();
    };

    checkAdmin();
  }, [router]);

  // Fetch only non-admin users
  const fetchUsers = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_admin', false)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data || []);
    }
    
    setLoading(false);
  };

  // Fetch dashboard counts
  const fetchCounts = async () => {
    try {
      // Clients and Employees counts
      const { count: clientsCount, error: clientsErr } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'client')
        .eq('is_admin', false);
      if (clientsErr) throw clientsErr;
      setTotalClients(clientsCount ?? 0);

      const { count: employeesCount, error: employeesErr } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'employee')
        .eq('is_admin', false);
      if (employeesErr) throw employeesErr;
      setTotalEmployees(employeesCount ?? 0);

      setTotalUsers((clientsCount ?? 0) + (employeesCount ?? 0));

      // Files uploads count
      const { count: uploadsCount, error: uploadsErr } = await supabase
        .from('uploaded_documents')
        .select('*', { count: 'exact', head: true });
      if (uploadsErr) throw uploadsErr;
      setTotalUploads(uploadsCount ?? 0);

      // Referrals count: count of records from referrals table
      const { count: referralsCount, error: referralsErr } = await supabase
        .from('referrals')
        .select('*', { count: 'exact', head: true });
      if (referralsErr) throw referralsErr;
      setEmployeeReferrals(referralsCount ?? 0);
    } catch (err) {
      console.error('Error fetching counts', err);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // View user details
  const viewUserDetails = (userId: string) => {
    setNavigatingUserId(userId);
    router.push(`/admin/user/${userId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            {adminUser && (
              <div className="text-sm text-gray-600">
                Logged in as: <span className="font-medium">{adminUser.full_name}</span>
              </div>
            )}
            {/* <button
              onClick={handleSignOut}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <FaSignOutAlt className="mr-2" />
              Sign Out
            </button> */}
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-gray-500">Total Users</div>
            <div className="text-3xl text-black font-bold">{totalUsers ?? '—'}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-gray-500">Total Clients</div>
            <div className="text-3xl text-black font-bold">{totalClients ?? '—'}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-gray-500">Total Employees</div>
            <div className="text-3xl text-black font-bold">{totalEmployees ?? '—'}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-gray-500">File Uploads</div>
            <div className="text-3xl text-black font-bold">{totalUploads ?? '—'}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-gray-500">Referrals</div>
            <div className="text-3xl text-black font-bold">{employeeReferrals ?? '—'}</div>
          </div>
        </div>

        {/* Users List */}
        
      </div>
    </div>
  );
}