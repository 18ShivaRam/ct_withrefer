import type { Metadata } from 'next';
import IndividualClient from './IndividualClient';

export const metadata: Metadata = {
  title: 'Individual Tax Services — Federal, State & Local Filing',
  description:
    'Expert personal tax filing across the U.S., including federal, state, and local returns. Accurate, secure, and reviewed by professionals.',
  alternates: { canonical: 'https://cognitaxes.com/individual' },
  openGraph: {
    type: 'website',
    url: 'https://cognitaxes.com/individual',
    siteName: 'Cognitaxes',
    title: 'Individual Tax Services — Federal, State & Local Filing',
    description:
      'Expert personal tax filing across the U.S., including federal, state, and local returns. Accurate, secure, and reviewed by professionals.',
    images: [
      {
        url: 'https://cognitaxes.com/images/individual.jpg',
        width: 1200,
        height: 630,
        alt: 'Individual tax services',
      },
    ],
  },
};

export default function IndividualPage() {
  return <IndividualClient />;
}