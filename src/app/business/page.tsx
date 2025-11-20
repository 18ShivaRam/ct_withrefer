import type { Metadata } from 'next';
import BusinessClient from './BusinessClient';

export const metadata: Metadata = {
  title: 'Business Tax Services — LLC, Corp, and Partnership Filing',
  description:
    'Comprehensive business tax services for LLCs, corporations, and partnerships. Secure filings, accurate compliance, and dedicated support.',
  alternates: { canonical: 'https://cognitaxes.com/business' },
};

export default function BusinessPage() {
  return <BusinessClient />;
}