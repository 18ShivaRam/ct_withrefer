'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ClientReferralPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const ensureAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = '/auth/login'; return; }
      // Optional: check role === client
    };
    ensureAuth();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) { setMessage('Please login'); return; }
      const { error } = await supabase.from('referrals').insert({
        name: form.name,
        email: form.email || null,
        phone: form.phone || null,
        referred_by: userId
      });
      if (error) throw error;
      setMessage('Referred successfully');
      setForm({ name: '', email: '', phone: '' });
    } catch (err: any) {
      setMessage(err?.message || 'Failed to refer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Refer a Client</h1>
      <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <input className="border rounded p-2 w-full" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="border rounded p-2 w-full" placeholder="Email (optional)" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input className="border rounded p-2 w-full" placeholder="Phone (optional)" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <button type="submit" disabled={submitting} className="bg-[#006666] text-white rounded px-4 py-2">{submitting ? 'Submitting...' : 'Submit Referral'}</button>
        {message && <div className="text-sm text-gray-700 mt-2">{message}</div>}
      </form>
    </div>
  );
}