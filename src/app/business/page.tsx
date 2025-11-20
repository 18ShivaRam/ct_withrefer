import type { Metadata } from 'next';
import BusinessClient from './BusinessClient';

export const metadata: Metadata = {
  title: 'Business Tax Services — LLC, Partnerships, Corporations, Compliance',
  description:
    'Cognitax supports businesses with tax preparation, entity setup, compliance, payroll, bookkeeping, and strategic tax planning.',
  alternates: { canonical: 'https://cognitaxes.com/business' },
};

export default function BusinessPage() {
  return <BusinessClient />;
}