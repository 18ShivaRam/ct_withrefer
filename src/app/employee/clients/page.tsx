import type { Metadata } from 'next';
import EmployeeClientsClient from './EmployeeClientsClient';

export const metadata: Metadata = {
  title: 'Employee — Assigned Clients',
  robots: { index: false, follow: false },
};

export default function EmployeeClientsPage() {
  return <EmployeeClientsClient />;
}