import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Cognitaxes — Mission, Values & Expert Team',
  description:
    'Learn about Cognitaxes: our mission to simplify tax filing, our values of accuracy and trust, and the expert team behind our services.',
  alternates: { canonical: 'https://cognitaxes.com/about' },
};

export default function AboutPage() {
  return <AboutClient />;
}