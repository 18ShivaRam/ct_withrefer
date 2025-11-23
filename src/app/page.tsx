import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Cognitaxes — Smart, Secure Tax Filing',
  description:
    'Expert tax preparation for individuals and businesses. Bookkeeping, payroll, IRS representation, and strategic planning — secure, accurate, and stress-free.',
  alternates: { canonical: 'https://cognitaxes.com/' },
  openGraph: {
    type: 'website',
    url: 'https://cognitaxes.com/',
    siteName: 'Cognitaxes',
    title: 'Cognitaxes — Smart, Secure Tax Filing',
    description:
      'Expert tax preparation for individuals and businesses. Bookkeeping, payroll, IRS representation, and strategic planning — secure, accurate, and stress-free.',
    images: [
      {
        url: 'https://cognitaxes.com/images/logosvg1.jpg',
        width: 1200,
        height: 630,
        alt: 'Cognitaxes brand logo',
      },
    ],
  },
};

export default function HomePage() {
  return <HomeClient />;
}