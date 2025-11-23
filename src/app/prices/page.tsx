import type { Metadata } from 'next';
import PricesClient from './PricesClient';

export const metadata: Metadata = {
  title: 'Pricing — Affordable, Transparent Tax Services',
  description:
    'View Cognitaxes pricing for individual and business tax services. Clear, upfront rates and flexible options with expert support.',
  alternates: { canonical: 'https://cognitaxes.com/prices' },
  openGraph: {
    type: 'website',
    url: 'https://cognitaxes.com/prices',
    siteName: 'Cognitaxes',
    title: 'Pricing — Affordable, Transparent Tax Services',
    description:
      'View Cognitaxes pricing for individual and business tax services. Clear, upfront rates and flexible options with expert support.',
    images: [
      {
        url: 'https://cognitaxes.com/images/prices.jpg',
        width: 1200,
        height: 630,
        alt: 'Cognitaxes pricing overview',
      },
    ],
  },
};

export default function PricesPage() {
  return <PricesClient />;
}