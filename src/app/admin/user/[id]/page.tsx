import type { Metadata } from 'next';
import AdminUserClient from './AdminUserClient';

export const metadata: Metadata = {
  title: 'Admin — User Details',
  robots: { index: false, follow: false },
};

export default function AdminUserPage({ params }: { params: { id: string } }) {
  return <AdminUserClient id={params.id} />;
}