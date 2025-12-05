'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminReferralsPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/admin/login'; return; }
      const { data: admin } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
      if (!admin?.is_admin) { await supabase.auth.signOut(); window.location.href = '/admin/login'; return; }

      const { data, error } = await supabase
        .from('referrals')
        .select('id, name, email, phone, referred_by, created_at, profiles:referred_by(full_name,email,user_unique_id)')
        .order('created_at', { ascending: false });
      if (error) console.error(error);
      setRows(data || []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-black">Referrals</h1>
        <input
          type="text"
          className="border rounded p-2 text-black"
          placeholder="Search referrals"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-black">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referred By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referrer Unique ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referred On</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(rows.filter((r) => {
                  const q = search.trim().toLowerCase();
                  if (!q) return true;
                  const fields = [r.name, r.email, r.phone, r.profiles?.full_name, r.profiles?.user_unique_id].map((v: any) => (v || '').toString().toLowerCase());
                  return fields.some((f: string) => f.includes(q));
                })).map(r => (
                  <tr key={r.id}>
                    <td className="px-6 py-4">{r.name}</td>
                    <td className="px-6 py-4">{r.email || '-'}</td>
                    <td className="px-6 py-4">{r.phone || '-'}</td>
                    <td className="px-6 py-4">{r.profiles?.full_name || r.referred_by}</td>
                    <td className="px-6 py-4">{r.profiles?.user_unique_id || '-'}</td>
                    <td className="px-6 py-4">{new Date(r.created_at).toLocaleString()}</td>
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
