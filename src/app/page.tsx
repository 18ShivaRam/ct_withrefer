import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Cognitax — Smart, Secure Tax Filing',
  description:
    'Expert tax preparation for individuals and businesses. Bookkeeping, payroll, IRS representation, and strategic planning — secure, accurate, and stress-free.',
  alternates: { canonical: 'https://cognitaxes.com/' },
};

export default function HomePage() {
  return <HomeClient />;
}