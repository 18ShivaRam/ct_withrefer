import type { Metadata } from 'next';
import RefundClient from './RefundClient';

export const metadata: Metadata = {
  title: 'Tax Refund Services — Maximize Deductions & Credits',
  description:
    'Understand your tax refund with Cognitaxes. Optimize deductions, check refund status, and get guidance to maximize your return.',
  alternates: { canonical: 'https://cognitaxes.com/refund' },
  openGraph: {
    type: 'website',
    url: 'https://cognitaxes.com/refund',
    siteName: 'Cognitaxes',
    title: 'Tax Refund Services — Maximize Deductions & Credits',
    description:
      'Understand your tax refund with Cognitaxes. Optimize deductions, check refund status, and get guidance to maximize your return.',
    images: [
      {
        url: 'https://cognitaxes.com/images/refund.jpg',
        width: 1200,
        height: 630,
        alt: 'Tax refund services',
      },
    ],
  },
};

export default function RefundPage() {
  return <RefundClient />;
}