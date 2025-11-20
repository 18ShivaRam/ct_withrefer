import type { Metadata } from 'next';
import AdminReferralsClient from './AdminReferralsClient';

export const metadata: Metadata = {
  title: 'Admin — Referrals',
  robots: { index: false, follow: false },
};

export default function AdminReferralsPage() {
  return <AdminReferralsClient />;
}