import type { Metadata } from 'next';
import AdminUserClient from './AdminUserClient';

export const metadata: Metadata = {
  title: 'Admin — User Details',
  robots: { index: false, follow: false },
};

// Next.js 15 server components may type `params` as a Promise.
// Use async function and await the params to satisfy PageProps.
export default async function AdminUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminUserClient id={id} />;
}