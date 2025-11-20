import type { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: 'Tax Services — Individuals and Businesses',
  description:
    'End-to-end tax services for individuals and businesses. Filing, compliance, and expert support tailored to your needs.',
  alternates: { canonical: 'https://cognitaxes.com/services' },
};

export default function ServicesPage() {
  return <ServicesClient />;
}