'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ReferralPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.replace('/auth/login'); return; }
        setUser(user);
        const { data: prof, error: profErr } = await supabase
          .from('profiles')
          .select('id, role, full_name, is_admin')
          .eq('id', user.id)
          .single();
        if (profErr) throw profErr;
        setProfile(prof);
        // Only clients can access this page; employees have their own portal
        if (prof?.role === 'employee' || prof?.is_admin) {
          router.replace('/employee');
          return;
        }
      } catch (e) {
        console.error('Referral init error', e);
        router.replace('/auth/login');
        return;
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    try {
      setSubmitting(true);
      const referredBy = user?.id;
      if (!referredBy) throw new Error('Not authenticated');
      const payload = {
        name: name.trim(),
        email: email.trim() || null,
        phone: phone.trim() || null,
        referred_by: referredBy,
        created_at: new Date().toISOString(),
      };
      const { error: insertError } = await supabase
        .from('referrals')
        .insert(payload);
      if (insertError) throw insertError;
      setSuccess('Referral submitted successfully');
      setName('');
      setEmail('');
      setPhone('');
    } catch (e: any) {
      console.error('Submit referral error', e);
      setError(e?.message || 'Failed to submit referral');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#006666] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading referral form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl text-black font-bold mb-6">Referral</h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#006666] mb-1">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#006666]"
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#006666] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#006666]"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#006666] mb-1">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#006666]"
              placeholder="Phone number"
            />
          </div>

          {error && <div className="bg-red-50 text-red-700 p-3 rounded">{error}</div>}
          {success && <div className="bg-green-50 text-green-700 p-3 rounded">{success}</div>}

          <button
            type="submit"
            disabled={submitting}
            className={`w-full px-4 py-2 bg-[#006666] text-white rounded hover:bg-[#005a5a] transition-colors ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {submitting ? 'Submitting…' : 'Submit Referral'}
          </button>
        </form>
      </div>
    </div>
  );
}