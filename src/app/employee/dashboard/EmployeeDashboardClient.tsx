'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function EmployeeDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [totalClients, setTotalClients] = useState<number | null>(null);
  const [assignedCount, setAssignedCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCounts = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const employeeId = session?.user?.id;
        if (!employeeId) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }

        // Total clients (non-deleted, role=client)
        const { count: clientsCount, error: clientsError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'client')
          .eq('is_deleted', false);
        if (clientsError) throw clientsError;
        setTotalClients(clientsCount ?? 0);

        // Assigned to current employee
        const { count: assigned, error: assignedError } = await supabase
          .from('client_employee_assignments')
          .select('*', { count: 'exact', head: true })
          .eq('employee_id', employeeId);
        if (assignedError) throw assignedError;
        setAssignedCount(assigned ?? 0);
      } catch (e: any) {
        console.error('Error loading counts:', e);
        setError(e?.message || 'Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };
    loadCounts();
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#006666] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <div className="text-gray-700">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-50 text-red-700 p-3 rounded">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl text-black font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500">Total Clients</div>
          <div className="text-3xl text-black font-bold">{totalClients ?? '—'}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500">Clients Assigned to You</div>
          <div className="text-3xl text-black font-bold">{assignedCount ?? '—'}</div>
        </div>
      </div>
    </div>
  );
}