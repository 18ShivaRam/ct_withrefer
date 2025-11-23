import type { Metadata } from 'next';
import BusinessClient from './BusinessClient';

export const metadata: Metadata = {
  title: 'Business Tax Services — LLC, Corp, and Partnership Filing',
  description:
    'Comprehensive business tax services for LLCs, corporations, and partnerships. Secure filings, accurate compliance, and dedicated support.',
  alternates: { canonical: 'https://cognitaxes.com/business' },
  openGraph: {
    type: 'website',
    url: 'https://cognitaxes.com/business',
    siteName: 'Cognitaxes',
    title: 'Business Tax Services — LLC, Corp, and Partnership Filing',
    description:
      'Comprehensive business tax services for LLCs, corporations, and partnerships. Secure filings, accurate compliance, and dedicated support.',
    images: [
      {
        url: 'https://cognitaxes.com/images/business.jpg',
        width: 1200,
        height: 630,
        alt: 'Business tax services',
      },
    ],
  },
};

export default function BusinessPage() {
  return <BusinessClient />;
}