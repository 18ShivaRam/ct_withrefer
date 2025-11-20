import type { Metadata } from 'next';
import PricesClient from './PricesClient';

export const metadata: Metadata = {
  title: 'Pricing — Affordable, Transparent Tax Services',
  description:
    'View Cognitax pricing for individual and business tax services. Clear, upfront rates and flexible options with expert support.',
  alternates: { canonical: 'https://cognitaxes.com/prices' },
};

export default function PricesPage() {
  return <PricesClient />;
}