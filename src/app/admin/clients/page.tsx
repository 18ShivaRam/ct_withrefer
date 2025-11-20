import type { Metadata } from 'next';
import AdminClientsClient from './AdminClientsClient';

export const metadata: Metadata = {
  title: 'Admin — Clients',
  robots: { index: false, follow: false },
};

export default function AdminClientsPage() {
  return <AdminClientsClient />;
}