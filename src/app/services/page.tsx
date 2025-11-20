import type { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: 'Tax & Financial Services — Personal, Business, Bookkeeping, IRS Help',
  description:
    'Explore Cognitax services: individual and business tax filing, bookkeeping, payroll, IRS representation, tax planning, and compliance.',
  alternates: { canonical: 'https://cognitaxes.com/services' },
};

export default function ServicesPage() {
  return <ServicesClient />;
}