import type { Metadata } from 'next';
import DashboardReferralsClient from './DashboardReferralsClient';

export const metadata: Metadata = {
  title: 'Dashboard — Referrals',
  robots: { index: false, follow: false },
};

export default function DashboardReferralsPage() {
  return <DashboardReferralsClient />;
}