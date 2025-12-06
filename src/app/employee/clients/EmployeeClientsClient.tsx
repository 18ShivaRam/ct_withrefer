'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function EmployeeClientsPage() {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<any[]>([]);
  const [stats, setStats] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setError(null);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { window.location.href = '/auth/login'; return; }
        const employeeId = session.user.id;
        const { data, error } = await supabase
          .from('client_employee_assignments')
          .select('client_id, profiles:client_id(full_name,email,phone,user_unique_id)')
          .eq('employee_id', employeeId);
        if (error) throw error;
        
        const clientList = (data || []).map((row: any) => ({
          ...row.profiles,
          id: row.client_id
        }));
        setClients(clientList);

        // Fetch stats
        if (clientList.length > 0) {
          const clientIds = clientList.map((c: any) => c.id);
          try {
            const statsRes = await fetch('/api/admin/client-doc-stats', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ clientIds })
            });
            if (statsRes.ok) {
              const { stats } = await statsRes.json();
              setStats(stats || {});
            }
          } catch (statsErr) {
            console.error('Failed to load stats', statsErr);
          }
        }
      } catch (e: any) {
        console.error('Load assigned clients error', e);
        setError(e?.message || 'Failed to load assigned clients');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl text-black font-bold mb-6">Assigned Clients</h1>
      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#006666] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <div className="text-gray-700">Loading clients...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-3 rounded">{error}</div>
        ) : clients.length === 0 ? (
          <div className="text-gray-700">No clients assigned</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-black">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#006666] uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#006666] uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#006666] uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#006666] uppercase">User Unique ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#006666] uppercase">Client Uploads</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#006666] uppercase">Admin Uploads</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clients.map((c: any, idx: number) => (
                  <tr key={c?.user_unique_id || c?.email || String(idx)} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{c?.full_name || '-'}</td>
                    <td className="px-6 py-4">{c?.email || '-'}</td>
                    <td className="px-6 py-4">{c?.phone || '-'}</td>
                    <td className="px-6 py-4">{c?.user_unique_id || '-'}</td>
                    <td className="px-6 py-4">{stats[c.id]?.clientUploads || 0}</td>
                    <td className="px-6 py-4">{stats[c.id]?.adminUploads || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}