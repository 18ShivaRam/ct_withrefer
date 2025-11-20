import type { Metadata } from 'next';
import RefundClient from './RefundClient';

export const metadata: Metadata = {
  title: 'Tax Refund Services — Maximize Deductions & Credits',
  description:
    'Understand your tax refund with Cognitax. Optimize deductions, check refund status, and get guidance to maximize your return.',
  alternates: { canonical: 'https://cognitaxes.com/refund' },
};

export default function RefundPage() {
  return <RefundClient />;
}