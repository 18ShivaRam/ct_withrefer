import type { Metadata } from 'next';
import ClientReferralClient from './ClientReferralClient';

export const metadata: Metadata = {
  title: 'Client Portal — Referrals',
  robots: { index: false, follow: false },
};

export default function ClientReferralPage() {
  return <ClientReferralClient />;
}