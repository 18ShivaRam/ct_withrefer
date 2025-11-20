import type { Metadata } from 'next';
import IndividualClient from './IndividualClient';

export const metadata: Metadata = {
  title: 'Individual Tax Filing — Federal, State & Local Returns',
  description:
    'File individual taxes with confidence: federal, state, local returns, amendments, IRS representation, tax planning, ITIN and FBAR support.',
  alternates: { canonical: 'https://cognitaxes.com/individual' },
};

export default function IndividualPage() {
  return <IndividualClient />;
}