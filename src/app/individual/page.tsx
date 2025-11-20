import type { Metadata } from 'next';
import IndividualClient from './IndividualClient';

export const metadata: Metadata = {
  title: 'Individual Tax Services — Federal, State & Local Filing',
  description:
    'Expert personal tax filing across the U.S., including federal, state, and local returns. Accurate, secure, and reviewed by professionals.',
  alternates: { canonical: 'https://cognitaxes.com/individual' },
};

export default function IndividualPage() {
  return <IndividualClient />;
}