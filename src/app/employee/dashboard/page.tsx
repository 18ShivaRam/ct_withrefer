import type { Metadata } from 'next';
import EmployeeDashboardClient from './EmployeeDashboardClient';

export const metadata: Metadata = {
  title: 'Employee — Dashboard',
  robots: { index: false, follow: false },
};

export default function EmployeeDashboardPage() {
  return <EmployeeDashboardClient />;
}