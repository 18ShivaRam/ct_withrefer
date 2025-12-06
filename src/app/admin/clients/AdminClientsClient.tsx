'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function AdminClientsPage() {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [stats, setStats] = useState<Record<string, any>>({});
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [assigning, setAssigning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');

  const filteredClients = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) => {
      const fields = [c.full_name, c.email, c.phone, c.user_unique_id].map((v: any) => (v || '').toString().toLowerCase());
      return fields.some((f: string) => f.includes(q));
    });
  }, [clients, search]);

  const totalClients = filteredClients.length;
  const totalPages = Math.max(1, Math.ceil(totalClients / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(totalClients, startIndex + pageSize);
  const currentClients = useMemo(() => filteredClients.slice(startIndex, endIndex), [filteredClients, startIndex, endIndex]);

  useEffect(() => {
    const fetchStats = async () => {
      if (currentClients.length === 0) return;
      
      const clientIds = currentClients.map(c => c.id);
      try {
        const res = await fetch('/api/admin/client-doc-stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientIds })
        });
        if (res.ok) {
            const { stats: newStats } = await res.json();
            setStats(prev => ({ ...prev, ...newStats }));
        }
      } catch (e) {
        console.error('Failed to fetch stats', e);
      }
    };
    
    fetchStats();
  }, [currentClients]);

  useEffect(() => {
    // Clamp current page if list or page size changes
    const nextTotalPages = Math.max(1, Math.ceil(clients.length / pageSize));
    if (currentPage > nextTotalPages) {
      setCurrentPage(nextTotalPages);
    }
  }, [clients, pageSize]);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/admin/login';
        return;
      }
      const { data: admin } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
      if (!admin?.is_admin) {
        await supabase.auth.signOut();
        window.location.href = '/admin/login';
        return;
      }
      setErrorMsg(null);
      // Try fetching only clients with soft-delete filter; fallback if columns missing
      let clientsData: any[] | null = null;
      let clientsError: any = null;
      try {
        const res1 = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'client')
          .eq('is_deleted', false)
          .order('created_at', { ascending: false });
        clientsData = res1.data;
        clientsError = res1.error;
        if (clientsError) throw clientsError;
      } catch (err: any) {
        // Fallback 1: ignore is_deleted filter
        try {
          const res2 = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'client')
            .order('created_at', { ascending: false });
          clientsData = (res2.data || []).filter((c: any) => c.is_deleted ? !c.is_deleted : true);
          clientsError = res2.error;
          if (clientsError) throw clientsError;
        } catch (err2: any) {
          // Fallback 2: legacy filter using is_admin=false
          const res3 = await supabase
            .from('profiles')
            .select('*')
            .eq('is_admin', false)
            .order('created_at', { ascending: false });
          clientsData = (res3.data || []).filter((c: any) => c.role ? c.role === 'client' : true).filter((c: any) => c.is_deleted ? !c.is_deleted : true);
          clientsError = res3.error;
          if (clientsError) {
            console.error('Fetch clients error:', clientsError?.message || clientsError);
            setErrorMsg(clientsError?.message || 'Failed to load clients');
          }
        }
      }
      const finalClients = clientsData || [];
      setClients(finalClients);

      // Employees for assignment
      // Employees for assignment with soft-delete; fallback if needed
      try {
        const { data: employeesData, error: employeesError } = await supabase
          .from('profiles')
          .select('id, full_name, email, employee_role, is_deleted, role')
          .eq('role', 'employee')
          .eq('is_deleted', false)
          .order('full_name', { ascending: true });
        if (employeesError) throw employeesError;
        setEmployees(employeesData || []);
      } catch (err: any) {
        const { data: employeesData2, error: employeesError2 } = await supabase
          .from('profiles')
          .select('id, full_name, email, employee_role, role')
          .eq('role', 'employee')
          .order('full_name', { ascending: true });
        if (employeesError2) {
          console.error('Fetch employees for assignment error:', employeesError2?.message || employeesError2);
        }
        setEmployees((employeesData2 || []).filter((e: any) => e.is_deleted ? !e.is_deleted : true));
      }

      try {
        const { data: assignmentRows, error: assignErr } = await supabase
          .from('client_employee_assignments')
          .select('client_id, employee_id');
        if (assignErr) {
          console.error('Fetch assignments error:', assignErr.message);
        }
        const map: Record<string, string> = {};
        (assignmentRows || []).forEach((row: any) => {
          if (row?.client_id && row?.employee_id) {
            map[row.client_id] = row.employee_id;
          }
        });
        setAssignments(map);
      } catch (e) {
        console.error('Assignments load exception', e);
      }

      setLoading(false);
    };
    load();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl text-black font-bold">Clients</h1>
        <Link href="/admin" className="text-sm text-[#006666]">← Back to Dashboard</Link>
      </div>
      {/* Top Controls: Assignment + Pagination */}
      <div className="bg-white rounded-lg shadow p-6">
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">{errorMsg}</div>
        )}

      <div className="flex items-center justify-between mb-4">
        {/* Assignment Controls */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            aria-label="Select all on page"
            className="h-4 w-4"
            checked={currentClients.length > 0 && currentClients.every(c => selectedClientIds.includes(c.id))}
            onChange={(e) => {
              if (e.target.checked) {
                const ids = currentClients.map(c => c.id);
                setSelectedClientIds(prev => Array.from(new Set([...prev, ...ids])));
              } else {
                const ids = new Set(currentClients.map(c => c.id));
                setSelectedClientIds(prev => prev.filter(id => !ids.has(id)));
              }
            }}
          />
          <select
            className="border rounded p-2 text-black"
            value={selectedEmployeeId}
            onChange={e => setSelectedEmployeeId(e.target.value)}
          >
            <option value="">Select employee...</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.full_name || emp.email} ({emp.employee_role || '-'})
              </option>
            ))}
          </select>
          <button
            className="bg-[#006666] text-white rounded px-4 py-2 disabled:bg-gray-300 disabled:text-gray-600"
            disabled={assigning || selectedClientIds.length === 0 || !selectedEmployeeId}
            onClick={async () => {
              setAssigning(true);
              try {
                for (const clientId of selectedClientIds) {
                  const res = await fetch('/api/admin/assign-client', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ employeeId: selectedEmployeeId, clientId })
                  });
                  if (!res.ok) {
                    const j = await res.json();
                    throw new Error(j.error || 'Assignment failed');
                  }
                }
                alert('Assigned successfully');
                setSelectedClientIds([]);
                setAssignments(prev => {
                  const next = { ...prev };
                  selectedClientIds.forEach((id) => { next[id] = selectedEmployeeId; });
                  return next;
                });
              } catch (err: any) {
                alert(err.message);
              } finally {
                setAssigning(false);
              }
            }}
          >
            {assigning ? 'Assigning...' : 'Assign Selected'}
          </button>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center space-x-3">
          <input
            type="text"
            className="border rounded p-2 text-black"
            placeholder="Search clients"
            value={search}
            onChange={(e) => { setCurrentPage(1); setSearch(e.target.value); }}
          />
          <span className="text-sm text-gray-700">
            {totalClients === 0 ? '0 of 0' : `${startIndex + 1}–${endIndex} of ${totalClients}`}
          </span>
          <select
            className="border rounded p-2 text-black"
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <button
            className={`px-3 py-2 rounded border ${currentPage <= 1 ? 'text-gray-400 border-gray-300 cursor-not-allowed' : 'text-[#006666] border-[#006666] hover:bg-[#006666] hover:text-white'}`}
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            title="Previous"
          >
            <FaChevronLeft />
          </button>
          <button
            className={`px-3 py-2 rounded border ${currentPage >= totalPages ? 'text-gray-400 border-gray-300 cursor-not-allowed' : 'text-[#006666] border-[#006666] hover:bg-[#006666] hover:text-white'}`}
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            title="Next"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

        {loading ? (
          <div className='text-black text-center'>Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-black">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#006666] uppercase tracking-wider">Select</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#006666] uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#006666] uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#006666] uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#006666] uppercase tracking-wider">User Unique ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#006666] uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#006666] uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#006666] uppercase tracking-wider">Total Uploads</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#006666] uppercase tracking-wider">Uploads Today</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#006666] uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentClients.map((c) => (
                  <tr key={c.id} className={`hover:bg-gray-50 ${(stats[c.id]?.lastClientUploadDate && (!c.admin_last_viewed_at || stats[c.id]?.lastClientUploadDate > c.admin_last_viewed_at)) ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''}`}>
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedClientIds.includes(c.id)}
                        onChange={(e) => {
                          setSelectedClientIds(prev => e.target.checked ? [...prev, c.id] : prev.filter(id => id !== c.id));
                        }}
                      />
                    </td>
                    <td className="px-6 py-4">{c.full_name || '-'}</td>
                    <td className="px-6 py-4">{c.email}</td>
                    <td className="px-6 py-4">{c.phone || '-'}</td>
                    <td className="px-6 py-4">{c.user_unique_id || '-'}</td>
                    <td className="px-6 py-4">{
                      (() => {
                        const empId = assignments[c.id];
                        if (!empId) return '-';
                        const emp = employees.find(e => e.id === empId);
                        return emp ? (emp.full_name || emp.email || empId) : empId;
                      })()
                    }</td>
                    <td className="px-6 py-4">{new Date(c.created_at).toLocaleString()}</td>
                    <td className="px-6 py-4">{stats[c.id]?.totalUploads || 0}</td>
                    <td className={`px-6 py-4 ${(stats[c.id]?.uploadsToday || 0) > 0 ? 'font-bold text-yellow-700' : ''}`}>
                      {stats[c.id]?.uploadsToday || 0}
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/user/${c.id}`} className="text-[#006666]">View</Link>
                    </td>
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
