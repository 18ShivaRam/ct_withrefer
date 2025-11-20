import type { Metadata } from 'next';
import AdminEmployeesClient from './AdminEmployeesClient';

export const metadata: Metadata = {
  title: 'Admin — Employees',
  robots: { index: false, follow: false },
};

export default function AdminEmployeesPage() {
  return <AdminEmployeesClient />;
}