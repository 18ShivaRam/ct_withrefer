import type { Metadata } from 'next';
import HowItWorksClient from './HowItWorksClient';

export const metadata: Metadata = {
  title: 'How It Works — Simple, Secure, Expert-Reviewed Tax Filing',
  description:
    'See how Cognitaxes works: upload documents, get expert review, and file securely. Transparent process with real-time updates.',
  alternates: { canonical: 'https://cognitaxes.com/how-it-works' },
};

export default function HowItWorksPage() {
  return <HowItWorksClient />;
}